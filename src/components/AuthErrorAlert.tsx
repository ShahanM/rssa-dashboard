import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";

const AuthErrorAlert: React.FC<{ error: string }> = ({ error }) => {
	const [authError, setAuthError] = useState<string>("");
	const { loginWithPopup, getAccessTokenWithPopup } = useAuth0();

	useEffect(() => {
		if (error) {
			setAuthError(error);
		}
	}, [error]);

	const handleConsent = async () => {
		try {
			await getAccessTokenWithPopup();
			setAuthError("");
		} catch (error) {
			setAuthError((error as Error).message);
		}
	};

	const handleLoginAgain = async () => {
		try {
			await loginWithPopup();
			setAuthError("");
		} catch (error) {
			setAuthError((error as Error).message);
		}
	};

	const handle = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		fn: () => void) => {
		e.preventDefault();
		fn();
	};

	if (!authError) return null;

	return (
		<div className="flex w-full">
			{authError === "consent_required" && (
				<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 w-full">
					<div className="flex">
						<div className="ml-3">
							<p className="text-sm text-yellow-700">
								You need to{" "}
								<a href="#/" className="font-medium underline text-yellow-700 hover:text-yellow-600"
									onClick={(e) => handle(e, handleConsent)}>
									consent to get access to users api
								</a>
							</p>
						</div>
					</div>
				</div>
			)}
			{authError === "login_required" && (
				<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 w-full">
					<div className="flex">
						<div className="ml-3">
							<p className="text-sm text-yellow-700">
								You need to{" "}
								<a href="#/" className="font-medium underline text-yellow-700 hover:text-yellow-600"
									onClick={(e) => handle(e, handleLoginAgain)}>
									log in again
								</a>
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default AuthErrorAlert;