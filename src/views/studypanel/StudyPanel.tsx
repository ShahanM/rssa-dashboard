import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { VerticalComponentList } from '../../components/componentlist/ComponentList';
import CreateStudyForm from '../../components/forms/CreateStudyForm';
import { isAuthError } from '../../utils/errors';
import { Study } from '../../utils/generics.types';
import './StudyPanel.css';
import { StudyPanelProps } from './StudyPanel.types';
import { duplicateStudy, getStudies } from '../../api/endpoints';
import ConfirmDuplicateDialog from '../../components/dialogs/ConfirmDuplicate';


const StudyPanel: React.FC<StudyPanelProps> = ({
	selected, onChangeSelection, authErrorCallback }) => {

	const [show, setShow] = useState<boolean>(false);
	const [studies, setStudies] = useState<Study[]>([]);

	const [confirmDupe, setConfirmDupe] = useState<boolean>(false);

	const { getAccessTokenSilently } = useAuth0();

	const handleAuthError = (error: any) => {
		authErrorCallback((error as Error).message);
	}

	const handleCreateStudySuccess = (response: Study) => {
		setShow(false);
		setConfirmDupe(false);
		if (response) setStudies([...studies, response]);
	}

	const handleSelection = (id: string) => {
		onChangeSelection({ studyId: id, stepId: "", pageId: "" });
	}

	useEffect(() => {
		const callApi = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await getStudies(token);
				setStudies(response);
			} catch (error) {
				if (isAuthError(error)) {
					authErrorCallback((error as Error).message);
				} else {
					// FIXME: Handle error
					console.log("We are in the error block", error);
				}
			}
		};

		callApi();
	}, [getAccessTokenSilently, authErrorCallback])

	return (
		<Container className="study-panel">
			<Row className="d-flex header">
				<Col md={8}>
					<h2>Your studies</h2>
				</Col>
				<Col md={4} className="header-button-container">
					<Row>
						<Button className="header-button" color="primary" onClick={() => setShow(true)}>
							Create Study
						</Button>
						{selected && selected.studyId &&
							<Button className="header-button" color="primary" onClick={() => setConfirmDupe(true)}>
								Duplicate Study
							</Button>
						}
					</Row>
				</Col>
				<ConfirmDuplicateDialog show={confirmDupe}
					onClose={() => setConfirmDupe(false)}
					onConfirm={() => dupeStudy(selected.studyId,
						getAccessTokenSilently, handleCreateStudySuccess, authErrorCallback)} />
				<CreateStudyForm
					show={show} showHideCallback={setShow}
					requestToken={getAccessTokenSilently}
					onSuccess={handleCreateStudySuccess}
					onAuthError={handleAuthError} />
			</Row>
			<Row className="list-container">
				<VerticalComponentList components={studies}
					selected={selected.studyId}
					onChangeSelection={handleSelection} />
			</Row>
		</Container>
	)
}

export default StudyPanel;


async function dupeStudy(studyId: string, requestToken: () => Promise<string>,
	onSuccess: (response: any) => void, onAuthError: (error: any) => void) {
	try {
		const token = await requestToken();
		const response = await duplicateStudy(
			studyId, token);
		onSuccess(response);
	} catch (error) {
		if (isAuthError(error)) {
			onAuthError(error);
		}
	}
}