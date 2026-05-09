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
                header: 'Attention Check Response',
            },
            {
                accessorKey: 'external_id',
                header: 'Verification Status',
                cell: (info) => (info.getValue() === 'N/A' ? 'Unverified' : info.getValue()),
            },
        ],
    },
};
