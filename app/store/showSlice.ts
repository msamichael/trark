import { createSlice } from "@reduxjs/toolkit";

type Show = {
  showImage: string;
  showLink: string;
  title: string;
  showAired: string;
};

type ShowListState = {
  showList: Show[];
  orderBy: string;
  page: number;
};

const initialState: ShowListState = {
  showList: [],
  orderBy: "popularity",
  page: 1,
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
  },
});

export const { setShowList, setSort } = showSlice.actions;
export default showSlice.reducer;
