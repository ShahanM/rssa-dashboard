import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useApi } from "../../hooks/useApi";
import { ConstructScale, ConstructType, SurveyConstruct } from "../../utils/generics.types";

interface ConstructCreateFormProps {
	show: boolean;
	showHideCallback: (show: boolean) => void;
	onSuccess: () => void;
}


const ConstructCreateForm: React.FC<ConstructCreateFormProps> = ({
	show,
	showHideCallback,
	onSuccess,
}) => {

	// const [error, setError] = useState<string>("");
	const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
	const [showScales, setShowScales] = useState<boolean>(false);

	const [constructTypes, setConstructTypes] = useState<ConstructType[]>([]);
	const [relevantScales, setRelevantScales] = useState<ConstructScale[]>([]);

	const { data: construct, loading, error, api, clearData } = useApi<SurveyConstruct>();

	const [constructName, setConstructName] = useState<string>("");
	const [constructDesc, setConstructDesc] = useState<string>("");

	const [constructTypeId, setConstructTypeId] = useState<string>("");
	const [constructScaleId, setConstructScaleId] = useState<string>("");

	// useEffect(() => {
	// 	if (construct.name.length >= 4 && construct.desc.length >= 4) {
	// 		setSubmitEnabled(true);
	// 	} else {
	// 		setSubmitEnabled(false);
	// 	}
	// }, [construct]);

	const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const name = e.target.value;
		setConstructName(name);
	}

	const handleDescriptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const desc = e.target.value;
		setConstructDesc(desc);
	}

	useEffect(() => {
		if (constructName.length >= 4 && constructDesc.length >= 4) {
			setSubmitEnabled(true);
		} else {
			setSubmitEnabled(false);
		}
	}, [constructName, constructDesc]);

	const handleConstructTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const typeId = e.target.value;
		setConstructTypeId(typeId);
	}

	const handleScaleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const scaleId = e.target.value;
		setConstructScaleId(scaleId);
	}

	const handleClose = () => {
		showHideCallback(false);
	}

	const constructCreateRequest = useCallback(async () => {
		if (constructName && constructDesc && api) {
			try {
				await api.post("constructs/", {
					name: constructName,
					desc: constructDesc,
					type_id: constructTypeId,
					scale_id: constructScaleId
				});
			} catch (error) {
				console.log("Error creating construct, contact the administrator.");
			}
		}
	}, [constructName, constructDesc, constructTypeId, constructScaleId, api]);

	const handleSuccess = useCallback(async () => {
		if (construct) {
			setConstructName("");
			setConstructDesc("");
			setConstructTypeId("");
			setConstructScaleId("");
			setSubmitEnabled(false);
			showHideCallback(false);
			onSuccess();
			clearData();
		}
	}, [construct, clearData, showHideCallback, onSuccess]);

	useEffect(() => { handleSuccess() }, [handleSuccess]);
	// const createConstruct = async () => {
	// 	console.log(construct);
	// 	try {
	// 		const token = await requestToken();
	// 		const response = await createSurveyConstruct({
	// 			name: construct.name,
	// 			desc: construct.desc,
	// 			type_id: construct.typeId,
	// 			scale_id: construct.scaleId
	// 		}, token);
	// 		handleSuccess(response);
	// 		handleClose();
	// 	} catch (error) {
	// 		if (isAuthError(error)) {
	// 			onAuthError(error);
	// 		} else {
	// 			setError((error as Error).message);
	// 		}
	// 	}
	// }

	// useEffect(() => {
	// 	const fetchConstructTypes = async () => {
	// 		try {
	// 			const token = await requestToken();
	// 			const response = await getConstructTypes(token);
	// 			setConstructTypes(response);
	// 		} catch (error) {
	// 			console.error(error);
	// 		}
	// 	}
	// 	if (constructTypes.length === 0) {
	// 		fetchConstructTypes();
	// 	}
	// }, [requestToken, constructTypes]);

	// useEffect(() => {
	// 	const fetchRelevantScales = async () => {
	// 		try {
	// 			const token = await requestToken();
	// 			const response = await getConstructScales(token);
	// 			setRelevantScales(response);
	// 		} catch (error) {
	// 			console.error(error);
	// 		}

	// 	}
	// 	if (constructTypes.find((type) => type.id === construct.typeId)?.type === "Likert") {
	// 		if (relevantScales.length === 0) {
	// 			fetchRelevantScales();
	// 		}
	// 		setShowScales(true);
	// 	} else {
	// 		setShowScales(false);
	// 	}
	// }, [requestToken, relevantScales, construct.typeId, constructTypes]);

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Create Construct</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && (
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
								value={constructName}
								onChange={handleNameInput} />
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="constructDescriptionText">
							<Form.Label>Description</Form.Label>
							<Form.Control as="textarea" rows={3}
								value={constructDesc}
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
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" type="submit"
						disabled={!submitEnabled}
						onClick={constructCreateRequest}>
						Save changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}

export default ConstructCreateForm;
