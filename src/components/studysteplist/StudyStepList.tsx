import React from 'react';
import { StudyStepListProps } from './StudyStepList.types';
import { Container } from 'react-bootstrap';
import StudyStepCard from '../studystepcard/StudyStepCard';


const StudyStepList: React.FC<StudyStepListProps> = ({ studySteps }) => {

	return (
		<Container>
			{studySteps.map((step) => (
				<StudyStepCard key={step.id} step={step} />
			))}
		</Container>
	);
}

export default StudyStepList;