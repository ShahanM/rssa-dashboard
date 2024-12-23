import { SelectionState } from '../dashboard/Dashboard.types';

export interface StudyPanelProps {
	selected: SelectionState;
	onChangeSelection: (state: SelectionState) => void;
	authErrorCallback: (errorMessage: string) => void;
}