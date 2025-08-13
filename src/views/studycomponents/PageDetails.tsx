import { useParams } from "react-router-dom";
import CreateResourceButton from "../../components/buttons/CreateResourceButton";
import type { FormField } from "../../components/forms/DynamicFormField";
import ResourceMetaInfo from "../../components/views/ResourceMetaInfo";
import ResourceTable from "../../components/views/ResourceTable";
import ResourceViewer from "../../components/views/ResourceViewer";
import type { Page } from "../../utils/generics.types";

type SurveyConstructItem = {
	id: string;
	text: string;
	order_position: number;
}

export type SurveyConstructScaleLevel = {
	id: string;
	label: string;
	level: number;
}
export type SurveyConstruct = {
	content_id: string;
	desc: string;
	name: string;
	items: SurveyConstructItem[];
	order_position: number;
	scale_levels: SurveyConstructScaleLevel[];
	scale_name: string;

}

export type SurveyPage = {
	id: string;
	study_id: string;
	step_id: string;
	description: string;
	name: string;
	date_created: Date;
	order_position: number;
	page_contents: SurveyConstruct[];
	last_page: boolean;
}


type NewContentPage = {
	page_id: string;
	construct_id: string;
	scale_id: string;
}

const PageDetails: React.FC = () => {
	const { studyId, stepId, pageId } = useParams<{ studyId: string; stepId: string; pageId: string }>();

	const summary = false;

	const handleStudyLoad = (loadedPage: Page) => {
	}

	const createSurveyPageFormFields: FormField[] = [
		{
			name: 'page_id',
			label: 'Page ID',
			value: pageId,
			type: 'static',
			required: true,
		},
		{
			name: 'construct_id',
			label: 'Survey construct',
			type: 'select',
			required: true,
			optionsEndpoint: 'constructs',
			optionsValueKey: 'id',
			optionsLabelKey: 'name',
		},
		{
			name: 'scale_id',
			label: 'Measurement scale',
			type: 'select',
			required: true,
			optionsEndpoint: 'construct-scales',
			optionsValueKey: 'id',
			optionsLabelKey: 'name',
		}
	]

	return (
		<div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
			<ResourceViewer
				apiResourceTag="pages"
				resourceId={pageId}
				resourceKey="page"
				onResourceLoaded={handleStudyLoad}
				summary={summary}
			>
				{(page: Page) => {
					console.log("Page", page);
					return (
						<>
							<h2 className="text-xl font-bold mb-3">{page.name}</h2>
							<ResourceMetaInfo metaInfo={[
								{ label: 'Name', value: page.name },
								{ label: 'ID', value: page.id },
								{ label: 'Order position', value: String(page.order_position) },
								{ label: 'Description', value: page.description, wide: true },
							]} />
							{
								page.page_contents.length > 0 ?
									<ResourceTable
										data={page.page_contents}
										columns={[
											{
												accessorKey: "name",
												header: "Construct Name",
											},
											{
												accessorKey: "scale_name",
												header: "Scale Name"
											}
										]}
									/> :
									<p>
										This Page currently has no survey constructs linked to it.
										It will appear as a blank page in the survey.
									</p>
							}
							<CreateResourceButton<NewContentPage>
								apiResourceTag="survey"
								objectName="surveyPage"
								buttonLabel="Add Survey Construct"
								formFields={createSurveyPageFormFields}
								invalidateQueryKey={['pages', pageId, summary]}
								className="mt-3"
							/>
						</>
					)
				}}
			</ResourceViewer>
		</div>
	)
}

export default PageDetails;