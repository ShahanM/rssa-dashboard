import { useApiClients } from '../../api/ApiContext';
import CreateResourceButton from '../../components/buttons/CreateResourceButton';
import ResourceTable from '../../components/resources/ResourceTable';
import { usePermissions } from '../../hooks/usePermissions';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setScale } from '../../store/surveyscales/selectionSlice';
import type { Scale } from '../../types/surveyComponents.types';

const ScalesList: React.FC = () => {
    const selectedObject = useAppSelector((state) => state.scaleSelection.scale);
    const { scaleClient: apiClient } = useApiClients();
    const dispatch = useAppDispatch();
    const { hasPermission } = usePermissions();

    type T = Scale;

    const handleRowClick = (resourceInstance: T) => dispatch(setScale(resourceInstance));

    return (
        <>
            <div className="flex justify-between items-center p-0 min-w-100 my-3">
                <h2 className="text-2xl font-bold mb-4">{apiClient.config.viewTitle}</h2>
                {hasPermission(`create:${apiClient.config.apiResourceTag}`) && (
                    <CreateResourceButton<T>
                        createFn={apiClient.create}
                        resourceName={apiClient.config.resourceName}
                        formFields={apiClient.config.formFields}
                        invalidateQueryKeys={[apiClient.queryKeys.all()]}
                    />
                )}
            </div>
            <ResourceTable<T>
                resourceTag={apiClient.config.apiResourceTag}
                queryFn={apiClient.getPaginated}
                columns={apiClient.config.tableColumns!}
                onRowClick={handleRowClick}
                selectedRowId={selectedObject?.id}
            />
        </>
    );
};

export default ScalesList;
