import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { StudyStepCardProps } from './StudyStepCard.types';


const StudyStepCard: React.FC<StudyStepCardProps> = ({ step }) => {

	return (
		<Row className="study-step-card d-flex align-items-center">
			<Col md={9}>
				<h6>{step.name}</h6>
				<p>{step.description}</p>
			</Col>
			<Col md={1}>
				<Button variant="primary">Edit</Button>
			</Col>
		</Row>
	);
}

export default StudyStepCard;