import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { DocumentArrowDownIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import CodeBlock from "../CodeBlock";
import { CopyToClipboardButton } from "./CopyToClipboardButton";

const GenerateStudyEnvFileButton: React.FC<{ studyId: string; studyName: string; }> = ({ studyId, studyName }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	return (
		<>
			<ExportEnvFileModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				studyId={studyId} studyName={studyName} />
			<button className={clsx(
				"m-3 p-3 border rounded-lg bg-yellow-300",
				"cursor-pointer text-yellow-800",
				"hover:bg-yellow-500 hover:text-white"
			)}
				onClick={() => setIsModalOpen(true)}
			>
				<div className="flex space-x-3 justify-between items-center">
					<DocumentArrowDownIcon className={clsx(
						"size-8"
					)} />
					<span>Export study .env file</span>
				</div>
			</button>
		</>
	)
}


interface ExportConfigModalProps {
	isOpen: boolean;
	onClose: (isOpen: boolean) => void;
	studyId: string;
	studyName: string;
}

const ExportEnvFileModal: React.FC<ExportConfigModalProps> = ({ isOpen, onClose, studyId, studyName }) => {

	const RSSA_API = import.meta.env.VITE_RSSA_API!;
	const RSSA_API_DEV = import.meta.env.VITE_RSSA_API_DEV!;

	const envFileContent = useMemo(() => {
		const dev_url = `REACT_APP_RSSA_API_DEV=${RSSA_API_DEV}`;
		const prod_url = `REACT_APP_RSSA_API=${RSSA_API}`;
		const study_id = `REACT_APP_RSSA_STUDY_ID=${studyId}`

		return [dev_url, prod_url, study_id].join('\n')
	}, [studyId, RSSA_API, RSSA_API_DEV])

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={onClose}>
				<TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
					leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
					<div className="fixed inset-0 bg-black/30" />
				</TransitionChild>
				<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
					<TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95">
						<DialogPanel className="w-1/2 rounded-xl bg-yellow-500 p-6 shadow-xl">
							<DialogTitle as="h3" className="text-lg font-medium leading-6 text-purple-800">{studyName}</DialogTitle>
							{
								<CodeBlock codeString={envFileContent} language="yaml" />
							}
							<div className="flex justify-between mt-3 p-1">
								<p className="text-gray-800 text-wrap me-6">
									Use the 
									<span className="font-mono text-purple-800"> Copy </span> 
									button to copy the content above. Then paste it into a 
									<span className="font-mono text-purple-800"> .env </span> 
									file in your study project's root directory.
								</p>
								<CopyToClipboardButton textToCopy={envFileContent} showLabel={true}
									className={clsx(
										"bg-red-800 text-purple-100 float-end h-10",
										"hover:bg-purple-900"
									)}
								/>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</Dialog>
		</Transition>
	);
};
export default GenerateStudyEnvFileButton