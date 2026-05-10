import React from 'react';
import ResourceToggle from '../../components/ResourceToggle';
import type { ParticipantDataConfig } from '../../types/resourceClient.types';

export const participantDataConfig: ParticipantDataConfig = {
    participant: {
        apiResourceTag: 'participants',
        resourceName: 'StudyParticipant',
        viewTitle: 'Study Participants',
        editableFields: [
            /* ... */
        ],
        formFields: [
            /* ... */
        ],
        tableColumns: [
            {
                accessorKey: 'id',
                header: 'ID',
            },
            {
                accessorKey: 'source_meta',
                header: 'Prolific PID',
                cell: (info) => JSON.parse(info.getValue() as string).PROLIFIC_PID,
            },
            {
                accessorKey: 'created_at',
                header: 'Date Created',
                cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
            },
            {
                accessorKey: 'current_status',
                header: 'Status',
            },
            {
                accessorKey: 'all_attention_checks_passed',
                header: 'Attention Response',
            },
            {
                id: 'is_verified',
                header: 'Verified',
                cell: ({ row }) => {
                    return React.createElement(ResourceToggle, {
                        resourceId: row.original.id,
                        initialValue: row.original.is_verified || false,
                        fieldKey: 'is_verified',
                        clientKey: 'participantClient',
                    });
                },
            },
            {
                id: 'discard',
                header: 'Discard',
                cell: ({ row }) => {
                    return React.createElement(ResourceToggle, {
                        resourceId: row.original.id,
                        initialValue: row.original.discarded || false,
                        fieldKey: 'discarded',
                        clientKey: 'participantClient',
                    });
                },
            },
        ],
    },
};
