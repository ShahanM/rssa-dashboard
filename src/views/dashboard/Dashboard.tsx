import { withAuthenticationRequired } from "@auth0/auth0-react";

import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import AuthErrorAlert from "../../components/AuthErrorAlert";
import StudyPanel from "../studypanel/StudyPanel";
import StudySummaryView from "../StudySummary";
import "./Dashboard.css";
import { Link } from "react-router-dom";


export const Dashboard = () => {
	const [authError, setAuthError] = useState<string>("");
	// const [selected, setSelected] = useState<SelectionState>({
	// 	studyId: "",
	// 	stepId: "",
	// 	pageId: ""
	// });
	const [selectedStudyId, setSelectedStudyId] = useState<string>();

	const handleSelection = (studyId: string) => {
		setSelectedStudyId(studyId);
	}

	return (
		<Container id="dashboard">
			<AuthErrorAlert error={authError} />
			<Row className="navigation-row d-flex">
				<Col md={{ span: 5 }}>
					<StudyPanel
						authErrorCallback={setAuthError}
						selectedStudyId={selectedStudyId}
						onChangeSelection={handleSelection} />
				</Col>
				<Col md={{ span: 7 }}>
					<Row className="mt-4">
						<Link to={`/studies/${selectedStudyId}`}>
							<Button>Show details &gt;</Button>
						</Link>
					</Row>

					{/* <StudyDetails  */}
					{/* <StudyStepPanel
						studyId={selected.studyId}
						authErrorCallback={setAuthError}
						selected={selected}
						onChangeSelection={handleSelection} /> */}
					<Row>
						<StudySummaryView
							studyId={selectedStudyId}
							authErrorCallback={setAuthError}
						/>
					</Row>
				</Col>
			</Row>
			{/* <Row>
				<StudyConditionWidget studyId={selected.studyId} />
			</Row>
			<Row className="page-selector">
				<PagePanel studyId={selected.studyId}
					stepId={selected.stepId}
					authErrorCallback={setAuthError}
					selected={selected} onChangeSelection={handleSelection} />
			</Row> */}
		</Container>
	);
};

export default withAuthenticationRequired(Dashboard, {
	onRedirecting: () => <>Loading</>,
});