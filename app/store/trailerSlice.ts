import {createSlice} from "@reduxjs/toolkit";

type TrailerState = {
    showTrailer:boolean;
};

const initialState: TrailerState = {
    showTrailer : false,
}

const trailerSlice = createSlice({
    name:"trailer",
    initialState,
    reducers: {
        setShowTrailer(state, action){
            state.showTrailer = action.payload;
        }
    }
});

export const { setShowTrailer } = trailerSlice.actions;
export default trailerSlice.reducer;