import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Row, Table } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MetadataTableRow } from '../../components/MetadataTableRow';
import PageCreateForm from '../../components/forms/PageCreateForm';
import StudyComponentList from '../../components/StudyComponentList';
import { useStudyNavigation } from '../../hooks/StudyNavigationContext';
import { useApi } from '../../hooks/useApi';
import { StudyStep } from '../../utils/generics.types';

const StepDetails: React.FC = () => {
	const { studyId, stepId } = useParams<{ studyId: string; stepId: string }>();
	const navigate = useNavigate();
	const { setStepDisplayName } = useStudyNavigation();
	const [loadingStepData, setLoadingStepData] = useState(true);
	const { data: step, loading, error, api } = useApi<StudyStep>();

	const [showPageCreateForm, setShowPageCreateForm] = useState<boolean>(false);

	useEffect(() => {
		if (!studyId) {
			console.warn("Study ID is missing from URL. Redirecting to studies listings.")
			navigate('/studies', { replace: true });
			return;
		}

		if (!stepId) {
			console.warn("Step ID is missing from URL. Redirecting back to study page.");
			navigate(`/studies/${studyId}`, { replace: true });
			return;
		}
		setLoadingStepData(true);

	}, [studyId, stepId, navigate]);

	const fetchStudyStep = useCallback(async () => {
		if (stepId) {
			try {
				await api.get(`steps/${stepId}`);
			} catch (error) {
				console.log("Error fetching study steps. ", error);
			}
		}
	}, [stepId, api]);

	useEffect(() => {
		if (step && step.name) {
			setStepDisplayName(step.name)
			console.log("Step", step);
		}
	}, [step, setStepDisplayName])

	useEffect(() => {
		fetchStudyStep();
	}, [fetchStudyStep]);

	const lastPageOrderPos = useMemo(() => {
		const lastOrderPosition = step?.pages?.[step.pages.length - 1]?.order_position;
		return (lastOrderPosition ?? 0) + 1;
	}, [step?.pages]);

	if (!step) {
		return (
			<h2>Loading step data</h2>
		)
	}
	if (!stepId || !studyId) {
		return <p>Something went wrong</p>;
	}

	return (
		<>
			<Row>
				<div className="container-header-content">
					<Link to={`/studies/${studyId}`}><Button>&lt;</Button></Link>
				</div>
				<div className="container-header-content">
					<h2>{step.name}</h2>
				</div>
			</Row>
			<Table striped bordered hover>
				<tbody>
					<MetadataTableRow label={"Step ID"} value={step.id} />
					<MetadataTableRow label={"Description"} value={step.description} />
					<MetadataTableRow label={"Date created"} value={step.date_created} />
					<MetadataTableRow label={"Order position"} value={step.order_position} />
				</tbody>
			</Table>
			<Row>
				{step.pages &&
					<StudyComponentList
						studyComponents={step.pages}
						urlPathPrefix={`/studies/${studyId}/steps/${stepId}/pages`}
						labelKey={'name'}
					/>
				}
			</Row>
			{
				studyId && stepId &&
				<PageCreateForm
					studyId={studyId}
					stepId={stepId}
					orderPosition={lastPageOrderPos}
					show={showPageCreateForm}
					showHideCallback={setShowPageCreateForm}
					onSuccess={fetchStudyStep}
				/>
			}
			<Row>
				<Button onClick={() => setShowPageCreateForm(true)} >
					Add a page
				</Button>
			</Row>
		</>
	)
}

export default StepDetails;