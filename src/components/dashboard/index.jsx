/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, CircularProgress, Grid } from "@mui/material";
import { symbolMapping } from "../../constants/symbolMaping";

export default function Dashboard() {
  const navigate = useNavigate();
  const [priceData, setPriceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connect to the WebSocket server
    const ws = new WebSocket("ws://localhost:8081");

    // Listen for messages (price updates) from the server
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);


      // Update the price data for the corresponding symbol
      setPriceData((prevData) => ({
        ...prevData,
        [data.symbol]: {
          currentPrice: data.currentPrice,
          priceDifference: data.priceDifference,
          percentageDifference: data.percentageDifference,
          prevDayClose: data.prevDayClose
        },
      }));

      // Set loading to false after first data comes in
      setLoading(false);
    };

    // Clean up the WebSocket connection when the component is unmounted
    return () => {
      ws.close();
    };
  }, []);

  // Show loader while waiting for data
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading market data...</Typography>
      </Box>
    );
  }

  return (
    <Box className="watchlist-container">
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: "#014188", mb: 3, textAlign: "center" }}
      >
        Market Overview
      </Typography>

      <Grid container spacing={3}>
        {Object.keys(priceData).map((symbol) => {
          const stock = priceData[symbol];
          console.log("stock",stock);
          
          const isPositive = stock?.currentPrice - stock?.prevDayClose >= 0;

          return (
            <Grid item xs={12} sm={6} md={4} key={symbol}>
              <Card
                sx={{
                  borderRadius: "8px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => navigate(`/marketDetails/${symbol}`)}
              >
                <CardContent>
                  {/* Symbol and Stock Name */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      // variant="h6"
                      sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap:'10px'}}
                    >
                      <img src={symbolMapping[symbol].logo} width={30}/> <span>{symbolMapping[symbol]?.symbol || symbol}</span>
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#636e72" }}
                    >
                      ₹{stock?.currentPrice && stock?.currentPrice?.toFixed(2) || "0.00"}
                    </Typography>
                  </Box>

                  {/* Price Difference */}
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color: isPositive ? "green" : "red",
                      mb: 1,
                    }}
                  >
                    {(stock?.currentPrice - stock?.prevDayClose) >=0 ? '+':''}
                    {(stock?.currentPrice - stock?.prevDayClose).toFixed(2)} 
                    ({(((stock?.currentPrice - stock?.prevDayClose)/stock?.prevDayClose)*100).toFixed(2)+'%' || "0.00"})
                  </Typography>

                  {/* Additional Info */}
                  <Typography
                    variant="body2"
                    sx={{ color: "#636e72", fontStyle: "italic" }}
                  >
                    Click to view more details
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
