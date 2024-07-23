export interface InputFormModalProps {
	show: boolean;
	showHideCallback: (show: boolean) => void;
	requestToken: () => Promise<string>;
	onSuccess: (response: any) => void; // TODO: Define response type
	onAuthError: (error: any) => void; // TODO: Define error type	
}

export interface OrderedInputFormModalProps extends InputFormModalProps {
	maxEmptyPosition: number;
}

export interface CreateStepFormProps extends OrderedInputFormModalProps {
	studyId: string;
}

export interface CreatePageFormProps extends CreateStepFormProps {
	stepId: string;
}