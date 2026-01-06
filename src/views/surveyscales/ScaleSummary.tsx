import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useApiClients } from '../../api/ApiContext';
import ResourceMetaInfo from '../../components/resources/ResourceMetaInfo';
import ResourceViewer from '../../components/resources/ResourceViewer';
import { useAppSelector } from '../../store/hooks';
import type { Scale } from '../../types/surveyComponents.types';

const ScaleSummaryView: React.FC = () => {
    const selectedObject = useAppSelector((state) => state.scaleSelection['scale']);
    const { scaleClient: apiClient } = useApiClients();
    type T = Scale;

    if (!selectedObject) {
        return <p>{`No selected ${apiClient.config.resourceName}.`}</p>;
    }
    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
            <ResourceViewer<T>
                queryKey={apiClient.queryKeys.summary(selectedObject.id!)}
                queryFn={() => apiClient.getOne(selectedObject.id!)}
                resourceName={apiClient.config.resourceName}
            >
                {(resourceInstance: T) => (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold mb-4">{resourceInstance.display_name}</h3>
                            <Link to={`/${apiClient.config.apiResourceTag}/${resourceInstance.id}`}>
                                <button
                                    className={clsx(
                                        'btn btn-primary rounded bg-yellow-500',
                                        'hover:bg-yellow-600 text-purple px-4 py-2',
                                        'cursor-pointer'
                                    )}
                                >
                                    <span>Show details &gt;</span>
                                </button>
                            </Link>
                        </div>
                        <ResourceMetaInfo<T>
                            resourceInstance={resourceInstance}
                            metaInfo={apiClient.config.editableFields}
                        />
                    </>
                )}
            </ResourceViewer>
        </div>
    );
};

export default ScaleSummaryView;
