import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useApi } from "../../hooks/useApi";
import { StudyStep } from "../../utils/generics.types";

interface ConstructItemCreateFormProps {
	constructId: string;
	orderPosition: number;
	show: boolean;
	showHideCallback: (show: boolean) => void;
	onSuccess: () => void;
}

const ConstructItemCreateForm: React.FC<ConstructItemCreateFormProps> = ({
	constructId,
	orderPosition,
	show,
	showHideCallback,
	onSuccess,
}) => {

	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [itemText, setItemText] = useState<string>("");
	const [itemType, setItemType] = useState<string>();
	const [itemTypes, setItemTypes] = useState<{ id: string; type: string }[]>([]);

	const { data: step, loading, error, api, clearData } = useApi<StudyStep>();

	const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setItemText(name);
		if (name.length >= 4) setSubmitEnabled(true);
	}

	const handleClose = () => {
		showHideCallback(false);
	}


	const itemCreateRequest = useCallback(async () => {
		if (constructId && itemText && orderPosition && api) {
			try {
				await api.post("items/", {
					construct_id: constructId,
					order_position: orderPosition,
					text: itemText,
					item_type: 'eccefa3a-55fe-4459-bef9-7a826ecd3b58' // FIXME: This should be dynamic
				});
			} catch (error) {
				console.log("Error creating step, contact the administrator.");
			}
		}
	}, [constructId, itemText, orderPosition, api]);

	const handleSuccess = useCallback(async () => {
		if (step) {
			setItemText("");
			setItemType("");
			setSubmitEnabled(false);
			onSuccess();
			clearData();
			showHideCallback(false);
		}
	}, [onSuccess, step, clearData, showHideCallback]);

	useEffect(() => { handleSuccess() }, [handleSuccess]);

	const handleItemTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const typeId = e.target.value;
		if (typeId === "-1") {
			setItemType(undefined);
		} else {
			setItemType(typeId);
		}
	}

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add item</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && (
						<Alert variant="danger">
							Something went wrong. Please try again later.
						</Alert>
					)}
					<Form>
						<Form.Group className="mb-3"
							controlId="constructCreateForm.studyId">
							<Form.Label>Construct ID</Form.Label>
							<Form.Control
								type="text"
								placeholder="Study ID"
								value={constructId}
								disabled
							/>
						</Form.Group>
						<Form.Group className="mb-3"
							controlId="constructCreateForm.orderposition">
							<Form.Label>Order position</Form.Label>
							<Form.Control
								type="number"
								placeholder="Order position"
								value={orderPosition}
								disabled
							/>
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="constructTypeSelect">
							<Form.Label>Type</Form.Label>
							<Form.Select aria-label="type select"
								onChange={handleItemTypeSelect}>
								<option value={-1}>Select a type</option>
								{itemTypes && itemTypes.map((type) => (
									<option value={type.id} key={type.id}>
										{type.type}
									</option>
								))
								}
							</Form.Select>
						</Form.Group>
						<Form.Group className="mb-3"
							controlId="constructCreateForm.name">
							<Form.Label>Item text (required)</Form.Label>
							<Form.Control
								type="text"
								placeholder="Item text must be at least 4 characters"
								autoFocus
								value={itemText}
								onChange={handleTextInput}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" disabled={!submitEnabled}
						onClick={itemCreateRequest}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default ConstructItemCreateForm;