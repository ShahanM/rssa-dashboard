import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import StudyPanel from "../studypanel/StudyPanel";
import StudyStepPanel from "../studysteppanel/StudyStepPanel";


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
			<Row>
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
			</Row>
			<Row>
				<Col md={5}>
					<StudyPanel authErrorCallback={setAuthError}
						selected={selected} onChangeSelection={handleSelection} />
				</Col>
				<Col md={7}>
					<Row>

					</Row>
					<Row>
						<StudyStepPanel studyId={selected} authErrorCallback={setAuthError} />
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default withAuthenticationRequired(Dashboard, {
	onRedirecting: () => <>Loading</>,
});
