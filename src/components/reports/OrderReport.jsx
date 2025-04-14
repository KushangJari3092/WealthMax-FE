/* eslint-disable react/prop-types */
import { useState } from "react";
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
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";

const OrderReport = ({ orders }) => {
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

  const handleDownloadExcel = () => {
    if (orders?.length > 0) {
      // Define the data for the Excel file
      const data = orders.map((order) => ({
        "Order ID": order._id,
        Symbol: order.symbol,
        Quantity: order.quantity,
        "Price (₹)": order.price.toFixed(2),
        "Total Cost (₹)": order.totalCost.toFixed(2),
        Type: order.type.charAt(0).toUpperCase() + order.type.slice(1),
        Date: new Date(order.createdAt).toLocaleDateString("en-GB"),
      }));

      // Create a new workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

      // Generate and download the Excel file
      XLSX.writeFile(workbook, "Order_Report.xlsx");
    } else {
      alert("No orders available to download.");
    }
  };

  // Paginate the orders
  const paginatedOrders = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#014188" }}
        >
          Orders
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="outlined"
            color="warning"
            size="small"
            startIcon={<DownloadIcon />}
            sx={{ textTransform: "none", fontSize: "16px" }}
            onClick={handleDownloadExcel}
          >
            Download
          </Button>
        </Box>
      </Box>

      {orders?.length > 0 ? (
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
                    Order ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Stock
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Price (₹)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Total Cost (₹)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#014188" }}>
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.symbol}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>₹{order.price.toFixed(2)}</TableCell>
                    <TableCell>₹{order.totalCost.toFixed(2)}</TableCell>
                    <TableCell
                      sx={{
                        color: order.type === "buy" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={orders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      ) : (
        <Typography
          variant="body1"
          sx={{ textAlign: "center", color: "grey", mt: 3 }}
        >
          No orders found.
        </Typography>
      )}
    </Box>
  );
};

export default OrderReport;