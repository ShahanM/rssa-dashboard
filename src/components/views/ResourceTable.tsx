import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type SortingState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { useState } from 'react';

type BaseData = { id: string };

interface GenericTableProps<T extends BaseData> {
	data: T[];
	columns: ColumnDef<T>[];
	onRowClick?: (row: T) => void;
	selectedRowId?: string;
	className?: string;
}

export const ResourceTable = <T extends BaseData>({
	data,
	columns,
	onRowClick,
	selectedRowId,
	className = ''
}: GenericTableProps<T>) => {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<table className={clsx(
			"min-w-full divide-y divide-gray-400 rounded-3",
			className
		)}>
			<thead className="bg-gray-50">
				{table.getHeaderGroups().map(headerGroup => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map(header => (
							<th
								key={header.id}
								className={clsx(
									"px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase",
									"tracking-wider cursor-pointer",
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
			<tbody className="bg-white divide-y divide-gray-200">
				{table.getRowModel().rows.map(row => (
					<tr
						key={row.original.id}
						onClick={() => onRowClick?.(row.original)}
						className={clsx(
							onRowClick && 'cursor-pointer',
							"hover:bg-yellow-500",
							selectedRowId && selectedRowId === row.original.id && 'bg-yellow-500'
						)}
					>
						{row.getVisibleCells().map(cell => (
							<td key={cell.id} className={clsx(
								"px-6 py-4",
								cell.column.columnDef.meta?.cellClassName || '',
							)}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default ResourceTable;