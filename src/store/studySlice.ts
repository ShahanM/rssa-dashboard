import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Study } from '../utils/generics.types';
// Next, define the shape of this feature's state
interface StudyState {
	selectedStudy: Study | null;
}

// Define the initial state
const initialState: StudyState = {
	selectedStudy: null,
}

const studySlice = createSlice({
	name: 'study',
	initialState,
	// The `reducers` field lets us define reducers and generate associated actions
	reducers: {
		// This action will be used to set or clear the selected study
		setSelectedStudy: (state, action: PayloadAction<Study | null>) => {
			state.selectedStudy = action.payload
		},
	},
})

// Export the action creator so you can use it in your components
export const { setSelectedStudy } = studySlice.actions

// Export the reducer to add it to the store
export default studySlice.reducer