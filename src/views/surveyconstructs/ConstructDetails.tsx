import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApiClients } from '../../api/ApiContext';
import ResourceChildList from '../../components/views/ResourceChildList';
import ResourceInfoPanel from '../../components/views/ResourceInfoPanel';
import { clearSelectedConstruct } from '../../store/constructlibrary/selectionSlice';
import { useAppDispatch } from '../../store/hooks';
import type { ConstructItem, SurveyConstruct } from '../../types/surveyconstructs.types';

const ConstructDetails: React.FC = () => {
    const { constructId } = useParams<{ constructId: string }>();
    const dispatch = useAppDispatch();

    const { constructClient, itemClient } = useApiClients();

    if (!constructId) {
        console.warn('Construct ID is missing from URL. Redirecting to constructs listings.');
        return null;
    }

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
            <ResourceInfoPanel<SurveyConstruct>
                resourceClient={constructClient}
                resourceId={constructId}
                onDelete={() => dispatch(clearSelectedConstruct())}
            />
            <div className="flex space-x-2 justify-between gap-4">
                <ResourceChildList<ConstructItem> resourceClient={itemClient} parentId={constructId} />
            </div>
        </div>
    );
};

export default ConstructDetails;
