import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiClients } from '../../api/ApiContext';
import ResourceChildList from '../../components/resources/ResourceChildList';
import ResourceInfoPanel from '../../components/resources/ResourceInfoPanel';
import { useAppDispatch } from '../../store/hooks';
import { clearSelectedScale, setScale } from '../../store/surveyscales/selectionSlice';
import type { Scale, ScaleLevel } from '../../types/surveyComponents.types';

const ScaleDetails: React.FC = () => {
    const { scaleId } = useParams<{ scaleId: string }>();
    const dispatch = useAppDispatch();
    const { scaleClient, levelClient } = useApiClients();

    const [levels, setLevels] = useState<ScaleLevel[]>();

    const handleLoad = useCallback((scaleData: Scale) => dispatch(setScale(scaleData)), [dispatch]);
    const handleDelete = useCallback(() => dispatch(clearSelectedScale()), [dispatch]);

    if (!scaleId) {
        console.warn('Construct ID is missing from URL. Redirecting to constructs listings.');
        return null;
    }

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
            <ResourceInfoPanel<Scale>
                resourceClient={scaleClient}
                resourceId={scaleId}
                onDelete={handleDelete}
                onLoad={handleLoad}
            />
            <div className="flex space-x-2 justify-between gap-4">
                <ResourceChildList<ScaleLevel>
                    resourceClient={levelClient}
                    parentId={scaleId}
                    dataCallback={setLevels}
                />
                {levels && levels.length > 0 && <ScalePreview scaleLevels={levels} />}
            </div>
        </div>
    );
};

const ScalePreview: React.FC<{ scaleLevels: ScaleLevel[] }> = ({ scaleLevels = [] }) => {
    const [selectedOption, setSelectedOption] = useState<string>();

    if (scaleLevels.length === 0) {
        return <p>You have to add scale options.</p>;
    }

    return (
        <div className={clsx('border p-3 rounded-lg border-yellow-300 bg-yellow-50')}>
            <p>This construct scale item helps me understand how the scale buttons will appear in the study.</p>
            <div className={clsx('flex justify-between mt-3')}>
                {scaleLevels.map((level) => (
                    <button
                        key={`scale-level-${level.id}`}
                        className={clsx(
                            'p-2 border rounded min-w-27 border-yellow-300',
                            'hover:bg-yellow-400',
                            'cursor-pointer',
                            selectedOption === level.id ? 'bg-yellow-400' : 'bg-gray-100'
                        )}
                        onClick={() => setSelectedOption(level.id)}
                    >
                        <p>{level.label}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ScaleDetails;
