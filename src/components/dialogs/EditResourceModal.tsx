import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import type { DependentResourceClient, ResourceClient } from '../../types/resourceClient.types';
import type { BaseResourceType } from '../../types/sharedBase.types';
import EditableResourceMetaInfo from '../forms/EditableMetaInfo';

interface EditResourceModalProps<T extends BaseResourceType> {
    isOpen: boolean;
    onClose: () => void;
    resource: T;
    resourceClient: ResourceClient<T> | DependentResourceClient<T>;
    onSave: (formData: Partial<T>) => void;
    isSaving: boolean;
}

const EditResourceModal = <T extends BaseResourceType>({
    isOpen,
    onClose,
    resource,
    resourceClient,
    onSave,
    isSaving,
}: EditResourceModalProps<T>) => {
    const { hasPermission } = usePermissions();
    const canEdit = hasPermission(`update:${resourceClient.config.apiResourceTag}`);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                                    Edit {resourceClient.config.resourceName}
                                </DialogTitle>
                                <div className="mt-2">
                                    <EditableResourceMetaInfo<T>
                                        hasEditPermission={canEdit}
                                        resourceInstance={resource}
                                        onSave={onSave}
                                        isSaving={isSaving}
                                        editableFields={resourceClient.config.editableFields}
                                    />
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default EditResourceModal;
