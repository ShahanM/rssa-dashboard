import React from 'react';
import { CopyToClipboardButton } from '../components/buttons/CopyToClipboardButton';
import ConditionStatsView from '../components/ConditionStatsView';
import StudyConditionCheckbox from '../components/resources/StudyConditionCheckbox';
import type { DashBoardResourceConfig } from '../types/resourceClient.types';
import UserCard from '../views/profile/UserCard';

export const resourceConfig: DashBoardResourceConfig = {
    study: {
        apiResourceTag: 'studies',
        resourceName: 'Study',
        viewTitle: 'Studies',
        editableFields: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'description', label: 'Description', wide: true, type: 'textarea' },
            {
                key: 'owner',
                label: 'Owner',
                render: (study) => (study.owner ? React.createElement(UserCard, { userId: study.owner }) : null),
            },
            {
                key: 'created_by',
                label: 'Created by',
                render: (study) =>
                    study.created_by ? React.createElement(UserCard, { userId: study.created_by }) : null,
            },
            {
                key: 'created_at',
                label: 'Date Created',
                formatFn: (dateString) => new Date(dateString as string).toLocaleDateString(),
            },
            {
                key: 'total_participants',
                label: 'Total Participants',
                formatFn: (total_participants) =>
                    total_participants !== undefined || total_participants !== 0 ? (total_participants as string) : '0',
                wide: true,
                optional: true,
            },
            {
                key: 'participants_by_condition',
                label: 'Condition stats',
                render: (study) =>
                    study.participants_by_condition
                        ? React.createElement(ConditionStatsView, { conditionStats: study.participants_by_condition })
                        : study.participants_by_condition,
                wide: true,
                optional: true,
            },
        ],
        formFields: [
            { name: 'name', label: 'Study Name', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: false },
        ],
        tableColumns: [
            { accessorKey: 'name', header: 'Study Name' },
            {
                accessorKey: 'created_at',
                header: 'Date Created',
                cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
            },
        ],
    },
    step: {
        apiResourceTag: 'steps',
        resourceName: 'Step',
        viewTitle: 'Study steps',
        editableFields: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
            {
                key: 'created_at',
                label: 'Date Created',
                formatFn: (dateString) => new Date(dateString as string).toLocaleDateString(),
            },
            {
                key: 'step_type',
                label: 'Type',
                type: 'select',
                options: [
                    { value: 'survey', label: 'Survey' },
                    { value: 'task', label: 'Task' },
                    { value: 'overview', label: 'Overview of study steps' },
                    { value: 'consent', label: 'Consent' },
                    { value: 'preference-elicitation', label: 'Preference elicitation' },
                    { value: 'instruction', label: 'Instruction/Information' },
                    { value: 'demographics', label: 'Demographics' },
                    { value: 'extras', label: 'Additional step e.g. - Feedback' },
                    { value: 'end', label: 'Final completion step' },
                ],
            },
            { key: 'path', label: 'Path', type: 'text' },
            { key: 'title', label: 'Title', type: 'text', wide: true },
            { key: 'instructions', label: 'Instruction', type: 'textarea', wide: true },
        ],
        formFields: [
            {
                name: 'step_type',
                label: 'Step type',
                type: 'select',
                options: [
                    { value: 'survey', label: 'Survey' },
                    { value: 'task', label: 'Task' },
                    { value: 'overview', label: 'Overview of study steps' },
                    { value: 'consent', label: 'Consent' },
                    { value: 'preference-elicitation', label: 'Preference elicitation' },
                    { value: 'instruction', label: 'Instruction/Information' },
                    { value: 'demographics', label: 'Demographics' },
                    { value: 'extras', label: 'Additional step e.g. - Feedback' },
                    { value: 'end', label: 'Final completion step' },
                ],
            },
            { name: 'name', label: 'Step Name', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: false },
            { name: 'path', label: 'Path', type: 'text', required: true },
        ],
        validators: {
            path: (client, parentId, excludeId) => (fieldName, value) => {
                return client.validateField(parentId, fieldName, value as string, excludeId);
            },
        },
    },
    page: {
        apiResourceTag: 'pages',
        resourceName: 'Page',
        viewTitle: 'Survey pages',
        editableFields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'id', label: 'ID' },
            { key: 'description', label: 'Description', type: 'textarea' },
            {
                key: 'created_at',
                label: 'Date Created',
                formatFn: (dateString) => new Date(dateString as string).toLocaleDateString(),
            },
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'instructions', label: 'Instruction', type: 'textarea', wide: true },
        ],
        formFields: [
            { name: 'page_type', label: 'Page type', type: 'static', required: true, value: 'survey' },
            { name: 'name', label: 'Page Name', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: false },
        ],
    },
    condition: {
        apiResourceTag: 'conditions',
        resourceName: 'Condition',
        viewTitle: 'Study conditions',
        editableFields: [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea', wide: true },
            {
                key: 'recommender_key',
                label: 'Recommender Key',
                type: 'select',
                wide: true,
                optionsEndpoint: 'conditions/recommender-keys',
                optionsValueKey: 'id',
                optionsLabelKey: 'name',
            },
            {
                key: 'view_link_key',
                label: 'View Link Key',
                type: 'text',
                wide: true,
            },
            { key: 'recommendation_count', label: 'Recommendation Count', type: 'number' },
        ],
        formFields: [
            { name: 'name', label: 'Condition Name', type: 'text', required: true },
            { name: 'view_link_key', label: 'View Link Key', type: 'text', required: false },
            { name: 'description', label: 'Description', type: 'textarea', required: false },
            {
                name: 'recommendation_count',
                label: 'Number of items in recommondation',
                type: 'number',
                required: true,
            },
        ],
        tableColumns: [
            {
                accessorKey: 'short_code',
                header: 'Identifier',
                cell: (info) => (info.getValue() as string).toLowerCase(),
            },
            {
                accessorKey: 'view_link_key',
                header: 'View Link',
                cell: (info) => (info.getValue() as string) || '-',
            },
            { accessorKey: 'name', header: 'Condition Name' },
            {
                id: 'include',
                header: 'Include',
                cell: ({ row }) => {
                    return React.createElement(StudyConditionCheckbox, {
                        conditionId: row.original.id,
                        initialEnabled: row.original.enabled || false,
                    });
                },
            },
        ],
    },
    content: {
        apiResourceTag: 'contents',
        resourceName: 'Page content',
        viewTitle: 'Page content',
        editableFields: [
            {
                key: 'preamble',
                label: 'Construct preamble',
                type: 'text',
                wide: true,
            },
            {
                key: 'survey_construct_id',
                label: 'Survey construct',
                type: 'select',
                required: true,
                optionsEndpoint: 'constructs',
                optionsValueKey: 'id',
                optionsLabelKey: 'name',
            },
            {
                key: 'survey_scale_id',
                label: 'Measurement scale',
                type: 'select',
                required: true,
                optionsEndpoint: 'scales',
                optionsValueKey: 'id',
                optionsLabelKey: 'name',
            },
        ],
        formFields: [
            {
                name: 'preamble',
                label: 'Construct preamble',
                type: 'text',
            },
            {
                name: 'survey_construct_id',
                label: 'Survey construct',
                type: 'modal-select',
                required: true,
                clientKey: 'constructClient',
                optionsEndpoint: 'constructs',
                optionsValueKey: 'id',
                optionsLabelKey: 'name',
            },
            {
                name: 'survey_scale_id',
                label: 'Measurement scale',
                type: 'modal-select',
                required: true,
                clientKey: 'scaleClient',
                optionsEndpoint: 'scales',
                optionsValueKey: 'id',
                optionsLabelKey: 'name',
            },
        ],
    },
    apikey: {
        apiResourceTag: 'apikeys',
        resourceName: 'ApiKey',
        viewTitle: 'Api Keys',
        editableFields: [],
        formFields: [{ name: 'description', label: 'Description', type: 'textarea', required: true }],
        tableColumns: [
            {
                id: 'copy-id-action',
                cell: ({ row }) => {
                    return React.createElement(CopyToClipboardButton, {
                        textToCopy: `VITE_RSSA_API_KEY_ID=${row.original.id}\nVITE_RSSA_API_KEY_SECRET=${row.original.display_name}`,
                    });
                },
            },
            { accessorKey: 'id', header: 'Key ID' },
            { accessorKey: 'display_name', header: 'Key Secret' },
            { accessorKey: 'display_info', header: 'Description' },
        ],
    },
    construct: {
        apiResourceTag: 'constructs',
        resourceName: 'Survey construct',
        viewTitle: 'Survey constructs',
        editableFields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'id', label: 'ID' },
            { key: 'description', label: 'Description', type: 'textarea', wide: true },
        ],
        formFields: [
            { name: 'name', label: 'Survey construct Name', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', required: false },
        ],
        tableColumns: [{ accessorKey: 'name', header: 'Construct Name' }],
    },
    scale: {
        apiResourceTag: 'scales',
        resourceName: 'Scales',
        viewTitle: 'Measurement scales',
        editableFields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'id', label: 'ID' },
            { key: 'description', label: 'Description', wide: true, type: 'textarea' },
        ],
        formFields: [
            {
                name: 'name',
                label: 'Scale Name',
                type: 'text',
                required: false,
                placeholder: 'Enter a scale name [optional]',
            },
            {
                name: 'description',
                label: 'Description',
                type: 'textarea',
                required: false,
                placeholder:
                    'Enter a description for the scale [optional].' +
                    'The name and description can help us mitigate duplicates.',
            },
        ],
        tableColumns: [{ accessorKey: 'name', header: 'Scale Name' }],
    },
    item: {
        apiResourceTag: 'items',
        resourceName: 'Construct item',
        viewTitle: 'Construct items',
        editableFields: [{ key: 'text', label: 'Item Text', type: 'textarea', wide: true, required: true }],
        formFields: [
            {
                name: 'survey_construct_id',
                label: 'Construct ID',
                type: 'static',
                required: true,
            },
            { name: 'text', label: 'Item Text', type: 'textarea', required: true },
        ],
    },
    level: {
        apiResourceTag: 'levels',
        resourceName: 'Scale level',
        viewTitle: 'Scale levels',
        editableFields: [
            { key: 'label', label: 'Label Text', type: 'text', required: true },
            { key: 'value', label: 'Value', type: 'text', required: true },
        ],
        formFields: [
            {
                name: 'survey_scale_id',
                label: 'Scale ID',
                type: 'static',
                required: true,
            },
            {
                name: 'label',
                label: 'Label Text',
                type: 'text',
                required: true,
            },
            {
                name: 'value',
                label: 'Value',
                type: 'text', // FIXME: this should allow numbers only fields
                required: true,
            },
        ],
    },
};
