import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { DocumentArrowDownIcon } from '@heroicons/react/16/solid';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useApi } from '../../hooks/useApi';
import CodeBlock from '../CodeBlock';
import { CopyToClipboardButton } from './CopyToClipboardButton';

const ExportStudyConfigButton: React.FC<{ studyId: string; studyName: string }> = ({ studyId, studyName }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <ExportConfigModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                studyId={studyId}
                studyName={studyName}
            />
            <button
                className={clsx(
                    'me-3 p-3 border rounded-lg bg-yellow-300',
                    'cursor-pointer text-yellow-800',
                    'hover:bg-yellow-500 hover:text-white'
                )}
                onClick={() => setIsModalOpen(true)}
            >
                <div className="flex space-x-3 justify-between items-center">
                    <DocumentArrowDownIcon className={clsx('size-8')} />
                    <span>Export study config</span>
                </div>
            </button>
        </>
    );
};

type ConfigCondition = {
    [key: string]: string;
};

type StudyConfig = {
    study_id: string;
    study_steps: Record<string, string>[];
    conditions: ConfigCondition;
};

interface ExportConfigModalProps {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
    studyId: string;
    studyName: string;
}

const ExportConfigModal: React.FC<ExportConfigModalProps> = ({ isOpen, onClose, studyId, studyName }) => {
    const { api } = useApi();
    const {
        data: studyConfig,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['studies', studyId],
        queryFn: () => api.get<StudyConfig>(`studies/${studyId}/export_study_config`),
        enabled: !!api && !!studyId,
    });

    if (isLoading) {
        return <div>Loading config...</div>;
    }

    if (error) {
        return <div>Error fetching config.</div>;
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </TransitionChild>
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="rounded-xl bg-yellow-400 p-6 shadow-xl">
                            <DialogTitle as="h3" className="text-lg font-medium leading-6 text-purple-800">
                                {studyName}
                            </DialogTitle>
                            {studyConfig && (
                                <CodeBlock codeString={JSON.stringify(studyConfig, null, 2)} language="json" />
                            )}
                            <div className="flex justify-between mt-3 p-1">
                                <p className="text-gray-800 text-wrap me-6">
                                    Use the
                                    <span className="font-mono text-purple-800"> Copy </span>
                                    button to copy the content above. Then paste it into a
                                    <span className="font-mono text-purple-800"> study.config.json </span>
                                    in your study project's root directory.
                                </p>
                                <CopyToClipboardButton
                                    textToCopy={JSON.stringify(studyConfig, null, 2)}
                                    showLabel={true}
                                    className={clsx('bg-red-800 text-purple-100 float-end h-10', 'hover:bg-purple-900')}
                                />
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};
export default ExportStudyConfigButton;
