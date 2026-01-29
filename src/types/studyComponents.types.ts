import type { BaseResourceType, OrderedComponent } from './sharedBase.types';
import type { ConstructItem, ScaleLevel } from './surveyComponents.types';

export interface StudyCondition extends BaseResourceType {
    resource_type: 'condition';

    name?: string;
    description?: string;
    recommender_key?: string;
    recommendation_count?: number;
    enabled?: boolean;
    short_code?: string;
    view_link_key?: string;
}

export type ConditionStats = {
    condition_id: string;
    condition_name: string;
    participant_count: number;
};

export interface Study extends BaseResourceType {
    resource_type: 'study';

    name?: string;
    description?: string;

    // Nullable properties FIXME: these will become non-nullable after migration
    owner?: string;
    created_by?: string;

    // Initially null, and also exist only in StudyDetail
    steps?: StudyStep[];
    conditions?: StudyCondition[];

    // Only exists in StudySummary
    total_participants?: number;
    participants_by_condition?: ConditionStats[];
}

export interface Page extends OrderedComponent {
    resource_type: 'page';

    name?: string;
    description?: string;

    study_id: string;
    step_id: string;

    page_type?: string;

    title?: string;
    instructions?: string;

    last_page: boolean;
}

export interface StudyStep extends OrderedComponent {
    resource_type: 'step';

    name?: string;
    description?: string;

    study_id: string;

    step_type?: string;
    path?: string;

    title?: string;
    instructions?: string;

    pages?: Page[];
}

export interface PageContent extends OrderedComponent {
    resource_type: 'content';
    /*
     * This is only used to link constructs and scales to a survey page. This
     * interface represents the schema of a join table that connects construct, page, and scale.
     */

    page_id: string;
    construct_id: string;
    scale_id: string;

    // Formatting match for form fields
    preamble?: string;
    survey_construct_id?: string;
    survey_scale_id?: string;

    items?: ConstructItem[];
    scale_name?: string;
    scale_levels?: ScaleLevel[];
}

export interface SurveyPage extends Page {
    /*
     * Special kind of page that display survey content. Currently this is the
     * only kind of page supported.
     */
    page_contents: PageContent[];
}

export type SortDirectionOption = 'asc' | 'desc' | null;
export type PaginatedResourceQuery = {
    pageIndex?: number;
    pageSize?: number;
    sortBy?: string | null;
    sortDir?: SortDirectionOption;
    search?: string;
};

export type PaginatedResourceList<T> = {
    rows: T[];
    page_count: number;
};

export interface ApiKey extends BaseResourceType {
    resource_type: 'apikey';

    study_id: string;
    user_id: string;
    is_active: boolean;
}

export interface StudyAuthorization extends BaseResourceType {
    resource_type: 'authorization';

    study_id: string;
    user_id: string;
    role: string;
}
