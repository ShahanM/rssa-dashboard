import {
	type ColumnDef
} from '@tanstack/react-table';
import type { NewStudy } from '../../api/api.types';
import CreateResourceButton from '../../components/buttons/CreateResourceButton';
import type { FormField } from '../../components/forms/DynamicFormField';
import ResourceListViewer from '../../components/views/ResourceListViewer';
import ResourceTable from '../../components/views/ResourceTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setStudy } from '../../store/studycomponents/selectionSlice';
import type { Study } from '../../utils/generics.types';

const StudyPanel: React.FC = () => {
	const dispatch = useAppDispatch();
	const selectedStudy = useAppSelector(state => state.studySelection.study);


	const studyColumns: ColumnDef<Study>[] = [
		{
			accessorKey: 'name',
			header: 'Study Name',
		},
		{
			accessorKey: 'date_created',
			header: 'Date Created',
			cell: info => new Date(info.getValue() as string).toLocaleDateString(),
		}
	];

	const createStudyFormFields: FormField[] = [
		{
			name: 'name',
			label: 'Study Name',
			type: 'text',
			required: true,
		},
		{
			name: 'description',
			label: 'Description',
			type: 'textarea',
			required: false,
		}
	];

	const handleRowClick = (study: Study) => {
		dispatch(setStudy(study));
	};

	return (
		<div className="container mx-auto p-3 bg-gray-50 rounded-lg me-2">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold mb-4">Your Studies</h2>
				<CreateResourceButton<NewStudy>
					apiResourceTag="studies"
					objectName="study"
					formFields={createStudyFormFields}
				/>
			</div>
			<ResourceListViewer<Study> apiResourceTag='studies'>
				{(studies) => (
					<ResourceTable
						data={studies}
						columns={studyColumns}
						onRowClick={handleRowClick}
						selectedRowId={selectedStudy?.id} />
				)}
			</ResourceListViewer>
		</div>
	);
}

export default StudyPanel;