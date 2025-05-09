/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

let persistedUser;
try {
  const userCookie = Cookies.get("user"); // Get the cookie value
  // console.log("userCookie", userCookie);
  persistedUser = userCookie ? JSON.parse(userCookie) : null; // Parse the JSON if it exists
} catch (error) {
  console.error("Error parsing cookie:", error);
  persistedUser = null; // If error in parsing, set to null
}

// console.log("persistedUser", persistedUser);

const initialState = {
  user: null,
  token: '',
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { loginSuccess, setToken } = authSlice.actions;

export default authSlice.reducer;

//API CALL
export const login = (payload) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/users/login`,
      payload,
      { withCredentials: true }
    );
    if (response?.data?.loggedin) {
      dispatch(loginSuccess(response?.data));
      dispatch(setToken(response?.data?.token))
    }
    // Cookies.set("token", response?.data?.token)
    // Cookies.set("user", response?.data?.user)
    return { success: true, data: response.data };
  } catch (error) {
    // console.log('error', error)
    return {
      success: false,
      error: error.response?.data.message,
      user: error.response.data.user || null,
    };
  }
};

export const logout = () => async (dispatch) => {
  try {
    Cookies.remove("token");
    Cookies.remove("user");
    dispatch(setToken(''))
    return { success: true, data: { message: 'logged out' } };
  } catch (error) {
    // console.log('error', error)
    return {
      success: false,
    };
  }
};

export const signUp = (payload) => async (dispatch) => {
  try {
    // dispatch(loginStart());

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/users/signup`,
      payload
    );
    // dispatch(loginSuccess(data));
    // console.log("response", response);
    return { success: true, data: response.data };
  } catch (error) {
    // dispatch(loginFailure(error.response.data.message));
    // console.log('err', error)
    return {
      success: false,
      error: error.response.data,
      user: error.response.data.user || null,
    };
  }
};
