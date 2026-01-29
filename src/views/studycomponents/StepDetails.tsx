import React from 'react';
import { useParams } from 'react-router-dom';
import { useApiClients } from '../../api/ApiContext';
import ResourceChildList from '../../components/resources/ResourceChildList';
import ResourceInfoPanel from '../../components/resources/ResourceInfoPanel';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearSelectedStep, selectStep, setStep } from '../../store/studycomponents/selectionSlice';
import type { Page, StudyStep } from '../../types/studyComponents.types';

const StepDetails: React.FC = () => {
    const { stepId } = useParams<{ studyId: string; stepId: string }>();
    const dispatch = useAppDispatch();
    const { stepClient, pageClient } = useApiClients();

    const selectedStep = useAppSelector(selectStep);

    if (!stepId) {
        console.warn('Step ID is missing from URL. Redirecting to studies listings.');
        return <>Invalid url</>;
    }

    const handleLoad = React.useCallback((stepData: StudyStep) => dispatch(setStep(stepData)), [dispatch]);

    const handleDelete = React.useCallback(() => dispatch(clearSelectedStep()), [dispatch]);

    return (
        <div className="container mx-auto p-3 bg-gray-50 rounded-lg mb-2">
            <ResourceInfoPanel<StudyStep>
                resourceClient={stepClient}
                resourceId={stepId}
                onDelete={handleDelete}
                onLoad={handleLoad}
            />
            <div className="flex space-x-2 justify-between gap-4">
                {selectedStep?.step_type === 'survey' && (
                    <ResourceChildList<Page> resourceClient={pageClient} parentId={stepId} />
                )}
            </div>
        </div>
    );
};

export default StepDetails;
