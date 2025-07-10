import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { OrderedComponent, Page, StudyStep } from "../utils/generics.types";
import { SortableItem } from "./SortableItem";

interface StudyComponentListProps {
	studyComponents: OrderedComponent[];
	urlPathPrefix: string;
	patchUrl?: string;
	labelKey: string;
}

const StudyComponentList: React.FC<StudyComponentListProps> = ({
	studyComponents,
	urlPathPrefix,
	patchUrl,
	labelKey
}) => {
	const [components, setComponents] = useState<OrderedComponent[]>(studyComponents);

	const { api } = useApi<StudyStep[] | Page[]>();

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
			console.log("Order updated successfully on server.");
		} catch (error) {
			console.error("Error updating order on server:", error);
			setComponents(components);
		}
	}, [api, patchUrl, components]);


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
				order_position: index + 1, // Update order_position based on new index
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
				<ul className="study-component-list-container">
					{components.map((component) =>
						<SortableItem
							key={component.id}
							urlPathPrefix={urlPathPrefix}
							studyComponent={component}
							labelKey={labelKey} />
					)}
				</ul>
			</SortableContext>
		</DndContext>
	)
}

export default StudyComponentList;