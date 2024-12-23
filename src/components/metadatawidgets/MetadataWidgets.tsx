import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import {
	getConstructItemTypes,
	getConstructScales,
	getConstructTypes,
	getParticipantTypes,
	getStudyConditions
} from '../../api/endpoints';
import {
	ConstructItemType,
	ConstructScale,
	ConstructType,
	ParticipantType,
	StudyCondition
} from '../../utils/generics.types';
import {
	CreateConstructScaleForm,
	CreateConstructTypeForm,
	CreateItemTypeForm,
	CreateParticipantTypeForm,
	CreateStudyConditionForm
} from '../forms/MetadataForms';
import './MetadataWidgets.css';


export const ConstructTypeWidget = () => {

	const [constructTypes, setConstructTypes] = useState<ConstructType[]>([]);
	const [show, setShow] = useState(false);
	const [refreshList, setRefreshList] = useState<boolean>(true);
	const { getAccessTokenSilently } = useAuth0();


	const handleCreateConstructType = (constructType: ConstructType) => {
		setRefreshList(true);
	}

	const handleAuthError = (error: Error) => {
		console.error(error);
	}

	useEffect(() => {
		const fetchConstructTypes = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await getConstructTypes(token);
				setConstructTypes(response);
			} catch (error) {
				console.error(error);
			}
		}
		if (refreshList) {
			setRefreshList(false);
			fetchConstructTypes();
		}
	}, [getAccessTokenSilently, refreshList]);

	return (
		<>
			<Row className="d-flex header">
				<Col md={8}>
					<h6>Construct types</h6>
				</Col>
				<Col md={4} className="header-button">
					<Button color="primary" onClick={() => setShow(true)}>
						Create new construct type
					</Button>
				</Col>
				<CreateConstructTypeForm
					show={show}
					showHideCallback={setShow}
					requestToken={getAccessTokenSilently}
					onSuccess={handleCreateConstructType}
					onAuthError={handleAuthError}
				/>
			</Row>
			<Row>
				<ul>
					{constructTypes.map((type, index) => (
						<li key={type.id}>{type.type}</li>
					))}
				</ul>
			</Row>
		</>
	);
}

export const ConstructScaleWidget = () => {
	const [show, setShow] = useState(false);
	const [refreshList, setRefreshList] = useState<boolean>(true);
	const { getAccessTokenSilently } = useAuth0();
	const [constructScales, setConstructScales] = useState<ConstructScale[]>([]);

	const handleCreateConstructScale = (constructScale: ConstructScale) => {
		setRefreshList(true);
	}

	const handleAuthError = (error: Error) => {
		console.error(error);
	}

	useEffect(() => {
		const fetchConstructScales = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await getConstructScales(token);
				setConstructScales(response);
			} catch (error) {
				console.error(error);
			}
		}
		if (refreshList) {
			setRefreshList(false);
			fetchConstructScales();
		}
	}, [getAccessTokenSilently, refreshList]);

	return (
		<>
			<Row className="d-flex header">
				<Col md={8}>
					<h6>Construct scales</h6>
				</Col>
				<Col md={4} className="header-button">
					<Button color="primary" onClick={() => setShow(true)}>
						Create new scale
					</Button>
				</Col>
				<CreateConstructScaleForm
					show={show}
					showHideCallback={setShow}
					requestToken={getAccessTokenSilently}
					onSuccess={handleCreateConstructScale}
					onAuthError={handleAuthError} />
			</Row>
			<Row>
				<ul>
					{constructScales.map((scale, index) => (
						<li key={scale.id}>{scale.name} ({scale.levels} point scale)</li>
					))}
				</ul>
			</Row>
		</>
	)
}

export const ItemTypeWidget = () => {

	const [itemTypes, setItemTypes] = useState<ConstructItemType[]>([]);
	const [show, setShow] = useState(false);
	const [refreshList, setRefreshList] = useState<boolean>(true);
	const { getAccessTokenSilently } = useAuth0();

	const handleCreateItemType = (ConstructItemType: ConstructItemType) => {
		setRefreshList(true);
	}

	const handleAuthError = (error: Error) => {
		console.error(error);
	}

	useEffect(() => {
		const fetchItemTypes = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await getConstructItemTypes(token);
				setItemTypes(response);
			} catch (error) {
				console.error(error);
			}
		}
		if (refreshList) {
			setRefreshList(false);
			fetchItemTypes();
		}
	}, [getAccessTokenSilently, refreshList]);

	return (
		<>
			<Row className="d-flex header">
				<Col md={8}>
					<h6>Item types</h6>
				</Col>
				<Col md={4} className="header-button">
					<Button color="primary" onClick={() => setShow(true)}>
						Create new item type
					</Button>
				</Col>
				<CreateItemTypeForm
					show={show} showHideCallback={setShow}
					requestToken={getAccessTokenSilently}
					onSuccess={handleCreateItemType}
					onAuthError={handleAuthError}
				/>
			</Row>
			<Row>
				<ul>
					{itemTypes.map((type, index) => (
						<li key={index}>{type.type}</li>
					))}
				</ul>
			</Row>
		</>
	)
}

export const ParticipantTypeWidget = () => {
	const [participantTypes, setParticipantTypes] = useState<ParticipantType[]>([]);
	const [show, setShow] = useState(false);
	const [refreshList, setRefreshList] = useState<boolean>(true);
	const { getAccessTokenSilently } = useAuth0();

	const handleCreateParticipantType = (participantType: ParticipantType) => {
		setRefreshList(true);
	}

	const handleAuthError = (error: Error) => {
		console.error(error);
	}

	useEffect(() => {
		const fetchParticipantTypes = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await getParticipantTypes(token);
				setParticipantTypes(response);
			} catch (error) {
				console.error(error);
			}
		}
		if (refreshList) {
			setRefreshList(false);
			fetchParticipantTypes();
		}
	}, [getAccessTokenSilently, refreshList]);

	return (
		<>
			<Row className="d-flex header">
				<Col md={8}>
					<h6>Participant types</h6>
				</Col>
				<Col md={4} className="header-button">
					<Button color="primary" onClick={() => setShow(true)}>
						Create new participant type
					</Button>
				</Col>
				<CreateParticipantTypeForm
					show={show} showHideCallback={setShow}
					requestToken={getAccessTokenSilently}
					onSuccess={handleCreateParticipantType}
					onAuthError={handleAuthError}
				/>
			</Row>
			<Row>
				<ul>
					{participantTypes.map((type, index) => (
						<li key={type.id}>{type.type}</li>
					))}
				</ul>
			</Row>
		</>
	)
}

export const StudyConditionWidget: React.FC<{ studyId: string }> = ({ studyId }) => {
	const [studyConditions, setStudyConditions] = useState<StudyCondition[]>([]);
	const [show, setShow] = useState(false);
	const { getAccessTokenSilently } = useAuth0();

	const handleCreateParticipantType = (studyCondition: StudyCondition) => {
		setStudyConditions([...studyConditions, studyCondition]);
	}

	const handleAuthError = (error: Error) => {
		console.error(error);
	}

	useEffect(() => {
		const fetchParticipantTypes = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await getStudyConditions(studyId, token);
				setStudyConditions(response);
			} catch (error) {
				console.error(error);
			}
		}
		if (studyId) {
			fetchParticipantTypes();
		} else {
			setStudyConditions([]);
		}
	}, [getAccessTokenSilently, studyId]);

	return (
		<>
			<Row className="d-flex header">
				<Col md={8}>
					<h6>Stuy conditions</h6>
					<p><strong>Study Id:</strong> {studyId}</p>
				</Col>
				<Col md={4} className="header-button">
					<Button color="primary" onClick={() => setShow(true)}>
						Create new condition
					</Button>
				</Col>
				<CreateStudyConditionForm
					show={show} showHideCallback={setShow}
					requestToken={getAccessTokenSilently}
					onSuccess={handleCreateParticipantType}
					onAuthError={handleAuthError}
					studyId={studyId}
				/>
			</Row>
			<Row>
				<ul>
					{studyConditions.map((condition, index) => (
						<li key={condition.id}>
							<p>
								{condition.id}: {condition.name}
								<span>
									<Button color="info">Edit</Button>
								</span>
							</p>
						</li>
					))}
				</ul>
			</Row>
		</>
	)
}