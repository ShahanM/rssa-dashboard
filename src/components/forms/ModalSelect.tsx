import type { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { useState } from 'react';
import { useSelectableClient } from '../../api/useSelectableClient';
import type { BaseResourceType } from '../../types/sharedBase.types';
import type { PaginatedResourceList } from '../../types/studyComponents.types';
import ResourceTable from '../resources/ResourceTable';
import type { FormField } from './forms.typs';

interface ModalSelectProps {
    field: FormField;
    value: string;
    onValueChange: (name: string, value: unknown) => void;
    className?: string;
    showSearchModal?: (isOpen: boolean) => void;
}

export const ModalSelect = ({ field, value, onValueChange, showSearchModal, ...rest }: ModalSelectProps) => {
    const [showResourceList, setShowResourceList] = useState(false);
    const [selectedItem, setSelectedItem] = useState<BaseResourceType>();
    const resourceClient = useSelectableClient(field.clientKey!);
    const handleSelect = (item: BaseResourceType) => {
        const valueToSet = item[(field.optionsValueKey as keyof BaseResourceType) || 'id'];
        onValueChange(field.name, valueToSet);
        setSelectedItem(item);
        setShowResourceList(false);
    };

    const displayLabel = selectedItem
        ? selectedItem[field.optionsLabelKey as keyof BaseResourceType | 'display_name']
        : 'None selected';

    return (
        <>
            <div className="flex items-center space-x-3">
                <input
                    type="text"
                    value={displayLabel as string}
                    readOnly
                    className={clsx(rest.className, 'w-1/3')}
                    placeholder={field.placeholder}
                />
                <button
                    type="button"
                    onClick={() => setShowResourceList(!showResourceList)}
                    className="rounded-md bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700 "
                >
                    Select...
                </button>
            </div>
            {showResourceList && (
                <ResourceTable<BaseResourceType>
                    className="mt-3"
                    resourceTag={resourceClient.config.apiResourceTag}
                    queryFn={(queryParams) => {
                        return resourceClient.getPaginated(
                            queryParams
                        ) as Promise<PaginatedResourceList<BaseResourceType> | null>;
                    }}
                    columns={resourceClient.config.tableColumns as ColumnDef<BaseResourceType>[]}
                    onRowClick={handleSelect}
                    pageSize={5}
                    isPageSizeEditable={false}
                    isSearchable={true}
                />
            )}
        </>
    );
};
