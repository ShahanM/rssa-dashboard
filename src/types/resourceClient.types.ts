import type { ColumnDef } from '@tanstack/react-table';
import type { EditableField, FieldValidator, FormField, ValidatorFactory } from '../components/forms/forms.typs';
import type { BaseResourceType, ResourceTypeRegistry, ResourceUnionType } from './sharedBase.types';
import type { PaginatedResourceList, PaginatedResourceQuery } from './studyComponents.types';

export interface ResourceConfig<T extends BaseResourceType> {
    apiResourceTag: string;
    resourceName: string;
    viewTitle: string;
    formFields: FormField[];
    editableFields: EditableField<T>[];
    tableColumns?: ColumnDef<T>[];
    validators?: {
        [fieldName: string]: ValidatorFactory<T>;
    };
}

export interface BasicResourceConfig {
    apiResourceTag: string;
    formFields: FormField[];
}

export type DashboardResourceConfig = {
    [K in keyof ResourceTypeRegistry]: ResourceConfig<ResourceTypeRegistry[K]>;
};
export type StudyResourceConfig = Pick<
    DashboardResourceConfig,
    'study' | 'step' | 'condition' | 'preshuffled_movie_list'
>;

export type SurveyResourceConfig = Pick<
    DashboardResourceConfig,
    'page' | 'content' | 'construct' | 'scale' | 'item' | 'level'
>;

export type SystemResourceConfig = Pick<DashboardResourceConfig, 'apikey' | 'authorization' | 'local_user'>;

export type ParticipantDataConfig = Pick<DashboardResourceConfig, 'participant' | 'participant_audit'>;

export type ServerGeneratedKeys = 'id' | 'date_created' | 'resource_type';

export function isDependentClient<T extends BaseResourceType>(
    client: ResourceClient<T> | DependentResourceClient<T>
): client is DependentResourceClient<T> {
    return 'parentResourceType' in client;
}

export type SelectableClientKey = 'studyClient' | 'constructClient' | 'scaleClient';

export interface ResourceClient<T extends BaseResourceType> {
    clientType: 'base';
    config: ResourceConfig<T>;
    queryKeys: {
        all: () => readonly [string];
        lists: () => readonly [string, 'list'];
        active: (id: string) => readonly [string, string];
        detail: (id: string) => readonly [string, string, 'detail'];
        summary: (id: string) => readonly [string, string, 'summary'];
    };
    getOne: (id: string) => Promise<T | null>;
    getPaginated: (
        queryParams: PaginatedResourceQuery,
        customPath?: string
    ) => Promise<PaginatedResourceList<T> | null>;
    update: (id: string, data: Partial<T>) => Promise<T | null>;
    create: (data: Omit<T, ServerGeneratedKeys>) => Promise<T | null>;
    del: (id: string) => Promise<unknown>;
}
export interface DependentResourceClient<T extends BaseResourceType> extends Omit<
    ResourceClient<T>,
    'create' | 'clientType'
> {
    clientType: 'dependent';
    parentResourceType: ResourceUnionType;
    create: (parentId: string, data: Omit<T, ServerGeneratedKeys>) => Promise<T | null>;
    getList: (parentId: string) => Promise<T[] | null>;
    reorder: (parentId: string, data: { id: string; order_position: number }[]) => Promise<void>;
    validateField: (parentId: string, fieldName: string, value: string, excludeId?: string) => void;
}

export const createValidators = <T extends BaseResourceType>(
    client: DependentResourceClient<T>,
    parentId: string
): Record<string, FieldValidator> => {
    const activeValidators: Record<string, FieldValidator> = {};
    const validatorsConfig = client.config.validators;

    if (!validatorsConfig) {
        return activeValidators;
    }

    for (const fieldName in validatorsConfig) {
        const validatorFactory = validatorsConfig[fieldName];
        if (validatorFactory) {
            activeValidators[fieldName] = validatorFactory(client, parentId);
        }
    }
    return activeValidators;
};
