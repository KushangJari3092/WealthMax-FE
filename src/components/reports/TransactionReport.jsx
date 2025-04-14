/* eslint-disable react/prop-types */
import  { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
} from "@mui/material";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";

const TransactionReport = ({ transactions }) => {
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const handleDownloadExcel = async () => {
    if (transactions?.length > 0) {
      // Define the data for the Excel file
      const data = transactions.map((transaction) => ({
        "Transaction ID": transaction._id,
        Type: transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
        "Amount (₹)": transaction.amount.toFixed(2),
        Status: transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1),
        Date: new Date(transaction.createdAt).toLocaleDateString("en-GB"),
        "Payment ID": transaction.razorpay_payment_id || "N/A",
        "Order ID": transaction.razorpay_order_id || "N/A",
      }));

      // Create a new workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

      // Generate and download the Excel file
      XLSX.writeFile(workbook, "Transaction_Report.xlsx");
    } else {
      alert("No transactions available to download.");
    }
  };

  // Paginate the transactions
  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#014188" }}>
          Transaction Report
        </Typography>
        <Button
          variant="outlined"
          color="warning"
          size="small"
          onClick={handleDownloadExcel}
          startIcon={<DownloadIcon />}
          sx={{ textTransform: "none", fontSize: "16px" }}
        >
          Download
        </Button>
      </Box>
      {transactions?.length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "8px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              overflow: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Transaction ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Amount (₹)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Payment ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Order ID
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction._id}</TableCell>
                    <TableCell
                      sx={{
                        color: transaction.type === "deposit" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </TableCell>
                    <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                    <TableCell
                      sx={{
                        color: transaction.status === "success" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>{transaction.razorpay_payment_id || "-"}</TableCell>
                    <TableCell>{transaction.razorpay_order_id || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={transactions.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      ) : (
        <Typography variant="body1" sx={{ textAlign: "center", color: "grey", mt: 3 }}>
          No transactions found.
        </Typography>
      )}
    </Box>
  );
};

export default TransactionReport;