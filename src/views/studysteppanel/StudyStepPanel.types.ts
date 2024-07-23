import { SelectionState } from '../dashboard/Dashboard.types';

export interface StudyStepPanelProps {
	studyId: string;
	selected: SelectionState;
	onChangeSelection: (state: SelectionState) => void;
	authErrorCallback: (errorMessage: string) => void;
}