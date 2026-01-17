import { useApiClients } from '../../api/ApiContext';
import ResourceExplorer from '../../components/resources/ResourceExplorer';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectStudy, setStudy } from '../../store/studycomponents/selectionSlice';
import type { Study } from '../../types/studyComponents.types';
import StudySummaryView from './StudySummary';

export const StudyExplorer = () => {
    const selectedObject = useAppSelector(selectStudy);
    const dispatch = useAppDispatch();
    const { studyClient } = useApiClients();

    const handleSelect = (study: Study) => {
        dispatch(setStudy(study));
    };

    return (
        <ResourceExplorer<Study>
            resourceClient={studyClient}
            selectedId={selectedObject?.id ?? null}
            onSelect={handleSelect}
            SummaryComponent={StudySummaryView}
            requireCreatePermission={false} // StudyPanel didn't check permission in original code
        />
    );
};

export default StudyExplorer;
