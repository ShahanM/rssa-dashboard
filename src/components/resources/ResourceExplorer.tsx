import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import type { ResourceClient } from '../../types/resourceClient.types';
import type { BaseResourceType } from '../../types/sharedBase.types';
import CreateResourceButton from '../buttons/CreateResourceButton';
import ResourceTable from './ResourceTable';

interface ResourceExplorerProps<T extends BaseResourceType> {
    resourceClient: ResourceClient<T>;
    selectedId: string | null;
    onSelect: (item: T) => void;
    SummaryComponent: React.ComponentType;
    requireCreatePermission?: boolean;
}

const ResourceExplorer = <T extends BaseResourceType>({
    resourceClient,
    selectedId,
    onSelect,
    SummaryComponent,
    requireCreatePermission = true,
}: ResourceExplorerProps<T>) => {
    const { hasPermission } = usePermissions();
    const canCreate = !requireCreatePermission || hasPermission(`create:${resourceClient.config.apiResourceTag}`);

    return (
        <div className="container mx-auto p-3">
            <div className="flex space-x-2 justify-between mb-2 p-3">
                {/* LIST PANE */}
                <div className="container mx-auto p-3 bg-gray-50 rounded-lg me-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold mb-4">{resourceClient.config.viewTitle}</h2>
                        {canCreate && (
                            <CreateResourceButton<T>
                                createFn={resourceClient.create}
                                resourceName={resourceClient.config.resourceName}
                                formFields={resourceClient.config.formFields}
                                invalidateQueryKeys={[resourceClient.queryKeys.all()]}
                            />
                        )}
                    </div>
                    <ResourceTable<T>
                        resourceTag={resourceClient.config.apiResourceTag}
                        queryFn={resourceClient.getPaginated}
                        columns={resourceClient.config.tableColumns!}
                        onRowClick={onSelect}
                        selectedRowId={selectedId || undefined}
                        isSearchable={true}
                    />
                </div>

                {/* SUMMARY PANE */}
                <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
                    <SummaryComponent />
                </div>
            </div>
        </div>
    );
};

export default ResourceExplorer;
