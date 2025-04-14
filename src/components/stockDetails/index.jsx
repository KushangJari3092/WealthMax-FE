/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Box, Grid } from "@mui/material";
import StockChart from "./StockChart";
import BuySellCard from "./BuySellCard";
import Overview from "./Overview";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";

export default function StockDetails() {
  const { symbol } = useParams();
  const [chartData, setChartData] = useState([]); // State for holding chart data
  const [priceData, setPriceData] = useState({});
  const wsRef = useRef(null); // WebSocket reference to handle the connection
  // const user = useSelector((state) => state?.auth?.user);
  // console.log("user", user);
  useEffect(() => {
    // Establish WebSocket connection to the server
    wsRef.current = new WebSocket("ws://localhost:8082"); // Ensure this matches your WebSocket server port

    // When the WebSocket connection opens, send the symbol to the backend
    wsRef.current.onopen = () => {
      console.log(`Connected to WebSocket, subscribing to symbol: ${symbol}`);
      wsRef.current.send(JSON.stringify({ symbol })); // Send the symbol to the backend when connected
    };

    // Listen for WebSocket messages
    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data); // Parse the incoming message
      // console.log("message.currentPrice", message);
      // Check if the message is a price update for the symbol
      if (message.symbol === symbol) {
        const currentTime = moment(); // Get the current time

        const newPoint = {
          time: currentTime.format("HH:mm:ss"), // Format time for the X-axis
          close: parseFloat(message.currentPrice), // Close price for the Y-axis
        };

        // Update the chart data with the new price
        setChartData((prevData) => {
          // Keep all points, but slice to maintain the last 20 points
          const updatedData = [...prevData, newPoint]; // Only keep last 20 points
          return updatedData;
        });
        setPriceData({
          currentPrice: +message.currentPrice,
          priceDifference: message.priceDifference,
          percentageDifference: message.percentageDifference,
          high: +message.high,
          low: +message.low,
          open: +message.open,
          prevDayClose: +message.prevDayClose,
          totalTradeValue: +message.totalTradeValue,
          volume: +message.volume,
          symbol: +message.symbol,
        });
      }
    };

    // Cleanup the WebSocket connection when the component unmounts
    return () => {
      if (wsRef.current) {
        wsRef.current.close(); // Close the WebSocket connection
        console.log("WebSocket closed");
      }
    };
  }, [symbol]); // Effect runs whenever the symbol changes

  return (
    <Box className="stock-details-container">
      <Grid container spacing={2}>
        {/* StockChart component takes 70% width */}
        <Grid item xs={12} md={8}>
          <StockChart chartData={chartData} priceData={priceData} />
        </Grid>

        {/* BuySellCard component takes 30% width */}
        <Grid item xs={12} md={4}>
          <BuySellCard priceData={priceData}/>
        </Grid>
      </Grid>
      <Grid>
        <Grid item xs={12} md={8}>
          <Overview chartData={chartData} priceData={priceData} />
        </Grid>
      </Grid>
    </Box>
  );
}
