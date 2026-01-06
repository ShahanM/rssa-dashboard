import type { BaseResourceType, OrderedComponent } from './sharedBase.types';

export interface SurveyConstruct extends BaseResourceType {
    resource_type: 'construct';

    name: string;
    description: string;

    survey_items: ConstructItem[] | null;
}

export interface ConstructItem extends OrderedComponent {
    resource_type: 'item';

    text: string;
}

export interface Scale extends BaseResourceType {
    resource_type: 'scale';
    name: string;
    description: string;
    created_by: string | null;
    date_create: string;
}

export interface ScaleLevel extends OrderedComponent {
    resource_type: 'level';
    survey_scale_id: string;

    label: string;
    value: number;
}
