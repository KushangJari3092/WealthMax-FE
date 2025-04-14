/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "./commonSlice";
import { toast } from "react-toastify";

const initialState = {
 
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    
  },
});

export const { success, setBankDetails } = paymentSlice.actions;

export default paymentSlice.reducer;

export const createPayment = (amount) => async (dispatch) => {
    // console.log("amount", amount);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/payment/create-order`,
        {amount:amount*100},
        { withCredentials: true }
      );
    //   console.log("response", response);
      // dispatch(success(response?.data));
  
      return response?.data;
    } catch (error) {
      console.log("error", error);
      return {
        success: false,
        error: error.response?.data.message,
        user: error.response.data.user || null,
      };
    }
  };

export const verifyPayment = (payload) => async (dispatch) => {
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/payment/verify`,
        payload,
        { withCredentials: true }
      );
      return response?.data;
    } catch (error) {
      console.log("error", error);
      return {
        success: false,
        error: error.response?.data.message,
        user: error.response.data.user || null,
      };
    }
  };

export const withdrawAmount = (amount) => async (dispatch) => {
  try {
    // Send a POST request to the backend to process the withdrawal
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/payment/withdraw`,
      { amount }, // Pass the withdrawal amount
      { withCredentials: true }
    );

    console.log("Withdraw response:", response);

    if (response?.data?.success) {
      toast.success("Withdrawal successful! Your balance has been updated.");
    } else {
      toast.error(response?.data?.error || "Withdrawal failed");
    }

    return response?.data;
  } catch (error) {
    console.error("Withdrawal error:", error);
    toast.error(error.response?.data?.message || "An error occurred during the withdrawal process");

    return {
      success: false,
      error: error.response?.data?.message,
    };
  }
};