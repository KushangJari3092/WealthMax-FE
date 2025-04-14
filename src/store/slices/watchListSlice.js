/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

const initialState = {
  watchlist: null,
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    success: (state, action) => {
      console.log("action.payload", action.payload);
      //   state.watchlist = action.payload.watchlist;
    },
  },
});
export const { success } = watchlistSlice.actions;

export default watchlistSlice.reducer;

export const fetchWatchlist = (payload) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/watchlist`,

      { data: payload, withCredentials: true }
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
export const addToWatchlist = (payload) => async (dispatch) => {
  console.log("payload", payload);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/watchlist/add`,
      payload,
      { withCredentials: true }
    );
    // console.log("response", response);
    // dispatch(success(response?.data));

    return { success: true, data: response.data };
  } catch (error) {
    console.log("error", error);
    return {
      success: false,
      error: error.response?.data.message,
      user: error.response.data.user || null,
    };
  }
};
export const removeFromWatchlist = (payload) => async (dispatch) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/watchlist/remove`,
      {
        data: payload,
        withCredentials: true,
      }
    );
    // console.log("response", response);
    // dispatch(success(response?.data));
    return { success: true, data: response.data };
  } catch (error) {
    console.log("error---", error);
    return {
      success: false,
      error: error.response?.data.message,
      user: error.response?.data?.user || null,
    };
  }
};
