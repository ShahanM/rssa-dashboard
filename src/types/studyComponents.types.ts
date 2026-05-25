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
    authorized_test_code?: string;
}

export type ConditionStats = {
    study_condition_id: string;
    study_condition_name: string;
    participant_count: number;
};

export interface Study extends BaseResourceType {
    resource_type: 'study';

    name?: string;
    description?: string;

    completion_code?: string;
    redirect_url?: string;

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
    isVerified?: boolean;
};

export type PaginatedResourceList<T> = {
    data: T[];
    page_count: number;
    total: number;
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

export interface User extends BaseResourceType {
    resource_type: 'local_user';
    email: string;
    desc?: string;
    auth0_sub?: string;
    picture?: string;
}

export interface PreShuffledMovieList extends BaseResourceType {
    id: string;
    subset_desc: string;
    seed: string;

    // NOTE: the strategy, other than Random, are applied to the movielens_rate_count field.
    // We can make this a selectable field at some point.
    strategy: 'A-Res' | 'Stratified Chunking' | 'Random';

    year_min?: number;
    year_max?: number;
    genre?: number;

    min_rating_count: number;

    exclude_no_emotions: boolean;
    exclude_no_recommendations: boolean;
}

export interface StudyAttentionCheckMinimal {
    id: string;
    expected_survey_scale_level_id: string;
}

export interface ParticipantAttentionCheckResponseAudit {
    id: string;
    study_attention_check_id: string;
    responded_survey_scale_level_id: string | null;
    study_attention_check: StudyAttentionCheckMinimal;
    passed_attention: boolean;
}

export interface ParticipantSourceMeta {
    PROLIFIC_PID?: string;
    STUDY_ID?: string;
    SESSION_ID?: string;
    [key: string]: unknown;
}

export interface StudyParticipant extends BaseResourceType {
    resource_type: 'participant';

    current_status: string;

    attention_check_responses: ParticipantAttentionCheckResponseAudit[];
    all_attention_checks_passed: boolean;
    is_verified: boolean;
    discarded: boolean;
    source_meta: ParticipantSourceMeta;
}

export interface FreeformResponse {
    id: string;
    context_tag: string;
    response_text: string;
}

export interface ActivityResponse {
    id: string;
    context_tag: string;
    payload_json: JSON;
}

export interface ParticipantAuditDetail extends BaseResourceType {
    resource_type: 'participant_audit';
    study_id: string;
    study_condition: StudyCondition;
    attention_check_responses: ParticipantAttentionCheckResponseAudit[];
    all_attention_checks_passed: boolean;

    freeform_responses: FreeformResponse[];
    activity_responses: ActivityResponse[];

    source_meta: ParticipantSourceMeta;
    current_status: string;
    is_verified: boolean;
    discarded: boolean;
}
