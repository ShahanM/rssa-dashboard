import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { duplicateStudy } from '../../api/endpoints';
import { VerticalComponentList } from '../../components/componentlist/ComponentList';
import { useApi } from '../../hooks/useApi';
import { isAuthError } from '../../utils/errors';
import { Study } from '../../utils/generics.types';
import './StudyPanel.css';
import { StudyPanelProps } from './StudyPanel.types';


const StudyPanel: React.FC<StudyPanelProps> = ({
	selectedStudyId, onChangeSelection, authErrorCallback }) => {

	const [show, setShow] = useState<boolean>(false);
	// const [studies, setStudies] = useState<Study[]>([]);
	// const { getAccessTokenSilently } = useAuth0();

	const [confirmDupe, setConfirmDupe] = useState<boolean>(false);


	const { data: studies, loading, error, api } = useApi<Study[]>();

	// const handleAuthError = (error: any) => {
	// 	authErrorCallback((error as Error).message);
	// }

	const handleCreateStudySuccess = (response: Study) => {
		setShow(false);
		setConfirmDupe(false);
		// if (response) setStudies([...studies, response]);
	}

	const handleSelection = (studyId: string) => {
		onChangeSelection(studyId);
	}

	// useEffect(() => {
	// 	const callApi = async () => {
	// 		try {
	// 			const token = await getAccessTokenSilently();
	// 			const response = await getStudies(token);
	// 			setStudies(response);
	// 		} catch (error) {
	// 			if (isAuthError(error)) {
	// 				authErrorCallback((error as Error).message);
	// 			} else {
	// 				console.error("Error fetching studies:", error);

	// 			}
	// 		}
	// 	};

	// 	callApi();
	// }, [getAccessTokenSilently, authErrorCallback])

	const fetchStudies = useCallback(async () => {
		try {
			await api.get("studies/");
		} catch (error) {
			console.error("Error fetching studies:", error);
		}
	}, [api]);

	useEffect(() => { fetchStudies(); }, [fetchStudies])

	if (loading) {
		return <div>Loading studies...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	if (!studies || studies.length === 0) {
		return <div>No studies found.</div>;
	}

	return (
		<Container className="study-panel">
			<Row className="header">
				<Col md={8}>
					<h2>Your studies</h2>
				</Col>
				<Col md={4} className="header-button-container">
					<Row>
						<Button className="header-button" color="primary" onClick={() => setShow(true)}>
							Create Study
						</Button>
						<Button className="header-button" color="primary" onClick={() => setConfirmDupe(true)}
							disabled={!(selectedStudyId && selectedStudyId.length > 0)}>
							Duplicate Study
						</Button>
					</Row>
				</Col>
				{/* {selectedStudyId && selectedStudyId.length > 0 &&
					<ConfirmDuplicateDialog show={confirmDupe}
						onClose={() => setConfirmDupe(false)}
						onConfirm={() => dupeStudy(selectedStudyId,
							getAccessTokenSilently, handleCreateStudySuccess, authErrorCallback)} />
				}
				<CreateStudyForm
					show={show} showHideCallback={setShow}
					requestToken={getAccessTokenSilently}
					onSuccess={handleCreateStudySuccess}
					onAuthError={handleAuthError} /> */}
			</Row>
			<Row className="list-container">
				<VerticalComponentList components={studies}
					selected={selectedStudyId}
					onChangeSelection={handleSelection} />
			</Row>
		</Container>
	)
}

export default StudyPanel;


async function dupeStudy(
	studyId: string,
	requestToken: () => Promise<string>,
	onSuccess: (response: any) => void,
	onAuthError: (error: any) => void) {
	try {
		const token = await requestToken();
		const response = await duplicateStudy(
			studyId, token);
		onSuccess(response);
	} catch (error) {
		if (isAuthError(error)) {
			onAuthError(error);
		} else {
			console.error("Error duplicating study:", error);
			alert("Error duplicating study: " + (error as Error).message);
		}
	}
}