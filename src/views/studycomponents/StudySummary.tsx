import { useAuth0 } from "@auth0/auth0-react";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, ListGroup, Row, Table } from "react-bootstrap";
import { getStudySummary } from "../../api/endpoints";
import { isAuthError } from "../../utils/errors";
import { ConditionCount, StudySummary } from "../../utils/generics.types";
import { Link } from "react-router-dom";
import { MetadataTableRow } from "../../components/MetadataTableRow";


interface StudySummaryViewProps {
	studyId: string | undefined;
	authErrorCallback: (errorMessage: string) => void;
}



const StudySummaryView: React.FC<StudySummaryViewProps> = (
	{ studyId, authErrorCallback }
) => {
	const [study, setStudy] = useState<StudySummary>();
	const { getAccessTokenSilently } = useAuth0();

	const fetchStudySummary = useCallback(async () => {
		if (studyId) {
			try {
				const token = await getAccessTokenSilently();
				const response = await getStudySummary(studyId, token);
				const studySummary: StudySummary = {
					...response,
					date_created: new Date(response.date_created)
				}
				setStudy(studySummary);
				console.log("Study summary fetched:", response);
			} catch (error) {
				if (isAuthError(error)) {
					authErrorCallback((error as Error).message);
				} else {
					console.error("Error fetching studies:", error);

				}
			}
		}

	}, [studyId, getAccessTokenSilently, authErrorCallback]);

	useEffect(() => {
		fetchStudySummary();
	}, [fetchStudySummary]);

	if (!studyId || !study) {
		return (
			<Container className="study-summary">
				<p>Please select a study to view the summary.</p>
			</Container>
		);
	}

	return (
		<>
			<Table striped bordered>
				<tbody>
					<MetadataTableRow label={"Study ID"} value={study.id} />
					<MetadataTableRow label={"Description"} value={study.description} />
					<MetadataTableRow label={"Date created"} value={study.date_created.toLocaleDateString()} />
				</tbody>
			</Table>
			<h3>Particpant Summary</h3>
			<p><strong>Total participants:</strong> {study.total_participants}</p>
			<ParticipantByConditionView conditionGroups={study.participants_by_condition} />
		</>
	);
}



const ParticipantByConditionView: React.FC<{ conditionGroups: ConditionCount[] }> = (
	{ conditionGroups }
) => {
	return (
		<Table striped bordered hover>
			<tbody>
				{conditionGroups.map((conditionCount) =>
					<MetadataTableRow
						key={conditionCount.condition_id}
						label={conditionCount.condition_name}
						value={conditionCount.participant_count} />
				)}
			</tbody>
		</Table>
	)
}

export default StudySummaryView;