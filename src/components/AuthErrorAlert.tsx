import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Alert, Row } from "react-bootstrap";


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

	return (
		<Row>
			{authError === "consent_required" && (
				<Alert color="warning">
					You need to{" "}
					<a href="#/" className="alert-link"
						onClick={(e) => handle(e, handleConsent)}>
						consent to get access to users api
					</a>
				</Alert>
			)}
			{authError === "login_required" && (
				<Alert color="warning">
					You need to{" "}
					<a href="#/" className="alert-link"
						onClick={(e) => handle(e, handleLoginAgain)}>
						log in again
					</a>
				</Alert>
			)}
		</Row>
	)
}

export default AuthErrorAlert;