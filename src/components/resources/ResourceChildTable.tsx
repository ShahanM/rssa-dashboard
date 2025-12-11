import clsx from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { type DependentResourceClient } from '../../types/resourceClient.types';
import type { BaseResourceType } from '../../types/sharedBase.types';
import CreateResourceButton from '../buttons/CreateResourceButton';
import EditResourceModal from '../dialogs/EditResourceModal';
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<TChild | null>(null);
    const queryClient = useQueryClient();

    const updateMutation = useMutation<TChild | null, Error, Partial<TChild>, { previousData: TChild[] | undefined }>({
        mutationFn: (formData: Partial<TChild>) => {
            if (!selectedResource) throw new Error("No resource selected");
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
                return oldData.map((item) =>
                    item.id === selectedResource.id ? { ...item, ...formData } : item
                );
            });
            return { previousData };
        },
        onError: (err) => {
            // Rollback logic could go here
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
        if (resourceClient.config.apiResourceTag === 'items' || resourceClient.config.apiResourceTag === 'levels') {
            setSelectedResource(resource);
            setIsModalOpen(true);
        }
    };

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
                        invalidateQueryKeys={[resourceClient.queryKeys.lists()]}
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
                onRowClick={handleRowClick}
                selectedRowId={undefined}
                parentId={parentId}
                paginate={false}
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
