/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  data: null,
};

const stockDetailSlice = createSlice({
  name: "details",
  initialState,
  reducers: {
    fetchSuccess: (state, action) => {
      // console.log("action.payload", action.payload);
      state.data = action.payload;
    },
  },
});
export const { fetchSuccess } = stockDetailSlice.actions;

export default stockDetailSlice.reducer;

export const fetchStockDetails = (symbol) => async (dispatch) => {
  console.log("symbol---", symbol);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/marketDetails/${symbol}`
    );
    if (response?.data) {
      dispatch(fetchSuccess(response.data));
      return { success: true };
    } else {
      console.log("No data found");
      return { success: false };
    }
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      error: error,
    };
  }
};
