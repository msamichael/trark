import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import showReducer from "./showSlice";
import categoryTabReducer from './categorySlice';
import trailerReducer from './trailerSlice';
import bookmarkReducer from './bookmarkSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    show: showReducer,
    tab: categoryTabReducer,
    trailer: trailerReducer,
    bookmark: bookmarkReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
