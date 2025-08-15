import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useApi } from "../../hooks/useApi";

interface ResourceViewerProps<T, K> {
	apiResourceTag: string;
	resourceId?: string;
	summary?: boolean;
	resourceKey: keyof K;
	onResourceLoaded?: (data: T) => void;
	children: (data: T) => React.ReactNode;
}

const ResourceViewer = <
	T, K
>({
	apiResourceTag,
	resourceId,
	summary = false,
	resourceKey,
	onResourceLoaded,
	children,
}: ResourceViewerProps<T, K>) => {

	const { api } = useApi<T>();

	const { data: resourceObject, isLoading, error } = useQuery({
		queryKey: [apiResourceTag, resourceId, summary],
		queryFn: () => api.get(`${apiResourceTag}/${resourceId}${summary ? '/summary' : ''}`),
		enabled: !!api && !!resourceId
	});

	useEffect(() => {
		if (resourceObject && onResourceLoaded) {
			onResourceLoaded(resourceObject);
		}
	}, [resourceObject, onResourceLoaded]);

	if (isLoading) {
		return <p>Loading {apiResourceTag} details...</p>;
	}

	if (!resourceId) {
		return <p>Please select a study to view the summary.</p>
	}

	if (error) {
		return <p>Error: {error.message}</p>
	}

	if (!resourceObject) {
		return <p>No details found for the selected {JSON.stringify(resourceKey)}</p>
	}

	return <>{children(resourceObject)}</>;
}

export default ResourceViewer;