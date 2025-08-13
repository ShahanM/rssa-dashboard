import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import type { OrderedComponent, Page, StudyStep } from "../utils/generics.types";
import { SortableItem } from "./SortableItem";

interface StudyComponentListProps {
	studyComponents: OrderedComponent[];
	urlPathPrefix?: string;
	patchUrl?: string;
	labelKey: string;
	apiResourceTag: string;
	resourceKey: string;
	invalidateQueryKey?: QueryKey;
}

const StudyComponentList: React.FC<StudyComponentListProps> = ({
	studyComponents,
	urlPathPrefix,
	patchUrl,
	labelKey,
	apiResourceTag,
	resourceKey,
	invalidateQueryKey = ['study-components'],
}) => {
	const [components, setComponents] = useState<OrderedComponent[]>(studyComponents);

	const { api } = useApi<StudyStep[] | Page[]>();

	const queryClient = useQueryClient();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	useEffect(() => {
		setComponents(studyComponents);
	}, [studyComponents])

	const updateOrderOnServer = useCallback(async (
		updatedComponents: Array<{ id: string, order_position: number }>) => {
		if (!patchUrl) {
			console.error("Patch URL is not provided. Cannot update order on server.");
			return;
		}

		try {
			await api.put(patchUrl, updatedComponents);
		} catch (error) {
			console.error("Error updating order on server:", error);
			setComponents(components);
		} finally {
			await queryClient.invalidateQueries({ queryKey: invalidateQueryKey })
		}
	}, [api, patchUrl, components, invalidateQueryKey, queryClient]);


	const handleDragEnd = useCallback(async (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			const oldIndex = components.findIndex((component) => component.id === active.id);
			const newIndex = components.findIndex((component) => component.id === over?.id);

			if (oldIndex === -1 || newIndex === -1) {
				console.error("Dragged item or target not found in current components state.");
				return;
			}

			const newOrderedComponents = arrayMove(components, oldIndex, newIndex);
			const updatedComponents = newOrderedComponents.map((component, index) => ({
				...component,
				order_position: index + 1,
			}));
			setComponents(updatedComponents);

			const componentsToUpdate = updatedComponents.map((component, index) => ({
				id: component.id,
				order_position: index + 1,
			}));
			console.log("Components to update:", componentsToUpdate);
			await updateOrderOnServer(componentsToUpdate);

		}
	}, [components, updateOrderOnServer]);

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
			<SortableContext
				items={components.map((component) => component.id)}
				strategy={verticalListSortingStrategy}
			>
				<ul className="w-full max-w-2xl">
					{components.map((component) =>
						<SortableItem
							key={component.id}
							urlPathPrefix={urlPathPrefix}
							studyComponent={component}
							invalidateQueryKey={invalidateQueryKey}
							apiResourceTag={apiResourceTag}
							resourceKey={resourceKey}
							labelKey={labelKey} />
					)}
				</ul>
			</SortableContext>
		</DndContext>
	)
}

export default StudyComponentList;