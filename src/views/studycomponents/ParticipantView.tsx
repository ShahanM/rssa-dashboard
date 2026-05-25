import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useApiClients } from '../../api/ApiContext';
import type { ActivityResponse, FreeformResponse, ParticipantSourceMeta } from '../../types/studyComponents.types';
import clsx from 'clsx';

interface ParticipantDrawerProps {
    participantId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const ParticipantDrawer: React.FC<ParticipantDrawerProps> = ({ participantId, isOpen, onClose }) => {
    const { participantAuditClient, participantClient, studyClient } = useApiClients();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: participantAuditClient.queryKeys.detail(participantId || ''),
        queryFn: () => {
            if (!participantId) throw new Error('ID required');
            return participantAuditClient.getOne(participantId);
        },
        enabled: !!participantId && isOpen,
    });

    const verifyMutation = useMutation({
        mutationFn: (newStatus: boolean) => {
            if (!participantId) throw new Error('ID required');
            return participantAuditClient.update(participantId, { is_verified: newStatus });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: participantAuditClient.queryKeys.detail(participantId!) });
            queryClient.invalidateQueries({ queryKey: participantClient.queryKeys.all() });
            if (data) queryClient.invalidateQueries({ queryKey: studyClient.queryKeys.detail(data?.study_id) });
        },
    });

    const discardMutation = useMutation({
        mutationFn: (newStatus: boolean) => {
            if (!participantId) throw new Error('ID required');
            return participantAuditClient.update(participantId, { discarded: newStatus });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: participantAuditClient.queryKeys.detail(participantId!) });
            queryClient.invalidateQueries({ queryKey: participantClient.queryKeys.all() });
            if (data) queryClient.invalidateQueries({ queryKey: studyClient.queryKeys.detail(data?.study_id) });
        },
    });

    if (isLoading) {
        return <div>Loading</div>;
    }
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
            )}

            <div
                className={clsx(
                    'fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl',
                    'transform transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : 'translate-x-full',
                    'flex flex-col'
                )}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Participant Audit</h2>
                    <div className="flex space-x-3 items-center">
                        {data && (
                            <button
                                onClick={() => discardMutation.mutate(!data.discarded)}
                                disabled={discardMutation.isPending}
                                className={clsx(
                                    'px-4 py-1.5 text-sm font-medium rounded-md text-white transition-colors',
                                    data.discarded
                                        ? 'bg-orange-300 hover:bg-orange-400'
                                        : 'bg-red-500 hover:bg-red-600',
                                    'disabled:opacity-50'
                                )}
                            >
                                {discardMutation.isPending
                                    ? 'Updating...'
                                    : data.discarded
                                      ? 'Undo Discard'
                                      : 'Discard Participant'}
                            </button>
                        )}
                        <button onClick={onClose}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {!participantId ? (
                        <p className="text-gray-500 italic">No participant selected.</p>
                    ) : isLoading ? (
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500">Failed to load participant details.</div>
                    ) : data ? (
                        <>
                            <div className="flex gap-3">
                                <span
                                    className={clsx(
                                        'px-3 py-1 rounded-full text-sm font-medium',
                                        data.is_verified
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    )}
                                >
                                    {data.is_verified ? 'Verified' : 'Pending Verification'}
                                </span>
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    Status: {data.current_status}
                                </span>
                            </div>
                            <section>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                                    Condition: {data.study_condition.name}
                                </h3>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                                    Attention Checks
                                </h3>
                                {data.attention_check_responses.length > 0 ? (
                                    <ul className="space-y-2">
                                        {data.attention_check_responses.map((check, idx) => (
                                            <li key={check.id} className="flex items-center text-sm">
                                                <span
                                                    className={clsx(
                                                        'w-2 h-2 rounded-full mr-2',
                                                        check.responded_survey_scale_level_id ===
                                                            check.study_attention_check.expected_survey_scale_level_id
                                                            ? 'bg-green-500'
                                                            : 'bg-red-500'
                                                    )}
                                                ></span>
                                                Check {idx + 1}:{' '}
                                                {check.responded_survey_scale_level_id ===
                                                check.study_attention_check.expected_survey_scale_level_id
                                                    ? 'Passed'
                                                    : 'Failed'}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">No attention checks recorded.</p>
                                )}
                            </section>
                            <FreeformResponseSection responses={data.freeform_responses} />
                            <ActivityResponseSection responses={data.activity_responses} />
                            <SourceMetaSection sourceMetaData={data.source_meta} />
                            <div className="flex justify-center">
                                {data && (
                                    <button
                                        onClick={() => verifyMutation.mutate(!data.is_verified)}
                                        disabled={verifyMutation.isPending || data.discarded}
                                        className={clsx(
                                            'px-4 py-2 mt-3 text-sm font-medium rounded-md text-white transition-colors',
                                            data.is_verified
                                                ? 'bg-red-500 hover:bg-red-600'
                                                : 'bg-green-600 hover:bg-green-700',
                                            'disabled:opacity-50'
                                        )}
                                    >
                                        {verifyMutation.isPending
                                            ? 'Updating...'
                                            : data.is_verified
                                              ? 'Revoke Verification'
                                              : 'Verify Participant'}
                                    </button>
                                )}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </>
    );
};

const FreeformResponseSection = ({ responses }: { responses: FreeformResponse[] }) => {
    return (
        <section>
            {responses ? (
                responses.map((response) => (
                    <div key={response.id}>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                            Response Context: {response.context_tag}
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-700">
                            {response.response_text}
                        </div>
                    </div>
                ))
            ) : (
                <span className="italic text-gray-400">No feedback provided.</span>
            )}
        </section>
    );
};

const ActivityResponseSection = ({ responses }: { responses: ActivityResponse[] }) => {
    return (
        <section>
            {responses ? (
                responses.map((response) => (
                    <div key={response.id}>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                            Response Context:{response.context_tag}
                        </h3>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-xs text-green-400 font-mono">
                                {JSON.stringify(response.payload_json, null, 2)}
                            </pre>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono">'// No response data'</pre>
                </div>
            )}
        </section>
    );
};

const SourceMetaSection = ({ sourceMetaData }: { sourceMetaData: ParticipantSourceMeta }) => {
    const parse_profilic_meta = (sourceMeta: ParticipantSourceMeta) => {
        return (
            <>
                <p>Prolific PID: {sourceMeta.PROLIFIC_PID}</p>
                <p>Prolific Study ID: {sourceMeta.STUDY_ID}</p>
                <p>Prolific Session ID: {sourceMeta['SESSION_ID']}</p>
            </>
        );
    };
    return (
        <section>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Source Metadata</h3>
            <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto border border-gray-200">
                <pre className="text-xs text-gray-600 font-mono">
                    {sourceMetaData ? parse_profilic_meta(sourceMetaData) : '// No source metadata'}
                </pre>
            </div>
        </section>
    );
};

export default ParticipantDrawer;
