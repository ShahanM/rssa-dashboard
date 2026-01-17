import { useApiClients } from '../../api/ApiContext';
import ResourceExplorer from '../../components/resources/ResourceExplorer';
import { selectConstruct, setConstruct } from '../../store/constructlibrary/selectionSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { SurveyConstruct } from '../../types/surveyComponents.types';
import ConstructSummaryView from './ConstructSummary';

const ConstructLibrary = () => {
    const selectedObject = useAppSelector(selectConstruct);
    const dispatch = useAppDispatch();
    const { constructClient } = useApiClients();

    const handleSelect = (construct: SurveyConstruct) => {
        dispatch(setConstruct(construct));
    };

    return (
        <ResourceExplorer<SurveyConstruct>
            resourceClient={constructClient}
            selectedId={selectedObject?.id ?? null}
            onSelect={handleSelect}
            SummaryComponent={ConstructSummaryView}
        />
    );
};

export default ConstructLibrary;
