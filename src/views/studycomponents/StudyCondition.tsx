import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useApiClients } from '../../api/ApiContext';
import ResourceInfoPanel from '../../components/resources/ResourceInfoPanel';
import { useAppDispatch } from '../../store/hooks';
import { clearSelectedCondition, setCondition } from '../../store/studycomponents/selectionSlice';
import type { StudyCondition as StudyConditionType } from '../../types/studyComponents.types';

const StudyCondition: React.FC = () => {
    const { studyId, conditionId } = useParams<{ studyId: string; conditionId: string }>();
    const dispatch = useAppDispatch();
    const { conditionClient } = useApiClients();

    const handleLoad = useCallback((conditionData: StudyConditionType) => {
        dispatch(setCondition(conditionData));
    }, [dispatch]);

    if (!studyId || !conditionId) {
        console.warn('Study ID or Condition ID is missing from URL.');
        return <>Invalid url</>;
    }

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
            <ResourceInfoPanel<StudyConditionType>
                resourceClient={conditionClient}
                resourceId={conditionId}
                parentId={studyId}
                onDelete={() => dispatch(clearSelectedCondition())}
                onLoad={handleLoad}
            />
        </div>
    );
};

export default StudyCondition;
