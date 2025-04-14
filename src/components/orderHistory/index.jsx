/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory } from "../../store/slices/ordersSlice";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    CircularProgress,
    TextField,
    FormControlLabel,
    Checkbox,
    Grid,
    Divider,
    Button,
} from "@mui/material";
import { symbolMapping } from "../../constants/symbolMaping";

// Helper function to normalize dates (remove time component)
const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0); // Set time to midnight
    return normalized;
};

const OrderHistory = () => {
    const dispatch = useDispatch();
    const { orderHistory } = useSelector((state) => state.orders);
    const { loading } = useSelector((state) => state.common);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [showBuyOrders, setShowBuyOrders] = useState(true);
    const [showSellOrders, setShowSellOrders] = useState(true);

    useEffect(() => {
        dispatch(getOrderHistory());
    }, [dispatch]);

    // Filtered orders based on filters
    const filteredOrders = orderHistory.filter((order) => {
        const orderDate = normalizeDate(order.createdAt); // Normalize order date
        const from = fromDate ? normalizeDate(fromDate) : null; // Normalize from date
        const to = toDate ? normalizeDate(toDate) : null; // Normalize to date

        // Filter by search term
        const matchesSearchTerm =
            searchTerm === "" ||
            order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (symbolMapping[order.symbol]?.title || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        // Filter by date range
        const matchesDateRange =
            (!from || orderDate >= from) && (!to || orderDate <= to);

        // Filter by order type (buy/sell)
        const matchesOrderType =
            (showBuyOrders && order.type === "buy") ||
            (showSellOrders && order.type === "sell");

        return matchesSearchTerm && matchesDateRange && matchesOrderType;
    });

    // Group orders by date
    const groupedOrders = filteredOrders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(order);
        return acc;
    }, {});

    return (
        <Box className="watchlist-container">
            <Grid container spacing={3}>
                {/* Left: Filters Section */}
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            backgroundColor: "#fff",
                            position: "sticky",
                            top: "16px",
                            zIndex: 1,
                        }}
                    >
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
                                sx={{ fontWeight: "bold", color: "#333" }}
                            >
                                Filters
                            </Typography>
                            <Button
                                variant="text"
                                color="primary"
                                onClick={() => {
                                    setSearchTerm("");
                                    setFromDate("");
                                    setToDate("");
                                    setShowBuyOrders(true);
                                    setShowSellOrders(true);
                                }}
                                sx={{ textTransform: "none", fontSize: "14px" }}
                            >
                                Clear Filters
                            </Button>
                        </Box>

                        {/* Search Stock */}
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search for a Stock"
                            sx={{ mb: 2 }}
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {/* Date Range Filters */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                mb: 2,
                            }}
                        >
                            From:
                            <TextField
                                type="date"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                            To:
                            <TextField
                                type="date"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Order Status Filters */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={showBuyOrders}
                                    onChange={(e) => setShowBuyOrders(e.target.checked)}
                                />
                            }
                            label="Buy orders"
                        />
                        <br />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={showSellOrders}
                                    onChange={(e) => setShowSellOrders(e.target.checked)}
                                />
                            }
                            label="Sell orders"
                        />
                    </Box>
                </Grid>

                {/* Right: Order History Table */}
                <Grid item xs={12} md={8}>
                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "200px",
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : filteredOrders.length > 0 ? (
                        <Box>
                            {Object.keys(groupedOrders).map((date) => (
                                <Box key={date} sx={{ mb: 4 }}>
                                    {/* Date Header */}
                                    <Typography
                                        sx={{
                                            fontWeight: "bold",
                                            color: "grey",
                                            mb: 2,
                                            borderBottom: "1px solid #e0e0e0",
                                            pb: 1,
                                        }}
                                    >
                                        {date}
                                    </Typography>

                                    {/* Orders Table */}
                                    <TableContainer
                                        component={Paper}
                                        sx={{ borderRadius: "8px", overflow: "auto", mb: 2 }}
                                    >
                                        <Table>
                                            <TableBody>
                                                {groupedOrders[date].map((order) => (
                                                    <TableRow key={order._id}>
                                                        {/* Symbol and Type */}
                                                        <TableCell sx={{ fontSize: "15px", width: "20%" }}>
                                                            <Typography variant="body1">
                                                                {symbolMapping[order.symbol]?.title ||
                                                                    order.symbol}
                                                            </Typography>
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: "bold",
                                                                    color:
                                                                        order.type === "buy" ? "green" : "red",
                                                                }}
                                                            >
                                                                {order.type}
                                                            </Typography>
                                                        </TableCell>

                                                        {/* Quantity */}
                                                        <TableCell
                                                            sx={{
                                                                fontSize: "15px",
                                                                width: "15%",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <Typography variant="body1">
                                                                {order.quantity}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                            >
                                                                Qty
                                                            </Typography>
                                                        </TableCell>

                                                        {/* Average Price */}
                                                        <TableCell
                                                            sx={{
                                                                fontSize: "15px",
                                                                width: "15%",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <Typography variant="body1">
                                                                ₹{order.price.toFixed(2)}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                            >
                                                                Avg Price
                                                            </Typography>
                                                        </TableCell>

                                                        {/* Date & Time */}
                                                        <TableCell
                                                            sx={{
                                                                fontSize: "15px",
                                                                width: "30%",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            <Typography variant="body1">
                                                                {new Date(order.createdAt).toLocaleDateString(
                                                                    "en-GB"
                                                                )}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                            >
                                                                {new Date(order.createdAt).toLocaleTimeString()}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography
                            variant="h6"
                            sx={{ textAlign: "center", color: "grey", mt: 3 }}
                        >
                            No orders found.
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default OrderHistory;
