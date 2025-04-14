/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { Children } from "react";
import { Box, Card } from "@mui/material";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
