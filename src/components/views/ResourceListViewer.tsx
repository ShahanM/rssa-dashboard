import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";

interface ResourceListViewerProps<T> {
	apiResourceTag: string;
	children: (data: T[]) => React.ReactNode;
}

const ResourceListViewer = <T,>({
	apiResourceTag,
	children
}: ResourceListViewerProps<T>) => {
	const { api } = useApi<T[]>();
	const { data: resourceList, isLoading, error } = useQuery({
		queryKey: [apiResourceTag],
		queryFn: async () => api.get(`${apiResourceTag}/`),
		enabled: !!api,
	})
	if (isLoading) {
		return <p>Loading {apiResourceTag}...</p>;
	}
	if (error) {
		return <p>Error: {error.message}</p>;
	}
	if (!resourceList || resourceList.length === 0) {
		return <p>No {apiResourceTag} found.</p>;
	}

	return <>{children(resourceList)}</>;

}

export default ResourceListViewer;