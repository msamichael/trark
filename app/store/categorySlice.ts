import {createSlice} from "@reduxjs/toolkit";

 type Category = 'anime' | 'movies' | 'series'; 

type TabState = {
    categoryTab: Category
};

const initialState: TabState = {
    categoryTab : 'anime',
}

const categorySlice = createSlice({
    name:"tab",
    initialState,
    reducers: {
        setTab(state, action){
            state.categoryTab = action.payload;
        }
    }
});

export const { setTab } = categorySlice.actions;
export default categorySlice.reducer;