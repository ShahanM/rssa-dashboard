import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { type DependentResourceClient } from '../../types/resourceClient.types';
import type { BaseResourceType } from '../../types/sharedBase.types';
import type { PaginatedResourceList } from '../../types/studyComponents.types';
import CreateResourceButton from '../buttons/CreateResourceButton';
import EditResourceModal from '../dialogs/EditResourceModal';
import ResourceTable from './ResourceTable';

interface ResourceChildTableProps<TChild extends BaseResourceType> {
    resourceClient: DependentResourceClient<TChild>;
    parentId: string;
    className?: string;
    allowCreate?: boolean;
    onRowClick?: (resource: TChild) => void;
    paginate?: boolean;
    pageSize?: number;
    filterFn?: (item: TChild) => boolean;
    filterState?: unknown;
}
const ResourceChildTable = <TChild extends BaseResourceType>({
    resourceClient,
    parentId,
    className = '',
    allowCreate = true,
    onRowClick,
    paginate = false,
    pageSize = 10,
    filterFn,
    filterState,
}: ResourceChildTableProps<TChild>) => {
    const { hasPermission } = usePermissions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<TChild | null>(null);
    const queryClient = useQueryClient();

    const updateMutation = useMutation<TChild | null, Error, Partial<TChild>, { previousData: TChild[] | undefined }>({
        mutationFn: (formData: Partial<TChild>) => {
            if (!selectedResource) throw new Error('No resource selected');
            return resourceClient.update(selectedResource.id, formData);
        },
        onMutate: async (formData) => {
            if (!selectedResource) return { previousData: undefined };
            await queryClient.cancelQueries({
                queryKey: resourceClient.queryKeys.lists(),
            });
            const previousData = queryClient.getQueryData<TChild[]>(resourceClient.queryKeys.lists());

            queryClient.setQueryData<TChild[]>(resourceClient.queryKeys.lists(), (oldData) => {
                if (!oldData) return [];
                return oldData.map((item) => (item.id === selectedResource.id ? { ...item, ...formData } : item));
            });
            return { previousData };
        },
        onError: (err) => {
            console.error(err.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: resourceClient.queryKeys.lists(),
            });
            setIsModalOpen(false);
            setSelectedResource(null);
        },
    });

    const handleRowClick = (resource: TChild) => {
        if (onRowClick) {
            onRowClick(resource);
            return;
        }

        setSelectedResource(resource);
        setIsModalOpen(true);
    };

    return (
        <div className={clsx(className)}>
            <div className="flex justify-between items-center p-0 min-w-100 my-3">
                <h3 className="text-xl font-bold mb-3">{resourceClient.config.viewTitle}</h3>
                {hasPermission(`create:${resourceClient.config.apiResourceTag}`) && allowCreate && (
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
                queryFn={async (queryParams, parentId) => {
                    if (!parentId) return null;

                    // Local Override Mode (Legacy / Custom JS Filters)
                    if (filterFn) {
                        let list = await resourceClient.getList(parentId);
                        if (!list) return null;

                        list = list.filter(filterFn);

                        if (queryParams.search) {
                            const lowerSearch = queryParams.search.toLowerCase();
                            list = list.filter((item) => JSON.stringify(item).toLowerCase().includes(lowerSearch));
                        }

                        const totalItems = list.length;
                        const pageCount =
                            paginate && queryParams.pageSize ? Math.ceil(totalItems / queryParams.pageSize) : 1;

                        if (paginate && queryParams.pageIndex !== undefined && queryParams.pageSize !== undefined) {
                            const start = queryParams.pageIndex * queryParams.pageSize;
                            list = list.slice(start, start + queryParams.pageSize);
                        }

                        return { data: list, page_count: pageCount, total: totalItems };
                    }

                    // Server-Side Delegation (With Flat-List Fallback)
                    const response = await resourceClient.getPaginated(queryParams, parentId);
                    if (!response) return null;

                    // If the backend returned a flat array instead of a PaginatedResourceList,
                    // wrap it dynamically so the table doesn't crash!
                    if (Array.isArray(response)) {
                        return {
                            data: response,
                            page_count: 1,
                            total: response.length,
                        } as PaginatedResourceList<TChild>;
                    }
                    return response;
                }}
                columns={resourceClient.config.tableColumns!}
                onRowClick={handleRowClick}
                selectedRowId={undefined}
                parentId={parentId}
                paginate={paginate}
                pageSize={pageSize}
                isSearchable={true}
                filterState={filterState}
            />
            {selectedResource && (
                <EditResourceModal<TChild>
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    resource={selectedResource}
                    resourceClient={resourceClient}
                    onSave={(formData) => updateMutation.mutate(formData)}
                    isSaving={updateMutation.isPending}
                />
            )}
        </div>
    );
};

export default ResourceChildTable;
