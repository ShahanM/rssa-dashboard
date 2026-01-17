import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Scale } from '../../types/surveyComponents.types';

export interface SelectionState {
    scale: Scale | null;
}

const initialState: SelectionState = {
    scale: null,
};

const scaleSelectionSlice = createSlice({
    name: 'scaleSelection',
    initialState,
    reducers: {
        setScale: (state, action: PayloadAction<Scale | null>) => {
            state.scale = action.payload;
        },
        clearSelectedScale: (state) => {
            state.scale = null;
        },
    },
});

export const { setScale, clearSelectedScale } = scaleSelectionSlice.actions;

export const selectScale = (state: { scaleSelection: SelectionState }) => state.scaleSelection.scale;

export default scaleSelectionSlice.reducer;
