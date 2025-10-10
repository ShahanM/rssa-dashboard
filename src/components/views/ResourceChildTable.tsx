import clsx from 'clsx';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { type DependentResourceClient } from '../../types/resourceClient.types';
import type { BaseResourceType } from '../../types/sharedBase.types';
import CreateResourceButton from '../buttons/CreateResourceButton';
import ResourceTable from './ResourceTable';

const ResourceChildTable = <TChild extends BaseResourceType>({
    resourceClient,
    parentId,
    className = '',
}: {
    resourceClient: DependentResourceClient<TChild>;
    parentId: string;
    className?: string;
}) => {
    const { hasPermission } = usePermissions();
    const location = useLocation();
    const childNavPath = useMemo(
        () => location.pathname + '/' + resourceClient.config.apiResourceTag,
        [resourceClient, location]
    );
    return (
        <div className={clsx(className)}>
            <div className="flex justify-between items-center p-0 min-w-100 my-3">
                <h3 className="text-xl font-bold mb-3">{resourceClient.config.viewTitle}</h3>
                {hasPermission(`create:${resourceClient.config.apiResourceTag}`) && (
                    <CreateResourceButton<TChild>
                        createFn={resourceClient.create}
                        parentId={parentId}
                        resourceName={resourceClient.config.resourceName}
                        formFields={resourceClient.config.formFields}
                        invalidateQueryKeys={[resourceClient.queryKeys.all()]}
                    />
                )}
            </div>
            <ResourceTable<TChild>
                resourceTag={resourceClient.config.apiResourceTag}
                queryFn={async (_queryParams, parentId) => {
                    if (!parentId) {
                        return null;
                    }
                    const list = await resourceClient.getList(parentId);
                    if (!list) {
                        return null;
                    }
                    return {
                        rows: list,
                        page_count: 1,
                    };
                }}
                columns={resourceClient.config.tableColumns!}
                onRowClick={() => {}}
                selectedRowId={undefined}
                parentId={parentId}
                paginate={false}
            />
        </div>
    );
};

export default ResourceChildTable;
