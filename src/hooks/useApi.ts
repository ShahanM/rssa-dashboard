import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useMemo, useState } from 'react';

interface ApiMethodOptions extends RequestInit {
	isProtected?: boolean;
}

interface ApiResponse<T> {
	data: T | null;
	loading: boolean;
	error: Error | null;
	api: {
		get: (url: string, options?: ApiMethodOptions) => Promise<T | null>;
		post: <B>(url: string, body: B, options?: ApiMethodOptions) => Promise<T | null>;
		put: <B>(url: string, body: B, options?: ApiMethodOptions) => Promise<T | null>;
		del: (url: string, options?: ApiMethodOptions) => Promise<T | null>; // 'delete' is a reserved keyword
		patch: <B>(url: string, body: B, options?: ApiMethodOptions) => Promise<T | null>;
	};
	clearData: () => void;
}

const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
const AUTH0_SCOPE = import.meta.env.VITE_AUTH0_SCOPE || 'openid profile email';
const RSSA_API = import.meta.env.VITE_RSSA_API!;
const RSSA_API_DEV = import.meta.env.VITE_RSSA_API_DEV!;

const API = process.env.NODE_ENV === "production" ? RSSA_API : RSSA_API_DEV;

export const useApi = <T = unknown>(): ApiResponse<T> => {
	const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const clearData = () => setData(null);

	const request = useCallback(async <B>(
		url: string,
		method: string,
		body?: B,
		options: ApiMethodOptions = {}
	): Promise<T | null> => {
		const { isProtected = true, ...fetchOptionsRest } = options;

		setLoading(true);
		setError(null);
		setData(null); // Clear previous data on new call

		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			...(options.headers as Record<string, string>),
		};

		if (isProtected) {
			if (!isAuthenticated && !authLoading) {
				setError(new Error("User not authenticated. Please log in."));
				setLoading(false);
				return null;
			}

			try {
				// Use the audience and scope defined in the environment/config
				const accessToken = await getAccessTokenSilently({
					authorizationParams: {
						audience: AUTH0_AUDIENCE,
						scope: AUTH0_SCOPE,
					},
				});
				headers['Authorization'] = `Bearer ${accessToken}`;
			} catch (e) {
				const errorMessage = e instanceof Error ? e.message : String(e);
				setError(new Error(`Failed to get access token: ${errorMessage}`));
				setLoading(false);
				console.error("Auth0 Token Error:", e);
				return null;
			}
		}

		try {
			const fetchOptions: RequestInit = {
				method,
				headers,
				...fetchOptionsRest,
			};

			if (body) {
				fetchOptions.body = JSON.stringify(body);
			}

			const response = await fetch(API + url, fetchOptions);

			if (!response.ok) {
				const errorBody = await response.text();
				let errorMessage = `API Error: ${response.status}`;
				try {
					const errorJson = JSON.parse(errorBody);
					errorMessage = errorJson.message || errorJson.error || errorMessage + ` - ${errorBody}`;
				} catch {
					errorMessage += ` - ${errorBody}`;
				}
				throw new Error(errorMessage);
			}

			if (response.status === 204) {
				// No content response, return null
				setData(null);
				return null;
			}

			const contentType = response.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				const responseData: T = await response.json();
				setData(responseData);
				return responseData;
			} else {
				setData(null);
				return null;
			}
		} catch (e) {
			if (e instanceof Error) {
				setError(e);
			} else {
				setError(new Error(String(e)));
			}
			console.error("API Call Error:", e);
			return null;
		} finally {
			setLoading(false);
		}
	}, [getAccessTokenSilently, isAuthenticated, authLoading]);

	const api = useMemo(() => ({
		get: (url: string, options?: ApiMethodOptions) => request(url, 'GET', undefined, options),
		post: <B>(url: string, body: B, options?: ApiMethodOptions) => request(url, 'POST', body, options),
		put: <B>(url: string, body: B, options?: ApiMethodOptions) => request(url, 'PUT', body, options),
		del: (url: string, options?: ApiMethodOptions) => request(url, 'DELETE', undefined, options), // 'delete' is a reserved keyword, so use 'del'
		patch: <B>(url: string, body: B, options?: ApiMethodOptions) => request(url, 'PATCH', body, options),
	}), [request]);
	return { data, loading, error, api, clearData };
};