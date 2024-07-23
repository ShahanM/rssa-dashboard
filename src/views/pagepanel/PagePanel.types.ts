import { SelectionState } from "../dashboard/Dashboard.types";


export interface PagePanelProps {
	studyId: string;
	stepId: string;
	selected: SelectionState;
	onChangeSelection: (state: SelectionState) => void;
	authErrorCallback: (errorMessage: string) => void;
}