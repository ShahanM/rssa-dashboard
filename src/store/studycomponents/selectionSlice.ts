import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Page, Study, StudyStep } from '../../types/studyComponents.types';

export interface SelectionState {
    study: Study | null;
    step: StudyStep | null;
    page: Page | null;
}

const initialState: SelectionState = {
    study: null,
    step: null,
    page: null,
};

const studyComponentSelection = createSlice({
    name: 'studyComponentSelection',
    initialState,
    reducers: {
        setStudy: (state, action: PayloadAction<Study | null>) => {
            state.study = action.payload;
            state.step = null;
        },
        clearSelectedStudy: (state) => {
            state.study = null;
            state.step = null;
            state.page = null;
        },
        setStep: (state, action: PayloadAction<StudyStep | null>) => {
            state.step = action.payload;
        },
        clearSelectedStep: (state) => {
            state.step = null;
            state.page = null;
        },
        setPage: (state, action: PayloadAction<Page | null>) => {
            state.page = action.payload;
        },
        clearSelectedPage: (state) => {
            state.page = null;
        },
    },
});

export const { setStudy, clearSelectedStudy, setStep, clearSelectedStep, setPage, clearSelectedPage } =
    studyComponentSelection.actions;
export default studyComponentSelection.reducer;
