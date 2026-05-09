import type {
    ApiKey,
    Page,
    PageContent,
    PreShuffledMovieList,
    Study,
    StudyAuthorization,
    StudyCondition,
    StudyStep,
    User,
} from './studyComponents.types';
import type { ConstructItem, Scale, ScaleLevel, SurveyConstruct } from './surveyComponents.types';

export type StudyComponentType =
    | 'study'
    | 'step'
    | 'page'
    | 'condition'
    | 'content'
    | 'apikey'
    | 'authorization'
    | 'local_user'
    | 'preshuffled_movie_list';
export type SurveyConstructType = 'construct' | 'item' | 'scale' | 'level';

export interface ResourceTypeRegistry {
    study: Study;
    step: StudyStep;
    page: Page;
    condition: StudyCondition;
    content: PageContent;
    apikey: ApiKey;
    construct: SurveyConstruct;
    scale: Scale;
    item: ConstructItem;
    level: ScaleLevel;
    authorization: StudyAuthorization;
    local_user: User;
    preshuffled_movie_list: PreShuffledMovieList;
}

export type ResourceUnionType = keyof ResourceTypeRegistry;

export type BaseResourceType = {
    resource_type: ResourceUnionType;

    id: string;
    display_name: string;
    display_info: string;

    created_at: string;
    updated_at: string;
};

export interface OrderedComponent extends BaseResourceType {
    order_position: number;
    next?: string | null;
}
