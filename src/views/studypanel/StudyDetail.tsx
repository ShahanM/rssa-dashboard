import { Study, StudyCondition, StudyStep } from '../../utils/generics.types';

interface StudyDetailsProps {
	study: Study;
	studyConditions: StudyCondition[];
	studySteps: StudyStep[];
}



const StudyDetails: React.FC<StudyDetailsProps> = ({
	study,
	studyConditions,
	studySteps
}) => {
	return (
		<div>
			<h1>Study Details</h1>
		</div>
	);
}

export default StudyDetails;