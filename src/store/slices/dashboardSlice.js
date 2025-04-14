/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  data: null,
};

const dashboardSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    success: (state, action) => {
      console.log("action.payload", action.payload);
      state.data = action.payload.user;
    },
  },
});
export const { success } = dashboardSlice.actions;

export default dashboardSlice.reducer;

export const fetchDashboardData = (payload) => async (dispatch) => {
  try {
    console.log("hi2");
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/dashboard`,
      payload
    );
    console.log("response", response);
    dispatch(success(response?.data));

    // return { success: true, data: response.data };
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      error: error.response?.data.message,
      user: error.response.data.user || null,
    };
  }
};
