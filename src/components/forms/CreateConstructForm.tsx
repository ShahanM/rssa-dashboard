import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { ConstructType, SurveyConstruct, ConstructScale } from "../../utils/generics.types";
import { InputFormModalProps } from "./forms.types";
import { createSurveyConstruct, getConstructScales, getConstructTypes } from "../../api/endpoints";
import { isAuthError } from "../../utils/errors";
import { emptyConstruct } from "../../utils/emptyinstances";


const CreateConstructForm: React.FC<InputFormModalProps> = ({
	show,
	showHideCallback,
	requestToken,
	onSuccess,
	onAuthError
}) => {

	const [error, setError] = useState<string>("");
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [showScales, setShowScales] = useState<boolean>(false);

	// FIXME: refresh list when new construct type is created
	const [constructTypes, setConstructTypes] = useState<ConstructType[]>([]);
	const [relevantScales, setRelevantScales] = useState<ConstructScale[]>([]);

	const [construct, setConstruct] = useState<SurveyConstruct>(emptyConstruct);

	useEffect(() => {
		if (construct.name.length >= 4 && construct.desc.length >= 4) {
			setSubmitEnabled(true);
		} else {
			setSubmitEnabled(false);
		}
	}, [construct]);

	const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setConstruct({ ...construct, name: name });
	}

	const handleDescriptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const desc = e.target.value;
		setConstruct({ ...construct, desc: desc });
	}

	const handleConstructTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const typeId = e.target.value;
		if (typeId === "-1") {
			setConstruct({ ...construct, typeId: "", scaleId: "" });
		} else if (constructTypes.find((type) => type.id === construct.typeId)?.type !== "Likert") {
			setConstruct({ ...construct, typeId: typeId, scaleId: "" });
		} else {
			setConstruct({ ...construct, typeId: typeId });
		}
	}

	const handleScaleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const scaleId = e.target.value;
		setConstruct({ ...construct, scaleId: scaleId });
	}

	const handleClose = () => {
		setError("");
		showHideCallback(false);
	}

	const handleSuccess = (newConstruct: SurveyConstruct) => {
		onSuccess(newConstruct.id);
		setConstruct(emptyConstruct);
	}

	const createConstruct = async () => {
		try {
			const token = await requestToken();
			const response = await createSurveyConstruct({
				name: construct.name,
				desc: construct.desc,
				type_id: construct.typeId,
				scale_id: construct.scaleId
			}, token);
			handleSuccess(response);
			handleClose();
		} catch (error) {
			if (isAuthError(error)) {
				onAuthError(error);
			} else {
				setError((error as Error).message);
			}
		}
	}

	useEffect(() => {
		const fetchConstructTypes = async () => {
			try {
				const token = await requestToken();
				const response = await getConstructTypes(token);
				setConstructTypes(response);
			} catch (error) {
				console.error(error);
			}
		}
		if (constructTypes.length === 0) {
			fetchConstructTypes();
		}
	}, [requestToken, constructTypes]);

	useEffect(() => {
		const fetchRelevantScales = async () => {
			try {
				const token = await requestToken();
				const response = await getConstructScales(token);
				setRelevantScales(response);
			} catch (error) {
				console.error(error);
			}

		}
		if (constructTypes.find((type) => type.id === construct.typeId)?.type === "Likert") {
			if (relevantScales.length === 0) {
				fetchRelevantScales();
			}
			setShowScales(true);
		} else {
			setShowScales(false);
		}
	}, [requestToken, relevantScales, construct.typeId, constructTypes]);

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Create Construct</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error !== "" && (
						<Alert variant="danger">
							Something went wrong. Please try again later.
						</Alert>
					)}
					<Form>
						<Form.Group className="mb-3"
							controlId="constructNameText">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Construct name"
								value={construct.name}
								onChange={handleNameInput} />
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="constructDescriptionText">
							<Form.Label>Description</Form.Label>
							<Form.Control as="textarea" rows={3}
								value={construct.desc}
								onChange={handleDescriptionInput}
							/>
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="constructTypeSelect">
							<Form.Label>Type</Form.Label>
							<Form.Select aria-label="type select"
								onChange={handleConstructTypeSelect}>
								<option value={-1}>Select a type</option>
								{constructTypes.map((type) => (
									<option value={type.id} key={type.id}>
										{type.type}
									</option>
								))
								}
							</Form.Select>
						</Form.Group>
						{showScales &&
							<Form.Group
								className="mb-3"
								controlId="constructScaleSelect">
								<Form.Label>Scale</Form.Label>
								<Form.Select aria-label="scale select"
									onChange={handleScaleSelect}>
									<option value={-1}>Select a scale</option>
									{relevantScales.map((scale) => (
										<option value={scale.id} key={scale.id}>
											{scale.name}
										</option>
									))
									}
								</Form.Select>
							</Form.Group>
						}
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" type="submit"
						disabled={!submitEnabled}
						onClick={createConstruct}>
						Save changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default CreateConstructForm;
