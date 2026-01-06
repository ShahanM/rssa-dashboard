import { createContext, useContext } from 'react';
import type { ApiKey, Page, PageContent, Study, StudyCondition, StudyStep } from '../types/studyComponents.types';
import type { ConstructItem, Scale, ScaleLevel, SurveyConstruct } from '../types/surveyComponents.types';
import type { createDependentResourceClient, createResourceClient } from './resourceClient';
import type { ResourceClient } from '../types/resourceClient.types';

export interface ApiClients {
    studyClient: ReturnType<typeof createResourceClient<Study>>;
    stepClient: ReturnType<typeof createDependentResourceClient<StudyStep>>;
    pageClient: ReturnType<typeof createDependentResourceClient<Page>>;
    conditionClient: ReturnType<typeof createDependentResourceClient<StudyCondition>>;
    constructClient: ReturnType<typeof createResourceClient<SurveyConstruct>>;
    itemClient: ReturnType<typeof createDependentResourceClient<ConstructItem>>;
    scaleClient: ReturnType<typeof createResourceClient<Scale>>;
    levelClient: ReturnType<typeof createDependentResourceClient<ScaleLevel>>;
    contentClient: ReturnType<typeof createDependentResourceClient<PageContent>>;
    keyClient: ReturnType<typeof createDependentResourceClient<ApiKey>>;
}

export const ApiContext = createContext<ApiClients | null>(null);

export const useApiClients = () => {
    const clients = useContext(ApiContext);
    if (!clients) {
        throw new Error('useApiClients must be used within an ApiProvider');
    }

    function getResourceClient<K extends keyof ApiClients>(key: K): ApiClients[K];
    function getResourceClient(key: 'studyClient'): ResourceClient<Study>;
    function getResourceClient(key: 'constructClient'): ResourceClient<SurveyConstruct>;
    function getResourceClient(key: 'scaleClient'): ResourceClient<Scale>;

    function getResourceClient(key: keyof ApiClients) {
        if (clients) return clients[key];
    }

    return { ...clients, getResourceClient };
};
