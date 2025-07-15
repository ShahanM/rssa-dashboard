import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useApi } from "../../hooks/useApi";
import { StudyCondition } from "../../utils/generics.types";

interface ConditionCreateFormProps {
	studyId: string;
	show: boolean;
	showHideCallback: (show: boolean) => void;
	onSuccess: () => void;
}

const ConditionCreateForm: React.FC<ConditionCreateFormProps> = ({
	studyId,
	show,
	showHideCallback,
	onSuccess,
}) => {

	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [conditionName, setConditionName] = useState<string>("");
	const [conditionDescription, setConditionDescription] = useState<string>("");

	const { data: condition, loading, error, api, clearData } = useApi<StudyCondition>();

	const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setConditionName(name);
		if (name.length >= 4) setSubmitEnabled(true);
	}

	const handleClose = () => {
		showHideCallback(false);
	}

	const handleDescriptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConditionDescription(e.target.value);
	}

	const conditionCreateRequest = useCallback(async () => {
		if (studyId && conditionName && conditionDescription && api) {
			try {
				await api.post("conditions/", {
					study_id: studyId,
					name: conditionName,
					description: conditionDescription
				});
			} catch (error) {
				console.log("Error creating condition, contact the administrator.");
			}
		}
	}, [studyId, conditionName, conditionDescription, api]);

	const handleSuccess = useCallback(async () => {
		if (condition) {
			setConditionName("");
			setConditionDescription("");
			setSubmitEnabled(false);
			onSuccess();
			clearData();
			showHideCallback(false);
		}
	}, [onSuccess, condition, clearData, showHideCallback]);

	useEffect(() => { handleSuccess() }, [handleSuccess]);

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add condition</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && (
						<Alert variant="danger">
							Something went wrong. Please try again later.
						</Alert>
					)}
					<Form>
						<Form.Group className="mb-3"
							controlId="createConditionForm.studyId">
							<Form.Label>Study ID</Form.Label>
							<Form.Control
								type="text"
								placeholder="Study ID"
								value={studyId}
								disabled
							/>
						</Form.Group>
						<Form.Group className="mb-3"
							controlId="createConditionForm.name">
							<Form.Label>Condition Name (required)</Form.Label>
							<Form.Control
								type="text"
								placeholder="Condition name must be at least 4 characters"
								autoFocus
								value={conditionName}
								onChange={handleNameInput}
							/>
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="createConditionForm.description">
							<Form.Label>Description</Form.Label>
							<Form.Control as="textarea" rows={3}
								value={conditionDescription}
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
						onClick={conditionCreateRequest}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default ConditionCreateForm;