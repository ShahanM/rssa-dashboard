import ScalesList from "./ScalesList";
import ScaleSummaryView from "./ScaleSummary";


const SurveyScales: React.FC = () => {
	return (
		<div className="container mx-auto p-3">
			<div className="flex space-x-2 justify-between mb-2 p-3">
				<ScalesList />
				<ScaleSummaryView />
			</div>
		</div>
	);
}
export default SurveyScales;