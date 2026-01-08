import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useApiClients } from '../../api/ApiContext';
import type { StudyCondition } from '../../types/studyComponents.types';

interface StudyConditionCheckboxProps {
    conditionId: string;
    initialEnabled: boolean;
}

const StudyConditionCheckbox: React.FC<StudyConditionCheckboxProps> = ({ conditionId, initialEnabled }) => {
    const { conditionClient } = useApiClients();
    const queryClient = useQueryClient();
    const [isEnabled, setIsEnabled] = useState(initialEnabled);

    const mutation = useMutation({
        mutationFn: async (updatedEnabled: boolean) => {
            return conditionClient.update(conditionId, { enabled: updatedEnabled });
        },
        onMutate: async (updatedEnabled) => {
            await queryClient.cancelQueries({ queryKey: conditionClient.queryKeys.lists() });
            const previousData = queryClient.getQueryData<StudyCondition[]>(conditionClient.queryKeys.lists());

            setIsEnabled(updatedEnabled);

            return { previousData };
        },
        onError: (_err, _newEnabled, context: { previousData?: StudyCondition[] | undefined } | undefined) => {
            if (context?.previousData) {
            }
            setIsEnabled(!isEnabled);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: conditionClient.queryKeys.lists() });
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        mutation.mutate(newValue);
    };

    return (
        <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()}
            disabled={mutation.isPending}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer disabled:opacity-50"
        />
    );
};

export default StudyConditionCheckbox;
