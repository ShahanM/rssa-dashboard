import { PlusIcon } from '@heroicons/react/16/solid';
import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import DynamicFormModal from '../forms/DynamicFormModal';
import type { FieldValidator, FormField } from '../forms/forms.typs';
import type { ServerGeneratedKeys } from '../../types/resourceClient.types';
import type { BaseResourceType } from '../../types/sharedBase.types';

type BaseCreateFn<T> = (formData: Omit<T, ServerGeneratedKeys>) => Promise<T | null>;
type DependentCreateFn<T> = (parentId: string, formData: Omit<T, ServerGeneratedKeys>) => Promise<T | null>;

interface CreateResourceButtonProps<T> {
    createFn: BaseCreateFn<T> | DependentCreateFn<T>;
    formFields: FormField[];
    resourceName: string;
    invalidateQueryKeys?: QueryKey[];
    buttonLabel?: string;
    className?: string;
    validators?: Record<string, FieldValidator>;
    parentId?: string;
}

export const CreateResourceButton = <T extends BaseResourceType>({
    formFields,
    resourceName,
    invalidateQueryKeys,
    buttonLabel = `Create new ${resourceName}`,
    className = '',
    createFn,
    validators,
    parentId,
}: CreateResourceButtonProps<T>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (createAction: () => Promise<T | null>) => createAction(),
        onSuccess: () => {
            if (invalidateQueryKeys) {
                invalidateQueryKeys.forEach((key) => {
                    queryClient.invalidateQueries({
                        queryKey: key,
                    });
                });
            }
        },
    });

    const handleCreate = useCallback(
        async (formData: Omit<T, ServerGeneratedKeys>) => {
            if (createFn.length === 2) {
                if (!parentId) {
                    console.error('Parent ID is required for this creation function but was not provided.');
                    return;
                }
                const dependentCreate = createFn as DependentCreateFn<T>;
                await mutation.mutateAsync(() => dependentCreate(parentId, formData));
            } else {
                const baseCreate = createFn as BaseCreateFn<T>;
                await mutation.mutateAsync(() => baseCreate(formData));
            }
        },
        [parentId, mutation, createFn]
    );

    return (
        <>
            <DynamicFormModal<T>
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Create New ${resourceName}`}
                fields={formFields}
                onSubmit={handleCreate}
                isSubmitting={mutation.isPending}
                submitButtonText="Create"
                validators={validators}
            />
            <button
                className={clsx(
                    'flex flex-wrap items-center px-3 py-3 m-0 rounded-md space-x-2',
                    'bg-yellow-500 hover:bg-yellow-600',
                    'text-gray-700 text-sm font-medium cursor-pointer',
                    'hover:bg-gray-700 hover:text-white',
                    className
                )}
                onClick={() => setIsModalOpen(true)}
            >
                <PlusIcon className="h-5 w-5" />
                <span>{buttonLabel}</span>
            </button>
        </>
    );
};

export default CreateResourceButton;
