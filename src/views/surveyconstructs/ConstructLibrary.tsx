import ConstructList from "./ConstructList";
import ConstructSummaryView from "./ConstructSummary";

const ConstructLibrary = () => {
	return (
		<div className="container mx-auto p-3">
			<div className="flex space-x-2 justify-between mb-2 p-3">
				<ConstructList />
				<ConstructSummaryView />
			</div>
		</div>
	);
}


export default ConstructLibrary;
