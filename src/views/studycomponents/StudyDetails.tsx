import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useApiClients } from '../../api/ApiContext';
import ResourceChildList from '../../components/resources/ResourceChildList';
import ResourceChildTable from '../../components/resources/ResourceChildTable';
import ResourceInfoPanel from '../../components/resources/ResourceInfoPanel';
import { useAppDispatch } from '../../store/hooks';
import { usePermissions } from '../../hooks/usePermissions';
import { clearSelectedStudy, setStudy } from '../../store/studycomponents/selectionSlice';
import type { ApiKey, Study, StudyAuthorization, StudyCondition, StudyStep } from '../../types/studyComponents.types';

const StudyDetails: React.FC = () => {
    const { studyId } = useParams<{ studyId: string }>();
    const dispatch = useAppDispatch();
    const { studyClient, stepClient, conditionClient, keyClient, authorizationClient } = useApiClients();
    const { hasPermission } = usePermissions();

    const handleLoad = useCallback((studyData: Study) => dispatch(setStudy(studyData)), [dispatch]);
    const handleDelete = useCallback(() => dispatch(clearSelectedStudy()), [dispatch]);

    if (!studyId) {
        console.warn('Study ID is missing from URL. Redirecting to studies listings.');
        return <>Invalid url</>;
    }

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
            <ResourceInfoPanel<Study>
                resourceClient={studyClient}
                resourceId={studyId}
                onDelete={handleDelete}
                onLoad={handleLoad}
            />
            <div className="flex space-x-2 justify-between gap-4">
                <ResourceChildList<StudyStep> resourceClient={stepClient} parentId={studyId} />
                <div>
                    <ResourceChildTable<ApiKey> resourceClient={keyClient} parentId={studyId} className="mb-5" />
                    <ResourceChildTable<StudyCondition> resourceClient={conditionClient} parentId={studyId} />
                    {hasPermission('admin:all') && (
                        <ResourceChildTable<StudyAuthorization>
                            resourceClient={authorizationClient}
                            parentId={studyId}
                            className="mt-5"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

StudyDetails.whyDidYouRender = true;
export default StudyDetails;
