import React, { useCallback, useState } from 'react';
import { useApiClients } from '../../api/ApiContext';
import ResourceChildTable from '../../components/resources/ResourceChildTable';
import { useApi } from '../../hooks/useApi';
import { useAppSelector } from '../../store/hooks';
import type { StudyParticipant } from '../../types/studyComponents.types';
import ParticipantDrawer from './ParticipantView';

interface ParticipantAuditTabProps {
    studyId: string;
}

const ParticipantAuditTab: React.FC<ParticipantAuditTabProps> = ({ studyId }) => {
    const { participantClient } = useApiClients();

    const { api } = useApi();
    const { study } = useAppSelector((state) => state.studyComponentSelection);
    const [unverifiedOnly, setUnverifiedOnly] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleParticipantClick = useCallback((participant: StudyParticipant) => {
        setSelectedParticipantId(participant.id);
        setDrawerOpen(true);
    }, []);

    const handleExport = useCallback(async () => {
        if (!studyId) return;

        try {
            setIsExporting(true);

            const blob = await api.get<Blob>(`studies/${studyId}/export`, {
                responseType: 'blob',
            });

            if (!blob) {
                throw new Error('No data returned from export');
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const study_name = study?.display_name;
            a.download = `study_${study_name}_export.csv`;

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Failed to export study data:', error);
        } finally {
            setIsExporting(false);
        }
    }, [studyId, api, study?.display_name]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        isExporting ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                >
                    {isExporting ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Exporting...
                        </>
                    ) : (
                        'Export CSV'
                    )}
                </button>

                <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={unverifiedOnly}
                            onChange={() => setUnverifiedOnly(!unverifiedOnly)}
                        />
                        <div
                            className={`block w-10 h-6 rounded-full transition-colors ${unverifiedOnly ? 'bg-purple-600' : 'bg-gray-300'}`}
                        ></div>
                        <div
                            className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${unverifiedOnly ? 'transform translate-x-4' : ''}`}
                        ></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Show Unverified Only</span>
                </label>
            </div>

            <ResourceChildTable<StudyParticipant>
                resourceClient={participantClient}
                parentId={studyId}
                allowCreate={false}
                className="mb-5"
                paginate={true}
                pageSize={15}
                filterState={{ isVerified: unverifiedOnly ? false : undefined }}
                onRowClick={handleParticipantClick}
            />

            <ParticipantDrawer
                isOpen={drawerOpen}
                participantId={selectedParticipantId}
                onClose={() => {
                    setDrawerOpen(false);
                    setSelectedParticipantId(null);
                }}
            />
        </div>
    );
};

export default ParticipantAuditTab;
