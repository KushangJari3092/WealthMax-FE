/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import "../../styles/loginModal.css";
import { login } from "../../store/slices/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import SignupModal from "./Signup";
import { useNavigate } from "react-router-dom";
import fullLogo from "../../assets/full-logo.png";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [loginResponse, setloginResponse] = useState();
  const [signup, setsignup] = useState(false);
  const handleClose = () => {
    // setOpen(false);
    setloginResponse();
    setemail();
    setpassword();
    // setsignup(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    const res = await dispatch(
      login({
        email,
        password,
      })
    );
    // console.log("res", res);

    if (!res?.success) {
      toast.error(res?.error);
      if (!res?.user) {
        setsignup(true);
      }
    }
    if (res?.success) {
      setloginResponse(res?.data);

      if (res?.data?.loggedin) {
        setTimeout(() => {
          navigate("/dashboard"); // Navigate to dashboard after login
          toast.success(res?.data?.message); // Show success toast
          handleClose(); // Close any modal or overlay if open
        }, 100); // Small delay to ensure the token is saved
      }
    }
  };

  return (
    <Box className="login-bg">
      {/* <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}> */}
      <Box className="logo-login">
        <img
          src={fullLogo}
          alt="logo-main"
          loading="lazy"
          className="logo"
          height={80}
          width={280}
          onClick={() => navigate("/")}
        />
      </Box>
      <Box className="modal-box">
        {/* Left section */}
        <Box className="modal-left">
          <Typography variant="h2" sx={{ color: "white" }}>
            Simple, Free Investing.
          </Typography>
          <Typography variant="body1">Built for a growing India.</Typography>
          <Box className="stocks">
            {/* <Typography variant="body2">Stocks</Typography> */}
          </Box>
        </Box>

        {/* Right section */}
        <Box className="modal-right">
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 0, fontWeight: "bolder" }}
          >
            Welcome to WealthMax
          </Typography>
          <Typography
            sx={{ mb: 2, fontWeight: 600, fontSize: "18px", color: "grey" }}
          >
            Login to your account
          </Typography>
          {/* Use onSubmit event on the form */}
          <Box component="form" className="modal-form" onSubmit={handleSubmit}>
            <TextField
              label="Enter Registered Email Address"
              type="email"
              variant="outlined"
              fullWidth
              required
              onChange={(e) => setemail(e.target.value)}
            />
            {signup && (
              <Typography sx={{ color: "red" }}>
                You need to Signup first
              </Typography>
            )}

            {loginResponse?.exists && (
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                onChange={(e) => setpassword(e.target.value)}
              />
            )}

            {/* Set the button type to submit to trigger form submission */}
            {/* {signup ? (
              <Button
                variant="contained"
                color="success"
                type="button" // 'type="button"' ensures this button doesn't submit the form
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign Up
              </Button>
            ) : ( */}
              <Button
                variant="contained"
                color="primary"
                className="modal-button"
                type="submit"
              >
                Continue
              </Button>
            {/* )} */}
          </Box>
          {!loginResponse?.user && (
            <Typography variant="caption" className="modal-caption">
              Dont have an account?{" "}
              <Typography
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/signup")}
              >
                Create Your Account First
              </Typography>
            </Typography>
          )}
          <Typography variant="caption" className="modal-caption">
            By proceeding, you agree to our{" "}
            <a href="#terms">Terms & Conditions</a> and{" "}
            <a href="#privacy">Privacy Policy</a>.
          </Typography>
        </Box>
      </Box>
      {/* </Fade>
      </Modal> */}
    </Box>
  );
}
