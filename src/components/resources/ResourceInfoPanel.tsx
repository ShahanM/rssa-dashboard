import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../toast/ToastProvider';
import { usePermissions } from '../../hooks/usePermissions';
import {
    createValidators,
    isDependentClient,
    type DependentResourceClient,
    type ResourceClient,
} from '../../types/resourceClient.types';
import type { BaseResourceType } from '../../types/sharedBase.types';
import DeleteResourceButton from '../buttons/DeleteResourceButton';
import EditableResourceMetaInfo from '../forms/EditableMetaInfo';

type StatelessOnloadFn = () => void;
type StatefulOnloadFn<T> = (resourceInstance: T) => void;

const ResourceInfoPanel = <T extends BaseResourceType>({
    resourceClient,
    resourceId,
    parentId,
    onLoad,
    onDelete,
}: {
    resourceClient: ResourceClient<T> | DependentResourceClient<T>;
    resourceId: string;
    parentId?: string;
    onDelete?: () => void;
    onLoad?: StatelessOnloadFn | StatefulOnloadFn<T>;
}) => {
    const { hasPermission } = usePermissions();
    const navigate = useNavigate();
    const location = useLocation();

    const navigateUp = useCallback(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const parentSegments = pathSegments.length > 2 ? pathSegments.slice(0, -2) : pathSegments.slice(0, -1);
        navigate('/' + parentSegments.join('/'));
    }, [location.pathname, navigate]);

    const handleDelete = useCallback(() => {
        if (onDelete) onDelete();
        navigateUp();
    }, [onDelete, navigateUp]);

    const validators = useMemo(() => {
        if (isDependentClient(resourceClient)) {
            if (parentId) createValidators(resourceClient, parentId);
        }
        return undefined;
    }, [resourceClient, parentId]);

    const {
        data: resource,
        isSuccess,
        isLoading,
        error,
    } = useQuery({
        queryKey: resourceClient.queryKeys.detail(resourceId),
        queryFn: () => resourceClient.getOne(resourceId),
        retry: 0,
        retryDelay: (failureCount) => {
            if (failureCount === 0) return 5000;
            return Math.min(1000 * 2 ** failureCount, 30000);
        },

        enabled: !!resourceClient,
    });

    const queryClient = useQueryClient();

    const { showToast } = useToast();

    const updateMutation = useMutation<T | null, Error, Partial<T>, { previousData: T | undefined }>({
        mutationFn: (formData: Partial<T>) => resourceClient.update(resourceId, formData),
        onMutate: async (formData: Partial<T>): Promise<{ previousData: T | undefined }> => {
            await queryClient.cancelQueries({
                queryKey: resourceClient.queryKeys.detail(resourceId),
            });
            const previousData = queryClient.getQueryData<T>(resourceClient.queryKeys.detail(resourceId));

            queryClient.setQueryData<T>(resourceClient.queryKeys.detail(resourceId), (oldData: T | undefined) => {
                if (!oldData) return undefined;
                return {
                    ...oldData,
                    ...formData,
                };
            });
            showToast('Saving changes...', 'info');
            return { previousData };
        },
        onError: (err, _FormData, context) => {
            if (context?.previousData) {
                queryClient.setQueryData<T>(resourceClient.queryKeys.detail(resourceId), context.previousData);
            }
            showToast(`Error saving: ${err.message}`, 'error');
            console.error(err.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: resourceClient.queryKeys.detail(resourceId),
            });
        },
    });

    useEffect(() => {
        if (isSuccess && resource) {
            if (onLoad) {
                if (onLoad.length === 1) {
                    const statefulOnload = onLoad as StatefulOnloadFn<T>;
                    statefulOnload(resource);
                } else {
                    const statelessOnload = onLoad as StatelessOnloadFn;
                    statelessOnload();
                }
            }
        }
    }, [isSuccess, resource, onLoad]);

    if (isLoading) return <p>Loading {resourceClient.config.resourceName} details...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!resource) return <p>No data found.</p>;

    return (
        <>
            <div className="flex justify-between mb-3 items-center">
                <h2 className="text-xl font-bold mb-3">{resource.display_name}</h2>
                {hasPermission(`delete:${resourceClient.config.apiResourceTag}`) && (
                    <DeleteResourceButton<T>
                        resourceClient={resourceClient}
                        resourceId={resourceId}
                        onDelete={handleDelete}
                    />
                )}
            </div>
            <EditableResourceMetaInfo<T>
                hasEditPermission={hasPermission(`update:${resourceClient.config.apiResourceTag}`)}
                resourceInstance={resource}
                onSave={(formData: Partial<T>) => updateMutation.mutate(formData)}
                isSaving={updateMutation.isPending}
                editableFields={resourceClient.config.editableFields}
                validators={validators}
            />
        </>
    );
};

export default ResourceInfoPanel;
