import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import PagePanel from "../pagepanel/PagePanel";
import StudyPanel from "../studypanel/StudyPanel";
import StudyStepPanel from "../studysteppanel/StudyStepPanel";
import "./Dashboard.css";
import { SelectionState } from "./Dashboard.types";
import { StudyConditionWidget } from "../../components/metadatawidgets/MetadataWidgets";


export const Dashboard = () => {

	const { loginWithPopup, getAccessTokenWithPopup } = useAuth0();
	const [authError, setAuthError] = useState<string>("");
	const [selected, setSelected] = useState<SelectionState>({
		studyId: "",
		stepId: "",
		pageId: ""
	});

	const handleSelection = (newState: SelectionState) => {
		setSelected(newState);
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
		<Container id="dashboard">
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
			<Row className="navigation-row d-flex">
				<Col md={{ span: 5 }}>
					<Row>
						<StudyPanel authErrorCallback={setAuthError}
							selected={selected} onChangeSelection={handleSelection} />
					</Row>
				</Col>
				<Col md={{ span: 7 }}>
					<Row>
						<StudyStepPanel studyId={selected.studyId}
							authErrorCallback={setAuthError}
							selected={selected} onChangeSelection={handleSelection} />
					</Row>
				</Col>
				<StudyConditionWidget studyId={selected.studyId} />
			</Row>
			<Row className="page-selector">
				<PagePanel studyId={selected.studyId}
					stepId={selected.stepId}
					authErrorCallback={setAuthError}
					selected={selected} onChangeSelection={handleSelection} />
			</Row>
		</Container>
	);
};

export default withAuthenticationRequired(Dashboard, {
	onRedirecting: () => <>Loading</>,
});
