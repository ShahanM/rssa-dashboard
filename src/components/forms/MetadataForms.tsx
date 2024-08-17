import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import {
	createConstructScale,
	createConstructType,
	createItemType,
	createParticipantType,
	createStudyCondition
} from '../../api/endpoints';
import { isAuthError } from '../../utils/errors';
import { ConstructScale } from '../../utils/generics.types';
import { InputFormModalProps, CreateStudyConditionProps } from './forms.types';


const emptyConstructScale: ConstructScale = {
	id: "",
	levels: 1,
	name: "",
	scale_levels: [{ level: 1, label: "" }]
}


export const CreateConstructTypeForm: React.FC<InputFormModalProps> = ({
	show,
	showHideCallback,
	requestToken,
	onSuccess,
	onAuthError
}) => {

	const [error, setError] = useState<string>("");
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [constructType, setConstructType] = useState<string>("");

	const handleClose = () => {
		setError("");
		showHideCallback(false);
	}

	const handleConstructTypeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const type = e.target.value;
		setConstructType(type);
		if (type.length >= 4) { setSubmitEnabled(true); }
	}

	const createNewConstructType = async () => {
		try {
			const token = await requestToken();
			const response = await createConstructType({ type: constructType }, token);
			onSuccess(response);
			handleClose();
		} catch (error) {
			if (isAuthError(error)) {
				onAuthError(error);
				handleClose();
			} else {
				setError((error as Error).message
				);
			}
		}
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create construct type</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{error !== "" && (
					<Alert variant="danger">
						Something went wrong. Please try again later.
					</Alert>
				)}
				<Form>
					<Form.Group className="mb-3"
						controlId="constructType">
						<Form.Label>Type</Form.Label>
						<Form.Control
							type="text"
							placeholder="Construct type"
							autoFocus
							value={constructType}
							onChange={handleConstructTypeInput}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" disabled={!submitEnabled}
					onClick={createNewConstructType}>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export const CreateConstructScaleForm: React.FC<InputFormModalProps> = ({
	show,
	showHideCallback,
	requestToken,
	onSuccess,
	onAuthError
}) => {
	const [error, setError] = useState<string>("");
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [constructScale, setConstructScale] = useState<ConstructScale>(emptyConstructScale);

	useEffect(() => {
		if (constructScale.name.length >= 4 && constructScale.levels > 0) {
			if (constructScale.scale_levels.length === constructScale.levels) {
				const valid = constructScale.scale_levels.every((field) => field.label.length > 0);
				setSubmitEnabled(valid);
			}
		}
	}, [constructScale]);

	const handleClose = () => {
		setError("");
		setConstructScale(emptyConstructScale);
		showHideCallback(false);
	}

	const handleLevelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const leveltxt = e.target.value === "" ? "0" : e.target.value;
		const newlevel = parseInt(leveltxt);
		const levels = { ...constructScale, levels: newlevel };
		const numFields = constructScale.scale_levels.length;
		setSubmitEnabled(false);
		if (numFields > newlevel) {
			removeLabelField(numFields - newlevel);
		} else if (numFields < newlevel) {
			addLabelField(newlevel - numFields);
		}
		setConstructScale(levels);
	}

	const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		const scale = { ...constructScale, name: name };
		setConstructScale(scale);
		if (name.length >= 4) { setSubmitEnabled(true); }
	}

	const handleScaleLevelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const level = parseInt(e.target.attributes.getNamedItem("data-level")?.value || "1");
		const newScaleLevels = constructScale.scale_levels.map((field) => {
			if (field.level === level) {
				return { level: level, label: e.target.value };
			}
			return field;
		});
		const scale = { ...constructScale, scale_levels: newScaleLevels };
		setConstructScale(scale);
	}

	const addLabelField = (num: number) => {
		let scale = constructScale;
		for (; num > 0; num--) {
			scale.scale_levels.push({ level: scale.scale_levels.length + 1, label: "" });
		}
		setConstructScale(scale);
	}

	const removeLabelField = (num: number) => {
		let scale = constructScale;
		for (; num > 0; num--) {
			scale.scale_levels.pop();
		}
		setConstructScale(scale);
	}

	const createNewConstructType = async () => {
		try {
			const token = await requestToken();
			const response = await createConstructScale({
				levels: constructScale.levels,
				name: constructScale.name,
				scale_levels: constructScale.scale_levels
			}, token);
			onSuccess(response);
			handleClose();
		} catch (error) {
			if (isAuthError(error)) {
				onAuthError(error);
				handleClose();
			} else {
				setError((error as Error).message
				);
			}
		}
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create construct type</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{error !== "" && (
					<Alert variant="danger">
						Something went wrong. Please try again later.
					</Alert>
				)}
				<Form>
					<Form.Group className="mb-3"
						controlId="constructScaleName">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Scale name"
							autoFocus
							value={constructScale.name}
							onChange={handleNameInput} />
					</Form.Group>
					<Form.Group className="mb-3"
						controlId="constructScaleLevels">
						<Form.Label>Number of levels</Form.Label>
						<Form.Control
							type="number"
							min={1}
							autoFocus
							onChange={handleLevelInput} />
					</Form.Group>
					<Form.Label>Scale levels</Form.Label>
					{
						constructScale.scale_levels.map((label) => (
							<InputGroup className="mb-3">
								<InputGroup.Text id={`constructScaleLevels-${label.level}`}>
									{`Level ${label.level}`}
								</InputGroup.Text>
								<Form.Control
									placeholder="Label"
									aria-label="Label"
									aria-describedby={`constructScaleLevels-${label.level}`}
									value={label.label}
									data-level={label.level}
									onChange={handleScaleLevelInput}
								/>
							</InputGroup>
						))}
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" disabled={!submitEnabled}
					onClick={createNewConstructType}>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export const CreateItemTypeForm: React.FC<InputFormModalProps> = ({
	show,
	showHideCallback,
	requestToken,
	onSuccess,
	onAuthError
}) => {
	const [error, setError] = useState<string>("");
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [itemType, setItemType] = useState<string>("");

	const handleClose = () => {
		setError("");
		setItemType("");
		showHideCallback(false);
	}

	const handleItemTypeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const type = e.target.value;
		setItemType(type);
		if (type.length >= 4) { setSubmitEnabled(true); }
	}

	const createNewItemType = async () => {
		try {
			const token = await requestToken();
			const response = await createItemType({ type: itemType }, token);
			onSuccess(response);
			handleClose();
		} catch (error) {
			if (isAuthError(error)) {
				onAuthError(error);
				handleClose();
			} else {
				setError((error as Error).message
				);
			}
		}
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create item type</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{error !== "" && (
					<Alert variant="danger">
						Something went wrong. Please try again later.
					</Alert>
				)}
				<Form>
					<Form.Group className="mb-3"
						controlId="itemType">
						<Form.Label>Type</Form.Label>
						<Form.Control
							type="text"
							placeholder="Item type"
							autoFocus
							value={itemType}
							onChange={handleItemTypeInput}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" disabled={!submitEnabled}
					onClick={createNewItemType}>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export const CreateParticipantTypeForm: React.FC<InputFormModalProps> = ({
	show,
	showHideCallback,
	requestToken,
	onSuccess,
	onAuthError
}) => {
	const [error, setError] = useState<string>("");
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [participantType, setParticipantType] = useState<string>("");

	const handleClose = () => {
		setError("");
		setParticipantType("");
		showHideCallback(false);
	}

	const handleParticipantTypeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const type = e.target.value;
		setParticipantType(type);
		if (type.length >= 4) { setSubmitEnabled(true); }
	}

	const createNewParticipantType = async () => {
		try {
			const token = await requestToken();
			const response = await createParticipantType({ type: participantType }, token);
			onSuccess(response);
			handleClose();
		} catch (error) {
			if (isAuthError(error)) {
				onAuthError(error);
				handleClose();
			} else {
				setError((error as Error).message
				);
			}
		}
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create participant type</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{error !== "" && (
					<Alert variant="danger">
						Something went wrong. Please try again later.
					</Alert>
				)}
				<Form>
					<Form.Group className="mb-3"
						controlId="participantType">
						<Form.Label>Type</Form.Label>
						<Form.Control
							type="text"
							placeholder="Participant type"
							autoFocus
							value={participantType}
							onChange={handleParticipantTypeInput}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" disabled={!submitEnabled}
					onClick={createNewParticipantType}>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export const CreateStudyConditionForm: React.FC<CreateStudyConditionProps> = ({
	show,
	showHideCallback,
	requestToken,
	onSuccess,
	onAuthError,
	studyId
}) => {
	const [error, setError] = useState<string>("");
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [studyConditionName, setStudyConditionName] = useState<string>("");
	const [studyConditionDesc, setStudyConditionDesc] = useState<string>("");

	const handleClose = () => {
		setError("");
		setStudyConditionName("");
		setStudyConditionDesc("");
		showHideCallback(false);
	}

	const handleStudyConditionNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setStudyConditionName(name);
	}

	const handleStudyConditionDescInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const desc = e.target.value;
		setStudyConditionDesc(desc);
	}

	useEffect(() => {
		if (studyConditionName.length >= 4) {
			setSubmitEnabled(true);
		}
	}, [studyConditionName]);

	const createNewStudyCondition = async () => {
		try {
			const token = await requestToken();
			const response = await createStudyCondition(
				{
					study_id: studyId,
					name: studyConditionName,
					description: studyConditionDesc
				}, token);
			onSuccess(response);
			handleClose();
		} catch (error) {
			if (isAuthError(error)) {
				onAuthError(error);
				handleClose();
			} else {
				setError((error as Error).message
				);
			}
		}
	}

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create participant type</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{error !== "" && (
					<Alert variant="danger">
						Something went wrong. Please try again later.
					</Alert>
				)}
				<Form>
					<Form.Group className="mb-3"
						controlId="studyConditionName">
						<Form.Label>Name</Form.Label>
						<Form.Control
							type="text"
							placeholder="Study condition name"
							autoFocus
							value={studyConditionName}
							onChange={handleStudyConditionNameInput}
						/>
					</Form.Group>
					<Form.Group className="mb-3"
						controlId="studyConditionName">
						<Form.Label>Description</Form.Label>
						<Form.Control
							type="text"
							placeholder="Study condition description"
							autoFocus
							value={studyConditionDesc}
							onChange={handleStudyConditionDescInput}
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" disabled={!submitEnabled}
					onClick={createNewStudyCondition}>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
