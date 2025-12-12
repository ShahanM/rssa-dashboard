import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
    type Table,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import type { BaseResourceType } from '../../types/sharedBase.types';
import type { PaginatedResourceList, PaginatedResourceQuery } from '../../types/studyComponents.types';

interface GenericTableProps<T extends BaseResourceType> {
    resourceTag: string;
    queryFn: (queryParams: PaginatedResourceQuery, parentId?: string) => Promise<PaginatedResourceList<T> | null>;
    columns: ColumnDef<T>[];
    onRowClick?: (row: T) => void;
    selectedRowId?: string;
    paginate?: boolean;
    pageSize?: number;
    isPageSizeEditable?: boolean;
    isSearchable?: boolean;
    parentId?: string;
    className?: string;
}

export const ResourceTable = <T extends BaseResourceType>({
    resourceTag,
    queryFn,
    columns,
    onRowClick,
    selectedRowId,
    paginate = true,
    pageSize = 10,
    isPageSizeEditable = true,
    isSearchable = false,
    parentId,
    className = '',
}: GenericTableProps<T>) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: pageSize,
    });

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

    const { data, isFetching } = useQuery({
        queryKey: [resourceTag, parentId, paginate ? pagination : {}, sorting, debouncedSearchTerm] as const,
        queryFn: ({ queryKey }) => {
            const [_key, parentId, paginationState, sorting, search] = queryKey;

            const params: PaginatedResourceQuery = {};

            if ('pageIndex' in paginationState && 'pageSize' in paginationState) {
                params.pageIndex = paginationState.pageIndex as number;
                params.pageSize = paginationState.pageSize as number;
            }

            if (sorting.length > 0) {
                params.sortBy = sorting[0].id;
                params.sortDir = sorting[0].desc ? 'desc' : 'asc';
            }

            if (search) {
                params.search = search;
            }
            return queryFn(params, parentId);
        },
        placeholderData: keepPreviousData,
    });

    const table = useReactTable({
        data: data?.rows ?? [],
        columns,
        state: {
            sorting,
            ...(paginate && { pagination }),
        },
        onSortingChange: setSorting,
        onPaginationChange: paginate ? setPagination : undefined,
        manualPagination: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
        pageCount: paginate ? (data?.page_count ?? -1) : 1,
    });

    if (!isFetching && table.getRowModel().rows.length === 0) {
        return <>Nothing to show</>;
    }

    return (
        <div className="mb-5">
            {isSearchable && (
                <div className="mb-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Search..."
                    />
                </div>
            )}
            {isFetching && <p>Loading...</p>}
            <table className={clsx('w-full divide-y divide-gray-400 rounded-3', className)}>
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className={clsx(
                                        'px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase',
                                        'tracking-wider cursor-pointer rounded-t-lg'
                                    )}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 rounded-b-lg">
                    {table.getRowModel().rows.map((row, idx) => (
                        <tr
                            key={row.original.id}
                            onClick={() => onRowClick?.(row.original)}
                            className={clsx(
                                onRowClick && 'cursor-pointer',
                                'hover:bg-yellow-500',
                                selectedRowId && selectedRowId === row.original.id && 'bg-yellow-500'
                            )}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className={clsx(
                                        'px-6 py-4',
                                        idx !== 0 && pageSize % (idx + 1) === 0 ? 'rounded-b-lg' : '',
                                        cell.column.columnDef.meta?.cellClassName || ''
                                    )}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {paginate && <TableNavigationFooter table={table} enablePageSizeEdit={isPageSizeEditable} />}
        </div>
    );
};

interface TableFooterProps<T extends BaseResourceType> {
    table: Table<T>;
    enablePageSizeEdit: boolean;
}

const TableNavigationFooter = <T extends BaseResourceType>({ table, enablePageSizeEdit }: TableFooterProps<T>) => {
    return (
        <div className="w-full p-1 mt-1 bg-gray-50">
            <div className="flex flex-between w-full items-center content-center">
                <TableNavButton
                    label={'<<'}
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                />
                <TableNavButton
                    label={'<'}
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                />
                <span className="items-center content-center me-1">
                    Page{' '}
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </span>
                <TableNavButton label={'>'} onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
                <TableNavButton
                    label={'>>'}
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                />

                {/* <span className="w-full items-center content-center">
                Page{' '}
                <strong>
                    {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </strong>
            </span> */}

                {enablePageSizeEdit && (
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        name="study-nav"
                        title="Study navigation"
                        className={clsx(
                            'mt-1 p-3 block w-27',
                            'rounded-md border-purple-700 dark:border-purple-500 shadow-sm bg-yellow-400',
                            'focus:border-purple-700 focus:ring-purple-700',
                            'sm:text-sm caret-yellow-500 text-gray-900'
                        )}
                    >
                        {[10, 25, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );
};

const TableNavButton: React.FC<{ label: string; onClick: () => void; disabled: boolean }> = ({
    label,
    onClick,
    disabled,
}) => {
    return (
        <button
            type="button"
            className={clsx('me-1 cursor-pointer text-xl', 'hover:bg-yellow-500 w-15', 'rounded-lg')}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default ResourceTable;
