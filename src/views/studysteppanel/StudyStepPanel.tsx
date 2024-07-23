import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { StudyStepList } from '../../components/componentlist/ComponentList';
import CreateStepForm from "../../components/forms/CreateStepForm";
import { isAuthError } from "../../utils/errors";
import { StudyStep } from "../../utils/generics.types";
import './StudyStepPanel.css';
import { StudyStepPanelProps } from "./StudyStepPanel.types";
import {findFirstEmptyPosition} from "../../utils/utils";


const StudyStepPanel: React.FC<StudyStepPanelProps> = ({
	studyId, selected, onChangeSelection, authErrorCallback }) => {

	const { getAccessTokenSilently } = useAuth0();
	const [steps, setSteps] = React.useState<StudyStep[]>([]);
	const [show, setShow] = React.useState<boolean>(false);

	const handleSelection = (id: string) => {
		onChangeSelection({ studyId: selected.studyId, stepId: id, pageId: "" });

	}

	useEffect(() => {
		const callApi = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await fetch(
					`http://localhost:8000/v2/${studyId}/step/`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "http://localhost:3339",
						"Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
						"Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
						"Authorization": `Bearer ${token}`
					},
				});
				if (response.status !== 200) {
					throw new Error(response.statusText);
				}
				const responseData: StudyStep[] = await response.json();
				console.log(responseData);

				// Sort the steps by order_position
				if (responseData.length === 0) {
					setSteps([]);
					return;
				}

				// FIXME: refactor this to a utility function
				const sortedarray = responseData.sort((a, b) =>
					a.order_position < b.order_position ? -1
						: a.order_position > b.order_position ? 1 : 0)
				setSteps(sortedarray);
			} catch (error) {
				if (isAuthError(error)) {
					authErrorCallback((error as Error).message);
				} else {
					// FIXME: Handle error
					console.log("We are in the error block", error);
				}
			}
		};

		if (studyId && studyId.length > 0) callApi();
	}, [getAccessTokenSilently, authErrorCallback, studyId]);

	const handleAddStepSuccess = (response: StudyStep) => {
		let newSteps = [...steps, response];
		// FIXME: use the utility function to sort the step order
		// TODO: This could be an API task but we need to reorder the steps in case of a position clash.
		// Perhaps we can insert the new step and push the rest of the steps down. This would need to
		// updated in the database as well.
		// Or we can just do it entirely in the backend and fetch all the steps again.
		// Or we can do it in the frontend and make relevant update calls to the backend.
		newSteps.sort((a, b) => a.order_position < b.order_position ? -1
			: a.order_position > b.order_position ? 1 : 0);
		setSteps(newSteps);
	}


	return (
		<Container className="study-step-panel">
			<Row className="d-flex header">
				<Col md={8}>
					<h2>Study Steps</h2>
				</Col>
				<Col md={4} className="header-button">
					<Button color="primary" onClick={() => setShow(true)}
						disabled={!studyId || studyId === ""}>
						Add step
					</Button>
				</Col>
				<CreateStepForm
					studyId={studyId}
					show={show} showHideCallback={setShow}
					requestToken={getAccessTokenSilently}
					onSuccess={handleAddStepSuccess}
					onAuthError={authErrorCallback}
					maxEmptyPosition={findFirstEmptyPosition(steps)} />
			</Row>
			<Row className="list-container">
				<StudyStepList components={steps}
					selected={selected.stepId}
					onChangeSelection={handleSelection} />
			</Row>
		</Container>
	)
}


export default StudyStepPanel;