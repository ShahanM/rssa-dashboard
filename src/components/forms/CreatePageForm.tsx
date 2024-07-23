import { CreatePageFormProps } from "./forms.types";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import React, { useState } from "react";
import { isAuthError } from "../../utils/errors";


const CreatePageForm: React.FC<CreatePageFormProps> = ({
	show,
	showHideCallback,
	requestToken,
	onSuccess,
	onAuthError,
	maxEmptyPosition,
	studyId,
	stepId
}) => {

	const [error, setError] = useState<string>("");
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [pageName, setPageName] = useState<string>("");
	const [orderPosition, setOrderPosition] = useState<number>(maxEmptyPosition + 1);
	const [pageDescription, setPageDescription] = useState<string>("");

	const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setPageName(name);
		if (name.length >= 4) setSubmitEnabled(true);
	}

	const handleClose = () => {
		setError("");
		showHideCallback(false);
	}

	const handleOrderPositionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setOrderPosition(parseInt(e.target.value));
	}

	const handleDescriptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPageDescription(e.target.value);
	}

	const insertPage = async () => {
		try {
			const token = await requestToken();
			const response = await fetch(`http://localhost:8000/v2/${studyId}/${stepId}/page/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "http://localhost:3339",
					"Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
					"Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					study_id: studyId,
					step_id: stepId,
					name: pageName,
					order_position: orderPosition,
					description: pageDescription
				})
			});
			const responseData = await response.json();
			if (response.status !== 200) {
				throw new Error(response.statusText);
			}
			onSuccess(responseData);
			handleClose();
		} catch (error) {
			if (isAuthError(error)) {
				onAuthError(error);
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
							controlId="createPageForm.studyId">
							<Form.Label>Study ID</Form.Label>
							<Form.Control
								type="text"
								placeholder="Study ID"
								value={studyId}
								disabled
							/>
						</Form.Group>
						<Form.Group className="mb-3"
							controlId="createPageForm.stepId">
							<Form.Label>Step ID</Form.Label>
							<Form.Control
								type="text"
								placeholder="Step ID"
								value={stepId}
								disabled
							/>
						</Form.Group>
						<Form.Group className="mb-3"
							controlId="createPageForm.name">
							<Form.Label>Page Name (required)</Form.Label>
							<Form.Control
								type="text"
								placeholder="Page name must be at least 4 characters"
								autoFocus
								value={pageName}
								onChange={handleNameInput}
							/>
						</Form.Group>
						<Form.Group className="mb-3"
							controlId="createPageForm.orderposition">
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
							controlId="createPageForm.description">
							<Form.Label>Description</Form.Label>
							<Form.Control as="textarea" rows={3}
								value={pageDescription}
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
						onClick={insertPage}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default CreatePageForm;