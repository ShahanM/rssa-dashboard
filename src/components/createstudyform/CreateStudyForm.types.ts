
export interface CreateStudyFormProps {
	show: boolean;
	showHideCallback: (show: boolean) => void;
	requestToken: () => Promise<string>;
	onSuccess: (response: any) => void; // TODO: Define response type
	onAuthError: (error: any) => void; // TODO: Define error type
}