import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Fragment, useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useDebounce } from '../../hooks/useDebounce';

interface AsyncComboboxProps {
    onChange: (value: string) => void;
    placeholder?: string;
    optionsEndpoint: string;
    optionsValueKey?: string;
    optionsLabelKey?: string;
    className?: string;
    label?: string;
}

export const AsyncCombobox: React.FC<AsyncComboboxProps> = ({
    onChange,
    placeholder = 'Search...',
    optionsEndpoint,
    optionsValueKey = 'id',
    optionsLabelKey = 'name',
    className,
}) => {
    const { api } = useApi();
    const [query, setQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<{ id: string; name: string } | null>(null);
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (!debouncedQuery && !selectedItem) {
            setOptions([]);
            return;
        }

        if (!debouncedQuery) return;

        let active = true;
        setLoading(true);

        const fetchOptions = async () => {
            try {
                const result = await api.get<any[]>(`${optionsEndpoint}?q=${encodeURIComponent(debouncedQuery)}`);
                if (active && result) {
                    setOptions(result);
                }
            } catch (error) {
                console.error('Error fetching options', error);
                setOptions([]);
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchOptions();

        return () => {
            active = false;
        };
    }, [debouncedQuery, optionsEndpoint, api, selectedItem]);

    return (
        <Combobox
            value={selectedItem}
            onChange={(item: any) => {
                setSelectedItem(item);
                onChange(item ? item[optionsValueKey] : '');
            }}
        >
            <div className={clsx('relative mt-1', className)}>
                <div className="relative w-full cursor-default overflow-hidden rounded-lg border border-purple-700 bg-gray-700 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <ComboboxInput
                        className="w-full border-none bg-gray-700 py-3 pl-3 pr-10 text-sm leading-5 text-gray-100 focus:ring-0"
                        displayValue={(item: any) => (item ? item[optionsLabelKey] : '')}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                    />
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery('')}
                >
                    <ComboboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
                        {loading && (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                Loading...
                            </div>
                        )}
                        {!loading && options.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                Nothing found.
                            </div>
                        ) : (
                            options.map((option: any) => (
                                <ComboboxOption
                                    key={option[optionsValueKey]}
                                    className={({ focus }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            focus ? 'bg-purple-600 text-white' : 'text-gray-900'
                                        }`
                                    }
                                    value={option}
                                >
                                    {({ selected, focus }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                                            >
                                                {option[optionsLabelKey]} {option.email ? `(${option.email})` : ''}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                        focus ? 'text-white' : 'text-purple-600'
                                                    }`}
                                                >
                                                    ✓
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </ComboboxOption>
                            ))
                        )}
                    </ComboboxOptions>
                </Transition>
            </div>
        </Combobox>
    );
};
