import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import clsx from 'clsx';
import React, { Fragment } from 'react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onConfirm: () => void;
    onClose: () => void;
    confirmButtonText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    title,
    children,
    onConfirm,
    onClose,
    confirmButtonText = 'Delete',
}) => {
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
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                            <DialogPanel
                                className={clsx(
                                    'w-full max-w-md transform overflow-hidden',
                                    'rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'
                                )}
                            >
                                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    {title}
                                </DialogTitle>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">{children}</p>
                                </div>

                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        className={clsx(
                                            'inline-flex justify-center',
                                            'rounded-md border border-transparent',
                                            'bg-gray-100 hover:bg-gray-200',
                                            'px-4 py-2 text-sm font-medium text-gray-900',
                                            'cursor-pointer',
                                            'focus:outline-none focus-visible:ring-2',
                                            'focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                                        )}
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className={clsx(
                                            'inline-flex justify-center',
                                            'rounded-md border border-transparent',
                                            'bg-red-100 hover:bg-red-200',
                                            'px-4 py-2 text-sm font-medium text-red-900',
                                            'cursor-pointer',
                                            'focus:outline-none focus-visible:ring-2',
                                            'focus-visible:ring-red-500 focus-visible:ring-offset-2'
                                        )}
                                        onClick={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                    >
                                        {confirmButtonText}
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

export default ConfirmationDialog;
