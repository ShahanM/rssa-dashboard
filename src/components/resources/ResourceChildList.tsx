import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { createValidators, type DependentResourceClient } from '../../types/resourceClient.types';
import type { OrderedComponent } from '../../types/sharedBase.types';
import CreateResourceButton from '../buttons/CreateResourceButton';
import SortableResourceList from '../SortableResourceList';
import { useLocation } from 'react-router-dom';
import EditResourceModal from '../dialogs/EditResourceModal';

const ResourceChildList = <TChild extends OrderedComponent>({
    resourceClient,
    parentId,
    dataCallback,
}: {
    resourceClient: DependentResourceClient<TChild>;
    parentId: string;
    dataCallback?: (resourceList: TChild[]) => void;
}) => {
    const { hasPermission } = usePermissions();
    const validators = useMemo(() => createValidators(resourceClient, parentId), [resourceClient, parentId]);
    const location = useLocation();
    const childNavPath = useMemo(
        () => location.pathname + '/' + resourceClient.config.apiResourceTag,
        [resourceClient, location]
    );

    const {
        data: resourceList,
        isLoading,
        error,
    } = useQuery({
        queryKey: resourceClient.queryKeys.lists(),
        queryFn: () => resourceClient.getList(parentId),
        retry: 0,
        retryDelay: (failureCount) => {
            if (failureCount === 0) return 5000;
            return Math.min(1000 * 2 ** failureCount, 30000);
        },
        enabled: !!resourceClient,
    });

    useEffect(() => {
        if (!isLoading && resourceList) {
            if (dataCallback) dataCallback(resourceList);
        }
    }, [resourceList, isLoading, dataCallback]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<TChild | null>(null);
    const queryClient = useQueryClient();

    const updateMutation = useMutation<TChild | null, Error, Partial<TChild>, { previousData: TChild[] | undefined }>({
        mutationFn: (formData: Partial<TChild>) => {
            if (!selectedResource) throw new Error("No resource selected");
            return resourceClient.update(selectedResource.id, formData);
        },
        onMutate: async (formData: Partial<TChild>) => {
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

    const isModalResource = resourceClient.config.apiResourceTag === 'items' || resourceClient.config.apiResourceTag === 'levels' || resourceClient.config.apiResourceTag === 'contents';

    const handleItemClick = (resource: TChild) => {
        if (isModalResource) {
            setSelectedResource(resource);
            setIsModalOpen(true);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center p-0 min-w-100 my-3">
                <h3 className="text-xl font-bold mb-3">{resourceClient.config.viewTitle}</h3>
                {hasPermission(`create:${resourceClient.config.apiResourceTag}`) && (
                    <CreateResourceButton<TChild>
                        createFn={resourceClient.create}
                        parentId={parentId}
                        resourceName={resourceClient.config.resourceName}
                        formFields={resourceClient.config.formFields}
                        invalidateQueryKeys={[resourceClient.queryKeys.lists()]}
                        validators={validators}
                    />
                )}
            </div>
            {isLoading && <p>Loading...</p>}
            {error && <p>There was an error!</p>}
            <SortableResourceList<TChild>
                resourceClient={resourceClient}
                parentId={parentId}
                studyComponents={resourceList ? resourceList : []}
                urlPathPrefix={isModalResource ? undefined : childNavPath}
                onItemClick={isModalResource ? handleItemClick : undefined}
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

export default ResourceChildList;
