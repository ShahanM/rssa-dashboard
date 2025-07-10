import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ConstructItemCreateForm from "../../components/forms/ConstructItemCreateForm";
import StudyComponentList from "../../components/StudyComponentList";
import { useApi } from "../../hooks/useApi";
import { SurveyConstructDetails } from "../../utils/generics.types";

const ConstructDetails: React.FC = () => {
	const { constructId } = useParams<{ constructId: string }>();
	const navigate = useNavigate()
	const { data: construct, loading, error, api } = useApi<SurveyConstructDetails>();

	const [showItemCreateForm, setShowItemCreateForm] = useState<boolean>(false);

	useEffect(() => {
		if (!constructId) {
			console.warn("Study ID is missing from URL. Redirecting to studies listings.")
			navigate('/studies', { replace: true });
			return;
		}
	}, [constructId, navigate]);

	const fetchConstructDetail = useCallback(async () => {
		if (constructId) {
			try {
				await api.get(`constructs/${constructId}/`);
			} catch (error) {
				console.error("Error fetching studies:", error);
			}
		}

	}, [constructId, api]);

	// useEffect(() => {
	// 	if (construct) {
	// 		setStudyDisplayName(construct.name);
	// 	}
	// }, [construct, setStudyDisplayName])

	useEffect(() => { fetchConstructDetail(); }, [fetchConstructDetail]);

	const lastItemOrderPosition = useMemo(() => {
		const lastOrderPosition = construct?.items?.[construct.items.length - 1]?.order_position;
		return (lastOrderPosition ?? 0) + 1;
	}, [construct?.items]);

	if (!constructId || !construct) {
		return (
			<p>Loading study...</p>
		)
	} else {
		console.log("Construct: ", construct);
	}
	return (
		<Container className="mt-4">
			<Row>
				<h3>Items</h3>
				<StudyComponentList
					studyComponents={construct.items}
					patchUrl={`constructs/${constructId}/items/order`}
					urlPathPrefix={`/constructs/${constructId}/items`}
					labelKey="text"
				/>
			</Row>
			{
				constructId &&
				<ConstructItemCreateForm
					constructId={constructId}
					orderPosition={lastItemOrderPosition}
					show={showItemCreateForm}
					showHideCallback={setShowItemCreateForm}
					onSuccess={fetchConstructDetail}
				/>
			}
			<Row>
				<Button onClick={() => setShowItemCreateForm(true)} >
					Add an item
				</Button>
			</Row>
			<Row className="mt-4">
				<h3>Scale Levels</h3>
				<ul style={{ listStyleType: "none", display: "flex" }}>
					{construct.scale_levels.map((scaleLevel) => (
						<li key={`sc_${scaleLevel.id}`}
							style={{
								width: "100px",
								textAlign: "center",
								marginRight: "10px",
								padding: "5px",
								border: "1px solid #ccc",
								borderRadius: "5px",
								backgroundColor: "#f8f9fa",
								alignItems: "center"
							}}>
							{scaleLevel.label}
						</li>
					))}
				</ul>
			</Row>
		</Container>
	)
}

export default ConstructDetails;