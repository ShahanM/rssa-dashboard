import { configureStore } from '@reduxjs/toolkit';
import studySelectionReducer from './studycomponents/selectionSlice';
import constructSelectionReducer from './constructlibrary/selectionSlice';
import scaleSelectionReducer from './surveyscales/selectionSlice';

export const store = configureStore({
	reducer: {
		studySelection: studySelectionReducer,
		constructSelection: constructSelectionReducer,
		scaleSelection: scaleSelectionReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch