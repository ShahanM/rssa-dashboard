import { useCallback, useEffect, useState } from "react";
import { Button, Row, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import LinkConstructButton from "../components/linkconstructbutton/LinkConstructButton";
import { MetadataTableRow } from "../components/MetadataTableRow";
import { useStudyNavigation } from "../hooks/StudyNavigationContext";
import { useApi } from "../hooks/useApi";

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

const PageDetails: React.FC = () => {
	const { studyId, stepId, pageId } = useParams<{ studyId: string; stepId: string; pageId: string }>();
	const navigate = useNavigate();
	const { setStepDisplayName } = useStudyNavigation();
	const [loadingStepData, setLoadingStepData] = useState(true);
	const { data: page, loading, error, api } = useApi<SurveyPage>();
	const { setPageDisplayName } = useStudyNavigation()

	useEffect(() => {
		if (!studyId) {
			console.warn("Study ID is missing from URL. Redirecting to studies listings.")
			navigate('/studies', { replace: true });
			return;
		}

		if (!stepId) {
			console.warn("Step ID is missing from URL. Redirecting back to study details page.");
			navigate(`/studies/${studyId}`, { replace: true });
			return;
		}

		if (!pageId) {
			console.warn("Page ID is missing from URL. Redirecting back to step details page.");
			navigate(`/studies/${studyId}/${pageId}`, { replace: true });
			return;
		}
		setLoadingStepData(true);

	}, [studyId, stepId, pageId, navigate]);

	const fetchPageInfo = useCallback(async () => {
		if (pageId) {
			try {
				await api.get(`pages/${pageId}`)
			} catch (error) {
				console.log("Error fetching step page. ", error);
			}
		}
	}, [pageId, api]);

	useEffect(() => { fetchPageInfo() }, [fetchPageInfo]);

	useEffect(() => {
		if (page) {
			setPageDisplayName(page.name);
			console.log("Page ", page);
		}
	}, [page, setPageDisplayName])

	if (!studyId || !stepId || !pageId) {
		return <p>There was a problem.</p>
	}

	if (!page) {
		return (
			<h2>Loading step data</h2>
		)
	}

	return (
		<>
			<Row>
				<div className="container-header-content">
					<Link to={`/studies/${studyId}/steps/${stepId}`}><Button>&lt;</Button></Link>
				</div>
				<div className="container-header-content">
					<h2>{page.name}</h2>
				</div>
			</Row>
			<Table striped bordered hover>
				<tbody>
					<MetadataTableRow label={"Page ID"} value={page.id} />
					<MetadataTableRow label={"Description"} value={page.description} />
					<MetadataTableRow label={"Date created"} value={page.date_created} />
					<MetadataTableRow label={"Order position"} value={page.order_position} />
				</tbody>
			</Table>
			{/* <Row> */}
			{
				page.page_contents && page.page_contents.map((pageContent) =>
					<div style={{ backgroundColor: "beige", borderRadius: "0.5em", margin: "0.25em" }}>
						<p>{pageContent.content_id}</p>
						<p>{pageContent.desc}</p>
						<p>{pageContent.name}</p>
						<p>{pageContent.order_position}</p>
						<p>{pageContent.scale_name}</p>
					</div>
				)
			}
			{/* </Row> */}
			<Row>
				<LinkConstructButton component={page}
					onSuccess={fetchPageInfo} />

			</Row>
		</>
	)
}

export default PageDetails;