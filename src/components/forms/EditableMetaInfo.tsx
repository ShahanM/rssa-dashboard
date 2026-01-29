import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { useDynamicForm } from '../../hooks/useDynamicForm';
import type { BaseResourceType } from '../../types/sharedBase.types';
import ResourceMetaInfo, { RenderStaticInfo } from '../resources/ResourceMetaInfo';
import type { EditableField, FieldValidator } from './forms.typs';
import { DynamicSelect } from './DynamicSelect';

interface EditableResourceMetaInfoProps<T> {
    resourceInstance: T;
    hasEditPermission: boolean;
    onSave: (formData: Partial<T>) => void;
    isSaving: boolean;
    editableFields: EditableField<T>[];
    validators?: Record<string, FieldValidator> | undefined;
}

export const EditableResourceMetaInfo = <T extends BaseResourceType>({
    resourceInstance,
    hasEditPermission = false,
    onSave,
    isSaving,
    editableFields,
    validators,
}: EditableResourceMetaInfoProps<T>) => {
    const [isEditing, setIsEditing] = useState(false);
    type FormDataType = Partial<T>;
    const initialFormValues = useMemo(() => {
        return Object.fromEntries(
            editableFields
                .filter((field) => field.type === 'text' || field.type === 'textarea')
                .map((field) => [field.key, resourceInstance[field.key] ?? ''])
        ) as FormDataType;
    }, [editableFields, resourceInstance]);

    const { formData, handleChange, validationStates, validationErrors, resetForm, isFormInvalid, setFieldValue } =
        useDynamicForm({
            initialValues: isEditing ? initialFormValues : ({} as FormDataType),
            validators: validators,
        });

    const switchToEditingMode = useCallback(() => {
        resetForm(initialFormValues);
        setIsEditing(true);
    }, [resetForm, initialFormValues]);

    const handleSave = useCallback(async () => {
        if (!formData) {
            return;
        }
        onSave(formData as Partial<T>);
        setIsEditing(false);
    }, [formData, onSave]);

    const handleCancel = () => {
        setIsEditing(false);
    };

    const renderField = (field: EditableField<T>) => {
        const commonProps = {
            id: field.key as string,
            name: field.key as string,
            value: String((formData as FormDataType)[field.key] || ''),
            onChange: handleChange,
            className: clsx(
                'p-3 mt-1',
                'block w-full rounded-md border-yellow-400',
                'shadow-sm focus:border-yellow-500 focus:ring-yellow-500',
                'sm:text-sm font-mono'
            ),
        };
        switch (field.type) {
            case 'textarea':
                return (
                    <>
                        <label htmlFor={field.key as string} className="block text-sm font-medium text-gray-700">
                            {field.label}
                        </label>
                        <textarea {...commonProps} />
                    </>
                );
            case 'text':
                return (
                    <>
                        <label htmlFor={field.key as string} className="block text-sm font-medium text-gray-700">
                            {field.label}
                        </label>
                        <input {...commonProps} type="text" />
                    </>
                );
            case 'select':
                if ((!field.options || field.options.length === 0) && !field.optionsEndpoint) {
                    return <RenderStaticInfo resourceInstance={resourceInstance} field={field} />;
                }
                return (
                    <DynamicSelect
                        {...commonProps}
                        staticOptions={field.options}
                        optionsEndpoint={field.optionsEndpoint}
                        optionsValueKey={field.optionsValueKey}
                        optionsLabelKey={field.optionsLabelKey}
                    />
                );
            case 'number':
                return (
                    <>
                        <label htmlFor={field.key as string} className="block text-sm font-medium text-gray-700">
                            {field.label}
                        </label>
                        <input
                            {...commonProps}
                            type="number"
                            onChange={(e) => {
                                const val = e.target.value === '' ? '' : Number(e.target.value);
                                setFieldValue(field.key as string, val);
                            }}
                        />
                    </>
                );
            case 'static':
            default:
                return <RenderStaticInfo resourceInstance={resourceInstance} field={field} />;
        }
    };

    if (isEditing) {
        console.log(resourceInstance);
        // --- EDIT MODE ---
        return (
            <div className="bg-white p-6 rounded-lg shadow mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {editableFields.map((field) => (
                        <div
                            key={`edit-${String(field.key)}`}
                            className={clsx(field.wide ? 'sm:col-span-2' : 'sm:col-span-1')}
                        >
                            {renderField(field)}
                            <div className="mt-1 text-xs h-4">
                                {' '}
                                {validationStates[field.key as string] === 'validating' && (
                                    <p className="text-gray-500">Checking...</p>
                                )}
                                {validationStates[field.key as string] === 'invalid' && (
                                    <p className="text-red-600">{validationErrors[field.key as string]}</p>
                                )}
                                {validationStates[field.key as string] === 'valid' && (
                                    <p className="text-green-600">✓ Available</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className={clsx(
                            'rounded-md bg-white px-3 py-2 text-sm',
                            'font-semibold text-gray-900 shadow-sm',
                            'ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                        )}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || isFormInvalid}
                        className={clsx(
                            'flex flex-wrap items-center px-3 py-3 m-0 rounded-md space-x-2',
                            'bg-yellow-500 hover:bg-yellow-600',
                            'text-gray-700 text-sm font-medium cursor-pointer',
                            'hover:bg-gray-700 hover:text-white',
                            (isSaving || isFormInvalid) && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        );
    }

    // --- VIEW MODE ---
    return (
        <div className="relative">
            <div className="absolute top-4 right-4">
                {hasEditPermission && (
                    <button
                        onClick={switchToEditingMode}
                        className={clsx(
                            'flex flex-wrap items-center px-3 py-3 m-0 rounded-md space-x-2',
                            'bg-yellow-500 hover:bg-yellow-600',
                            'text-gray-700 text-sm font-medium cursor-pointer',
                            'hover:bg-gray-700 hover:text-white'
                        )}
                    >
                        Edit
                    </button>
                )}
            </div>
            <ResourceMetaInfo<T> resourceInstance={resourceInstance} metaInfo={editableFields} />
        </div>
    );
};

export default EditableResourceMetaInfo;
