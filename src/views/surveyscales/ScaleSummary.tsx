import clsx from "clsx";
import { Link } from "react-router-dom";
import ResourceMetaInfo from "../../components/views/ResourceMetaInfo";
import ResourceViewer from "../../components/views/ResourceViewer";
import { useAppSelector } from "../../store/hooks";


interface ScaleSummary {
	id: string;
	name: string;
	description: string;
	created_by: string;
	date_created: string;
}

const ScaleSummaryView: React.FC = () => {
	const selectedObject = useAppSelector((state) => state.scaleSelection["scale"]);

	return (
		<div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
			<ResourceViewer
				apiResourceTag="construct-scales"
				resourceId={selectedObject?.id}
				resourceKey="scale"
				summary
			>
				{(scale: ScaleSummary) => (
					console.log("Scale", scale),
					<>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold mb-4">{scale.name}</h3>
							<Link to={`/scales/${scale.id}`}>
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
							{ label: 'Name', value: scale.name },
							{ label: 'ID', value: scale.id },
							{ label: 'Created at', value: new Date(scale.date_created).toLocaleDateString() }
						]} />
					</>
				)}

			</ResourceViewer>
		</div>
	)

}

export default ScaleSummaryView;