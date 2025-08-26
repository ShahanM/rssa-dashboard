import {
	type ColumnDef
} from '@tanstack/react-table';
import CreateResourceButton from '../../components/buttons/CreateResourceButton';
import type { FormField } from '../../components/forms/DynamicFormField';
import ResourceListViewer from '../../components/views/ResourceListViewer';
import ResourceTable from '../../components/views/ResourceTable';
import { setConstruct } from '../../store/constructlibrary/selectionSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { SurveyConstruct } from '../../utils/generics.types';


type NewSurveyConstruct = {
	name: string;
	desc: string;
	type_id?: string;
	scale_id?: string;	
}

const ConstructList: React.FC = () => {
	const dispatch = useAppDispatch();
	const selectedConstruct = useAppSelector(state => state.constructSelection.construct);

	const constructColumns: ColumnDef<SurveyConstruct>[] = [
		{ accessorKey: 'name', header: 'Construct Name' }
	]

	const createConstructFormFields: FormField[] = [
		{
			name: 'name',
			label: 'Study Name',
			type: 'text',
			required: true,
		},
		{
			name: 'desc',
			label: 'Description',
			type: 'textarea',
			required: false,
		}
	];

	const handleRowClick = (construct: SurveyConstruct) => {
		dispatch(setConstruct(construct));
	};

	return (
		<div className="container mx-auto p-3 bg-gray-50 rounded-lg me-2">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold mb-4">Your Studies</h2>
				<CreateResourceButton<NewSurveyConstruct>
					apiResourceTag="constructs"
					objectName="construct"
					formFields={createConstructFormFields}
				/>
			</div>
			<ResourceListViewer<SurveyConstruct> apiResourceTag='constructs'>
				{(surveyConstructs) => (
					<ResourceTable
						data={surveyConstructs}
						columns={constructColumns}
						onRowClick={handleRowClick}
						selectedRowId={selectedConstruct?.id} />
				)}
			</ResourceListViewer>
		</div>
	)
}

export default ConstructList;