/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  ComposedChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BsBookmarkPlus, BsBookmarkDashFill } from "react-icons/bs";
import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import { symbolMapping } from "../../constants/symbolMaping";
import "../../styles/stockDetails.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../../store/slices/watchListSlice";
import { toast } from "react-toastify";
import { getUser } from "../../store/slices/userSlice";
import { setLoading } from "../../store/slices/commonSlice";
import { ImManWoman } from "react-icons/im";

const StockChart = ({ priceData, chartData }) => {
  const { symbol } = useParams(); // Get the symbol from the URL params
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const loading = useSelector((state) => state.common?.loading);

  const [addToWatchList, setaddToWatchList] = useState(null);

  useEffect(() => {
    dispatch(getUser());
  }, [addToWatchList, dispatch]);

  useEffect(() => {
    if (user?.watchlist) {
      setaddToWatchList(user.watchlist.includes(symbol));
    }
  }, [user?.watchlist]);

  const handleWatchlist = async () => {
    setaddToWatchList((prev) => !prev);
    // dispatch(setLoading(true));
    if (!addToWatchList) {
      const res = await dispatch(addToWatchlist({ symbol }));
      console.log("res", res);
      if (res.success) {
        toast.success(`${symbolMapping[symbol].title} saved in your watchlist`);
      } else {
        toast.error(res?.data?.data?.message);
      }
    } else {
      const res = await dispatch(removeFromWatchlist({ symbol }));
      console.log("res", res);
      if (res.success) {
        toast.success(
          `${symbolMapping[symbol].title} removed from your watchlist`
        );
      } else {
        toast.error(res?.data?.data?.message);
      }
    }
    // dispatch(setLoading(false));
  };

  // if (loading) {
  //   return (
  //     <div className="loader" style={{ background: "transperant" }}>
  //       <div className="spinner"></div>
  //       <p>Updating Your Watchlist...</p>
  //     </div>
  //   );
  // }
  console.log("priceData.currentPrice - priceData.prevDayClose",priceData.currentPrice - priceData.prevDayClose);
  
  return (
    <div className="detail-container">
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img src={symbolMapping[symbol].logo} className="logo-title" style={{ marginBottom: '10px' }} />


          <button className="watchlist-btn" onClick={handleWatchlist}>
            {loading ? (
              <div className="loader1">
                <div className="spinner1"></div>
              </div>
            ) : !addToWatchList ? (
              <BsBookmarkPlus fontSize={14} />
            ) : (
              <BsBookmarkDashFill fontSize={14} fill="#017042" />
            )}
            Watchlist
          </button>
        </Box>
        <Typography className="title">
          {" "}
          {symbolMapping[symbol].title}
        </Typography>
        <div className="title-price">
          <Typography className="price">
            ₹
            {priceData.currentPrice
              ? priceData.currentPrice.toFixed(2)
              : "0.00"}
          </Typography>
          <Typography
            className={`price-difference ${priceData.currentPrice - priceData.prevDayClose >= 0 ? "positive" : "negative"
              }`}
            style={{
              color:
                priceData.currentPrice - priceData.prevDayClose >= 0 ? 'green': 'red'
            }}
          >
            {(priceData.currentPrice - priceData.prevDayClose>0 ? '+':'') + (priceData.currentPrice - priceData.prevDayClose).toFixed(2) || "0.00"} (
            {(((priceData.currentPrice - priceData.prevDayClose)/priceData.prevDayClose)*100).toFixed(2)+'%'
              || "0.00%"}
            )
          </Typography>
        </div>
      </Box>
      <div className="chart-container">
        {/* Display the symbol name */}
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} sx={{ border: "2px solid red" }}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              hide={true}
              dataKey="time"
              domain={["3:30:00", "18:30:00"]} // Fixed domain from 3:30 PM to 6:30 PM
              tickFormatter={(tick) => moment(tick, "HH:mm:ss").format("HH:mm")} // Format timestamps for better readability
            />
            <YAxis
              hide={true} // Hide Y-axis
              domain={["auto", "auto"]} // Set domain to auto
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="close"
              stroke={priceData.priceDifference >= 0 ? "#00b894" : "red"}
              strokeWidth={2}
              dot={false} // Use custom dot component for the end of the line
              isAnimationActive={false} // Disable animation for smoother updates
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;
