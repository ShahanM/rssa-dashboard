import React from 'react';
import { useParams } from 'react-router-dom';
import type { NewPage } from '../../api/api.types';
import CreateResourceButton from '../../components/buttons/CreateResourceButton';
import type { FormField } from '../../components/forms/DynamicFormField';
import StudyComponentList from '../../components/StudyComponentList';
import ResourceMetaInfo from '../../components/views/ResourceMetaInfo';
import ResourceViewer from '../../components/views/ResourceViewer';
import { useAppDispatch } from '../../store/hooks';
import { setStep } from '../../store/studycomponents/selectionSlice';
import type { StudyStep } from '../../utils/generics.types';

const StepDetails: React.FC = () => {
	const { studyId, stepId } = useParams<{ studyId: string; stepId: string }>();

	const summary = false;

	const dispatch = useAppDispatch();

	if (!studyId || !stepId) {
		console.warn("Study ID or Step ID is missing from URL. Redirecting to studies listings.");
		return null;
	}

	const handleStepLoad = (loadedStep: StudyStep) => {
		const stepForRedux: StudyStep = {
			id: loadedStep.id,
			study_id: loadedStep.study_id,
			name: loadedStep.name,
			description: loadedStep.description,
			order_position: loadedStep.order_position,
			date_created: new Date(loadedStep.date_created).toLocaleDateString()
		};
		dispatch(setStep(stepForRedux));
	}

	const createPageFormFields: FormField[] = [
		{
			name: 'study_id',
			label: 'Study ID',
			value: studyId,
			type: 'static',
			required: true,
		},
		{
			name: 'step_id',
			label: 'Step ID',
			value: stepId,
			type: 'static',
			required: true,
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
				apiResourceTag="steps"
				resourceId={stepId}
				resourceKey="step"
				summary={summary}
				onResourceLoaded={handleStepLoad}
			>
				{(step: StudyStep) => {
					return (
						console.log("Step: ", step),
						<>
							<h2 className="text-xl font-bold mb-3">{step.name}</h2>
							<ResourceMetaInfo metaInfo={[
								{ label: 'Name', value: step.name },
								{ label: 'ID', value: step.id },
								{ label: 'Date Created', value: new Date(step.date_created).toLocaleDateString() },
								{ label: 'Description', value: step.description },
								{ label: 'Instruction', value: step.instructions }
							]} />
							<div className="flex space-x-2 justify-between gap-4">
								<div>

									<div className="flex justify-between items-center p-0 min-w-100 my-3">
										<h3 className="text-xl font-bold mb-3">Pages</h3>
										<CreateResourceButton<NewPage>
											apiResourceTag="pages"
											objectName="page"
											formFields={createPageFormFields}
											invalidateQueryKey={['steps', stepId, summary]}
										/>
									</div>
									{step.pages && step.pages.length > 0 ?
										<StudyComponentList
											studyComponents={step.pages}
											patchUrl={`steps/${step.id}/pages/order`}
											urlPathPrefix={`/studies/${studyId}/steps/${stepId}/pages`}
											apiResourceTag='pages'
											resourceKey='page'
											labelKey="name"
										/>
										: <p>There are no pages to show for this step.</p>
									}
								</div>
							</div>
						</>
					)
				}}
			</ResourceViewer>
		</div>
	)
}

export default StepDetails;