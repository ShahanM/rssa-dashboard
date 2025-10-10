import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useCallback, useMemo } from 'react';
import { useDynamicForm } from '../../hooks/useDynamicForm';
import { DynamicSelect } from './DynamicSelect';
import type { FieldValidator, FormField } from './forms.typs';
import { ModalSelect } from './ModalSelect';

interface DynamicFormModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    fields: FormField[];
    submitButtonText?: string;
    onSubmit: (formData: T) => Promise<void>;
    isSubmitting?: boolean;
    validators?: Record<string, FieldValidator>;
}

const DynamicFormModal = <T extends Record<string, unknown>>({
    isOpen,
    onClose,
    title,
    fields,
    onSubmit,
    submitButtonText = 'Submit',
    isSubmitting = false,
    validators,
}: DynamicFormModalProps<T>) => {
    const initialFormState = useMemo(
        () =>
            fields.reduce(
                (acc, field) => {
                    acc[field.name] = field.type === 'static' ? field.value || '' : '';
                    return acc;
                },
                {} as Record<string, unknown>
            ),
        [fields]
    );

    const { formData, handleChange, setFieldValue, validationStates, validationErrors, resetForm } = useDynamicForm({
        initialValues: initialFormState,
        validators,
    });

    const handleSubmit = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            try {
                await onSubmit(formData as T);
            } catch (error) {
                console.error('Submission failed:', error);
            } finally {
                onClose();
                resetForm(initialFormState);
            }
        },
        [formData, onSubmit, onClose, resetForm, initialFormState]
    );

    const renderField = (field: FormField) => {
        const commonProps = {
            id: field.name,
            name: field.name,
            value: String((formData as Record<string, unknown>)[field.name] || ''),
            onChange: handleChange,
            required: field.required,
            placeholder: field.placeholder,
            className: clsx(
                'mt-1 p-3 block w-full',
                'rounded-md border-purple-700 dark:border-purple-500 shadow-sm bg-gray-700',
                'focus:border-purple-700 focus:ring-purple-700',
                'sm:text-sm caret-yellow-500 text-white'
            ),
        };

        switch (field.type) {
            case 'textarea':
                return <textarea {...commonProps} rows={field.rows || 4} />;
            case 'select':
                return (
                    <DynamicSelect
                        {...commonProps}
                        placeholderText={field.placeholder}
                        staticOptions={field.options}
                        optionsEndpoint={field.optionsEndpoint}
                        optionsValueKey={field.optionsValueKey}
                        optionsLabelKey={field.optionsLabelKey}
                    />
                );
            case 'modal-select':
                return (
                    <ModalSelect
                        {...commonProps}
                        field={field}
                        value={String(formData[field.name] || '')}
                        onValueChange={setFieldValue}
                    />
                );
            case 'static':
                return (
                    <input
                        type="text"
                        id={field.name}
                        name={field.name}
                        value={field.value}
                        disabled
                        readOnly
                        className={clsx(commonProps.className, 'bg-gray-600 text-gray-400 cursor-not-allowed')}
                    />
                );
            case 'text':
            default:
                return <input type="text" {...commonProps} />;
        }
    };

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
                    <div className="fixed inset-0 bg-black/30" />
                </TransitionChild>
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="min-w-md rounded-xl bg-gray-800 p-6 shadow-xl">
                            <DialogTitle as="h3" className="text-lg font-medium leading-6 text-white">
                                {title}
                            </DialogTitle>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                {fields.map((field) => (
                                    <div key={field.name}>
                                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-300">
                                            {field.label}
                                        </label>
                                        {renderField(field)}
                                        <div className="mt-1 text-xs h-4">
                                            {validationStates[field.name] === 'validating' && (
                                                <p className="text-gray-400">Checking...</p>
                                            )}
                                            {validationStates[field.name] === 'invalid' && (
                                                <p className="text-red-500">{validationErrors[field.name]}</p>
                                            )}
                                            {validationStates[field.name] === 'valid' && (
                                                <p className="text-green-500">✓ Available</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-6 flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className={clsx(
                                            'rounded-md border border-gray-600 bg-gray-600',
                                            'px-4 py-2 text-sm font-medium text-gray-400',
                                            'shadow-sm hover:bg-gray-500'
                                        )}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={clsx(
                                            'inline-flex justify-center',
                                            'rounded-md border border-transparent bg-indigo-600',
                                            'px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700',
                                            'disabled:opacity-50 disabled:cursor-not-allowed'
                                        )}
                                    >
                                        {isSubmitting ? 'Submitting...' : submitButtonText}
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DynamicFormModal;
