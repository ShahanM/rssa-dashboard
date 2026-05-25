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
                cell: (info) => info.row.original.source_meta?.PROLIFIC_PID || '',
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                cell: (info) => {
                    const dateTime = new Date(info.getValue() as string);
                    const dateStr = dateTime.toLocaleDateString();
                    const timeStr = dateTime.toLocaleTimeString();
                    return `${timeStr}, ${dateStr}`;
                    // return dateTime.toLocaleString();
                },
            },
            {
                accessorKey: 'current_status',
                header: 'Status',
            },
            {
                accessorKey: 'all_attention_checks_passed',
                header: 'Attention',
                cell: (info) => (info.getValue() ? 'PASS' : 'FAIL'),
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
    participant_audit: {
        apiResourceTag: 'participant-audits',
        resourceName: 'StudyParticipant',
        viewTitle: 'StudyParticipants',
        editableFields: [
            /* ... */
        ],
        formFields: [
            /* ... */
        ],
    },
};
