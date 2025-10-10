import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Scale } from '../../types/surveyconstructs.types';

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
export default scaleSelectionSlice.reducer;
