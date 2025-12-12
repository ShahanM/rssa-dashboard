import type { DependentResourceClient, SelectableClientKey } from '../../types/resourceClient.types';
import type { BaseResourceType } from '../../types/sharedBase.types';

export type ValidatorFactory<T extends BaseResourceType> = (
    client: DependentResourceClient<T>,
    parentId: string,
    excludeId?: string
) => FieldValidator;

export interface FormField {
    name: string;
    label: string;
    type?: 'text' | 'textarea' | 'select' | 'static' | 'modal-select' | 'number';
    value?: string; // Only applies for static fields
    required?: boolean;
    placeholder?: string;
    rows?: number;
    clientKey?: SelectableClientKey;
    options?: { value: string; label: string }[]; // For static select fields
    optionsEndpoint?: string; // For dynamic select fields
    optionsValueKey?: string; // Key for value in dynamic select options
    optionsLabelKey?: string; // Key for label in dynamic select options
}

export type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid';
export type FieldValidator = (fieldKey: string, value: string) => void;

export type MetaInfoField<T> = {
    key: keyof T;
    label: string;
    formatFn?: (value: T[keyof T]) => string;
    render?: (resource: T) => React.ReactNode | null;
    wide?: boolean;
    optional?: boolean;
};

export type EditableField<T> = MetaInfoField<T> & {
    label: string;
    wide?: boolean;
    // TODO: Need editable select types
    type?: 'text' | 'textarea' | 'static' | 'select' | 'number'; // To render different input types
    options?: { value: string; label: string }[]; // For static select fields
    optionsEndpoint?: string; // For dynamic select fields
    optionsValueKey?: string; // Key for value in dynamic select options
    optionsLabelKey?: string; // Key for label in dynamic select options
    required?: boolean;
};
