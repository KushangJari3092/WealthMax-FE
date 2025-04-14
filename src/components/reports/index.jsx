/* eslint-disable no-unused-vars */
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import TransactionReport from "./TransactionReport";
import OrderReport from "./OrderReport";
import { useDispatch, useSelector } from "react-redux";
import { getAllTransactionsReports, getOrdersReports } from "../../store/slices/reportsSlice";


const Reports = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.reports?.transactions);
  const orders = useSelector((state) => state.reports?.orders);
  const [selectedReport, setSelectedReport] = useState(""); // Default report type
  const [orderType, setOrderType] = useState("all"); // Default filter for orders
  const [transactionType, setTransactionType] = useState("all"); // Default filter for transactions
  const [fromDate, setFromDate] = useState(""); // Default from date
  const [toDate, setToDate] = useState(""); // Default to date
  const [show, setShow] = useState(false);
  console.log("orders",orders);
  

  const handleGenerateReport = async () => {
    const filters = {
      reportType: selectedReport,
      orderType: selectedReport === "orders" ? orderType : undefined,
      transactionType: selectedReport === "transactions" ? transactionType : undefined,
      fromDate,
      toDate,
    };

    if (selectedReport === "transactions") {
      await dispatch(getAllTransactionsReports(filters));
      setShow(true);
    }
    if (selectedReport === "orders") {
      await dispatch(getOrdersReports(filters));
      setShow(true);
    }
  };

  return (
    <Box className="watchlist-container">
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: "#014188", mb: 3 }}
      >
        Reports
      </Typography>

      {/* Header Section */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Report Type Selection */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Typography sx={{ fontWeight: "bold" }}>Select Report Type:</Typography>
          <RadioGroup
            row
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
          >
            <FormControlLabel
              value="orders"
              control={<Radio />}
              label="Order Report"
            />
            <FormControlLabel
              value="transactions"
              control={<Radio />}
              label="Transaction Report"
            />
          </RadioGroup>
        </Box>

        {/* Filters Section */}
        {selectedReport && (
          <Box
            sx={{
              display: "flex",
              // justifyContent: "space-between",
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {selectedReport === "orders" && (
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel>Order Type</InputLabel>
                  <Select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="buy">Buy</MenuItem>
                    <MenuItem value="sell">Sell</MenuItem>
                  </Select>
                </FormControl>
              )}

              {selectedReport === "transactions" && (
                <FormControl sx={{ minWidth: 200 }} size="small">
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="deposit">Deposit</MenuItem>
                    <MenuItem value="withdrawal">Withdraw</MenuItem>
                  </Select>
                </FormControl>
              )}

              <TextField
                label="From Date"
                type="date"
                size="small"
                sx={{ minWidth: 200 }}
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <TextField
                label="To Date"
                type="date"
                size="small"
                sx={{ minWidth: 200 }}
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
          
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateReport}
              >
                Generate Report
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Box>
        {show &&
          (selectedReport === "transactions" ? (
            <TransactionReport transactions={transactions} />
          ) : selectedReport === "orders" ? (
            <OrderReport orders={orders}/>
          ) : (
            <></>
          ))}
      </Box>
    </Box>
  );
};

export default Reports;