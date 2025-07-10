import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { duplicateStudy } from '../../api/endpoints';
import { useApi } from '../../hooks/useApi';
import { isAuthError } from '../../utils/errors';
import { Study } from '../../utils/generics.types';

interface StudyPanelProps {
	selectedStudyId: string | undefined;
	onChangeSelection: (study: {
		id: string;
		name?: string
	}) => void;
	authErrorCallback: (errorMessage: string) => void;
}

const StudyPanel: React.FC<StudyPanelProps> = ({
	selectedStudyId, onChangeSelection, authErrorCallback }) => {

	const [show, setShow] = useState<boolean>(false);
	const { data: studies, loading, error, api } = useApi<Study[]>();

	const handleCreateStudySuccess = (response: Study) => {
		setShow(false);
	}

	const handleSelection = (study: { id: string; name?: string; }) => {
		onChangeSelection(study);
	}

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
						{/* <Button className="header-button" color="primary" onClick={() => setConfirmDupe(true)}
							disabled={!(selectedStudyId && selectedStudyId.length > 0)}>
							Duplicate Study
						</Button> */}
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
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Study</th>
							<th>Lead</th>
						</tr>
					</thead>
					<tbody>
						{studies.map((study) => (
							<tr key={study.id}
								className={selectedStudyId === study.id ? "selected" : ""}
								onClick={() => handleSelection({ id: study.id, name: study.name })}>
								<td>{study.name}</td>
								<td>{ }</td>
							</tr>
						))}
					</tbody>
				</Table>
				{/* <VerticalComponentList components={studies}
					selected={selectedStudyId}
					onChangeSelection={handleSelection} /> */}
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