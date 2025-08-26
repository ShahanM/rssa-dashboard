import { PlusIcon } from "@heroicons/react/16/solid";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import clsx from "clsx";
import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { usePermissions } from "../../hooks/usePermissions";
import type { FormField } from "../forms/DynamicFormField";
import DynamicFormModal from "../forms/DynamicFormField";


interface CreateResourceButtonProps<T> {
	apiResourceTag: string;
	objectName: string;
	formFields: FormField[];
	invalidateQueryKey?: QueryKey;
	buttonLabel?: string;
	onSubmit?: (formData: T) => Promise<void>;
	className?: string;
}

export const CreateResourceButton = <
	T extends Record<string, unknown> = Record<string, unknown>
>({
	apiResourceTag,
	objectName,
	formFields,
	buttonLabel = `Create new ${objectName}`,
	invalidateQueryKey,
	className = '',
}: CreateResourceButtonProps<T>) => {

	const { hasPermission } = usePermissions();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const queryClient = useQueryClient();
	const { api } = useApi();
	
	const mutation = useMutation({
		mutationFn: async (formData: T) => api.post<T>(`${apiResourceTag}/`, formData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: invalidateQueryKey ? invalidateQueryKey : [apiResourceTag] });
		}
	});
	let permissionString = `create:${apiResourceTag}`;
	if (apiResourceTag.includes("-")) {
		permissionString = permissionString.replace("-", "_");
	}
	console.log("Required perimission: ", `create:${apiResourceTag}`, permissionString);
	
	if (!hasPermission(permissionString)) {
		return <></>;
	}

	const handleCreate = async (formData: T) => {
		await mutation.mutateAsync(formData);
	};

	return (
		<>
			<DynamicFormModal<T>
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={`Create New ${objectName}`}
				fields={formFields}
				onSubmit={handleCreate}
				isSubmitting={mutation.isPending}
				submitButtonText="Create"
			/>
			<button
				className={clsx(
					"flex flex-wrap items-center px-3 py-3 m-0 rounded-md space-x-2",
					"bg-yellow-500 hover:bg-yellow-600",
					"text-gray-700 text-sm font-medium cursor-pointer",
					"hover:bg-gray-700 hover:text-white",
					className
				)}
				onClick={() => setIsModalOpen(true)}
			>
				<PlusIcon className="h-5 w-5" />
				<span>{buttonLabel}</span>
			</button>
		</>
	)
}

export default CreateResourceButton;