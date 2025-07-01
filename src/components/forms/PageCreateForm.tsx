import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useApi } from "../../hooks/useApi";
import { Page } from "../../utils/generics.types";


interface PageCreateFormProps {
	studyId: string;
	stepId: string;
	orderPosition: number;
	show: boolean;
	showHideCallback: (show: boolean) => void;
	onSuccess: () => void;
}

const PageCreateForm: React.FC<PageCreateFormProps> = ({
	studyId,
	stepId,
	orderPosition,
	show,
	showHideCallback,
	onSuccess,
}) => {

	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [pageName, setPageName] = useState<string>("");
	const [pageDescription, setPageDescription] = useState<string>("");

	const { data: page, loading, error, api, clearData } = useApi<Page>();

	const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setPageName(name);
		if (name.length >= 4) setSubmitEnabled(true);
	}

	const handleClose = () => {
		showHideCallback(false);
	}

	const handleDescriptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPageDescription(e.target.value);
	}

	const pageCreateRequest = useCallback(async () => {
		if (studyId && stepId && pageName && orderPosition && pageDescription && api) {
			try {
				await api.post("pages", {
					study_id: studyId,
					step_id: stepId,
					order_position: orderPosition,
					name: pageName,
					description: pageDescription
				});
			} catch (error) {
				console.log("Error creating page, contact the administrator.");
			}
		}
	}, [studyId, stepId, pageName, orderPosition, pageDescription, api]);

	const handleSuccess = useCallback(async () => {
		if (page) {
			setPageName("");
			setPageDescription("");
			setSubmitEnabled(false);
			onSuccess();
			clearData();
			showHideCallback(false);
		}
	}, [onSuccess, page, clearData, showHideCallback]);

	useEffect(() => { handleSuccess() }, [handleSuccess]);

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add page</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && (
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
								disabled
							// onChange={handleOrderPositionInput}
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
						onClick={pageCreateRequest}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default PageCreateForm;