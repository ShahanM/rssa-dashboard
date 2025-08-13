import { TrashIcon } from "@heroicons/react/16/solid";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import clsx from "clsx";
import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import { usePermissions } from "../../hooks/usePermissions";

interface DeleteResourceButtonProps {
	apiResourceTag: string;
	resourceId: string;
	resourceKey: string;
	resourceName: string;
	invalidateQueryKey?: QueryKey;
	onSuccessCleanup?: () => void;
}

const DeleteResourceButton: React.FC<DeleteResourceButtonProps> = ({
	apiResourceTag,
	resourceId,
	resourceKey,
	resourceName,
	invalidateQueryKey,
	onSuccessCleanup,
}) => {
	const { hasPermission } = usePermissions();

	if (!hasPermission(`delete:${apiResourceTag}`)) {
		return <></>;
	}

	const { api } = useApi();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () => api.del(`${apiResourceTag}/${resourceId}`),
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: [apiResourceTag, resourceId] });
			queryClient.invalidateQueries({
				queryKey: invalidateQueryKey ? invalidateQueryKey : [apiResourceTag],
				exact: true
			});

			if (onSuccessCleanup) {
				onSuccessCleanup();
			}
		},
		onError: (error) => {
			console.error("Error deleting resource:", error);
		},
	})

	const openModal = () => { setIsModalOpen(true); };
	const closeModal = () => { setIsModalOpen(false); };

	return (
		<>
			<ConfirmationDialog
				isOpen={isModalOpen}
				onClose={closeModal}
				onConfirm={() => mutation.mutate()}
				title="Delete Item?"
			>
				Are you sure you want to delete {`the ${resourceKey}, "${resourceName}"`}? This action cannot be undone.
			</ConfirmationDialog>
			<button className={clsx(
				"p-2 border border-red-700 rounded-lg",
				"bg-red-100 hover:bg-red-600",
				"text-red-900 hover:text-white",
				"cursor-pointer"
			)}
				onClick={openModal}
				disabled={mutation.isPending}
			>
				<TrashIcon className={clsx(
					"w-6 stroke-2",
					mutation.isPending ? "animate-bounce" : ""
				)} />
				{ }
			</button>
		</>
	)
}

export default DeleteResourceButton;
