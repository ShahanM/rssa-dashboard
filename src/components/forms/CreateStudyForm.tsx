import { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { isAuthError } from "../../utils/errors";
import { InputFormModalProps } from "./forms.types";
import { createStudy as createStudyRequest } from "../../api/endpoints";

const CreateStudyForm: React.FC<InputFormModalProps> = ({
	show,
	showHideCallback,
	requestToken,
	onSuccess,
	onAuthError }) => {

	const [error, setError] = useState<string>("");
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [studyName, setStudyName] = useState<string>("");
	const [studyDescription, setStudyDescription] = useState<string>("");

	const handleClose = () => {
		setError("");
		showHideCallback(false);
	}

	const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setStudyName(name);
		if (name.length >= 4) { setSubmitEnabled(true); }
	}

	const handleDescriptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStudyDescription(e.target.value);
	}

	const createStudy = async () => {
		try {
			const token = await requestToken();
			const response = await createStudyRequest({
				name: studyName,
				description: studyDescription
			}, token);
			onSuccess(response);
			handleClose();
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
					<Modal.Title>Create study</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error !== "" && (
						<Alert variant="danger">
							Something went wrong. Please try again later.
						</Alert>
					)}
					<Form>
						<Form.Group className="mb-3"
							controlId="createStudyForm.studyName">
							<Form.Label>Study Name (required)</Form.Label>
							<Form.Control
								type="text"
								placeholder="Study name must be at least 4 characters"
								autoFocus
								value={studyName}
								onChange={handleNameInput}
							/>
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="createStudyForm.studyDescription">
							<Form.Label>Description</Form.Label>
							<Form.Control as="textarea" rows={3}
								value={studyDescription}
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
						onClick={createStudy}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default CreateStudyForm