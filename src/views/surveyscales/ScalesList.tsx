import {
	type ColumnDef
} from '@tanstack/react-table';
import type { NewConstructScale } from '../../api/api.types';
import CreateResourceButton from '../../components/buttons/CreateResourceButton';
import type { FormField } from '../../components/forms/DynamicFormField';
import ResourceListViewer from '../../components/views/ResourceListViewer';
import ResourceTable from '../../components/views/ResourceTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setScale } from '../../store/surveyscales/selectionSlice';
import type { ConstructScale } from '../../utils/generics.types';

const ScalesList: React.FC = () => {
	const dispatch = useAppDispatch();
	const selectedScale = useAppSelector(state => state.scaleSelection.scale);

	const scaleColumns: ColumnDef<ConstructScale>[] = [
		{ accessorKey: 'name', header: 'Scale Name' },
		// { accessorKey: 'created_by', header: 'Created By' }, // TODO: Add this back with condition for admin users
	]

	const createScaleFormFields: FormField[] = [
		{
			name: 'name',
			label: 'Scale Name',
			type: 'text',
			required: false,
			placeholder: 'Enter a scale name [optional]'
		},
		{
			name: 'description',
			label: 'Description',
			type: 'textarea',
			required: false,
			placeholder: 'Enter a description for the scale [optional].' +
				'The name and description can help us mitigate duplicates.'
		}
	];

	const handleRowClick = (scale: ConstructScale) => {
		dispatch(setScale(scale));
	};

	return (
		<div className="container mx-auto p-3 bg-gray-50 rounded-lg me-2">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold mb-4">Your Studies</h2>
				<CreateResourceButton<NewConstructScale>
					apiResourceTag="construct-scales"
					objectName="construct-scale"
					formFields={createScaleFormFields}
				/>
			</div>
			<ResourceListViewer<ConstructScale> apiResourceTag='construct-scales'>
				{(constructScales) => (
					<ResourceTable
						data={constructScales}
						columns={scaleColumns}
						onRowClick={handleRowClick}
						selectedRowId={selectedScale?.id} />
				)}
			</ResourceListViewer>
		</div>
	)
}

export default ScalesList;