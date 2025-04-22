/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import bankImage from "../../assets/bank2.png";
import Select, { components } from "react-select";
import HelpIcon from "@mui/icons-material/HelpOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { RiAddCircleLine } from "react-icons/ri";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useDispatch, useSelector } from "react-redux";
import {
  getBankDetails,
  getUser,
  updateUser,
} from "../../store/slices/userSlice";
import {
  bankMapping,
  bankMappingByName,
  getImageSrc,
} from "../../constants/banks";
import { RxCross2 } from "react-icons/rx";
import {
  getBankById,
  getBanks,
  getBranchDetailsOfBank,
} from "../../store/slices/bankSlice";
import "../../styles/bankDetails.css";
import { debounce } from "lodash"; // Importing debounce from lodash
import { toast } from "react-toastify";

const customStyles1 = {
  control: (base, state) => ({
    ...base,
    border: "1px solid #ced4da",
    borderRadius: "4px",
    marginTop: "25px",
    // minHeight: "50px", // Mimicking MUI's small size
    marginBottom: "10px",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: 230, // Set your desired max height for the dropdown
    overflowY: "auto",
  }),
  valueContainer: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    paddingLeft: "10px", // Add space for the icon
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#ffca61" // Highlight selected item with color
      : state.isFocused
        ? "#fafafa" // Hover effect
        : "white",
    color: "black",
    "&:active": {
      backgroundColor: "rgba(25, 118, 210, 0.08)",
    },
  }),
};
const customStyles2 = {
  control: (base, state) => ({
    ...base,
    border: "1px solid #ced4da",
    borderRadius: "4px",
    marginTop: "25px",
    // minHeight: "50px", // Mimicking MUI's small size
    marginBottom: "10px",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: 180, // Set your desired max height for the dropdown
    overflowY: "auto",
  }),
  valueContainer: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    paddingLeft: "10px", // Add space for the icon
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#ffca61" // Highlight selected item with color
      : state.isFocused
        ? "#fafafa" // Hover effect
        : "white",
    color: "black",
    "&:active": {
      backgroundColor: "rgba(25, 118, 210, 0.08)",
    },
  }),
};
export const bufferToBase64 = (buffer) => {
  // Convert buffer to base64 string
  const binary = new Uint8Array(buffer).reduce(
    (data, byte) => data + String.fromCharCode(byte),
    ""
  );
  return window.btoa(binary);
};
const BankAccountDetails = () => {
  const dispatch = useDispatch();
  const bankDetails = useSelector((state) => state.user?.bankDetails);

  const user = useSelector((state) => state.user?.user);

  const banks = useSelector((state) => state.bank?.banks);
  const bankById = useSelector((state) => state.bank?.bankById);
  const branchesofBank = useSelector((state) => state.bank?.branchesofBank);
  const loading = useSelector((state) => state.common?.loading);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [isAdd, setisAdd] = useState(false);
  const [newBank, setNewBank] = useState("");

  const [newBranch, setNewBranch] = useState();
  const [branchOptions, setBranchOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loadingBranch, setloadingBranch] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [accountNumber, setAccountNumber] = useState("false");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null); // Store selected bank

  const handleMenuOpen = (event, bank) => {
    setAnchorEl(event.currentTarget);
    setSelectedBank(bank); // Set the selected bank
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBank(null); // Reset selected bank
  };
  const open = Boolean(anchorEl);

  const bankOptions = banks?.map((b) => ({ label: b.bankName, value: b._id }));
  // console.log("bankOptions",bankOptions);

  // Debounced function to fetch branch options based on input
  const fetchBranchOptions = useCallback(
    debounce(async (input) => {
      if (newBank && input.length >= 1) {
        const res = await dispatch(
          getBranchDetailsOfBank({ bankName: newBank?.label, query: input })
        );
        console.log("res", res);
      }
    }, 100), // Delay of 500ms
    [dispatch, newBank]
  );
  useEffect(() => {
    dispatch(getBankDetails());
    dispatch(getUser());
    dispatch(getBanks());
  }, []);
  useEffect(() => {
    // dispatch(getBankById({ bankName: bankDetails?.bankName }));
    const fetchBRanch = async () => {
      setloadingBranch(true);
      const res = await dispatch(
        getBranchDetailsOfBank({
          bankName: bankDetails?.bankName,
          query: bankDetails?.ifsc,
        })
      );
      setloadingBranch(false);
    };
    fetchBRanch();
  }, [bankDetails]);

  useEffect(() => {
    // Load branch options when branches are available
    if (branchesofBank) {
      const options = branchesofBank.map((b) => ({
        label: `${b.city} - ${b.branchName} (${b.ifsc})`,
        value: b._id,
      }));
      setBranchOptions(options);
    }
  }, [branchesofBank]);

  useEffect(() => {
    if (newBank) {
      fetchBranchOptions(inputValue);
    }
  }, [newBank, inputValue, fetchBranchOptions]);
  useEffect(() => {
    if (newBank) {
      setBranchOptions([]);
      dispatch(getBankById({ bankName: newBank?.label }));
    }
  }, [newBank, dispatch]);

  useEffect(() => {
    if (bankById?.logo) {
      // If the logo exists as a buffer, convert it to base64
      const base64Flag = `data:image/jpeg;base64,`; // You can adjust the MIME type as needed (e.g., image/png)
      const imageStr = bufferToBase64(bankById?.logo.data);
      setPreviewLogo(base64Flag + imageStr);
    }
  }, [bankById]);

  const handleBankChange = (selectedOption) => {
    setBranchOptions([]); // Reset branch options when bank changes
    setNewBank(selectedOption);
  };

  const handleInputChange = (input) => {
    setInputValue(input);
    // setloadingBranch(true);
    if (input.length >= 1) {
      fetchBranchOptions(input);
    }
    // setloadingBranch(true);
  };

  const handleAddNewBank = async () => {
    setNewBranch(null);
    setNewBank(null);
    setisAdd(false);
    const ifsc = newBranch?.label?.match(/\(([^)]+)\)/);
    await dispatch(
      updateUser({
        bankName: newBank?.label,
        ifsc: ifsc[1],
        accountNum: accountNumber,
        action: "add",
      })
    );
    dispatch(getBankDetails());
  };

  

  return (
    <>

      <Box className="bank-detail-container">
        {
        (loading || !banks)
        // true
        &&
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(0, 0, 0, 0.1)',
              borderTop: '5px solid #fdc148',
              borderBottom: '5px solid #014188',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <style>
              {`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}
            </style>
          </div>
        }

        <Typography
          sx={{ fontSize: "25px", fontWeight: 500, marginBottom: "25px" }}
        >
          Bank Account Details
        </Typography>
        <Grid container spacing={4}>
          {/* Left Side - Bank Account List */}
          <Grid item xs={12} md={6}>
            <Box className="bank-right">
              {bankDetails?.allBanks?.map((bank) => (
                <Box key={bank?.bankName} className="bank-name">
                  <Box display="flex" alignItems="center" gap={2}>
                    {banks?.find((b) => b.bankName === bank?.bankName)?.logo !==
                      undefined ? (
                      <img
                        alt="bank"
                        src={getImageSrc(
                          banks?.find((b) => b.bankName === bank?.bankName)?.logo
                        )}
                        width={35}
                        height={35}
                      />
                    ) : (
                      <img alt="bank" src={bankImage} width={35} height={35} />
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Box sx={{ ml: 1 }}>
                        <Typography sx={{ fontWeight: 500 }}>
                          {bank?.bankName}
                        </Typography>
                        <Typography variant="body2">
                          {bank?.accountNum.slice(0, -4).replace(/\d/g, "X") +
                            bank?.accountNum.slice(-4)}
                        </Typography>
                      </Box>
                    </Box>
                    {bank?.bankName !== user?.bankName ? (
                      <Box>
                        <IconButton onClick={(e) => handleMenuOpen(e, bank)}>
                          <MoreVertIcon sx={{ fontSize: "19px" }} />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          PaperProps={{
                            elevation: 1,
                            sx: { width: 150 }, // Adjust menu width
                          }}
                        >
                          <MenuItem
                            onClick={async () => {
                              await dispatch(
                                updateUser({
                                  bankName: selectedBank?.bankName,
                                  ifsc: selectedBank?.ifsc,
                                  accountNum: selectedBank?.accountNum,
                                  action: "change_primary",
                                })
                              );
                              await dispatch(getBankDetails());
                              dispatch(getUser());
                              handleMenuClose();
                            }}
                            sx={{ p: 0, paddingLeft: 2 }}
                          >
                            Make Primary
                          </MenuItem>
                          <Divider sx={{ m: 0 }} />
                          <MenuItem
                            onClick={async () => {
                              if (selectedBank?.bankName === user?.bankName) {
                                toast.error("Primary bank cannot be deleted");
                              } else {
                                await dispatch(
                                  updateUser({
                                    bankName: selectedBank?.bankName,
                                    ifsc: selectedBank?.ifsc,
                                    accountNum: selectedBank?.accountNum,
                                    action: "delete",
                                  })
                                );
                                dispatch(getBankDetails());
                              }
                              handleMenuClose();
                            }}
                            sx={{ color: "red", p: 0, paddingLeft: 2 }}
                          >
                            Delete
                          </MenuItem>
                        </Menu>
                      </Box>
                    ) : (
                      <Box>
                        <Tooltip
                          title="primary bank"
                          arrow
                          componentsProps={{
                            tooltip: {
                              sx: {
                                fontSize: "14px", // Adjust the font size here
                                color: "white", // Optional: Change text color
                                padding: "5px", // Optional: Increase padding
                              },
                            },
                          }}
                        >
                          <IconButton>
                            <VerifiedIcon
                              color="success"
                              sx={{ fontSize: "17px" }}
                            />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}

              <Box
                padding={1.5}
                marginLeft={1}
                display="flex"
                alignItems="center"
                gap={1}
              >
                {/* Add another bank */}
                <RiAddCircleLine fill="#008059d4" />
                <Typography
                  sx={{ fontWeight: 500, color: "#008059d4", cursor: "pointer" }}
                  onClick={() => {
                    setisAdd(true);
                    setNewBank(false);
                  }}
                >
                  Add another bank
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Bank Account Details */}
          <Grid item xs={12} md={6}>
            {!isAdd && !newBranch && (
              <Card sx={{ padding: 2 }}>
                <Box display="flex" gap={3} alignItems="center" mb={2}>
                  {banks?.find((b) => b.bankName === bankDetails?.bankName)
                    ?.logo ? (
                    <img
                      alt="bank"
                      src={getImageSrc(
                        banks?.find((b) => b.bankName === bankDetails?.bankName)
                          ?.logo
                      )} // Replace with actual bank logo URL
                      width={35}
                      height={35}
                    />
                  ) : (
                    <img
                      alt="bank"
                      src={bankImage} // Replace with actual bank logo URL
                      width={35}
                      height={35}
                    />
                  )}
                  <Box>
                    <Typography sx={{ fontWeight: 500 }}>
                      {bankDetails?.bankName}
                    </Typography>
                    <Typography color="grey" fontWeight="bold">
                      Primary bank
                    </Typography>
                  </Box>
                </Box>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={15}>
                    <Typography width={80}>Status</Typography>
                    <Typography color="textSecondary">Verified</Typography>
                  </Box>
                  <Box mt={2} display="flex" alignItems="center" gap={15}>
                    <Typography width={80}>Account</Typography>
                    <Typography color="textSecondary">
                      {bankDetails?.accountNum.slice(0, -4).replace(/\d/g, "X") +
                        bankDetails?.accountNum.slice(-4)}
                    </Typography>
                  </Box>
                  <Box mt={2} display="flex" alignItems="center" gap={15}>
                    <Typography width={80}>IFSC Code</Typography>
                    <Typography color="textSecondary">
                      {bankDetails?.ifsc}
                    </Typography>
                  </Box>
                  <Box mt={2} display="flex" alignItems="center" gap={15}>
                    <Typography width={90}>Branch</Typography>
                    <Typography color="textSecondary" marginLeft={-1}>
                      {loadingBranch
                        ? "Fetching branch..."
                        : branchesofBank?.find(
                          (b) => b.ifsc === bankDetails?.ifsc
                        )?.branchName +
                        " - " +
                        branchesofBank?.find(
                          (b) => b.ifsc === bankDetails?.ifsc
                        )?.city}
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />

                <Box
                  elevation={1}
                  sx={{ padding: 2, mt: 3, backgroundColor: "#e6f7e6" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body2">
                    Have questions about Bank & Autopay?
                  </Typography>
                  <Button startIcon={<HelpIcon />} size="small">
                    Get help
                  </Button>
                </Box>
              </Card>
            )}
            {isAdd && !newBranch && (
              <Card className="add-bank-card" sx={{ height: "350px" }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>
                    Choose bank
                  </Typography>
                  <Box sx={{ cursor: "pointer" }} onClick={() => setisAdd(false)}>
                    <RxCross2 />
                  </Box>
                </Box>
                <Typography
                  sx={{ fontWeight: 500, fontSize: "15px", color: "grey" }}
                >
                  Bank is compulsory for opening an investment account
                </Typography>
                {!newBank && (
                  <Select
                    styles={customStyles1}
                    // className="basic-single"
                    isClearable
                    isSearchable
                    placeholder="Search bank"
                    options={bankOptions}
                    menuIsOpen={true}
                    defaultMenuIsOpen
                    onChange={handleBankChange}
                    components={{
                      DropdownIndicator: () => null, // Remove the default dropdown arrow
                      IndicatorSeparator: () => null, // Remove the separator line next to the arrow
                    }}
                  />
                )}
                {newBank && (
                  <Box sx={{ pb: 3 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      sx={{ mt: 3 }}
                    >
                      {bankById?.logo ? (
                        <img
                          alt="bank"
                          src={getImageSrc(bankById?.logo)} // Replace with actual bank logo URL
                          width={35}
                          height={35}
                        />
                      ) : (
                        <img
                          alt="bank"
                          src={bankImage} // Replace with actual bank logo URL
                          width={35}
                          height={35}
                        />
                      )}
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {newBank?.label}
                        </Typography>
                      </Box>
                    </Box>
                    <Select
                      styles={customStyles2}
                      // className="basic-single"
                      isClearable
                      isSearchable
                      menuIsOpen={true}
                      defaultMenuIsOpen
                      placeholder="IFSC Code"
                      options={branchOptions}
                      onInputChange={handleInputChange}
                      noOptionsMessage={() => "Search your branch/IFSC/City"}
                      components={{
                        DropdownIndicator: () => null, // Remove the default dropdown arrow
                        IndicatorSeparator: () => null, // Remove the separator line next to the arrow
                        // ValueContainer, // Custom ValueContainer to show the adornment
                      }}
                      onChange={(selectedOption) => {
                        // console.log("selectedOption", selectedOption);
                        setNewBranch(selectedOption);
                      }}
                    />
                  </Box>
                )}
              </Card>
            )}

            {newBranch && (
              <Card sx={{ p: 2 }}>
                <Box
                  sx={{
                    // p: 2,
                    borderRadius: 2,

                    backgroundColor: "white",
                  }}
                // className="add-bank-card"
                >
                  <Box display="flex" justifyContent="space-between">
                    <Typography sx={{ fontSize: "22px" }}>
                      Verify your bank account
                    </Typography>
                    <Box
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        setNewBranch("");
                        setisAdd(false);
                      }}
                    >
                      <RxCross2 />
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 1, mb: 2 }}
                  >
                    Investments on Groww can be done using only savings bank
                    accounts
                  </Typography>

                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box display="flex" alignItems="center">
                          {bankById?.logo ? (
                            <img
                              alt="bank"
                              src={getImageSrc(bankById?.logo)} // Replace with actual bank logo URL
                              width={35}
                              height={35}
                            />
                          ) : (
                            <img
                              alt="bank"
                              src={bankImage} // Replace with actual bank logo URL
                              width={35}
                              height={35}
                            />
                          )}
                          <Typography sx={{ ml: 2, fontSize: "18px" }}>
                            {newBank?.label}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          mt: 5,
                          fontSize: "15px",
                          display: "flex",
                          gap: "20px",
                        }}
                      >
                        <span style={{ color: "grey" }}>Branch Name:</span>
                        <span>
                          {newBranch?.label?.replace(/\s*\([^)]*\)$/, "")}
                        </span>
                      </Typography>
                      <Typography
                        sx={{
                          mt: 2,
                          fontSize: "15px",
                          display: "flex",
                          gap: "20px",
                        }}
                      >
                        <span style={{ color: "grey" }}>IFSC Code:</span>
                        <span>{newBranch?.label?.match(/\(([^)]+)\)/)[1]}</span>
                      </Typography>
                    </CardContent>
                  </Card>

                  <Typography sx={{ mb: 1 }}>
                    <span style={{ color: "grey" }}>Enter bank account of</span>{" "}
                    {user?.name}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Eg: 123456789101"
                    onChange={(e) => setAccountNumber(e.target.value)}
                    type={showAccountNumber ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowAccountNumber(!showAccountNumber)
                            }
                          >
                            {showAccountNumber ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={accountNumber?.length < 10}
                    sx={{ mt: 2, backgroundColor: "#008360" }}
                    onClick={handleAddNewBank}
                  >
                    VERIFY BANK
                  </Button>
                </Box>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default BankAccountDetails;
