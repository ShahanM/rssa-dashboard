import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useApi } from '../../hooks/useApi';

type BaseOption = {
    id: string;
    name: string;
    [key: string]: any;
};

interface DynamicSelectProps<TOption extends BaseOption> extends React.SelectHTMLAttributes<HTMLSelectElement> {
    placeholderText?: string;
    optionsEndpoint?: string;
    optionsValueKey?: keyof TOption;
    optionsLabelKey?: keyof TOption;
    staticOptions?: { value: string; label: string }[];
}

export const DynamicSelect = <TOption extends BaseOption>({
    placeholderText = 'Select an option',
    optionsEndpoint,
    optionsValueKey = 'id',
    optionsLabelKey = 'name',
    staticOptions = [],
    ...rest
}: DynamicSelectProps<TOption>) => {
    const { api } = useApi();

    const { data: fetchedOptions, isLoading } = useQuery({
        queryKey: ['form-options', optionsEndpoint],
        queryFn: () => api.get<TOption[]>(`${optionsEndpoint}/`),
        enabled: !!optionsEndpoint,
    });

    const options = optionsEndpoint
        ? fetchedOptions?.map((item) => ({ value: item[optionsValueKey], label: item[optionsLabelKey] })) || []
        : staticOptions;

    return (
        <select {...rest}>
            <option value="" disabled>
                {isLoading ? 'Loading...' : placeholderText}
            </option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};
