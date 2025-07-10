import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useMemo, useState } from 'react';

interface ApiRequestOptions extends RequestInit {
}

interface ApiResponse<T> {
	data: T | null;
	loading: boolean;
	error: Error | null;
	api: {
		get: (url: string, options?: ApiRequestOptions) => Promise<T | null>;
		post: (url: string, body: any, options?: ApiRequestOptions) => Promise<T | null>;
		put: (url: string, body: any, options?: ApiRequestOptions) => Promise<T | null>;
		del: (url: string, options?: ApiRequestOptions) => Promise<T | null>; // 'delete' is a reserved keyword
		patch: (url: string, body: any, options?: ApiRequestOptions) => Promise<T | null>;
	};
	clearData: () => void;
}

const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;
const AUTH0_SCOPE = process.env.REACT_APP_AUTH0_SCOPE || 'openid profile email';
const RSSA_API = process.env.REACT_APP_RSSA_API!;
const RSSA_API_DEV = process.env.REACT_APP_RSSA_API_DEV!;

const API = process.env.NODE_ENV === "production" ? RSSA_API : RSSA_API_DEV;

export const useApi = <T = any>(): ApiResponse<T> => {
	const { getAccessTokenSilently, isAuthenticated, isLoading: authLoading } = useAuth0();
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const clearData = () => setData(null);

	const request = useCallback(async (
		url: string,
		method: string,
		body?: any,
		options: ApiRequestOptions = {}
	): Promise<T | null> => {
		setLoading(true);
		setError(null);
		setData(null); // Clear previous data on new call

		if (!isAuthenticated && !authLoading) {
			setError(new Error("User not authenticated. Please log in."));
			setLoading(false);
			return null;
		}

		let accessToken: string;
		try {
			// Use the audience and scope defined in the environment/config
			accessToken = await getAccessTokenSilently({
				authorizationParams: {
					audience: AUTH0_AUDIENCE,
					scope: AUTH0_SCOPE,
				},
			});
		} catch (e: any) {
			setError(new Error(`Failed to get access token: ${e.message}`));
			setLoading(false);
			console.error("Auth0 Token Error:", e);
			return null;
		}

		try {
			const fetchOptions: RequestInit = {
				method,
				headers: {
					...options.headers,
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json', // Default to JSON for POST/PUT/PATCH
				},
				...options,
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
		} catch (e: any) {
			setError(e);
			console.error("API Call Error:", e);
			return null;
		} finally {
			setLoading(false);
		}
	}, [getAccessTokenSilently, isAuthenticated, authLoading]);

	const api = useMemo(() => ({
		get: (url: string, options?: ApiRequestOptions) => request(url, 'GET', undefined, options),
		post: (url: string, body: any, options?: ApiRequestOptions) => request(url, 'POST', body, options),
		put: (url: string, body: any, options?: ApiRequestOptions) => request(url, 'PUT', body, options),
		del: (url: string, options?: ApiRequestOptions) => request(url, 'DELETE', undefined, options), // 'delete' is a reserved keyword, so use 'del'
		patch: (url: string, body: any, options?: ApiRequestOptions) => request(url, 'PATCH', body, options),
	}), [request]);
	return { data, loading, error, api, clearData };
};