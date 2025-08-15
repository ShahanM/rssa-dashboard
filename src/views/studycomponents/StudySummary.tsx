import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";
import ResourceMetaInfo from "../../components/views/ResourceMetaInfo";
import ResourceViewer from "../../components/views/ResourceViewer";
import { useAppSelector } from "../../store/hooks";
import type { StudySummary } from "../../utils/generics.types";
import UserCard from "../profile/UserCard";

const StudySummaryView: React.FC = () => {
	const selectedObject = useAppSelector((state) => state.studySelection["study"]);

	return (
		<div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
			<ResourceViewer
				apiResourceTag="studies"
				resourceId={selectedObject?.id}
				resourceKey="study"
				summary
			>
				{(study: StudySummary) => (
					<>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold mb-4">{study.name}</h3>
							<Link to={`/studies/${study.id}`}>
								<button
									className={clsx(
										"btn btn-primary rounded bg-yellow-500",
										"hover:bg-yellow-600 text-purple px-4 py-2",
										"cursor-pointer",
									)}
								>
									<span>Show details &gt;</span>
								</button>
							</Link>
						</div>
						<ResourceMetaInfo metaInfo={[
							{ label: 'Name', value: study.name },
							{ label: 'ID', value: study.id },
							{
								label: 'Owner', value: study.owner ?
									<UserCard userId={study.owner} />
									: study.owner
							},
							{
								label: 'Created by',
								value: study.created_by ?
									<UserCard userId={study.created_by} />
									: study.created_by
							},
							{ label: 'Date Created', value: new Date(study.date_created).toLocaleDateString() },
							{ label: 'Description', value: study.description, wide: true },
						]} />
						<h4 className="text-xl font-bold mb-4">Participant Summary</h4>
						<ResourceMetaInfo metaInfo={[
							{ label: 'Total Participants', value: String(study.total_participants), wide: true },
							...(study.participants_by_condition.length > 0
								? study.participants_by_condition.map((conditionCount) => ({
									label: conditionCount.condition_name,
									value: String(conditionCount.participant_count)
								}))
								: [{ label: 'No conditions', value: 'N/A' }])
						]} />
					</>
				)}

			</ResourceViewer>
		</div>
	);
}

export default StudySummaryView;