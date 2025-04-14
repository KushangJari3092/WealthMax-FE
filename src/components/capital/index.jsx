/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Divider,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/logo.png";
import { toast } from "react-toastify";
import { Grid } from "rsuite";
import "../../styles/bankDetails.css";
import { loadRazorpayScript } from "../../constants/loadRazorpay";
import { createPayment, verifyPayment, withdrawAmount } from "../../store/slices/paymentSlice";
import { getUser } from "../../store/slices/userSlice";

const CapitalDetails = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user?.user);
  console.log("user", user);

  const loading = useSelector((state) => state.common?.loading);

  const [amount, setAmount] = useState(0);
  const [tabValue, setTabValue] = useState("add");
  const [toggleValue, setToggleValue] = useState("delivery");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAmountChange = (value) => {
    setAmount((prev) => prev + value);
  };

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
    setAmount(0); // Reset the amount input when switching tabs
  };

  const handleToggleChange = (event, newValue) =>
    setToggleValue(newValue || toggleValue);

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      toast.error(
        "Failed to load Razorpay SDK. Please check your internet connection."
      );
      return;
    }

    try {
      setIsProcessing(true);

      // Step 1: Create an order on the server
      const orderData = await dispatch(createPayment(amount));

      if (!orderData?.success) {
        toast.error("Failed to create payment order");
        setIsProcessing(false);
        return;
      }

      // Step 2: Open Razorpay payment modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
        amount: orderData.amount,
        currency: "INR",
        name: "WealthMax",
        image: logo,
        description: "Adding Money to Wallet",
        order_id: orderData.id, // Order ID from the server
        handler: async (response) => {
          // Step 3: Verify payment on the server
          const verifyResponse = await dispatch(
            verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: orderData.amount/100,
            })
          );

          console.log("verifyData", verifyResponse);

          if (verifyResponse.success) {
            toast.success(
              "Payment successful! Your balance has been updated."
            ); // Success toast
            setAmount(0); // Reset the amount
            dispatch(getUser());
          } else {
            toast.error("Payment verification failed"); // Error toast
          }
        },
        prefill: {
          name: user?.name || "Your Name",
          email: user?.email || "your-email@example.com",
          contact: user?.phone || "1234567890",
        },
        theme: {
          color: "#008360",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", (response) => {
        toast.error("Payment failed. Please try again.");
        console.error(response.error);
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred during the payment process");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if(amount>user?.demat_balance){
      toast.error("You cannot withdraw more than you available balance")
      return
    }

    try {
      setIsProcessing(true);

      const data = await dispatch(withdrawAmount(amount));

      if (data.success) {
        // toast.success("Withdrawal successful! Your balance has been updated.");
        setAmount(0); // Reset the amount
        dispatch(getUser());
      } else {
        toast.error(data.error || "Withdrawal failed");
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error("An error occurred during the withdrawal process");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    dispatch(getUser());
  }, []);

  return (
    <>
      <Box
        className="bank-detail-container"
        sx={{ display: "flex", justifyContent: "space-evenly" }}
      >
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            padding: 3,
            textAlign: "center",
            width: "40%",
            backgroundColor: "#a3a3a30f",
            height: "fit-content",
          }}
        >
          <Typography
            sx={{ fontSize: "25px", fontWeight: 500, marginBottom: "25px" }}
          >
            Your Balance
          </Typography>
          <Typography
            sx={{ fontSize: "20px", fontWeight: 500, marginBottom: 2 }}
          >
            Stocks, F&O balance
          </Typography>
          <Typography sx={{ fontSize: "30px", fontWeight: 600, color: "grey" }}>
            ₹ {user?.demat_balance.toFixed(2)}
          </Typography>
        </Box>
        <Box
          sx={{
            width: "40%",
            backgroundColor: "#a3a3a30f",
            height: "400px",
          }}
        >
          <Box className="buy-sell-container">
            <Box className="buy-sell-box">
              <Box>
                <Tabs
                  value={tabValue}
                  //   onChange={handleTabChange}
                  sx={{
                    mt: 0,
                    mb: 4,
                    borderBottom: "1px solid #9b9b9b75",
                    "& .MuiTab-root": {
                      color: "grey", // Default text color
                      textTransform: "none", // Remove the uppercase transformation
                      fontWeight: 600,
                    },
                    "& .Mui-selected": {
                      color: "#008360 !important",
                    }, // Selected tab text color
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#008360",
                      height: "2px",
                    }, // Indicator color
                  }}
                >
                  <Tab
                    label="Add Money"
                    value="add"
                    onClick={() => handleTabChange("add")}
                  />
                  <Tab
                    label="Withraw"
                    value="withdraw"
                    onClick={() => handleTabChange("withdraw")}
                  />
                </Tabs>

                <Box className="input-container-bs">
                  <Box
                    container
                    spacing={2}
                    alignItems="center"
                    className="input-section-buysell"
                    sx={{
                      alignItems: "flex-start !important",
                      gap: "10px !important",
                    }}
                  >
                    <Typography>Enter Amount</Typography>
                    <Box>
                      <TextField
                        type="number"
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={amount === 0 ? "" : amount}
                        placeholder="0"
                        sx={{
                          height: "30px",
                          borderRadius: "6px",
                          backgroundColor: "#00dda214", // Light green background
                          "& .MuiOutlinedInput-root": {
                            border: "none", // Remove default border
                            "& fieldset": { border: "none" }, // Remove border on normal state
                            "&:hover fieldset": { border: "none" }, // Remove border on hover
                            "&.Mui-focused fieldset": { border: "none" }, // Remove border on focus
                            color: "#008360", // Green text inside field
                          },
                          input: {
                            color: "#008360", // Ensures text inside input is green
                            height: "15px",
                          },
                        }}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        InputProps={{
                          startAdornment: (
                            <Typography
                              sx={{ marginRight: 1, color: "#008360" }}
                            >
                              ₹
                            </Typography>
                          ),
                        }}
                      />
                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button
                          variant="outlined"
                          color="success"
                          sx={{
                            borderRadius: "50px",
                            padding: 0,
                            height: "28px",
                          }}
                          onClick={() => handleAmountChange(100)}
                        >
                          + ₹100
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleAmountChange(500)}
                          color="success"
                          sx={{
                            borderRadius: "50px",
                            padding: 0,
                            height: "28px",
                          }}
                        >
                          + ₹500
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Divider />

                <Button
                  variant="contained"
                  fullWidth
                  // color={tabValue === "add" ? "success" : "warning"}
                  onClick={tabValue === "add" ? handlePayment : handleWithdraw}
                  disabled={isProcessing}
                  sx={{
                    fontWeight: "bold",
                    borderRadius: "8px",
                    bottom: 0,
                    backgroundColor: "#008360", // ✅ Corrected (no extra quotes)
                    "&:hover": {
                      backgroundColor: "#006e50", // Darker shade for hover effect
                    },
                    marginTop: "10px",
                  }}
                >
                  {isProcessing
                    ? "Processing..."
                    : tabValue === "add"
                    ? "ADD"
                    : "WITHDRAW"}
                </Button>
              </Box>
            </Box>
          </Box>
          {/* </Grid> */}
        </Box>

        {/* ---------------------------------------------------------- */}
      </Box>
    </>
  );
};

export default CapitalDetails;
