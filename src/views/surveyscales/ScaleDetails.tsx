import clsx from "clsx";
import { useCallback, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CreateResourceButton from "../../components/buttons/CreateResourceButton";
import DeleteResourceButton from "../../components/buttons/DeleteResourceButton";
import type { FormField } from "../../components/forms/DynamicFormField";
import StudyComponentList from "../../components/StudyComponentList";
import ResourceMetaInfo from "../../components/views/ResourceMetaInfo";
import ResourceTable from "../../components/views/ResourceTable";
import ResourceViewer from "../../components/views/ResourceViewer";
import { useAppDispatch } from "../../store/hooks";
import { clearSelectedScale } from "../../store/surveyscales/selectionSlice";
import type { ScaleLevel } from "../../utils/generics.types";

type ConstructScaleDetails = {
	id: string;
	name: string;
	description: string;
	created_by: string;
	date_created: string;
	scale_levels: ScaleLevel[];
}

type NewScaleLevel = {
	scale_id: string;
	label: string;
	value: string;
}

const ScaleDetails: React.FC = () => {
	const { scaleId } = useParams<{ scaleId: string }>();
	const dispatch = useAppDispatch();
	const location = useLocation();
	const navigate = useNavigate();

	const navigateUp = useCallback(() => {
		const pathSegments = location.pathname.split('/').filter(Boolean);
		const parentPath = '/' + pathSegments.slice(0, -1).join('/');
		navigate(parentPath);
	}, [location.pathname, navigate]);

	const summary = false;

	const createScaleLevel: FormField[] = [
		{
			name: 'scale_id',
			label: 'Scale ID',
			value: scaleId,
			type: 'static',
			required: true,
		},
		{
			name: 'label',
			label: 'Label Text',
			type: 'text',
			required: true,
		},
		{
			name: 'value',
			label: 'Value',
			type: 'text', // FIXME: this should allow numbers only fields
			required: true,
		}
	];
	if (!scaleId) {
		console.warn("Construct ID is missing from URL. Redirecting to constructs listings.");
		return null;
	}

	const handleDeletionCleanup = () => {
		dispatch(clearSelectedScale());
		navigateUp();
	}


	return (
		<div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
			<ResourceViewer
				apiResourceTag="construct-scales"
				resourceId={scaleId}
				resourceKey="scaleLevel"
				onResourceLoaded={() => { }}
				summary={summary}
			>
				{(scale: ConstructScaleDetails) => {
					const invalidateQueryKey = ['construct-scales', scaleId, summary];
					return (
						<>
							<div className="flex justify-between mb-3 items-center">
								<h2 className="text-xl font-bold mb-3">{scale.name}</h2>
									< DeleteResourceButton
										apiResourceTag="construct-scales"
										resourceId={scaleId}
										resourceKey="construct"
										resourceName={scale.name}
										onSuccessCleanup={handleDeletionCleanup}
									/>
							</div >
							<ResourceMetaInfo metaInfo={[
								{ label: 'Name', value: scale.name },
								{ label: 'ID', value: scale.id },
								{ label: 'Description', value: scale.description, wide: true },
							]} />
							<div className="flex space-x-2 justify-between gap-4">
								<div className="w-1/3">
									<div className="flex justify-between items-center p-0 min-w-100 my-3">
										<h3 className="text-xl font-bold mb-3">Scale options</h3>
										<CreateResourceButton<NewScaleLevel>
											apiResourceTag="scale-levels"
											objectName="scaleLevel"
											formFields={createScaleLevel}
											invalidateQueryKey={invalidateQueryKey}
										/>
									</div>
									<StudyComponentList
										studyComponents={scale.scale_levels}
										patchUrl={`construct-scales/${scale.id}/levels/order`}
										labelKey="label"
										apiResourceTag="scale-levels"
										resourceKey="scaleLevel"
										invalidateQueryKey={invalidateQueryKey}
									/>
								</div>
								<div>
									<h3 className="text-xl font-bold mb-3">Preview</h3>
									<ScalePreview scaleLevels={scale.scale_levels} />
									<h3 className="text-xl font-bold mb-3 mt-5">Option values</h3>
									<ResourceTable className="mt-1"
										data={scale.scale_levels}
										columns={[
											// { accessorKey: 'order_position', header: 'Order Position' },
											{ accessorKey: 'label', header: 'Label' },
											// { accessorKey: 'id', header: 'ID' },
											{ accessorKey: 'value', header: 'Value' },
										]} />
								</div>
							</div>
						</>
					)
				}}
			</ResourceViewer>
		</div >
	)
}

const ScalePreview: React.FC<{ scaleLevels: ScaleLevel[] }> = ({
	scaleLevels = []
}) => {
	const [selectedOption, setSelectedOption] = useState<string>();

	if (scaleLevels.length === 0) {
		return <p>You have to add scale options.</p>
	}

	return (
		<div className={clsx("border p-3 rounded-lg border-yellow-300 bg-yellow-50")}>
			<p>
				This construct scale item helps me understand
				how the scale buttons will appear in the study.
			</p>
			<div className={clsx("flex justify-between mt-3")}>
				{
					scaleLevels.map((level) => (
						<button key={`scale-level-${level.id}`}
							className={clsx(
								"p-2 border rounded min-w-27 border-yellow-300",
								"hover:bg-yellow-400",
								"cursor-pointer",
								selectedOption === level.id ? "bg-yellow-400" : "bg-gray-100"
							)}
							onClick={() => setSelectedOption(level.id)}
						>
							<p>{level.label}</p>
						</button>
					))
				}

			</div>
		</div>
	)
}

export default ScaleDetails;