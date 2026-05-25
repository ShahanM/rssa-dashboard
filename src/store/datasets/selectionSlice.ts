import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PreShuffledMovieList } from '../../types/studyComponents.types';

export interface DatasetSelectionState {
    shuffledList: PreShuffledMovieList | null;
}

const initialState: DatasetSelectionState = {
    shuffledList: null,
};

const datasetSelectionSlice = createSlice({
    name: 'datasetSelection',
    initialState,
    reducers: {
        setShuffledList: (state, action: PayloadAction<PreShuffledMovieList | null>) => {
            state.shuffledList = action.payload;
        },
        clearSelectedShuffledList: (state) => {
            state.shuffledList = null;
        },
    },
});

export const { setShuffledList, clearSelectedShuffledList } = datasetSelectionSlice.actions;

// Selector
export const selectShuffledList = (state: { datasetSelection: DatasetSelectionState }) =>
    state.datasetSelection.shuffledList;

export default datasetSelectionSlice.reducer;
