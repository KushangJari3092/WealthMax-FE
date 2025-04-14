/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: null,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      // console.log("action.payload", action);
      state.loading = action.payload;
    },
  },
});
export const { setLoading, setinWatchlist } = commonSlice.actions;

export default commonSlice.reducer;
