import React from 'react';
import { CopyToClipboardButton } from '../../components/buttons/CopyToClipboardButton';
import type { SystemResourceConfig } from '../../types/resourceClient.types';
import UserCard from '../../views/profile/UserCard';

export const systemConfig: SystemResourceConfig = {
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
    authorization: {
        apiResourceTag: 'authorizations',
        resourceName: 'Authorization',
        viewTitle: 'Authorized Users',
        editableFields: [], // No editable fields for now, only create/delete
        formFields: [
            {
                name: 'user_id',
                label: 'User',
                type: 'async-select',
                required: true,
                optionsEndpoint: 'users/search',
                optionsLabelKey: 'name',
                optionsValueKey: 'id',
                placeholder: 'Search by name or email...',
            },
            {
                name: 'role',
                label: 'Role',
                type: 'select',
                required: true,
                options: [
                    { value: 'viewer', label: 'Viewer' },
                    { value: 'editor', label: 'Editor' },
                    { value: 'admin', label: 'Admin' },
                ],
            },
        ],
        tableColumns: [
            {
                accessorKey: 'user_id',
                header: 'User',
                cell: (info) => React.createElement(UserCard, { userId: info.getValue() as string }),
            },
            { accessorKey: 'role', header: 'Role' },
        ],
    },
    local_user: {
        apiResourceTag: 'local-users',
        resourceName: 'User',
        viewTitle: 'Users',
        editableFields: [],
        formFields: [],
        tableColumns: [
            {
                accessorKey: 'picture',
                header: 'Picture',
                cell: (info) =>
                    info.getValue()
                        ? React.createElement('img', {
                              src: info.getValue() as string,
                              className: 'w-10 h-10 rounded-full',
                              alt: 'Profile',
                          })
                        : null,
            },
            { accessorKey: 'desc', header: 'Name' },
            { accessorKey: 'email', header: 'Email' },
            { accessorKey: 'auth0_sub', header: 'Auth0 ID' },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                cell: (info) => (info.getValue() ? new Date(info.getValue() as string).toLocaleDateString() : 'N/A'),
            },
        ],
    },
};
