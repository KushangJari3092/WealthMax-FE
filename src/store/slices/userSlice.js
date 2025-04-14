/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "./commonSlice";
import { toast } from "react-toastify";

const initialState = {
  user: null,
  bankDetails: null, // Initial state for bank details
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    success: (state, action) => {
      state.user = action.payload.user;
    },
    setBankDetails: (state, action) => {
      state.bankDetails = action.payload.bankDetails; // Update bank details here
    },
  },
});

export const { success, setBankDetails } = userSlice.actions;

export default userSlice.reducer;

export const getUser = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/users`,
      { data: payload, withCredentials: true }
    );
    dispatch(success(response?.data));
    dispatch(setLoading(false));
  } catch (error) {
    console.log("error in user", error);
    return {
      success: false,
      error: error.response?.data.message,
      user: error.response.data.user || null,
    };
  }
};
export const updateUser = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/users/update`,
      payload,
      { withCredentials: true }
    );
    toast.success("Bank details updated successfully", {
      closeOnClick: true,
      pauseOnHover: true,
    });

    // dispatch(success(response?.data));
    dispatch(setLoading(false));
  } catch (error) {
    console.log("error in user", error);
    return {
      success: false,
      error: error.response?.data.message,
      user: error.response.data.user || null,
    };
  }
};

export const getBankDetails = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/users/bank-details`,
      { data: payload, withCredentials: true }
    );
    // console.log("response?.data", response?.data);
    dispatch(setBankDetails(response?.data)); // Dispatch setBankDetails action
    dispatch(setLoading(false));
  } catch (error) {
    console.log("error in user", error);
    return {
      success: false,
      error: error.response?.data.message,
      bankDetails: null,
    };
  }
};
