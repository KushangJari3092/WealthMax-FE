/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Grid,
} from "@mui/material";
import { symbolMapping } from "../../constants/symbolMaping";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../../styles/stockDetails.css";
import { buyStock, sellStock } from "../../store/slices/tradeSlice";
import { getUser } from "../../store/slices/userSlice";

export default function BuySellCard({ priceData }) {
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const [tabValue, setTabValue] = useState("buy");
  const [toggleValue, setToggleValue] = useState("delivery");
  const [qty, setQty] = useState("");
  const [priceLimit, setPriceLimit] = useState(priceData.currentPrice || 0);

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleToggleChange = (event, newValue) =>
    setToggleValue(newValue || toggleValue);

  const handleOrder = async () => {
    if (!qty || parseInt(qty) <= 0 || !Number.isInteger(Number(qty))) {
      toast.error("Please enter a valid integer quantity");
      return;
    }

    const totalCost = priceData.currentPrice * parseInt(qty);

    if (tabValue === "buy") {
      if (totalCost > user?.demat_balance) {
        toast.error("Insufficient balance to buy the selected quantity");
        return;
      }

      const response = await dispatch(
        buyStock({
          symbol: symbolMapping[symbol].symbol,
          quantity: parseInt(qty),
          price: priceData.currentPrice,
          totalCost,
        })
      );

      if (response?.success) {
        // toast.success("Stock bought successfully!");
        setQty("");
        dispatch(getUser());
      } else {
        // toast.error(response?.error || "Failed to buy stock");
      }
    } else if (tabValue === "sell") {
      const response = await dispatch(
        sellStock({
          symbol: symbolMapping[symbol].symbol,
          quantity: parseInt(qty),
          price: priceData.currentPrice,
          totalCost,
        })
      );

      if (response?.success) {
        // toast.success("Stock sold successfully!");
        setQty("");
        dispatch(getUser());
      } else {
        // toast.error(response?.error || "Failed to sell stock");
      }
    }
  };

  return (
    <Box className="buy-sell-container">
      <Box className="buy-sell-box">
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "grey" }}>
            {symbolMapping[symbol].title}
          </Typography>
          <Divider sx={{ mt: 1 }} />
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              mt: 1,
              mb: 2,
              "& .MuiTab-root": {
                color: "grey",
                textTransform: "none",
                fontWeight: 600,
              },
              "& .Mui-selected": {
                color:
                  tabValue === "buy"
                    ? "green !important"
                    : tabValue === "sell"
                      ? "red"
                      : "black !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor:
                  tabValue === "buy"
                    ? "green"
                    : tabValue === "sell"
                      ? "red"
                      : "black !important",
                height: "2px",
              },
            }}
          >
            <Tab label="BUY" value="buy" />
            <Tab label="SELL" value="sell" />
          </Tabs>

          <ToggleButtonGroup
            value={toggleValue}
            exclusive
            onChange={handleToggleChange}
            sx={{ mb: 2 }}
            fullWidth
          >
            <ToggleButton value="delivery" sx={{ height: "30px" }}>
              Delivery
            </ToggleButton>
            <ToggleButton value="intraday" sx={{ height: "30px" }}>
              Intraday
            </ToggleButton>
            <ToggleButton value="mtf" sx={{ height: "30px" }}>
              MTF
            </ToggleButton>
          </ToggleButtonGroup>

          <Box className="input-container-bs">
            <Box
              container
              spacing={2}
              alignItems="center"
              className="input-section-buysell"
            >
              <Typography>Quantity</Typography>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  InputProps={{
                    sx: {
                      padding: "0",
                      height: "30px",
                    },
                  }}
                />
              </Grid>
            </Box>
            {/* <Box
              container
              spacing={2}
              alignItems="center"
              className="input-section-buysell"
            >
              <Typography>Price Limit</Typography>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={priceLimit}
                  disabled
                  InputProps={{
                    sx: {
                      padding: "0",
                      height: "30px",
                    },
                  }}
                />
              </Grid>
            </Box> */}
          </Box>
          {tabValue === "buy" && qty * priceData?.currentPrice > user?.demat_balance && (
            <Typography variant="body1" color="error" sx={{ mt: 2 }}>
              Insufficient balance for this quantity
            </Typography>
          )}
          {!Number.isInteger(Number(qty)) && qty && (
            <Typography variant="body1" color="error">
              Quantity must be an integer
            </Typography>
          )}
        </Box>
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, mb: 2 }}
          >
            Order will be executed at the current market price
          </Typography>

          <Divider />

          <Grid sx={{display:'flex', flexDirection:'column', mt: 1, mb: 2 }}>
            {qty && Number.isInteger(Number(qty)) && <Typography variant="body1">
              Required Amount : <span style={{ color: 'green' }}>₹{(qty * priceData?.currentPrice).toFixed(2)}</span>
            </Typography>}
            <Typography variant="body1" sx={{  color: 'grey' }}>
              Available Balance : ₹{user?.demat_balance?.toFixed(2)}
            </Typography>
          </Grid>

          <Button
            variant="contained"
            fullWidth
            color={tabValue === "buy" ? "success" : "error"}
            sx={{
              fontWeight: "bold",
              borderRadius: "8px",
            }}
            onClick={handleOrder}
          >
            {tabValue === "buy" ? "BUY" : "SELL"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
