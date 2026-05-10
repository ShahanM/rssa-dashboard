import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useApiClients, type ApiClients } from '../api/ApiContext';

interface ResourceToggleProps {
    resourceId: string;
    initialValue: boolean;
    fieldKey: string;
    clientKey: keyof ApiClients;
}

const ResourceToggle: React.FC<ResourceToggleProps> = ({ resourceId, initialValue, fieldKey, clientKey }) => {
    const clients = useApiClients();
    const resourceClient = clients[clientKey];

    const queryClient = useQueryClient();
    const [isChecked, setIsChecked] = useState(initialValue);

    const mutation = useMutation({
        mutationFn: async (updatedValue: boolean) => {
            return resourceClient.update(resourceId, { [fieldKey]: updatedValue });
        },
        onMutate: async (updatedValue) => {
            await queryClient.cancelQueries({ queryKey: resourceClient.queryKeys.lists() });
            const previousData = queryClient.getQueryData(resourceClient.queryKeys.lists());

            setIsChecked(updatedValue);

            return { previousData };
        },
        onError: (_err, _newEnabled, context: unknown) => {
            console.error(_err, _newEnabled, context);
            setIsChecked(!isChecked);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: resourceClient.queryKeys.lists() });
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.checked;
        mutation.mutate(newValue);
    };

    return (
        <input
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()}
            disabled={mutation.isPending}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer disabled:opacity-50"
        />
    );
};

export default ResourceToggle;
