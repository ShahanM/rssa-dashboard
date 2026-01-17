import { useApiClients } from '../../api/ApiContext';
import ResourceExplorer from '../../components/resources/ResourceExplorer';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectScale, setScale } from '../../store/surveyscales/selectionSlice';
import type { Scale } from '../../types/surveyComponents.types';
import ScaleSummaryView from './ScaleSummary';

const SurveyScales: React.FC = () => {
    const selectedObject = useAppSelector(selectScale);
    const dispatch = useAppDispatch();
    const { scaleClient } = useApiClients();

    const handleSelect = (scale: Scale) => {
        dispatch(setScale(scale));
    };

    return (
        <ResourceExplorer<Scale>
            resourceClient={scaleClient}
            selectedId={selectedObject?.id ?? null}
            onSelect={handleSelect}
            SummaryComponent={ScaleSummaryView}
        />
    );
};
export default SurveyScales;
