import React from 'react';
import ConditionStatsView from '../../components/ConditionStatsView';
import ResourceToggle from '../../components/ResourceToggle';
import type { StudyResourceConfig } from '../../types/resourceClient.types';

export const studyConfig: StudyResourceConfig = {
    study: {
        apiResourceTag: 'studies',
        resourceName: 'Study',
        viewTitle: 'Studies',
        editableFields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'id', label: 'ID' },
            {
                key: 'created_at',
                label: 'Date Created',
                formatFn: (dateString) => new Date(dateString as string).toLocaleDateString(),
            },
            {
                key: 'updated_at',
                label: 'Last Modified',
                formatFn: (dateString) => new Date(dateString as string).toLocaleDateString(),
            },
            { key: 'description', label: 'Description', wide: true, type: 'textarea' },
            { key: 'completion_code', label: 'Completion Code', type: 'text' },
            { key: 'redirect_url', label: 'Redirect URL', type: 'text' },
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
    condition: {
        apiResourceTag: 'conditions',
        resourceName: 'Condition',
        viewTitle: 'Study conditions',
        editableFields: [
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'id', label: 'ID' },
            { key: 'description', label: 'Description', type: 'textarea', wide: true },
            {
                key: 'recommender_key',
                label: 'Recommender Key',
                type: 'select',
                optionsEndpoint: 'conditions/recommender-keys',
                optionsValueKey: 'id',
                optionsLabelKey: 'name',
            },
            { key: 'view_link_key', label: 'View Link Key', type: 'text' },
            { key: 'recommendation_count', label: 'Recommendation Count', type: 'number' },
            { key: 'authorized_test_code', label: 'Testing Code', type: 'text' },
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
            { accessorKey: 'name', header: 'Condition Name' },
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
            {
                id: 'include',
                header: 'Include',
                cell: ({ row }) => {
                    return React.createElement(ResourceToggle, {
                        resourceId: row.original.id,
                        initialValue: row.original.enabled || false,
                        fieldKey: 'enabled',
                        clientKey: 'conditionClient',
                    });
                },
            },
        ],
    },
    preshuffled_movie_list: {
        apiResourceTag: 'shuffled-lists',
        resourceName: 'PreShuffledMovieList',
        viewTitle: 'PreShuffled Movie List',
        editableFields: [],
        formFields: [
            { name: 'subset_desc', label: 'Subset name', type: 'text', required: true },
            { name: 'seed', label: 'Seed', type: 'number', required: true },
            { name: 'year_min', label: 'Min Year', type: 'number', required: false },
            { name: 'year_max', label: 'Max Year', type: 'number', required: false },
            { name: 'genre', label: 'Genre', type: 'text', required: false },
            { name: 'min_rate_count', label: 'Minimum Ratings', type: 'number', required: true },
            {
                name: 'strategy',
                label: 'Strategy (Applied to movielens_rate_count)',
                type: 'select',
                required: true,
                options: [
                    { value: 'Random', label: 'Random' },
                    { value: 'A-Res', label: 'A-Res' },
                    { value: 'Stratified Chunking RC', label: 'Stratified Chunking - Rate Count' },
                    {
                        value: 'Stratified Chunking AvgRatingLD',
                        label: 'Stratified Chunking - AvgRating with Log Damping',
                    },
                    {
                        value: 'Stratified Chunking AvgRatingBA',
                        label: 'Stratified Chunking - AvgRating with Bayesian Average',
                    },
                ],
            },
            {
                name: 'exclude_no_emotions',
                label: 'Exclude without emotions?',
                type: 'select',
                required: false,
                options: [
                    { value: false, label: 'No' },
                    { value: true, label: 'Yes' },
                ],
            },
            {
                name: 'exclude_no_recommendations',
                label: 'Exclude without recommendations?',
                type: 'select',
                required: false,
                options: [
                    { value: 'false', label: 'No' },
                    { value: 'true', label: 'Yes' },
                ],
            },
        ],
        tableColumns: [
            {
                accessorKey: 'subset_desc',
                header: 'Subset',
            },
            {
                accessorKey: 'seed',
                header: 'seed',
            },
        ],
    },
};
