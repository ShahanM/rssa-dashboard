import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SurveyConstruct } from '../../types/surveyComponents.types';

export interface SelectionState {
    construct: SurveyConstruct | null;
}

const initialState: SelectionState = {
    construct: null,
};

const constructSelectionSlice = createSlice({
    name: 'constructSelection',
    initialState,
    reducers: {
        setConstruct: (state, action: PayloadAction<SurveyConstruct | null>) => {
            state.construct = action.payload;
        },
        clearSelectedConstruct: (state) => {
            state.construct = null;
        },
    },
});

export const { setConstruct, clearSelectedConstruct } = constructSelectionSlice.actions;

export const selectConstruct = (state: { constructSelection: SelectionState }) => state.constructSelection.construct;

export default constructSelectionSlice.reducer;
