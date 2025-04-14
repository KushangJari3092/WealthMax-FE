/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Grid,
    Paper,
} from "@mui/material";
import { setLoading } from "../../store/slices/commonSlice";
import { getUser } from "../../store/slices/userSlice";
import { symbolMapping, symbolMapping2 } from "../../constants/symbolMaping";

const MyPortfolio = () => {
    const dispatch = useDispatch();
    const wsRef = useRef(null);
    const user = useSelector((state) => state.user?.user);
    const [pricesData, setPricesData] = useState({});
    const [symbols, setSymbols] = useState([]);
    const loading = useSelector((state) => state.common?.loading);
    console.log("pricesData", pricesData);

    const calculateProfitLoss = (avgPrice, currentPrice, quantity) => {
        const profitLoss = (currentPrice - avgPrice) * quantity;
        const profitLossPercentage = ((currentPrice - avgPrice) / avgPrice) * 100;
        return { profitLoss, profitLossPercentage };
    };

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    useEffect(() => {
        if (user?.stocks) {
            const arr = user?.stocks.map(
                (stock) => symbolMapping2[stock.symbol]?.symbol
            );
            setSymbols(arr);
        }
    }, [user?.stocks]);

    useEffect(() => {
        // Initialize WebSocket connection
        wsRef.current = new WebSocket("ws://localhost:8083");
        dispatch(setLoading(true));
        wsRef.current.onopen = () => {
            wsRef.current.send(JSON.stringify({ symbols })); // Send array of symbols to subscribe
        };

        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data); // Parse incoming WebSocket data
            setPricesData(data);
        };
        dispatch(setLoading(false));

        // Cleanup the WebSocket connection when the component unmounts
        return () => {
            if (wsRef.current) {
                wsRef.current.close(); // Close the WebSocket connection
            }
        };
    }, [dispatch, symbols]);

    // Calculate total investment, total current value, and total profit/loss
    const totalSummary = user?.stocks?.reduce(
        (acc, stock) => {
            const currentPrice =
                pricesData[symbolMapping2[stock.symbol]?.symbol]?.currentPrice || 0;

            const investedValue = stock.quantity * stock.price;
            const marketValue = stock.quantity * currentPrice;

            acc.totalInvestment += investedValue;
            acc.totalCurrentValue += marketValue;
            acc.totalProfitLoss += marketValue - investedValue;

            return acc;
        },
        { totalInvestment: 0, totalCurrentValue: 0, totalProfitLoss: 0 }
    );

    return (
        <Box className="watchlist-container">
            <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#014188", mb: 3 }}
            >
                My Portfolio
            </Typography>

            {/* Summary Section */}
            {user?.stocks?.length > 0 && (
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                    }}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1" color="textSecondary">
                                Total Investment
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", color: "#636e72" }}
                            >
                                ₹{totalSummary?.totalInvestment.toFixed(2)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1" color="textSecondary">
                                Total Current Value
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", color: "#636e72" }}
                            >
                                ₹{totalSummary?.totalCurrentValue.toFixed(2)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1" color="textSecondary">
                                Total Profit/Loss
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold",
                                    color:
                                        totalSummary?.totalProfitLoss >= 0 ? "green" : "red",
                                }}
                            >
                                ₹{totalSummary?.totalProfitLoss.toFixed(2)} (
                                {(
                                    (totalSummary?.totalProfitLoss /
                                        totalSummary?.totalInvestment) *
                                    100
                                ).toFixed(2)}
                                %)
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Portfolio Cards */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {user?.stocks?.length > 0 ? (
                    user.stocks.map((stock) => {
                        const currentPrice =
                            pricesData[symbolMapping2[stock.symbol]?.symbol]?.currentPrice ||
                            0;
                        const prevDayClose =
                            pricesData[symbolMapping2[stock.symbol]?.symbol]?.prevDayClose ||
                            0;

                        const { profitLoss, profitLossPercentage } = calculateProfitLoss(
                            stock.price,
                            currentPrice,
                            stock.quantity
                        );

                        return (
                            <Card
                                key={stock.symbol}
                                sx={{
                                    borderRadius: "8px",
                                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <CardContent>
                                    {/* Symbol and Current Price */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "bold", color: "#014188", display: "flex", alignItems: "center", gap: '10px' }}
                                        >
                                            <img src={symbolMapping[stock.symbol].logo} width={30} /> <span>{stock.symbol} </span>
                                            <span style={{color:currentPrice-prevDayClose<0?'red':'green', fontSize:'16px'}}>({(currentPrice-prevDayClose)?.toFixed(2)})</span>
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "bold", color: "#636e72" }}
                                        >
                                            ₹{currentPrice.toFixed(2)}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    {/* Stock Details */}
                                    <Box sx={{ display: "flex", ml: 2, justifyContent: 'space-between', width: '50%' }}>
                                        <Box>
                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="body1" color="textSecondary">
                                                    Quantity
                                                </Typography>
                                                <Typography
                                                    sx={{ fontWeight: "bold", color: "#636e72" }}
                                                >
                                                    {stock.quantity}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="body1" color="textSecondary">
                                                    Avg Price
                                                </Typography>
                                                <Typography
                                                    sx={{ fontWeight: "bold", color: "#636e72" }}
                                                >
                                                    ₹{stock.price.toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box>
                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="body1" color="textSecondary">
                                                    Invested Value
                                                </Typography>
                                                <Typography
                                                    sx={{ fontWeight: "bold", color: "#636e72" }}
                                                >
                                                    ₹{(stock.quantity * stock.price).toFixed(2)}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ mb: 1 }}>
                                                <Typography variant="body1" color="textSecondary">
                                                    Market Value
                                                </Typography>
                                                <Typography
                                                    sx={{ fontWeight: "bold", color: "#636e72" }}
                                                >
                                                    ₹{(stock.quantity * currentPrice).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box>
                                            <Typography variant="body1" color="textSecondary">
                                                Profit/Loss
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: profitLoss >= 0 ? "green" : "red",
                                                }}
                                            >
                                                ₹{profitLoss.toFixed(2)} (
                                                {profitLossPercentage.toFixed(2)}%)
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <Typography
                        variant="h6"
                        sx={{ textAlign: "center", color: "grey", mt: 3 }}
                    >
                        No stocks in your portfolio.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default MyPortfolio;