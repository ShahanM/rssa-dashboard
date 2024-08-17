import { CreateItemFormProps } from "./forms.types";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { isAuthError } from "../../utils/errors";
import React, { useState, useEffect } from "react";
import { createConstructItem, getConstructItemTypes } from "../../api/endpoints";
import { ConstructItem, ConstructItemType } from "../../utils/generics.types";


const CreateItemForm: React.FC<CreateItemFormProps> = ({
	show,
	showHideCallback,
	requestToken,
	onSuccess,
	onAuthError,
	constructId,
	maxEmptyPosition
}) => {
	const [error, setError] = useState<string>("");
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [itemTypes, setItemTypes] = useState<ConstructItemType[]>([]);
	const [item, setItem] = useState<ConstructItem>({
		id: "",
		construct_id: constructId,
		text: "",
		order_position: maxEmptyPosition + 1,
		item_type: ""
	});

	const handleClose = () => {
		setError("");
		showHideCallback(false);
	};

	const handleItemTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const typeId = e.target.value;
		if (typeId === "-1") {
			setItem({ ...item, item_type: "" });
		} else {
			setItem({ ...item, item_type: typeId });
		}
	}

	const handleItemTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const text = e.target.value;
		setItem({ ...item, text: text });
		if (text.length >= 4) {
			setSubmitEnabled(true);
		}
	};

	const handleOrderPositionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setItem({ ...item, order_position: parseInt(e.target.value) });
	};

	const createNewItem = async () => {
		try {
			const token = await requestToken();
			const response = await createConstructItem(
				{
					construct_id: item.construct_id,
					text: item.text,
					order_position: item.order_position,
					item_type: item.item_type
				},
				token
			);
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
	};

	useEffect(() => {
		const fetchItemTypes = async () => {
			try {
				const token = await requestToken();
				const response = await getConstructItemTypes(token);
				setItemTypes(response);
			} catch (error) {
				console.error(error);
			}
		}
		if (itemTypes.length === 0) {
			fetchItemTypes();
		}
	}, [requestToken, itemTypes]);

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create new item</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className="mb-3"
						controlId="constructId">
						<Form.Label>Construct ID</Form.Label>
						<Form.Control
							type="text"
							placeholder="Construct ID"
							value={constructId}
							disabled
						/>
					</Form.Group>
					<Form.Group
						className="mb-3"
						controlId="itemTypeSelect">
						<Form.Label>Type</Form.Label>
						<Form.Select aria-label="type select"
							onChange={handleItemTypeSelect}>
							<option value={-1}>Select a type</option>
							{
								itemTypes.map((type) => (
									<option value={type.id} key={type.id}>{type.type}</option>
								))
							}
						</Form.Select>
					</Form.Group>
					<Form.Group className="mb-3"
						controlId="item-name">
						<Form.Label>Construct item</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter the item text"
							onChange={handleItemTextInput}
						/>
					</Form.Group>
					<Form.Group className="mb-3"
						controlId="order-position">
						<Form.Label>Order position</Form.Label>
						<Form.Control
							type="number"
							placeholder="Order position"
							value={item.order_position}
							onChange={handleOrderPositionInput}
						/>
					</Form.Group>
				</Form>
				{error && <Alert variant="danger">{error}</Alert>}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button
					variant="primary"
					disabled={!submitEnabled && item.item_type !== "-1"}
					onClick={createNewItem}
				>
					Create
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default CreateItemForm;