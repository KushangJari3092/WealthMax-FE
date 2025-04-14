/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "./commonSlice";

const initialState = {
  banks: null,
  bankById: null,
  branchesofBank: null,
};

const userSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {
    success: (state, action) => {
      state.banks = action.payload.banks;
    },
    setBranches: (state, action) => {
      state.branchesofBank = action.payload.branches;
    },
    setBank: (state, action) => {
      state.bankById = action.payload.bank;
    },
  },
});

export const { success, setBranches, setBank } = userSlice.actions;

export default userSlice.reducer;

export const addNewBank = (formData) => async (dispatch) => {
  console.log("payload", formData);
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_BACKEND_URL}/bank/add-bank`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", // Ensure multipart form is used for file uploads
        },
      }
    );

    console.log("Response:", response.data);
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

export const getBanks = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/bank/get-banks`,
      { data: payload, withCredentials: true }
    );
    // console.log("response", response);
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
export const getBankById = (payload) => async (dispatch) => {
  try {
    // dispatch(setLoading(true));
    
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/bank/get-bank`,
      { params: payload, withCredentials: true }
    );

    dispatch(setBank(response?.data));
    // dispatch(setLoading(false));
  } catch (error) {
    console.log("error in user", error);
    return {
      success: false,
      error: error.response?.data.message,
      user: error.response.data.user || null,
    };
  }
};

export const getBranchDetailsOfBank = (payload) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/bank/get-branch-details`,
      { params: payload, withCredentials: true }
    );
    dispatch(setBranches(response?.data));
  } catch (error) {
    console.log("error in fetching branch details", error);
    return {
      success: false,
      error: error.response?.data.message,
      branches: error.response.data.branches || null,
    };
  }
};
