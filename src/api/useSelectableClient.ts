import type { DependentResourceClient } from '../types/resourceClient.types';
import type { BaseResourceType } from '../types/sharedBase.types';
import { useApiClients, type ApiClients } from './ApiContext';

export type BaseClientKeys<T extends BaseResourceType> = {
    [K in keyof ApiClients]: ApiClients[K] extends DependentResourceClient<T> ? never : K;
}[keyof ApiClients];

export const useSelectableClient = (clientKey: BaseClientKeys<BaseResourceType>) => {
    const { getResourceClient } = useApiClients();
    return getResourceClient(clientKey);
};
