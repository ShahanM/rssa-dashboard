
export interface StudyPanelProps {
	selectedStudyId: string | undefined;
	onChangeSelection: (studyId: string) => void;
	authErrorCallback: (errorMessage: string) => void;
}