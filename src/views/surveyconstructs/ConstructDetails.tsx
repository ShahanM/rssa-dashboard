import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useApiClients } from '../../api/ApiContext';
import ResourceChildList from '../../components/resources/ResourceChildList';
import ResourceInfoPanel from '../../components/resources/ResourceInfoPanel';
import { clearSelectedConstruct } from '../../store/constructlibrary/selectionSlice';
import { useAppDispatch } from '../../store/hooks';
import type { ConstructItem, SurveyConstruct } from '../../types/surveyComponents.types';

const ConstructDetails: React.FC = () => {
    const { constructId } = useParams<{ constructId: string }>();
    const dispatch = useAppDispatch();

    const { constructClient, itemClient } = useApiClients();

    const handleDelete = useCallback(() => dispatch(clearSelectedConstruct()), [dispatch]);

    if (!constructId) {
        console.warn('Construct ID is missing from URL. Redirecting to constructs listings.');
        return null;
    }

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
            <ResourceInfoPanel<SurveyConstruct>
                resourceClient={constructClient}
                resourceId={constructId}
                onDelete={handleDelete}
            />
            <div className="flex space-x-2 justify-between gap-4">
                <ResourceChildList<ConstructItem> resourceClient={itemClient} parentId={constructId} />
            </div>
        </div>
    );
};

export default ConstructDetails;
