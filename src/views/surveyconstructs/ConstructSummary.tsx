import { useCallback, useEffect } from "react";
import { Table } from "react-bootstrap";
import { MetadataTableRow } from "../../components/MetadataTableRow";
import { useApi } from "../../hooks/useApi";

interface ConstructSummaryViewProps {
	constructId: string | undefined;
	authErrorCallback: (errorMessage: string) => void;
}

interface ConstructSummary {
	id: string;
	desc: string;
	construct_type: string;
	scale_name: string;
}

const ConstructSummaryView: React.FC<ConstructSummaryViewProps> = (
	{ constructId, authErrorCallback }
) => {
	const { data: construct, loading, error, api } = useApi<ConstructSummary>();

	const fetchConstructSummary = useCallback(async () => {
		if (constructId) {
			try {
				await api.get(`constructs/${constructId}/summary`);

			} catch (error) {
				console.error("Error fetching construct summary:", error);
			}
		}
	}, [constructId, api]);

	useEffect(() => { fetchConstructSummary(); }, [fetchConstructSummary]);

	if (loading) {
		return <div>Loading construct summary...</div>;
	}

	if (error) {
		return <div>Error loading construct summary.</div>;
	}

	if (!constructId || !construct) {
		return (
			<div>
				<p>Please select a construct to view the summary.</p>
			</div>
		);
	} else {
		console.log("Construct summary fetched:", construct);
	}

	return (
		<>
			<Table striped bordered>
				<tbody>
					<MetadataTableRow label={"Construct ID"} value={construct.id} />
					<MetadataTableRow label={"Description"} value={construct.desc} />
					<MetadataTableRow label={"Scale Type"} value={construct.construct_type} />
					<MetadataTableRow label={"Scale Name"} value={construct.scale_name} />
				</tbody>
			</Table>
		</>
	)

}

export default ConstructSummaryView;