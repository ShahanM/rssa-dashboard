import { useQuery, type QueryKey } from '@tanstack/react-query';
import { useEffect } from 'react';

interface ResourceViewerProps<T> {
    queryKey: QueryKey;
    queryFn: () => Promise<T | null>;
    resourceName: string;
    onResourceLoaded?: (data: T) => void;
    children: (data: T) => React.ReactNode;
}

const ResourceViewer = <T,>({
    queryKey,
    queryFn,
    resourceName,
    onResourceLoaded,
    children,
}: ResourceViewerProps<T>) => {
    const {
        data: resourceObject,
        isLoading,
        error,
    } = useQuery({
        queryKey,
        queryFn,
        retry: 0,
        retryDelay: (failureCount) => {
            if (failureCount === 0) return 5000;
            return Math.min(1000 * 2 ** failureCount, 30000);
        },
        enabled: !!queryFn,
    });

    useEffect(() => {
        if (resourceObject && onResourceLoaded) onResourceLoaded(resourceObject);
    }, [resourceObject, onResourceLoaded]);

    if (isLoading) return <p>Loading {resourceName} details...</p>;
    if (!resourceObject) return <p>No details found for the select {resourceName}.</p>;
    if (error) return <p>Error: {error.message}</p>;

    return <>{children(resourceObject)}</>;
};

export default ResourceViewer;
