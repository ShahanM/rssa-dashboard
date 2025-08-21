import { useParams } from "react-router-dom";
import type { NewStudyStep } from "../../api/api.types";
import { CopyToClipboardButton } from "../../components/buttons/CopyToClipboardButton";
import CreateResourceButton from "../../components/buttons/CreateResourceButton";
import type { FormField } from "../../components/forms/DynamicFormField";
import StudyComponentList from "../../components/StudyComponentList";
import ResourceMetaInfo from "../../components/views/ResourceMetaInfo";
import ResourceTable from "../../components/views/ResourceTable";
import ResourceViewer from "../../components/views/ResourceViewer";
import { useAppDispatch } from "../../store/hooks";
import { setStudy } from "../../store/studycomponents/selectionSlice";
import type { Study, StudyDetail } from "../../utils/generics.types";
import UserCard from "../profile/UserCard";
import ExportStudyConfigButton from "../../components/buttons/ExportStudyConfigButton";

const StudyDetails: React.FC = () => {
	const { studyId } = useParams<{ studyId: string }>();

	const dispatch = useAppDispatch();

	const summary = false;

	const handleStudyLoad = (loadedStudy: StudyDetail) => {
		const studyForRedux: Study = {
			id: loadedStudy.id,
			name: loadedStudy.name,
			description: loadedStudy.description,
			date_created: new Date(loadedStudy.date_created).toLocaleDateString()
		};
		dispatch(setStudy(studyForRedux));
	}

	if (!studyId) {
		console.warn("Study ID is missing from URL. Redirecting to studies listings.");
		return null;
	}

	const createStepFormFields: FormField[] = [
		{
			name: 'study_id',
			label: 'Study ID',
			value: studyId,
			type: 'static',
			required: true,
		},
		{
			name: 'step_type',
			label: 'Step type',
			type: 'select',
			options: [
				{ value: "survey", label: "Survey" },
				{ value: "info", label: "Info" },
				{ value: "pref_elicitation", label: "Preference Elicitation" },
				{ value: "interaction", label: "Interaction" },
				{ value: "demographics", label: "Demographics" }
			]
		},
		{
			name: 'name',
			label: 'Step Name',
			type: 'text',
			required: true,
		},
		{
			name: 'description',
			label: 'Description',
			type: 'textarea',
			required: false,
		}
	]

	return (
		<div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
			<ResourceViewer
				apiResourceTag="studies"
				resourceId={studyId}
				resourceKey="study"
				onResourceLoaded={handleStudyLoad}
				summary={summary}
			>
				{(study: StudyDetail) => {
					return (
						<>
							<h2 className="text-xl font-bold mb-3">{study.name}</h2>
							<ResourceMetaInfo metaInfo={[
								{ label: 'Name', value: study.name },
								{ label: 'ID', value: study.id },
								{
									label: 'Owner', value: study.owner ?
										<UserCard userId={study.owner} />
										: study.owner
								},
								{
									label: 'Created by',
									value: study.created_by ?
										<UserCard userId={study.created_by} />
										: study.created_by
								},
								{ label: 'Date Created', value: new Date(study.date_created).toLocaleDateString() },
								{ label: 'Description', value: study.description, wide: true },
							]} />
							<ExportStudyConfigButton studyId={study.id} studyName={study.name} />
							<div className="flex space-x-2 justify-between gap-4">
								<div>
									<div className="flex justify-between items-center p-0 min-w-100 my-3">
										<h3 className="text-xl font-bold mb-3">Study steps</h3>
										<CreateResourceButton<NewStudyStep>
											apiResourceTag="steps"
											objectName="step"
											formFields={createStepFormFields}
											invalidateQueryKey={['studies', studyId, summary]}
										/>
									</div>
									<StudyComponentList
										studyComponents={study.steps}
										patchUrl={`studies/${study.id}/steps/order`}
										urlPathPrefix={`/studies/${study.id}/steps`}
										labelKey="name"
										apiResourceTag="steps"
										resourceKey="step"

									/>
								</div>
								<div className="p-3">
									<h3 className="text-xl font-bold">Study Conditions</h3>
									<ResourceTable
										data={study.conditions}
										columns={[
											{
												id: 'copy-id-action',
												cell: ({ row }) => {
													const studyIdToCopy = row.original.id;
													return <CopyToClipboardButton
														textToCopy={studyIdToCopy}
														animated
													/>;
												}
											},
											{
												accessorKey: 'id',
												header: 'Condition ID',
											},
											{
												accessorKey: 'name',
												header: 'Condition Name',
											},
											{
												accessorKey: 'description',
												header: 'Description',
											}
										]}
									/>
								</div>
							</div>
						</>
					)
				}}
			</ResourceViewer>
		</div>
	)
}

export default StudyDetails;