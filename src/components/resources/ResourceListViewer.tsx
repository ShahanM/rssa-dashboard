import { useQuery, type QueryKey } from '@tanstack/react-query';

interface ResourceListViewerProps<T> {
    apiResourceTag: string;
    queryKey: QueryKey;
    queryFn: () => Promise<T[] | null>;
    children: (data: T[]) => React.ReactNode;
}

const ResourceListViewer = <T,>({ apiResourceTag, queryKey, queryFn, children }: ResourceListViewerProps<T>) => {
    const {
        data: resourceList,
        isLoading,
        error,
    } = useQuery({
        queryKey,
        queryFn,
        enabled: !!queryFn,
    });
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
};

export default ResourceListViewer;
