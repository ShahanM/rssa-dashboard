import ConstructList from './ConstructList';
import ConstructSummaryView from './ConstructSummary';

const ConstructLibrary = () => {
    return (
        <div className="container mx-auto p-3">
            <div className="flex space-x-2 justify-between mb-2 p-3">
                <div className="container mx-auto p-3 bg-gray-50 rounded-lg me-2">
                    <ConstructList />
                </div>
                <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
                    <ConstructSummaryView />
                </div>
            </div>
        </div>
    );
};

export default ConstructLibrary;
