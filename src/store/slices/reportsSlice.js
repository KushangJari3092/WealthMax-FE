import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "./commonSlice";
import { toast } from "react-toastify";

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    transactions: [], // Store order history here
    orders: [], // Store order history here
  },
  reducers: {
    setTransactionsreports: (state, action) => {
      state.transactions = action.payload;
    },
    setOrdersreports: (state, action) => {
      state.orders = action.payload;
    },
  },
});

export const { setTransactionsreports, setOrdersreports } = reportsSlice.actions;

export default reportsSlice.reducer;

// Function to fetch order history
export const getAllTransactionsReports = (filters) => async (dispatch) => {
  const { transactionType, fromDate, toDate } = filters;
  try {
    dispatch(setLoading(true)); // Set loading state
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/reports/getAllTransactions`,
      { params: { transactionType, fromDate, toDate }, withCredentials: true }
    );

    if (response?.data?.success) {
      dispatch(setTransactionsreports(response.data.transactions)); // Update Redux state
    } else {
      toast.error(response?.data?.error || "Failed to fetch transactions");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    toast.error(error.response?.data?.error || "An error occurred while fetching transactions");
    return {
      success: false,
      error: error.response?.data?.error,
    };
  } finally {
    dispatch(setLoading(false)); // Reset loading state
  }
};


export const getOrdersReports = (filters) => async (dispatch) => {
  const { orderType, fromDate, toDate } = filters;
  try {
    dispatch(setLoading(true)); // Set loading state
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/reports/getAllOrders`,
      { params: { orderType, fromDate, toDate }, withCredentials: true }
    );

    if (response?.data?.success) {
      dispatch(setOrdersreports(response.data.orders)); // Update Redux state
    } else {
      toast.error(response?.data?.error || "Failed to fetch orders");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    toast.error(error.response?.data?.error || "An error occurred while fetching orders");
    return {
      success: false,
      error: error.response?.data?.error,
    };
  } finally {
    dispatch(setLoading(false)); // Reset loading state
  }
};