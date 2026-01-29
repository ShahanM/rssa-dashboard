export type StudyComponentType = 'study' | 'step' | 'page' | 'condition' | 'content' | 'apikey' | 'authorization';
export type SurveyConstructType = 'construct' | 'item' | 'scale' | 'level';

export type ResourceUnionType = StudyComponentType | SurveyConstructType;

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
