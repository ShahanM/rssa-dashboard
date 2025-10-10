import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import type { DependentResourceClient } from '../types/resourceClient.types';
import type { OrderedComponent } from '../types/sharedBase.types';
import { SortableItem } from './SortableItem';

interface SortableResourceListProps<T extends OrderedComponent> {
    resourceClient: DependentResourceClient<T>;
    parentId: string;
    studyComponents: T[];
    urlPathPrefix?: string;
}

interface ReorderVariables {
    updatedOrder: Array<{ id: string; order_position: number }>;
    oldIndex: number;
    newIndex: number;
}

const SortableResourceList = <T extends OrderedComponent>({
    resourceClient,
    parentId,
    studyComponents,
    urlPathPrefix,
}: SortableResourceListProps<T>) => {
    const [components, setComponents] = useState<OrderedComponent[]>(studyComponents);

    const queryClient = useQueryClient();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setComponents(studyComponents);
    }, [studyComponents]);

    const invalidateQueryKey = resourceClient.queryKeys.lists();
    const reorderMutation = useMutation({
        mutationFn: ({ updatedOrder }: ReorderVariables) => {
            return resourceClient.reorder(parentId, updatedOrder);
        },
        onMutate: async ({ oldIndex, newIndex }: ReorderVariables) => {
            await queryClient.cancelQueries({ queryKey: invalidateQueryKey });
            const previousComponents = queryClient.getQueryData<OrderedComponent[]>(invalidateQueryKey);

            queryClient.setQueryData<OrderedComponent[]>(invalidateQueryKey, (oldData) => {
                if (!oldData) return [];
                const newOrderedComponents = arrayMove(oldData, oldIndex, newIndex);
                return newOrderedComponents.map((c, i) => ({ ...c, order_position: i + 1 }));
            });

            return { previousComponents };
        },
        onError: (err, _variables, context) => {
            if (context?.previousComponents) {
                queryClient.setQueryData(invalidateQueryKey, context.previousComponents);
                setComponents(context.previousComponents);
            }
            console.error('Error updating order:', err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
        },
    });

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const oldIndex = components.findIndex((c) => c.id === active.id);
            const newIndex = components.findIndex((c) => c.id === over.id);

            const newOrderedComponents = arrayMove(components, oldIndex, newIndex);
            setComponents(newOrderedComponents);

            const orderPayload = newOrderedComponents.map((component, index) => ({
                id: component.id,
                order_position: index + 1,
            }));

            reorderMutation.mutate({
                updatedOrder: orderPayload,
                oldIndex,
                newIndex,
            });
        },
        [components, reorderMutation]
    );

    if (!components || components.length === 0) {
        return <div>Nothing to show.</div>;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
        >
            <SortableContext items={components.map((component) => component.id)} strategy={verticalListSortingStrategy}>
                <ul className="w-full max-w-2xl">
                    {components.map((component) => (
                        <SortableItem<T>
                            resourceClient={resourceClient}
                            key={component.id}
                            urlPathPrefix={urlPathPrefix}
                            studyComponent={component}
                        />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
};

export default SortableResourceList;
