import { useCallback, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStudyNavigation } from "../hooks/StudyNavigationContext";
import { useApi } from "../hooks/useApi";
import { StudyDetail, StudyStep } from "../utils/generics.types";

const StudyDetails: React.FC = () => {
	const { studyId } = useParams<{ studyId: string }>();
	const navigate = useNavigate()
	const { setStudyDisplayName } = useStudyNavigation();
	const { data: study, loading, error, api } = useApi<StudyDetail>();

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

	useEffect(() => {
		fetchStudyDetail();
	}, [fetchStudyDetail]);

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
				<ul>
					{study.steps.map((studyStep) =>
						<StudyStepListItem
							key={`ss_${studyStep.id}`}
							step={studyStep}
							studyId={studyId} />)
					}
				</ul>
			</Row>
			<Row>
				{study.conditions.map((condition) =>
					<p key={`sc_${condition.id}`}>{condition.name}</p>)
				}
			</Row>
		</Container>
	)
}

const StudyStepListItem: React.FC<{ step: StudyStep; studyId: string }> = ({
	step,
	studyId
}) => {
	return (
		<li>
			<Link to={`/studies/${studyId}/steps/${step.id}`}>{step.name}</Link>
		</li>
	)
}

export default StudyDetails;