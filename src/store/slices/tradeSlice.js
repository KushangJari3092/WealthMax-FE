import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "./commonSlice";
import { toast } from "react-toastify";

const tradeSlice = createSlice({
  name: "trade",
  initialState: {},
  reducers: {},
});

export default tradeSlice.reducer;

// Function to handle Buy API call
export const buyStock = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true)); // Set loading state
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/trade/buy`,
      payload,
      { withCredentials: true }
    );

    if (response?.data?.success) {
      toast.success("Stock bought successfully!");
    } else {
      toast.error(response?.data?.error || "Failed to buy stock");
    }

    return response?.data;
  } catch (error) {
    console.error("Error buying stock:", error);
    // toast.error(error.response?.data?.error || "An error occurred while buying stock");
    return {
      success: false,
      error: error.response?.data?.error,
    };
  } finally {
    dispatch(setLoading(false)); // Reset loading state
  }
};

// Function to handle Sell API call
export const sellStock = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true)); // Set loading state
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/trade/sell`,
      payload,
      { withCredentials: true }
    );

    if (response?.data?.success) {
      toast.success("Stock sold successfully!");
    } else {
      toast.error(response?.data?.error || "Failed to sell stock");
    }

    return response?.data;
  } catch (error) {
    console.error("Error selling stock:", error);
    toast.error(error.response?.data?.error || "An error occurred while selling stock");
    return {
      success: false,
      error: error.response?.data?.error,
    };
  } finally {
    dispatch(setLoading(false)); // Reset loading state
  }
};

