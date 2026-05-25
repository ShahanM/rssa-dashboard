import { useMemo } from 'react';
import { useApi } from '../hooks/useApi';
import {
    type ApiKey,
    type Page,
    type PageContent,
    type ParticipantAuditDetail,
    type PreShuffledMovieList,
    type Study,
    type StudyAuthorization,
    type StudyCondition,
    type StudyParticipant,
    type StudyStep,
    type User,
} from '../types/studyComponents.types';
import { type ConstructItem, type Scale, type ScaleLevel, type SurveyConstruct } from '../types/surveyComponents.types';
import { ApiContext } from './ApiContext';
import { createDependentResourceClient, createResourceClient } from './resourceClient';

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const { api } = useApi();

    const clients = useMemo(() => {
        if (!api) return null;

        return {
            studyClient: createResourceClient<Study>(api, 'study'),
            stepClient: createDependentResourceClient<StudyStep>(api, 'step', 'study'),
            pageClient: createDependentResourceClient<Page>(api, 'page', 'step'),
            conditionClient: createDependentResourceClient<StudyCondition>(api, 'condition', 'study'),
            constructClient: createResourceClient<SurveyConstruct>(api, 'construct'),
            itemClient: createDependentResourceClient<ConstructItem>(api, 'item', 'construct'),
            scaleClient: createResourceClient<Scale>(api, 'scale'),
            levelClient: createDependentResourceClient<ScaleLevel>(api, 'level', 'scale'),
            contentClient: createDependentResourceClient<PageContent>(api, 'content', 'page'),
            keyClient: createDependentResourceClient<ApiKey>(api, 'apikey', 'study'),
            authorizationClient: createDependentResourceClient<StudyAuthorization>(api, 'authorization', 'study'),
            localUserClient: createResourceClient<User>(api, 'local_user'),
            preShuffledMovieListClient: createResourceClient<PreShuffledMovieList>(api, 'preshuffled_movie_list'),
            participantClient: createDependentResourceClient<StudyParticipant>(api, 'participant', 'study'),
            participantAuditClient: createResourceClient<ParticipantAuditDetail>(api, 'participant_audit'),
        };
    }, [api]);

    if (!clients) {
        return null;
    }

    return <ApiContext.Provider value={clients}>{children}</ApiContext.Provider>;
};
