/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../store/slices/userSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Paper,
  Tooltip,
  Box,
} from "@mui/material";
import { RiAddCircleLine } from "react-icons/ri";
import { IoIosCheckmarkCircle } from "react-icons/io";
import "../../styles/watchlist.css"; // External CSS for styling
import { symbolMapping } from "../../constants/symbolMaping";
import { setLoading } from "../../store/slices/commonSlice";
import { toast } from "react-toastify";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../../store/slices/watchListSlice";
import { MdOutlinePlaylistRemove } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function WatchList() {
  const wsRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [symbols, setSymbols] = useState([]); // Symbols array
  const [inWatchlist, setinWatchlist] = useState({}); // Symbols array
  const [pricesData, setPricesData] = useState({}); // Store the live prices and other data for each symbol
  const user = useSelector((state) => state.user?.user);
  const loading = useSelector((state) => state.common?.loading);

  useEffect(() => {
    // Initialize WebSocket connection
    wsRef.current = new WebSocket("ws://localhost:8083");
    dispatch(setLoading(true));
    wsRef.current.onopen = () => {
      console.log(`Connected to WebSocket, subscribing to symbols: ${symbols}`);
      wsRef.current.send(JSON.stringify({ symbols })); // Send array of symbols to subscribe
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data); // Parse incoming WebSocket data
      // console.log("Received price data", data);

      // Update the pricesData state with the incoming data for multiple symbols
      setPricesData(data);
    };
    dispatch(setLoading(false));
    // Cleanup the WebSocket connection when the component unmounts
    return () => {
      if (wsRef.current) {
        wsRef.current.close(); // Close the WebSocket connection
        console.log("WebSocket closed");
      }
    };
  }, [symbols]); // Effect runs whenever the symbols array changes

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?.watchlist) {
      setSymbols(user?.watchlist);
      const watchlistState = user.watchlist.reduce((acc, symbol) => {
        acc[symbol] = true; // Set each symbol to true
        return acc;
      }, {});

      setinWatchlist(watchlistState); // Update the inWatchlist state
    }
  }, [user?.watchlist]);


  const handleWatchlist = async (symbol, type) => {
    // dispatch(setLoading(true));
    if (type === "add") {
      const res = await dispatch(addToWatchlist({ symbol }));

      if (res.success) {
        toast.success(`${symbolMapping[symbol].title} saved in your watchlist`);
        setinWatchlist((prev) => ({ ...prev, [symbol]: true }));
      } else {
        toast.error(res?.data?.data?.message);
      }
    } else {
      const res = await dispatch(removeFromWatchlist({ symbol }));

      if (res.success) {
        toast.success(
          `${symbolMapping[symbol].title} removed from your watchlist`
        );
        setinWatchlist((prev) => ({ ...prev, [symbol]: false }));
      } else {
        toast.error(res?.data?.data?.message);
      }
    }
    // dispatch(setLoading(false));
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
        <p>Loading Watchlist...</p>
      </div>
    );
  }
  return (
    <div className="watchlist-container">
      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#014188", mb: 3 }}>
        My Watchlist
      </Typography>
      {symbols?.length > 0 ? (
        <TableContainer component={Paper} className="watchlist-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell align="right">Market Price</TableCell>

                <TableCell align="right">Watchlist</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {symbols.map((symbol) => (
                <TableRow key={symbol}>
                  <TableCell
                    scope="row"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      paddingLeft: "20px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/marketDetails/${symbol}`)}
                  >
                    <img
                      src={symbolMapping[symbol].logo}
                      className="logo-title"
                    />
                    <Typography
                      variant="body1"
                      sx={{ color: "rgb(94, 94, 94)", fontWeight: "600" }}
                    >
                      {symbolMapping[symbol].title}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      sx={{ color: "rgb(94, 94, 94)", fontWeight: "600" }}
                    >
                      ₹{pricesData[symbol]?.currentPrice || "0.00"}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        justifyContent: "right",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color:
                            pricesData[symbol]?.priceDifference < 0
                              ? "red"
                              : "green",
                        }}
                      >
                        {pricesData[symbol]?.priceDifference || "0.00"}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color:
                            pricesData[symbol]?.priceDifference < 0
                              ? "red"
                              : "green",
                        }}
                      >
                        {"(" +
                          (pricesData[symbol]?.percentageDifference ||
                            "0.00%") +
                          ")"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip
                      title={
                        inWatchlist[symbol]
                          ? "Remove from watchlist"
                          : "Add to watchlist"
                      }
                      arrow
                    >
                      <IconButton
                        onClick={() =>
                          handleWatchlist(
                            symbol,
                            inWatchlist[symbol] ? "remove" : "add"
                          )
                        }
                      >
                        {inWatchlist[symbol] ? (
                          <IoIosCheckmarkCircle
                            fill="green"
                            className="watchlist-icon checked"
                          />
                        ) : (
                          <RiAddCircleLine className="watchlist-icon unchecked" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="h6"
          sx={{ textAlign: "center", color: "grey", mt: 6 }}
        >
          Your Watchlist is Emplty
        </Typography>

      )}
    </div>
  );
}
