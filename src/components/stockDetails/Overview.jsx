/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Divider, Grid, LinearProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { symbolMapping } from "../../constants/symbolMaping";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Overview({ priceData }) {
  const [value, setValue] = React.useState(0);
  const { symbol } = useParams();
  const user = useSelector((state) => state.user?.user);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const calculateProfitLoss = (avgPrice, currentPrice, quantity) => {
    const profitLoss = (currentPrice - avgPrice) * quantity;
    const profitLossPercentage = ((currentPrice - avgPrice) / avgPrice) * 100;
    return { profitLoss, profitLossPercentage };
  };

  // Check if the symbol exists in the user's stocks
  const hasHoldings = user?.stocks?.some(
    (stock) => stock.symbol === symbolMapping[symbol]?.symbol
  );

  return (
    <Box className="overview-container">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Overview"
            {...a11yProps(0)}
            sx={{
              color: "#014188",
              "&.Mui-selected": {
                color: "#014188",
              },
              fontWeight: 600,
            }}
          />
          {hasHoldings && (
            <Tab
              label="DP Holding"
              {...a11yProps(1)}
              sx={{
                color: "#014188",
                "&.Mui-selected": {
                  color: "#014188",
                },
                fontWeight: 600,
              }}
            />
          )}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {/* Performance Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            sx={{ fontWeight: "bold", fontSize: "20px", color: "#636e72" }}
          >
            Performance
          </Typography>
          <Typography sx={{ color: "#636e72" }}>i</Typography>
        </Box>
        {/* Today's Low/High */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={2}>
            <Typography>Today’s Low</Typography>
            <Typography sx={{ fontWeight: "bold", color: "red" }}>
              {+priceData?.low?.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 4,
                backgroundColor: "#00800078",
                borderRadius: 2,
              }}
            >
              {/* Range bar */}
              <Box
                sx={{
                  position: "absolute",
                  top: "-12px",
                  left:
                    priceData?.high && priceData?.low
                      ? `${
                          ((priceData.currentPrice - priceData.low) /
                            (priceData.high - priceData.low)) *
                          100
                        }%`
                      : "0%",
                  transform: "translateX(-50%)",
                }}
              >
                {/* Triangle marker */}
                <Box
                  sx={{
                    width: 0,
                    height: 20,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderBottom: "10px solid gray",
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: "right" }}>
            <Typography>Today’s High</Typography>
            <Typography sx={{ fontWeight: "bold", color: "green" }}>
              {+priceData?.high?.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />
        {/* Stock Details Section */}
        <Grid container spacing={3}>
          <Grid item xs={2}>
            <Typography>Open</Typography>
            <Typography sx={{ fontWeight: "bold", color: "#636e72" }}>
              {priceData?.open?.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Prev. Close</Typography>
            <Typography sx={{ fontWeight: "bold", color: "#636e72" }}>
              {priceData?.prevDayClose?.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Volume</Typography>
            <Typography sx={{ fontWeight: "bold", color: "#636e72" }}>
              {priceData?.volume?.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>Total traded value</Typography>
            <Typography sx={{ fontWeight: "bold", color: "#636e72" }}>
              {priceData?.totalTradeValue?.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={2}>
            <Typography>Upper Circuit</Typography>
            <Typography sx={{ fontWeight: "bold", color: "#636e72" }}>
              182.40
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Lower Circuit</Typography>
            <Typography sx={{ fontWeight: "bold", color: "#636e72" }}>
              121.60
            </Typography>
          </Grid>
        </Grid>
      </CustomTabPanel>

      {/* My Holdings Tab */}
      {hasHoldings && (
        <CustomTabPanel value={value} index={1}>
          <Grid container direction="column">
            {user?.stocks?.map((stock) => {
              const { profitLoss, profitLossPercentage } = calculateProfitLoss(
                stock?.price,
                priceData?.currentPrice,
                stock?.quantity
              );

              return (
                stock?.symbol === symbolMapping[symbol]?.symbol && (
                  <Grid
                    container
                    direction="column"
                    spacing={2}
                    key={stock?.symbol}
                    sx={{
                      mb: 4,
                      p: 2,
                      borderRadius: "8px",
                    }}
                  >
                    <Grid item sx={{ display: "flex" }}>
                      <Typography sx={{ minWidth: "200px" }}>
                        Available Quantity
                      </Typography>
                      <Typography
                        sx={{ fontWeight: "bold", color: "#636e72" }}
                      >
                        {stock?.quantity}
                      </Typography>
                    </Grid>
                    <Grid item sx={{ display: "flex" }}>
                      <Typography sx={{ minWidth: "200px" }}>
                        Hold Price
                      </Typography>
                      <Typography
                        sx={{ fontWeight: "bold", color: "#636e72" }}
                      >
                        ₹{stock?.price?.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item sx={{ display: "flex" }}>
                      <Typography sx={{ minWidth: "200px" }}>
                        Current Price
                      </Typography>
                      <Typography
                        sx={{ fontWeight: "bold", color: "#636e72" }}
                      >
                        ₹{priceData?.currentPrice?.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item sx={{ display: "flex" }}>
                      <Typography sx={{ minWidth: "200px" }}>
                        Invested Value
                      </Typography>
                      <Typography
                        sx={{ fontWeight: "bold", color: "#636e72" }}
                      >
                        ₹{(stock?.quantity * stock?.price).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item sx={{ display: "flex" }}>
                      <Typography sx={{ minWidth: "200px" }}>
                        Market Value
                      </Typography>
                      <Typography
                        sx={{ fontWeight: "bold", color: "#636e72" }}
                      >
                        ₹{(stock?.quantity * priceData?.currentPrice).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item sx={{ display: "flex" }}>
                      <Typography sx={{ minWidth: "200px" }}>
                        Profit/Loss
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: profitLoss >= 0 ? "green" : "red",
                        }}
                      >
                        ₹ {profitLoss.toFixed(2)} (
                        {profitLossPercentage.toFixed(2)}%)
                      </Typography>
                    </Grid>
                  </Grid>
                )
              );
            })}
          </Grid>
        </CustomTabPanel>
      )}
    </Box>
  );
}
