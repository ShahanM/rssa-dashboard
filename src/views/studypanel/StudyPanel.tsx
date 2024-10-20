import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { VerticalComponentList } from '../../components/componentlist/ComponentList';
import CreateStudyForm from '../../components/forms/CreateStudyForm';
import { isAuthError } from '../../utils/errors';
import { Study } from '../../utils/generics.types';
import './StudyPanel.css';
import { StudyPanelProps } from './StudyPanel.types';
import { getStudies } from '../../api/endpoints';


const StudyPanel: React.FC<StudyPanelProps> = ({
	selected, onChangeSelection, authErrorCallback }) => {

	const [show, setShow] = useState<boolean>(false);
	const [studies, setStudies] = useState<Study[]>([]);

	const { getAccessTokenSilently } = useAuth0();

	const handleAuthError = (error: any) => {
		authErrorCallback((error as Error).message);
	}

	const handleCreateStudySuccess = (response: Study) => {
		setStudies([...studies, response]);
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
				<Col md={4} className="header-button">
					<Button color="primary" onClick={() => setShow(true)}>
						Create Study
					</Button>
				</Col>
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