/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addNewBank, getBanks } from "../../store/slices/bankSlice";
import Select from "react-select";
const AddBank = () => {
  const [bankName, setBankName] = useState("");
  const [bankSymbol, setBankSymbol] = useState("");
  const [bankLogo, setBankLogo] = useState(null);
  const [newBank, setNewBank] = useState("");
  const banks = useSelector((state) => state.bank?.banks);
  const [previewLogo, setPreviewLogo] = useState(null);
  const bankOptions = banks?.map((b) => ({
    label: b.bankName,
    value: b._id,
  }));
  const dispatch = useDispatch();
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBankLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    dispatch(getBanks());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newBank?.value) {
      console.log("Please select a bank");
      return;
    }

    if (!bankLogo) {
      console.log("Please upload a logo");
      return;
    }

    const formData = new FormData();
    formData.append("id", newBank?.value); // Send bank ID for updating
    formData.append("bankName", newBank.label);
    formData.append("logo", bankLogo);

    try {
      const res = await dispatch(addNewBank(formData));
      if (res.success) {
        console.log("Bank updated successfully");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Add Bank Details
      </Typography>

      <Select
        className="basic-single"
        isClearable
        isSearchable
        placeholder="Select bank"
        options={bankOptions}
        onChange={(e) => setNewBank(e)}
      />

      <Button variant="contained" component="label">
        Upload Bank Logo
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleLogoUpload}
        />
      </Button>

      {/* Show image preview if an image is uploaded */}
      {previewLogo && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body1">Logo Preview:</Typography>
          <img
            src={previewLogo}
            alt="Bank Logo"
            style={{ maxWidth: "100%", height: "30px", marginTop: "10px" }}
          />
        </Box>
      )}

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default AddBank;
