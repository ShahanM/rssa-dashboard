import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { QueryKey } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";
import type { OrderedComponent } from "../utils/generics.types";
import DeleteResourceButton from "./buttons/DeleteResourceButton";
import { usePermissions } from "../hooks/usePermissions";

interface SortableItemProps {
	studyComponent: OrderedComponent;
	urlPathPrefix?: string;
	labelKey: string;
	apiResourceTag: string;
	resourceKey: string;
	invalidateQueryKey?: QueryKey;
}

export const SortableItem: React.FC<SortableItemProps> = ({
	studyComponent,
	urlPathPrefix,
	labelKey,
	apiResourceTag,
	resourceKey,
	invalidateQueryKey
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: studyComponent.id });

	const { hasPermission } = usePermissions();

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.3 : 1,
	};

	return (
		<li style={style} ref={setNodeRef} {...attributes} className="flex space-x-3 items-center">
			{hasPermission(`delete:${resourceKey}`) && <DeleteResourceButton
				apiResourceTag={apiResourceTag}
				resourceId={studyComponent.id}
				resourceKey={resourceKey}
				resourceName={studyComponent[labelKey]}
				invalidateQueryKey={invalidateQueryKey}
			/>
			}
			<div className={clsx(
				"w-full list-none grid grid-cols-1 md:grid-cols-[1fr_auto]",
				"items-center gap-2 p-2 mb-1 bg-yellow-500",
				"border border-yellow-400 rounded",
				"hover:-translate-y-px hover:shadow-md",
			)}>
				<SortableItemContent urlPath={urlPathPrefix ? `${urlPathPrefix}/${studyComponent.id}` : undefined}>
					<div className="flex-1 text-gray-800 break-words truncate">
						{studyComponent[labelKey]}
					</div>

					<div className="flex-shrink-0 bg-white border border-gray-400 rounded-lg min-w-9 h-9 flex justify-center items-center font-semibold text-gray-600 px-2">
						{studyComponent.order_position}
					</div>
				</SortableItemContent>
				<div
					{...listeners}
					className="flex justify-end md:justify-center items-center cursor-grab text-2xl text-white flex-shrink-0"
				>
					☰
				</div>
			</div>
		</li>
	);
}

const SortableItemContent: React.FC<{ urlPath?: string, children: React.ReactNode; }> = ({ urlPath, children }) => {

	const classString = "flex items-center justify-between w-full min-w-0 gap-4 no-underline text-inherit";
	if (urlPath !== undefined) {
		return (
			<Link
				to={urlPath}
				className={classString}
			>{children}
			</Link>
		)
	}

	return (
		<div className={classString}>
			{children}
		</div>
	)

}