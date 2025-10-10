import ScalesList from './ScalesList';
import ScaleSummaryView from './ScaleSummary';

const SurveyScales: React.FC = () => {
    return (
        <div className="container mx-auto p-3">
            <div className="flex space-x-2 justify-between mb-2 p-3">
                <div className="container mx-auto p-3 bg-gray-50 rounded-lg me-2">
                    <ScalesList />
                </div>
                <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
                    <ScaleSummaryView />
                </div>
            </div>
        </div>
    );
};
export default SurveyScales;
