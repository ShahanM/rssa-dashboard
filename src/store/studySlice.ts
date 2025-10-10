import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Study } from '../types/studyComponents.types';

interface StudyState {
    selectedStudy: Study | null;
}

const initialState: StudyState = {
    selectedStudy: null,
};

const studySlice = createSlice({
    name: 'study',
    initialState,
    reducers: {
        setSelectedStudy: (state, action: PayloadAction<Study | null>) => {
            state.selectedStudy = action.payload;
        },
    },
});

export const { setSelectedStudy } = studySlice.actions;

export default studySlice.reducer;
