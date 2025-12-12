import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Page, Study, StudyCondition, StudyStep } from '../../types/studyComponents.types';

export interface SelectionState {
    study: Study | null;
    step: StudyStep | null;
    page: Page | null;
    condition: StudyCondition | null;
}

const initialState: SelectionState = {
    study: null,
    step: null,
    page: null,
    condition: null,
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
        setCondition: (state, action: PayloadAction<StudyCondition | null>) => {
            state.condition = action.payload;
        },
        clearSelectedCondition: (state) => {
            state.condition = null;
        },
    },
});

export const {
    setStudy,
    clearSelectedStudy,
    setStep,
    clearSelectedStep,
    setPage,
    clearSelectedPage,
    setCondition,
    clearSelectedCondition,
} = studyComponentSelection.actions;
export default studyComponentSelection.reducer;
