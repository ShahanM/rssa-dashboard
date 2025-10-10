import { TrashIcon } from '@heroicons/react/16/solid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import type { DependentResourceClient, ResourceClient } from '../../types/resourceClient.types';
import type { BaseResourceType } from '../../types/sharedBase.types';
import ConfirmationDialog from '../dialogs/ConfirmationDialog';

interface DeleteResourceButtonProps<T extends BaseResourceType> {
    resourceClient: ResourceClient<T> | DependentResourceClient<T>;
    resourceId: string;
    onDelete?: () => void;
}

const DeleteResourceButton = <T extends BaseResourceType>({
    resourceClient,
    resourceId,
    onDelete,
}: DeleteResourceButtonProps<T>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const obsoleteKey = resourceClient.queryKeys.active(resourceId);
    const deleteMutation = useMutation({
        mutationFn: () => resourceClient.del(resourceId),
        onSuccess: () => {
            queryClient.cancelQueries({ queryKey: obsoleteKey, exact: true });
            queryClient.invalidateQueries({
                queryKey: resourceClient.queryKeys.lists(),
            });
            queryClient.removeQueries({ queryKey: obsoleteKey, exact: true });
            if (onDelete) onDelete();
        },
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <>
            <ConfirmationDialog
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={() => deleteMutation.mutate()}
                title="Delete Item?"
            >
                Are you sure you want to delete {`the "${resourceClient.config.resourceName}"`}? This action cannot be
                undone.
            </ConfirmationDialog>
            <button
                className={clsx(
                    'p-2 border border-red-700 rounded-lg',
                    'bg-red-100 hover:bg-red-600',
                    'text-red-900 hover:text-white',
                    'cursor-pointer'
                )}
                onClick={openModal}
                disabled={deleteMutation.isPending}
            >
                <TrashIcon className={clsx('w-6 stroke-2', deleteMutation.isPending ? 'animate-bounce' : '')} />
                {}
            </button>
        </>
    );
};

export default DeleteResourceButton;
