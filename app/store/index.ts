import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import showReducer from "./showSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
    show: showReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
