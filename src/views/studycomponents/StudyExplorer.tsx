import { withAuthenticationRequired } from "@auth0/auth0-react";

import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import AuthErrorAlert from "../../components/AuthErrorAlert";
import StudyPanel from "../studycomponents/StudyPanel";
import StudySummaryView from "../studycomponents/StudySummary";

export interface SelectionState {
	studyId: string;
	stepId: string;
	pageId: string;
}


export const StudyExplorer = () => {
	const [authError, setAuthError] = useState<string>("");
	const [selectedStudy, setSelectedStudy] = useState<{
		id: string;
		name?: string
	}>();

	const handleSelection = (study: {
		id: string;
		name?: string
	}) => {
		setSelectedStudy(study);
	}

	return (
		<Container id="content-overview">
			<AuthErrorAlert error={authError} />
			<Row className="navigation-row d-flex">
				<Col md={{ span: 5 }}>
					<StudyPanel
						authErrorCallback={setAuthError}
						selectedStudyId={selectedStudy?.id}
						onChangeSelection={handleSelection} />
				</Col>
				<Col md={{ span: 7 }}>
					<Row className="mt-4">
						<Link to={`/studies/${selectedStudy?.id}`}>
							<Button>Show details &gt;</Button>
						</Link>
					</Row>
					<Row>
						<StudySummaryView
							studyId={selectedStudy?.id}
							authErrorCallback={setAuthError}
						/>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default withAuthenticationRequired(StudyExplorer, {
	onRedirecting: () => <>Loading</>,
});