import type { SurveyResourceConfig } from '../../types/resourceClient.types';

export const surveyConfig: SurveyResourceConfig = {
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
