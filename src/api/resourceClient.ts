import { resourceConfig } from '../config/resourceConfig';
import type { ApiClient } from '../hooks/useApi';
import type {
    DependentResourceClient,
    ResourceClient,
    ResourceConfig,
    ServerGeneratedKeys,
} from '../types/resourceClient.types';
import type { BaseResourceType, ResourceUnionType } from '../types/sharedBase.types';
import type { PaginatedResourceList, PaginatedResourceQuery } from '../types/studyComponents.types';

export const createResourceClient = <T extends BaseResourceType>(
    api: ApiClient,
    resourceType: ResourceUnionType
): ResourceClient<T> => {
    const config = resourceConfig[resourceType] as unknown as ResourceConfig<T>;
    const { apiResourceTag } = config;

    const queryKeys = {
        all: () => [apiResourceTag] as const,
        lists: () => [apiResourceTag, 'list'] as const,
        active: (id: string) => [apiResourceTag, id] as const,
        detail: (id: string) => [apiResourceTag, id, 'detail'] as const,
        summary: (id: string) => [apiResourceTag, id, 'summary'] as const,
    };

    const getOne = (id: string) => api.get<T>(`${apiResourceTag}/${id}`);

    const getPaginated = (queryParams: PaginatedResourceQuery) => {
        const params = new URLSearchParams({
            page_index: String(queryParams.pageIndex),
            page_size: String(queryParams.pageSize),
        });

        if (queryParams.sortBy) params.append('sort_by', queryParams.sortBy);
        if (queryParams.sortDir) params.append('sort_dir', queryParams.sortDir);
        if (queryParams.search) params.append('search', queryParams.search);

        return api.get<PaginatedResourceList<T>>(`${apiResourceTag}/?${params.toString()}`);
    };

    const getOnePreview = (id: string) => api.get<T>(`${apiResourceTag}/${id}/summary`);
    const update = (id: string, data: Partial<T>) => api.patch<T>(`${apiResourceTag}/${id}`, data);
    const create = (data: Omit<T, ServerGeneratedKeys>) => api.post<T>(`${apiResourceTag}/`, data);
    const del = (id: string) => api.del(`${apiResourceTag}/${id}`);

    return {
        clientType: 'base' as const,
        config,
        queryKeys,
        getOne,
        getPaginated,
        getOnePreview,
        update,
        create,
        del,
    };
};

export const createDependentResourceClient = <T extends BaseResourceType>(
    api: ApiClient,
    resourceType: ResourceUnionType,
    parentResourceType: ResourceUnionType
): DependentResourceClient<T> => {
    const { apiResourceTag: parentApiResourceTag } = resourceConfig[parentResourceType];

    const baseResourceClient = createResourceClient<T>(api, resourceType);
    const config = baseResourceClient.config;
    const { apiResourceTag } = config;

    const getList = (parentId: string) => api.get<T[]>(`${parentApiResourceTag}/${parentId}/${apiResourceTag}`);
    const reorder = async (parentId: string, data: { id: string; order_position: number }[]) => {
        await api.patch<void>(`${parentApiResourceTag}/${parentId}/${apiResourceTag}/reorder`, data);
    };
    const create = (parentId: string, data: Omit<T, ServerGeneratedKeys>) => {
        return api.post<T>(`${parentApiResourceTag}/${parentId}/${apiResourceTag}`, data);
    };
    const validateField = (parentId: string, fieldName: string, value: string, excludeId?: string) => {
        return api.get<void>(`${parentApiResourceTag}/${parentId}/${apiResourceTag}/validate`, {
            params: {
                [fieldName]: value,
                ...(excludeId && { exclude_id: excludeId }),
            },
        });
    };

    return {
        ...baseResourceClient,
        clientType: 'dependent' as const,
        create,
        parentResourceType,
        getList,
        reorder,
        validateField,
    };
};
