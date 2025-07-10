import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import StepCreateForm from "../../components/forms/StepCreateForm";
import StudyComponentList from "../../components/StudyComponentList";
import { useStudyNavigation } from "../../hooks/StudyNavigationContext";
import { useApi } from "../../hooks/useApi";
import { StudyDetail } from "../../utils/generics.types";

const StudyDetails: React.FC = () => {
	const { studyId } = useParams<{ studyId: string }>();
	const navigate = useNavigate()
	const { setStudyDisplayName } = useStudyNavigation();
	const { data: study, loading, error, api } = useApi<StudyDetail>();

	const [showStepCreateForm, setShowStepCreateForm] = useState<boolean>(false);

	useEffect(() => {
		if (!studyId) {
			console.warn("Study ID is missing from URL. Redirecting to studies listings.")
			navigate('/studies', { replace: true });
			return;
		}
	}, [studyId, navigate]);

	const fetchStudyDetail = useCallback(async () => {
		if (studyId) {
			try {
				await api.get(`studies/${studyId}`);
			} catch (error) {
				console.error("Error fetching studies:", error);
			}
		}

	}, [studyId, api]);

	useEffect(() => {
		if (study) {
			setStudyDisplayName(study.name);
		}
	}, [study, setStudyDisplayName])

	useEffect(() => { fetchStudyDetail(); }, [fetchStudyDetail]);

	const lastStepOrderPos = useMemo(() => {
		const lastOrderPosition = study?.steps?.[study.steps.length - 1]?.order_position;
		return (lastOrderPosition ?? 0) + 1;
	}, [study?.steps]);

	if (!studyId || !study) {
		return (
			<p>Loading study...</p>
		)
	} else {
		console.log("Study: ", study);
	}
	return (
		<Container className="mt-4">
			<Row>
				<StudyComponentList
					studyComponents={study.steps}
					patchUrl={`studies/${studyId}/steps/order`}
					urlPathPrefix={`/studies/${studyId}/steps`}
					labelKey="name"
				/>
			</Row>
			{
				studyId &&
				<StepCreateForm
					studyId={studyId}
					orderPosition={lastStepOrderPos}
					show={showStepCreateForm}
					showHideCallback={setShowStepCreateForm}
					onSuccess={fetchStudyDetail}
				/>
			}
			<Row>
				<Button onClick={() => setShowStepCreateForm(true)} >
					Add a step
				</Button>
			</Row>
			<Row>
				{study.conditions.map((condition) =>
					<p key={`sc_${condition.id}`}>{condition.name}</p>)
				}
			</Row>
		</Container>
	)
}

export default StudyDetails;