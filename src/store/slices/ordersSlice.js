import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "./commonSlice";
import { toast } from "react-toastify";

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orderHistory: [], // Store order history here
  },
  reducers: {
    setOrderHistory: (state, action) => {
      state.orderHistory = action.payload;
    },
  },
});

export const { setOrderHistory } = ordersSlice.actions;

export default ordersSlice.reducer;

// Function to fetch order history
export const getOrderHistory = () => async (dispatch) => {
  try {
    dispatch(setLoading(true)); // Set loading state
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/orders/history`,
      { withCredentials: true }
    );

    if (response?.data?.success) {
      dispatch(setOrderHistory(response.data.orders)); // Update Redux state
    } else {
      toast.error(response?.data?.error || "Failed to fetch order history");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching order history:", error);
    toast.error(error.response?.data?.error || "An error occurred while fetching order history");
    return {
      success: false,
      error: error.response?.data?.error,
    };
  } finally {
    dispatch(setLoading(false)); // Reset loading state
  }
};