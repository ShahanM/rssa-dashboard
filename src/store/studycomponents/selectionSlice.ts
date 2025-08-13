import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Study, StudyDetail, StudyStep, StudySummary, Page } from "../../utils/generics.types";



export interface SelectionState {
	study: Study | StudyDetail | StudySummary | null;
	step: StudyStep | null;
	page: Page | null;
}

const initialState: SelectionState = {
	study: null,
	step: null,
	page: null,
};

const studySelectionSlice = createSlice({
	name: 'studySelection',
	initialState,
	reducers: {
		setStudy: (state, action: PayloadAction<Study | StudyDetail | StudySummary | null>) => {
			state.study = action.payload;
			state.step = null;
		},
		clearStudy: (state) => {
			state.study = null;
			state.step = null;
			state.page = null;
		},
		setStep: (state, action: PayloadAction<StudyStep | null>) => {
			state.step = action.payload;
		},
		setPage: (state, action: PayloadAction<Page | null>) => {
			state.page = action.payload;

		},
	}
})

export const { setStudy, clearStudy, setStep, setPage } = studySelectionSlice.actions;
export default studySelectionSlice.reducer;