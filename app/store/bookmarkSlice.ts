import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type BookmarkedShow = {
    id:number;
  type: 'anime'|'movies'|'series';
};
type BookmarkListState = {

    bookmarks : BookmarkedShow[];
}

const initialState:BookmarkListState = {
    bookmarks:[]
}

const bookmarkSlice = createSlice({
    name:"bookmark",
    initialState,
    reducers: {
        setBookmarks(state, action:PayloadAction<BookmarkedShow[]>){
            state.bookmarks = action.payload;
        },

        addBookmark(state, action: PayloadAction<BookmarkedShow>){
            const exists = state.bookmarks.some(
                b=>b.id === action.payload.id && b.type === action.payload.type
            );
            if (!exists){
                state.bookmarks.push(action.payload);
            }
        },

        removeBookmark(state, action:PayloadAction<BookmarkedShow>){
            state.bookmarks = state.bookmarks.filter(
                b=>!(b.id === action.payload.id && b.type === action.payload.type)
            );
        }
    }
});

export const { setBookmarks, addBookmark, removeBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;