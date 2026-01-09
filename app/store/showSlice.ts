import { createSlice } from "@reduxjs/toolkit";

type Show = {
  showImage: string;
  showLink: string;
  title: string;
  showAired: string;
  release_date: string;
  first_air_date:string
};

type ShowListState = {
  showList: Show[];
  orderBy: string;
  page: number;
  lastPage: number;
};

const initialState: ShowListState = {
  showList: [],
  orderBy: "popularity",
  page: 1,
  lastPage: 1,
};

const showSlice = createSlice({
  name: "show",
  initialState,
  reducers: {
    setShowList(state, action) {
      state.showList = action.payload;
    },
    setSort(state, action) {
        state.orderBy = action.payload;
        state.page = 1
    },
    setPage(state, action){
        state.page = action.payload;
    },
    setLastPage(state, action){
        state.lastPage = action.payload;
    }
  },
});

export const { setShowList, setSort, setPage, setLastPage } = showSlice.actions;
export default showSlice.reducer;
