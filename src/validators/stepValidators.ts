import type { FieldValidator } from '../components/forms/forms.typs';
import type { ApiClient } from '../hooks/useApi';

interface StepValidatorDeps {
    api: ApiClient;
    studyId: string | undefined;
    stepId?: string;
}

export const createStepValidators = ({ api, studyId, stepId }: StepValidatorDeps) => {
    const validatePath: FieldValidator = async (fieldKey: string, value: string) => {
        if (!studyId) throw new Error('Study ID is required for validation.');
        try {
            await api.get(`studies/${studyId}/steps/validate-path`, {
                params: {
                    [fieldKey]: value,
                    ...(stepId && { exclude_step_id: stepId }),
                },
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('This is path is already in use.');
        }
    };

    return {
        path: validatePath,
    };
};
