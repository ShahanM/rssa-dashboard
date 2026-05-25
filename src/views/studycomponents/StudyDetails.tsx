import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApiClients } from '../../api/ApiContext';
import ResourceChildList from '../../components/resources/ResourceChildList';
import ResourceChildTable from '../../components/resources/ResourceChildTable';
import ResourceInfoPanel from '../../components/resources/ResourceInfoPanel';
import { usePermissions } from '../../hooks/usePermissions';
import { useAppDispatch } from '../../store/hooks';
import { clearSelectedStudy, setStudy } from '../../store/studycomponents/selectionSlice';
import type { ApiKey, Study, StudyAuthorization, StudyCondition, StudyStep } from '../../types/studyComponents.types';
import ParticipantAuditTab from './ParticipantAudit';
import StudyDemographics from './StudyDemographic';

type StudyViewTab = 'overview' | 'authorization' | 'audit' | 'demographics';

const StudyDetails: React.FC = () => {
    const { studyId } = useParams<{ studyId: string }>();
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const { studyClient, stepClient, conditionClient, keyClient, authorizationClient } = useApiClients();
    const { hasPermission } = usePermissions();

    const [activeTab, setActiveTab] = useState<StudyViewTab>('overview');

    const handleLoad = useCallback((studyData: Study) => dispatch(setStudy(studyData)), [dispatch]);
    const handleDelete = useCallback(() => dispatch(clearSelectedStudy()), [dispatch]);

    const handleConditionClick = useCallback(
        (condition: StudyCondition) => navigate(`conditions/${condition.id}`),
        [navigate]
    );

    if (!studyId) {
        console.warn('Study ID is missing from URL. Redirecting to studies listings.');
        return <>Invalid url</>;
    }

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
            <ResourceInfoPanel<Study>
                resourceClient={studyClient}
                resourceId={studyId}
                onDelete={handleDelete}
                onLoad={handleLoad}
            />

            <div className="mt-6 mb-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'overview'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Study Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('authorization')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'authorization'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Authorization
                    </button>
                    <button
                        onClick={() => setActiveTab('audit')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'audit'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Participant Audit
                    </button>
                    <button
                        onClick={() => setActiveTab('demographics')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'demographics'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Demographics Summary
                    </button>
                </nav>
            </div>

            {activeTab === 'overview' && (
                <div className="flex flex-col gap-4">
                    <div className="flex space-x-2 justify-between gap-4">
                        <div className="flex p-1">
                            <ResourceChildList<StudyStep> resourceClient={stepClient} parentId={studyId} />
                        </div>
                        <ResourceChildTable<StudyCondition>
                            resourceClient={conditionClient}
                            parentId={studyId}
                            onRowClick={handleConditionClick}
                        />
                    </div>
                </div>
            )}
            {activeTab === 'authorization' && (
                <div className="flex space-x-2 justify-between gap-4">
                    <ResourceChildTable<ApiKey> resourceClient={keyClient} parentId={studyId} className="" />
                    {hasPermission('admin:all') && (
                        <ResourceChildTable<StudyAuthorization>
                            resourceClient={authorizationClient}
                            parentId={studyId}
                            className="ms-3"
                        />
                    )}
                </div>
            )}
            {activeTab === 'audit' && <ParticipantAuditTab studyId={studyId} />}
            {activeTab === 'demographics' && <StudyDemographics studyId={studyId} />}
        </div>
    );
};

StudyDetails.whyDidYouRender = true;
export default StudyDetails;
