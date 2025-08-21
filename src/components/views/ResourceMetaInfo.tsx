import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { usePermissions } from "../../hooks/usePermissions";

type MetaInfoField = {
	label: string;
	value: string | React.ReactNode | undefined | null;
	wide?: boolean;
}

interface ResourceMetaInfoProps {
	metaInfo: MetaInfoField[];
}

const ResourceMetaInfo: React.FC<ResourceMetaInfoProps> = ({
	metaInfo
}) => {
	return (
		<div className="bg-white p-6 rounded-lg shadow mb-3">
			<dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
				{metaInfo.map((info) => {
					return (
						<div key={`meta-${info.label}`} className={clsx(info.wide ? "sm:col-span-2" : "sm:col-span-1")}>
							<dt className="text-sm font-medium text-gray-500">{info.label}</dt>
							<dd className="mt-1 text-sm text-gray-900 font-mono">
								{info.value ? info.value : "[NULL]"}
							</dd>
						</div>
					)
				})}
			</dl>
		</div>
	);
}


// --- Editable Wrapper Component ---
type EditableField = MetaInfoField & {
	key: string;
	label: string;
	value: string | undefined;
	wide?: boolean;
	type?: 'text' | 'textarea' | 'static' | null; // To render different input types
}

interface EditableResourceMetaInfoProps<T> {
	apiResourceTag: string;
	resourceId: string;
	objectName: string;
	invalidateQueryKey?: QueryKey;
	editableFields: EditableField[];
	onSave?: (formData: T) => Promise<void>;
}

export const EditableResourceMetaInfo = <
	T extends Record<string, unknown> = Record<string, unknown>
>({
	apiResourceTag,
	resourceId,
	invalidateQueryKey,
	editableFields,
	onSave,
}: EditableResourceMetaInfoProps<T>) => {

	const { hasPermission } = usePermissions();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<Record<string, string>>();
	const queryClient = useQueryClient();
	const { api } = useApi();

	const mutation = useMutation({
		mutationFn: async (formData: T) => api.put<T>(`${apiResourceTag}/${resourceId}`, formData),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: invalidateQueryKey ? invalidateQueryKey : [apiResourceTag, resourceId]
			});
			if (onSave) {
				onSave(formData as T);
			}
			setIsEditing(false);
		}
	});

	const switchToEditingMode = useCallback(async () => {
		const initialFormState = Object.fromEntries(
			editableFields
				.filter(field => field.type === "text" || field.type === "textarea")
				.map(field => [field.key, field.value ?? ''])
		);
		setFormData(initialFormState);
		setIsEditing(true);
	}, [editableFields]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSave = useCallback(async () => {
		if (!formData) { return }
		await mutation.mutateAsync(formData as T);
	}, [formData, mutation]);

	const handleCancel = () => {
		setIsEditing(false);
	};

	const displayMetaInfo: MetaInfoField[] = editableFields.map(field => ({
		label: field.label,
		value: field.value,
		wide: field.wide,
	}));

	const renderField = (field: EditableField) => {
		const commonProps = {
			id: field.key,
			name: field.key,
			value: String((formData as Record<string, unknown>)[field.key] || ''),
			onChange: handleChange,
			className: clsx(
				"p-3",
				"block w-full rounded-md border-yellow-400",
				"shadow-sm focus:border-yellow-500 focus:ring-yellow-500",
				"sm:text-sm font-mono")
		};
		switch (field.type) {
			case "textarea":
				return (<textarea {...commonProps} />);
			case "text":
				return (
					<input {...commonProps} type="text" />
				);
			case "static":
			default:
				return (
					<div className={clsx(field.wide ? "sm:col-span-2" : "sm:col-span-1")}>
						<dd className="mt-1 text-sm text-gray-900 font-mono">
							{field.value ? field.value : "[NULL]"}
						</dd>
					</div>
				)
		}
	}

	if (isEditing) {
		// --- EDIT MODE ---
		return (
			<div className="bg-white p-6 rounded-lg shadow mb-3">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
					{editableFields.map((field) => (
						<div key={`edit-${field.key}`} className={clsx(field.wide ? "sm:col-span-2" : "sm:col-span-1")}>
							<label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
								{field.label}
							</label>
							<div className="mt-1">
								{
									renderField(field)
								}
							</div>
						</div>
					))}
				</div>
				<div className="mt-6 flex justify-end space-x-3">
					<button
						type="button"
						onClick={handleCancel}
						className={clsx(
							"rounded-md bg-white px-3 py-2 text-sm",
							"font-semibold text-gray-900 shadow-sm",
							"ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						)}>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSave}
						disabled={mutation.isPending}
						className={clsx(
							"flex flex-wrap items-center px-3 py-3 m-0 rounded-md space-x-2",
							"bg-yellow-500 hover:bg-yellow-600",
							"text-gray-700 text-sm font-medium cursor-pointer",
							"hover:bg-gray-700 hover:text-white"
						)}>
						{mutation.isPending ? 'Saving...' : 'Save'}
					</button>
				</div>
			</div>
		);
	}

	// --- VIEW MODE ---
	return (
		<div className="relative">
			<div className="absolute top-4 right-4">
				{hasPermission(`update:${apiResourceTag}`) &&
					<button
						onClick={switchToEditingMode}
						className={clsx(
							"flex flex-wrap items-center px-3 py-3 m-0 rounded-md space-x-2",
							"bg-yellow-500 hover:bg-yellow-600",
							"text-gray-700 text-sm font-medium cursor-pointer",
							"hover:bg-gray-700 hover:text-white"
						)}>
						Edit
					</button>
				}
			</div>
			<ResourceMetaInfo metaInfo={displayMetaInfo} />
		</div>
	);
}


export default ResourceMetaInfo;