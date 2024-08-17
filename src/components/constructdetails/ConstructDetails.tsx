import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { getSurveyConstructById } from '../../api/endpoints';
import { SurveyConstructDetails } from '../../utils/generics.types';
import { findFirstEmptyPosition } from '../../utils/utils';
import CreateItemForm from '../forms/CreateItemForm';
import './ConstructDetails.css';


type ConstructDetailsProps = {
	constructId: string;
}

const ConstructDetails: React.FC<ConstructDetailsProps> = ({ constructId }) => {

	const { getAccessTokenSilently } = useAuth0();
	const [surveyConstruct, setSurveyConstruct] = useState<SurveyConstructDetails>();
	const [showItemForm, setShowItemForm] = useState<boolean>(false);
	const [refresh, setRefresh] = useState<boolean>(true);

	const handleItemCreateSuccess = () => {
		setRefresh(true);
	}

	useEffect(() => {
		const fetchSurveyConstruct = async () => {
			try {
				const token = await getAccessTokenSilently();
				const response = await getSurveyConstructById(constructId, token);
				setSurveyConstruct(response);
			} catch (error) {
				console.error(error);
			}
		};
		if (constructId) fetchSurveyConstruct();
	}, [constructId, getAccessTokenSilently]);

	return (
		<>
			{surveyConstruct ?
				<Container className="construct-details">
					<Row className="d-flex header">
						<h6>{surveyConstruct.name}</h6>
					</Row>
					<Row>
						<p>{surveyConstruct.desc}</p>
					</Row>
					<Row>
						<p>
							Construct type: {
								surveyConstruct.type ?
									<span>{surveyConstruct.type.type}</span>
									: "N/A"
							}
						</p>
						<p>
							Scale: {
								surveyConstruct.scale ?
									<span>{surveyConstruct.scale.name}</span>
									: "N/A"
							}
						</p>
						{
							surveyConstruct.scale &&
							<div>
								<p>Levels: {surveyConstruct.scale.levels}</p>
								<ul>

									{surveyConstruct.scale.scale_levels.map((level, index) => (
										<li key={index}>{level.label} : {level.level}</li>
									))}
								</ul>
							</div>
						}
					</Row>
					<Row>
						<Button onClick={() => setShowItemForm(true)}>Add Item</Button>
					</Row>
					<CreateItemForm
						show={showItemForm} showHideCallback={setShowItemForm}
						requestToken={getAccessTokenSilently}
						onSuccess={handleItemCreateSuccess}
						onAuthError={(error: Error) => console.error(error)}
						constructId={constructId}
						maxEmptyPosition={findFirstEmptyPosition(surveyConstruct.items ? surveyConstruct.items : [])}
					/>
					<Row>
						{surveyConstruct.items &&
							surveyConstruct.items.map((item, index) => (
								<Row key={index} className="item-row">
									<Col md={10}>
										{item.text}
									</Col>
									<Col>
										<Button>Edit</Button>
									</Col>
								</Row>
							))
						}
					</Row>
				</Container>
				:
				<Container>
					<p>Select a construct of the list on the left.</p>
				</Container>
			}
		</>
	)
}

export default ConstructDetails;