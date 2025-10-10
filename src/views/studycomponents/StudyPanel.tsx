import { useApiClients } from '../../api/ApiContext';
import CreateResourceButton from '../../components/buttons/CreateResourceButton';
import ResourceTable from '../../components/views/ResourceTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setStudy } from '../../store/studycomponents/selectionSlice';
import type { Study } from '../../types/studyComponents.types';

const StudyPanel: React.FC = () => {
    const selectedObject = useAppSelector((state) => state.studyComponentSelection.study);
    const { studyClient: apiClient } = useApiClients();
    const dispatch = useAppDispatch();

    const handleRowClick = (study: Study) => dispatch(setStudy(study));

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mb-4">{apiClient.config.viewTitle}</h2>
                <CreateResourceButton<Study>
                    createFn={apiClient.create}
                    resourceName={apiClient.config.resourceName}
                    formFields={apiClient.config.formFields}
                    invalidateQueryKeys={[apiClient.queryKeys.all()]}
                />
            </div>
            <ResourceTable<Study>
                resourceTag={apiClient.config.apiResourceTag}
                queryFn={apiClient.getPaginated}
                columns={apiClient.config.tableColumns!}
                onRowClick={handleRowClick}
                selectedRowId={selectedObject?.id}
                isSearchable={true}
            />
        </>
    );
};

export default StudyPanel;
