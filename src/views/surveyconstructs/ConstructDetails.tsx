import { useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CreateResourceButton from "../../components/buttons/CreateResourceButton";
import DeleteResourceButton from "../../components/buttons/DeleteResourceButton";
import type { FormField } from "../../components/forms/DynamicFormField";
import StudyComponentList from "../../components/StudyComponentList";
import ResourceMetaInfo from "../../components/views/ResourceMetaInfo";
import ResourceViewer from "../../components/views/ResourceViewer";
import { clearSelectedConstruct, setConstruct } from "../../store/constructlibrary/selectionSlice";
import { useAppDispatch } from "../../store/hooks";
import type { SurveyConstructDetails } from "../../utils/generics.types";


type NewConstructItem = {
	construct_id: string;
	text: string;
	order_position: number;
	item_type: string;
}


const ConstructDetails: React.FC = () => {
	const { constructId } = useParams<{ constructId: string }>();
	const dispatch = useAppDispatch();
	const location = useLocation();
	const navigate = useNavigate();

	const navigateUp = useCallback(() => {
		const pathSegments = location.pathname.split('/').filter(Boolean);
		const parentPath = '/' + pathSegments.slice(0, -1).join('/');
		navigate(parentPath);
	}, [location.pathname, navigate]);

	const summary = false;

	const handleConstructLoad = (loadedConstruct: SurveyConstructDetails) => {
		const constructForRedux: SurveyConstructDetails = {
			id: loadedConstruct.id,
			name: loadedConstruct.name,
			desc: loadedConstruct.desc,
			type: loadedConstruct.type,
			scale_levels: loadedConstruct.scale_levels,
			scale_level_cnt: loadedConstruct.scale_level_cnt,
			items: loadedConstruct.items,
		};
		dispatch(setConstruct(constructForRedux));
	}

	const createConstructItemFormFields: FormField[] = [
		{
			name: 'construct_id',
			label: 'Construct ID',
			value: constructId,
			type: 'static',
			required: true,
		},
		{
			name: 'text',
			label: 'Item Text',
			type: 'text',
			required: true,
		}
	];
	if (!constructId) {
		console.warn("Construct ID is missing from URL. Redirecting to constructs listings.");
		return null;
	}

	const handleDeletionCleanup = () => {
		dispatch(clearSelectedConstruct());
		navigateUp();
	}


	return (
		<div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
			<ResourceViewer
				apiResourceTag="constructs"
				resourceId={constructId}
				resourceKey="construct"
				onResourceLoaded={handleConstructLoad}
				summary={summary}
			>
				{(construct: SurveyConstructDetails) => {
					const invalidateQueryKey = ['constructs', constructId, summary];
					return (
						<>
							<div className="flex justify-between mb-3 items-center">
								<h2 className="text-xl font-bold mb-3">{construct.name}</h2>
								<DeleteResourceButton
									apiResourceTag="constructs"
									resourceId={constructId}
									resourceKey="construct"
									resourceName={construct.name}
									onSuccessCleanup={handleDeletionCleanup}
								/>
							</div>
							<ResourceMetaInfo metaInfo={[
								{ label: 'Name', value: construct.name },
								{ label: 'ID', value: construct.id },
								{ label: 'Description', value: construct.desc, wide: true },
							]} />
							<div className="flex space-x-2 justify-between gap-4">
								<div>

									<div className="flex justify-between items-center p-0 min-w-100 my-3">
										<h3 className="text-xl font-bold mb-3">Items</h3>
										<CreateResourceButton<NewConstructItem>
											apiResourceTag="items"
											objectName="item"
											formFields={createConstructItemFormFields}
											invalidateQueryKey={invalidateQueryKey}
										/>
									</div>
									<StudyComponentList
										studyComponents={construct.items}
										patchUrl={`constructs/${construct.id}/items/order`}
										invalidateQueryKey={invalidateQueryKey}
										apiResourceTag="items"
										resourceKey="item"
										labelKey="text"
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

export default ConstructDetails;