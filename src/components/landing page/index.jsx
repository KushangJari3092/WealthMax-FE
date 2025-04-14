/* eslint-disable no-unused-vars */
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import "../../styles/landingPage.css";
import animation from "../../assets/animation1.mp4";
import leaf from "../../assets/leaf.png";

export default function LandingPage() {
 
  return (
    <>
      <Box className="container">
        <Box className="title-section">
          <Typography className="t1">All things finance,</Typography>
          <Typography className="t1"> right here.</Typography>
          <Typography className="sub-t">Built for a growing India.</Typography>
        </Box>
        <Box className="video-section">
          <video
            src={animation} // Source of the video
            autoPlay
            loop
            muted
            playsInline
            className="video" // You can add this class for custom styling
          />
        </Box>
        <Box className="intro">
          <Box className="leaf-section">
            <img src={leaf} width={20} height={50} />

            <Box>
              <Typography className="txt">India&apos;s #1</Typography>
              <Typography className="txt">Stock Broker</Typography>
            </Box>

            <img src={leaf} width={20} height={50} className="lastLeaf" />
          </Box>
          <Box
            className="txt2"
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              width: "100%",
            }}
          >
            <Box
              sx={{
                position: "relative", // Ensure text is above the line
                zIndex: 1, // Make sure text appears above the line
                backgroundColor: "white",
                // border: "2px solid red",
                padding: "0 8px",
                width: "fit-content",
              }}
            >
              Trusted by 10 Mn+ active investors
            </Box>

            <Box
              className="line-behind-txt2"
              sx={{
                position: "absolute", // Make the line appear behind the text
                top: "60%", // Position line vertically in the middle of the text
                left: 0, // Align the line with the text
                width: "100%", // Extend the line to the width of the text container
                height: "3px", // Height of the line
                background:
                  "linear-gradient(90deg, hsla(60, 14%, 99%, 0) 0%, hsla(0, 0.09%, 14.16%, 0.3) 40%, hsla(0, 0.09%, 14.16%, 0.3), hsla(60, 14%, 99%, 0) 95%)", // Color of the line
                zIndex: 0, // Ensure the line is behind the text
                transform: "translateY(-50%)", // Center the line vertically with text
              }}
            />
          </Box>
        </Box>
        <Box></Box>
      </Box>

     
    </>
  );
}
