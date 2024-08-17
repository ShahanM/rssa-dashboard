import React, { useState } from 'react';
import {StudyStep } from '../../utils/generics.types';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { isAuthError } from '../../utils/errors';
import {CreateStepFormProps} from './forms.types';
import { createStudyStep } from '../../api/endpoints';


const CreateStepForm: React.FC<CreateStepFormProps> = ({
	show,
	showHideCallback,
	requestToken,
	onSuccess,
	onAuthError,
	maxEmptyPosition,
	studyId
}) => {

	const [error, setError] = useState<string>("");
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [stepName, setStepName] = useState<string>("");
	const [orderPosition, setOrderPosition] = useState<number>(maxEmptyPosition + 1);
	const [stepDescription, setStepDescription] = useState<string>("");

	const handleClose = () => {
		setError("");
		showHideCallback(false);
	}

	const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setStepName(name);
		if (name.length >= 4) setSubmitEnabled(true);
	}

	const handleOrderPositionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setOrderPosition(parseInt(e.target.value));
	}

	const handleDescriptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStepDescription(e.target.value);
	}

	const handleSuccesResponse = (response: StudyStep) => {
		onSuccess(response);
		setStepName("");
		setOrderPosition(maxEmptyPosition + 1); // FIXME: might need to re-calculate this
		setStepDescription("");
		handleClose();
	}

	const addStep = async () => {
		try {
			const token = await requestToken();
			const response = await createStudyStep({
				study_id: studyId,
				order_position: orderPosition,
				name: stepName,
				description: stepDescription
			}, token);
			handleSuccesResponse(response);
		} catch (error) {
			if (isAuthError(error)) {
				onAuthError(error);
				handleClose();
			} else {
				setError((error as Error).message);
			}
		}
	}


	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add step</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error !== "" && (
						<Alert variant="danger">
							Something went wrong. Please try again later.
						</Alert>
					)}
					<Form>
						<Form.Group className="mb-3"
							controlId="createStepForm.studyId">
							<Form.Label>Study ID</Form.Label>
							<Form.Control
								type="text"
								placeholder="Study ID"
								value={studyId}
								disabled
							/>
						</Form.Group>
						<Form.Group className="mb-3"
							controlId="createStepForm.name">
							<Form.Label>Step Name (required)</Form.Label>
							<Form.Control
								type="text"
								placeholder="Step name must be at least 4 characters"
								autoFocus
								value={stepName}
								onChange={handleNameInput}
							/>
						</Form.Group>
						<Form.Group className="mb-3"
							controlId="createStepForm.orderposition">
							<Form.Label>Order position</Form.Label>
							<Form.Control
								type="number"
								placeholder="Order position"
								value={orderPosition}
								onChange={handleOrderPositionInput}
							/>
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="createStepForm.description">
							<Form.Label>Description</Form.Label>
							<Form.Control as="textarea" rows={3}
								value={stepDescription}
								onChange={handleDescriptionInput}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" disabled={!submitEnabled}
						onClick={addStep}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default CreateStepForm;