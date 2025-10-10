import { configureStore } from '@reduxjs/toolkit';
import constructSelectionReducer from './constructlibrary/selectionSlice';
import studySelectionReducer from './studycomponents/selectionSlice';
import scaleSelectionReducer from './surveyscales/selectionSlice';

export const store = configureStore({
    reducer: {
        studyComponentSelection: studySelectionReducer,
        constructSelection: constructSelectionReducer,
        scaleSelection: scaleSelectionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
