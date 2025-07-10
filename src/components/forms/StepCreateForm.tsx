import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useApi } from "../../hooks/useApi";
import { StudyStep } from "../../utils/generics.types";

interface StepCreateFormProps {
	studyId: string;
	orderPosition: number;
	show: boolean;
	showHideCallback: (show: boolean) => void;
	onSuccess: () => void;
}

const StepCreateForm: React.FC<StepCreateFormProps> = ({
	studyId,
	orderPosition,
	show,
	showHideCallback,
	onSuccess,
}) => {

	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [stepName, setStepName] = useState<string>("");
	const [stepDescription, setStepDescription] = useState<string>("");

	const { data: step, loading, error, api, clearData } = useApi<StudyStep>();

	const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setStepName(name);
		if (name.length >= 4) setSubmitEnabled(true);
	}

	const handleClose = () => {
		showHideCallback(false);
	}

	const handleDescriptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStepDescription(e.target.value);
	}

	const stepCreateRequest = useCallback(async () => {
		if (studyId && stepName && orderPosition && stepDescription && api) {
			try {
				await api.post("steps/", {
					study_id: studyId,
					order_position: orderPosition,
					name: stepName,
					description: stepDescription
				});
			} catch (error) {
				console.log("Error creating step, contact the administrator.");
			}
		}
	}, [studyId, stepName, orderPosition, stepDescription, api]);

	const handleSuccess = useCallback(async () => {
		if (step) {
			setStepName("");
			setStepDescription("");
			setSubmitEnabled(false);
			onSuccess();
			clearData();
			showHideCallback(false);
		}
	}, [onSuccess, step, clearData, showHideCallback]);

	useEffect(() => { handleSuccess() }, [handleSuccess]);

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add step</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && (
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
								disabled
							// onChange={handleOrderPositionInput}
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
						onClick={stepCreateRequest}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default StepCreateForm;