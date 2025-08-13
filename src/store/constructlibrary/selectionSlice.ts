import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SurveyConstruct, SurveyConstructDetails } from "../../utils/generics.types";



export interface SelectionState {
	construct: SurveyConstruct | SurveyConstructDetails | null;
}

const initialState: SelectionState = {
	construct: null,
};

const constructSelectionSlice = createSlice({
	name: 'constructSelection',
	initialState,
	reducers: {
		setConstruct: (state, action: PayloadAction<SurveyConstruct | SurveyConstructDetails | null>) => {
			state.construct = action.payload;
		},
		clearSelectedConstruct: (state) => {
			state.construct = null;
		}
	}
})

export const { setConstruct, clearSelectedConstruct } = constructSelectionSlice.actions;
export default constructSelectionSlice.reducer;