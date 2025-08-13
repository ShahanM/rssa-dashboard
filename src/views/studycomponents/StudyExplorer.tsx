
import StudyPanel from "../studycomponents/StudyPanel";
import StudySummaryView from "../studycomponents/StudySummary";


export const StudyExplorer = () => {

	return (
		<div className="container mx-auto p-3">
			<div className="flex space-x-2 justify-between mb-2 p-3">
				<StudyPanel />
				<StudySummaryView />
			</div>
		</div>
	);
};

export default StudyExplorer;