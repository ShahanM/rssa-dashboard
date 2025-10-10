import { useParams } from 'react-router-dom';
import { useApiClients } from '../../api/ApiContext';
import ResourceChildList from '../../components/views/ResourceChildList';
import ResourceChildTable from '../../components/views/ResourceChildTable';
import ResourceInfoPanel from '../../components/views/ResourceInfoPanel';
import { useAppDispatch } from '../../store/hooks';
import { clearSelectedStudy } from '../../store/studycomponents/selectionSlice';
import type { ApiKey, Study, StudyCondition, StudyStep } from '../../types/studyComponents.types';

const StudyDetails: React.FC = () => {
    const { studyId } = useParams<{ studyId: string }>();
    const dispatch = useAppDispatch();
    const { studyClient, stepClient, conditionClient, keyClient } = useApiClients();

    if (!studyId) {
        console.warn('Study ID is missing from URL. Redirecting to studies listings.');
        return <>Invalid url</>;
    }

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
            <ResourceInfoPanel<Study>
                resourceClient={studyClient}
                resourceId={studyId}
                onDelete={() => dispatch(clearSelectedStudy())}
            />
            {/* <ExportStudyConfigButton studyId={studyId} studyName="does it matter?" /> */}
            <div className="flex space-x-2 justify-between gap-4">
                <ResourceChildList<StudyStep> resourceClient={stepClient} parentId={studyId} />
                <div>
                    <ResourceChildTable<ApiKey> resourceClient={keyClient} parentId={studyId} className="mb-5" />
                    <ResourceChildTable<StudyCondition> resourceClient={conditionClient} parentId={studyId} />
                </div>
            </div>
        </div>
    );
};

StudyDetails.whyDidYouRender = true;
export default StudyDetails;
