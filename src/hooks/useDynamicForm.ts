import { useCallback, useEffect, useRef, useState } from 'react';
import type { FieldValidator, ValidationState } from '../components/forms/forms.typs';
import { useDebounce } from './useDebounce';

interface UseDynamicFormProps<T> {
    initialValues: T;
    validators?: Record<string, FieldValidator>;
}

export const useDynamicForm = <T extends Record<string, unknown>>({
    initialValues,
    validators,
}: UseDynamicFormProps<T>) => {
    const [formData, setFormData] = useState<T>(() => initialValues);

    const [validationStates, setValidationStates] = useState<Record<string, ValidationState>>({});
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const previousFormDataRef = useRef<T>(null);

    const debouncedFormData = useDebounce(formData, 500);

    useEffect(() => {
        if (!validators || !debouncedFormData) return;
        if (previousFormDataRef.current === null) {
            previousFormDataRef.current = debouncedFormData;
            return;
        }
        const previousData = previousFormDataRef.current;

        Object.keys(validators).forEach(async (fieldKey) => {
            const currentValue = debouncedFormData[fieldKey];
            const previousValue = previousData?.[fieldKey];

            if (currentValue !== previousValue) {
                setValidationStates((prev) => ({ ...prev, [fieldKey]: 'validating' }));
                try {
                    await validators[fieldKey](fieldKey, currentValue as string);
                    setValidationStates((prev) => ({ ...prev, [fieldKey]: 'valid' }));
                    setValidationErrors((prev) => ({ ...prev, [fieldKey]: '' }));
                } catch (error: unknown) {
                    setValidationStates((prev) => ({ ...prev, [fieldKey]: 'invalid' }));
                    if (error instanceof Error) {
                        setValidationErrors((prev) => ({ ...prev, [fieldKey]: error.message }));
                    } else {
                        setValidationErrors((prev) => ({ ...prev, [fieldKey]: 'Validation failed.' }));
                    }
                }
            }
        });

        previousFormDataRef.current = debouncedFormData;
    }, [debouncedFormData, validators]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            if (validators && validators[name]) {
                setValidationStates((prev) => ({ ...prev, [name]: 'validating' }));
            }
            setFormData((prev) => ({ ...prev, [name]: value }));
        },
        [validators]
    );

    const setFieldValue = useCallback((name: string, value: unknown) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const resetForm = useCallback((newValues: T) => {
        setFormData(newValues);
        setValidationStates({});
        setValidationErrors({});
    }, []);

    const isFormInvalid = Object.values(validationStates).some(
        (state) => state === 'invalid' || state === 'validating'
    );

    return {
        formData,
        handleChange,
        setFieldValue,
        validationStates,
        validationErrors,
        resetForm,
        isFormInvalid,
    };
};
