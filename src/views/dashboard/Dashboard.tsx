import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import StudyPanel from "../studypanel/StudyPanel";


export const Dashboard = () => {

	const { loginWithPopup, getAccessTokenWithPopup } = useAuth0();
	const [authError, setAuthError] = useState<string>("");
	const [selected, setSelected] = useState<string>("");

	const handleSelection = (id: string) => {
		setSelected(id);
	}

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
		<Container>
				{authError === "consent_required" && (
					<Alert color="warning">
						You need to{" "}
						<a
							href="#/"
							className="alert-link"
							onClick={(e) => handle(e, handleConsent)}
						>
							consent to get access to users api
						</a>
					</Alert>
				)}

				{authError === "login_required" && (
					<Alert color="warning">
						You need to{" "}
						<a
							href="#/"
							className="alert-link"
							onClick={(e) => handle(e, handleLoginAgain)}
						>
							log in again
						</a>
					</Alert>
				)}
					<StudyPanel authErrorCallback={setAuthError}
						selected={selected} onChangeSelection={handleSelection} />
		</Container>
	);
};

export default withAuthenticationRequired(Dashboard, {
	onRedirecting: () => <>Loading</>,
});
