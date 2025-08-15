import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ConstructScale } from "../../utils/generics.types";



export interface SelectionState {
	scale: ConstructScale | null;
}

const initialState: SelectionState = {
	scale: null,
};

const scaleSelectionSlice = createSlice({
	name: 'scaleSelection',
	initialState,
	reducers: {
		setScale: (state, action: PayloadAction<ConstructScale | null>) => {
			state.scale = action.payload;
		},
		clearSelectedScale: (state) => {
			state.scale = null;
		}
	}
})

export const { setScale, clearSelectedScale } = scaleSelectionSlice.actions;
export default scaleSelectionSlice.reducer;