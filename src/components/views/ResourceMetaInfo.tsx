import clsx from "clsx";

type MetaInfo = {
	label: string;
	value: string | React.ReactNode | undefined | null;
	wide?: boolean;
}

interface ResourceMetaInfoProps {
	metaInfo: MetaInfo[];
}

const ResourceMetaInfo: React.FC<ResourceMetaInfoProps> = ({
	metaInfo
}) => {
	return (
		<div className="bg-white p-6 rounded-lg shadow mb-3">
			<dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
				{metaInfo.map((info) => {
					return (
						<div key={`meta-${info.label}`} className={clsx(info.wide ? "sm:col-span-2" : "sm:col-span-1")}>
							<dt className="text-sm font-medium text-gray-500">{info.label}</dt>
							<dd className="mt-1 text-sm text-gray-900 font-mono">
								{info.value ? info.value : "[NULL]"}
							</dd>
						</div>
					)
				})}
			</dl>
		</div>
	);
}

export default ResourceMetaInfo;