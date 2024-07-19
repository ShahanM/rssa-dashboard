import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import StudyListContainer from '../../components/studylistcontainer/StudyListContainer';
import { isAuthError } from '../../utils/errors';
import { Study } from '../../utils/generics.types';
import { StudyPanelProps } from './StudyPanel.types';


const StudyPanel: React.FC<StudyPanelProps> = ({ selected, onChangeSelection, authErrorCallback }) => {

	const [studies, setStudies] = useState<Study[]>([]);

	const { getAccessTokenSilently } = useAuth0();

	const handleAuthError = (error: any) => {
		authErrorCallback((error as Error).message);
	}


	useEffect(() => {
		const callApi = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await fetch("http://localhost:8000/v2/study/", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "http://localhost:3339",
						"Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
						"Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
						"Authorization": `Bearer ${token}`
					},
				});
				const responseData = await response.json();
				if (response.status !== 200) {
					throw new Error(response.statusText);
				}
				setStudies(responseData);
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
		<>
				<StudyListContainer studies={studies} selected={selected}
					onChangeSelection={onChangeSelection} />
		</>
	)
}

export default StudyPanel;