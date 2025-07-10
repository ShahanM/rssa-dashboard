import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { Link } from "react-router-dom";
import { OrderedComponent } from "../utils/generics.types";

interface SortableItemProps {
	studyComponent: OrderedComponent;
	urlPathPrefix: string;
	labelKey: string;
}

export const SortableItem: React.FC<SortableItemProps> = ({ studyComponent, urlPathPrefix, labelKey }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: studyComponent.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.3 : 1,
	};

	return (
		<li className="study-component-list-item" style={style} ref={setNodeRef} {...attributes}>
			<Link
				to={`${urlPathPrefix}/${studyComponent.id}`}
				className="list-item-clickable-area">
				<div className="list-item-text-content">{studyComponent[labelKey]}</div>
				<div className="list-item-number-bubble-container">
					<div className="list-item-number-bubble">
						{studyComponent.order_position}
					</div>
				</div>
			</Link>
			<div {...listeners}
				className="list-item-drag-handle"
			>
				☰
			</div>
		</li>
	);
}

