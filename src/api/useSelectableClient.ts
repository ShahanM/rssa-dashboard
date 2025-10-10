import type { ResourceClient, SelectableClientKey } from '../types/resourceClient.types';
import type { BaseResourceType } from '../types/sharedBase.types';
import { useApiClients } from './ApiContext';

export const useSelectableClient = (clientKey: SelectableClientKey) => {
    const { getResourceClient } = useApiClients();
    const client = getResourceClient(clientKey);

    if (client.clientType !== 'base') {
        throw new Error(`Client '${clientKey}' is not a valid non-dependent client.`);
    }

    return client as ResourceClient<BaseResourceType>;
};
