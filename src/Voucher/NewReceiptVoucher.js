import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  Alert,
  Select,
  MenuItem,
  Autocomplete,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Chip,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import CoustomSwitch from "../../Components/CSwitch";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";

const NewReceiptVoucher = ({ isDrawerOpen, handleDrawerClose }) => {
  const [voucherNo, setVoucherNo] = useState(20);
  const [dateOfReceiptVoucher, setDateOfReceiptVoucher] = React.useState(
    new Date()
  );

  const [drAccount, setDrAccount] = useState("");
  const [crAccount, setCrAccount] = useState("");
  const [crAmount, setCrAmount] = useState();
  const [referenceInvoice, setRefrenceInvoice] = useState("");
  const [transactionType, setTransactionType] = useState();
  const [instrumentNumber, setInstrumentNumber] = useState();
  const [instrumnetDate, setInstrumentDate] = React.useState(new Date());
  const [instrumentBank, setInstrumentBank] = useState();
  const [instrumentBranch, setInstrumentBranch] = useState();
  const [narration, setNarration] = useState("");
  const [membersOptions, setMembersOptions] = useState([]); // To store the results from the API
  const [drAccountOptions, setDrAccountOptions] = useState([]); // To store the results from the API

  const [errors, setErrors] = useState({});

  //const [invoiceOptions, setInvoiceOptions] = useState();
  //const [options, setOptions] = useState([]); // To store the results from the API
  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      //transition: Bounce,
    });
  };

  const fetchMembersOptions = async (query) => {
    if (!query) return;
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/members?q=${query}`
      );
      setMembersOptions(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  const fetchDrAccountOptions = async (query) => {
    if (!query) return;
    try {
      const { data } = await axios.get(
        `http://localhost:8001/api/Account?q=${query}`
      );
      setDrAccountOptions(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchInvoiceOptions = async (query) => {
    if (!query) return;
    try {
      const { data } = await axios.get(
        `http://localhost:8001/api/Invoice?q=${query}`
      );
      setRefrenceInvoice(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleInputChange = (field, value) => {
    const stringValue = value ? value.toString().trim() : "";

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: stringValue ? "" : prevErrors[field], // Remove error only if user types something
    }));

    console.log(drAccount);

    if (field === "drAccount") setDrAccount(value); //middleName
    if (field === "crAccount") setCrAccount(value); //middleName
    if (field === "referenceInvoice") setRefrenceInvoice(value); //middleName transactionType
    if (field === "transactionType") setTransactionType(value);
    if (field === "crAmount") setCrAmount(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents form submission
    if (validateFields()) {
      let data = JSON.stringify({
        voucherDate: "2025-03-17",
        narration: "Payment received for invoice INV-001",
        drAccount: "Bank Account",
        crAccount: "Customer A",
        crAmount: 5000,
        referenceInvoice: ["65fdc123e6a12a3456789abc"],
        transactionType: "Cash",
        instrumentNumber: "1234567890",
        instrumentDate: "2025-03-17",
        instrumentBank: "HDFC Bank",
        instrumentBranch: "Mumbai",
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:8000/receiptVoucher",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          handleDrawerClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {};

    if (!drAccount?.trim()) {
      newErrors.drAccount = "Select Account";
      isValid = false;
    }

    if (!crAmount?.trim()) {
      newErrors.crAmount = "Enter Amount";
      isValid = false;
    } else if (crAmount.length > 8) {
      newErrors.crAmount = "Amount should not exceed 8 digits";
      isValid = false;
    }
    if (!crAccount?.trim()) {
      newErrors.crAccount = "Select Member ";
      isValid = false;
    }

    if (!transactionType?.trim()) {
      newErrors.transactionType = "Select Transaction Type ";
      isValid = false;
    }

    if (referenceInvoice == null) {
      newErrors.referenceInvoice = "Select Reference Invoice ";
      isValid = false;
    }
    setErrors(newErrors);

    // Ensure validation message is updated before proceeding
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={handleDrawerClose}
      PaperProps={{
        sx: {
          width: { xs: "90%", sm: "60%", md: "50%", lg: "40%" }, // Responsive width
          borderRadius: "10px 0 0 10px",
          zIndex: 1000,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #ccc",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Receipt Voucher
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <MoreVertIcon sx={{ cursor: "pointer", color: "black" }} />
          <CloseIcon onClick={handleDrawerClose} sx={{ cursor: "pointer" }} />
        </Box>
      </Box>

      <Divider />

      {/* Form Fields */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        sx={{
          px: 2,
          mt: 2,
          justifyContent: "space-between",
        }}
      >
        {/* Voucher Number */}
        <Box>
          <Typography sx={{ mb: 1 }}>Voucher Number</Typography>
          <Box sx={{ flex: 1, minWidth: "30%", maxWidth: "30%" }}>
            <TextField
              size="small"
              placeholder="Enter Voucher Number"
              fullWidth
              value={voucherNo}
              onChange={(e) => setVoucherNo(e.target.value)}
              sx={{
                "& .MuiInputBase-input": {
                  textAlign: "center", // Centers the text inside the input
                },
              }}
            />
          </Box>
        </Box>

        {/* Date Picker */}
        <Box sx={{ flex: 1, minWidth: "25%", maxWidth: "25%" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Typography sx={{ mb: 1 }}>Date</Typography>
            <DatePicker
              value={dateOfReceiptVoucher}
              onChange={(newDate) => setDateOfReceiptVoucher(newDate)}
              format="dd/MM/yyyy"
              slotProps={{
                textField: { size: "small", fullWidth: true },
              }}
            />
          </LocalizationProvider>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2,
          mb: 2,
          mx: 2,

          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Account Selection Section */}
        <Box sx={{ width: "100%" }}>
          <Typography>DR Account</Typography>
          <Autocomplete
            freeSolo
            options={drAccountOptions}
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : `${option.accountId} ${option.drOrCr} ${option.accountName}`
            }
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                key={option.accountId}
                sx={{
                  fontSize: "14px",
                  padding: "4px 8px",
                  minHeight: "30px",
                }}
              >
                <Chip
                  label={option.accountId}
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    marginRight: 1,
                    height: "20px",
                    fontSize: "12px",
                  }}
                />
                {option.drOrCr} {option.accountName}
              </Box>
            )}
            onInputChange={(event, newInputValue) =>
              fetchDrAccountOptions(newInputValue)
            }
            renderInput={(params) => (
              <>
                <TextField
                  {...params}
                  placeholder="Search Member"
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "40px", // Adjust input box height
                      minHeight: "40px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "6px 8px", // Adjust inner text padding
                      fontSize: "14px", // Reduce font size if needed
                    },
                  }}
                  value={drAccount}
                  onChange={(e) =>
                    handleInputChange("drAccount", e.target.value)
                  }
                  error={!!errors.drAccount}
                />
                {errors.drAccount && (
                  <Alert
                    sx={{
                      width: "96%",
                      p: 0,
                      pl: "4%",
                      height: "23px",
                      borderRadius: "10px",
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      "& .MuiAlert-icon": { fontSize: "16px", mr: "8px" },
                    }}
                    variant="filled"
                    severity="error"
                  >
                    {errors.drAccount}
                  </Alert>
                )}
              </>
            )}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />
      <Box
        sx={{
          mt: 2,
          mb: 2,
          mx: 2,

          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography>CR Member Account</Typography>
          <Autocomplete
            freeSolo
            options={membersOptions}
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : `${option.unitNumber} ${option.firstName} ${option.surname}`
            }
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                key={option.unitNumber}
                sx={{
                  fontSize: "14px",
                  padding: "4px 8px",
                  minHeight: "30px",
                }}
              >
                <Chip
                  label={option.unitNumber}
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    marginRight: 1,
                    height: "20px",
                    fontSize: "12px",
                  }}
                />
                {option.firstName} {option.surname}
              </Box>
            )}
            onInputChange={(event, newInputValue) =>
              fetchMembersOptions(newInputValue)
            }
            renderInput={(params) => (
              <>
                <TextField
                  {...params}
                  placeholder="Search Member"
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "40px", // Adjust input box height
                      minHeight: "40px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "6px 8px", // Adjust inner text padding
                      fontSize: "14px", // Reduce font size if needed
                    },
                  }}
                  value={crAccount}
                  onChange={(e) =>
                    handleInputChange("crAccount", e.target.value)
                  }
                  error={!!errors.crAccount}
                />
                {errors.crAccount && (
                  <Alert
                    sx={{
                      width: "96%",
                      p: 0,
                      pl: "4%",
                      height: "23px",
                      borderRadius: "10px",
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      "& .MuiAlert-icon": { fontSize: "16px", mr: "8px" },
                    }}
                    variant="filled"
                    severity="error"
                  >
                    {errors.crAccount}
                  </Alert>
                )}
              </>
            )}
          />
        </Box>

        {/* Voucher Number */}
        <Box sx={{ mb: 0, ml: 2 }}>
          <Typography sx={{ mb: 0 }}>Amount</Typography>
          <Box sx={{ flex: 1, minWidth: "50%", maxWidth: "100%" }}>
            <TextField
              size="small"
              placeholder="Enter Amount"
              fullWidth
              type="number"
              sx={{
                "& input[type='number']": {
                  "-webkit-appearance": "none", // For Chrome/Safari
                  "moz-appearance": "textfield", // For Firefox
                  appearance: "none", // For Edge
                },
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    WebkitAppearance: "none", // Remove spin buttons in Chrome/Safari
                    margin: 0, // Ensures no margin is left for the spin buttons
                  },
              }}
              value={crAmount}
              onChange={(e) => handleInputChange("crAmount", e.target.value)}
              error={!!errors.crAmount} // Show error if validation fails
            />
            {errors.crAmount && (
              <Alert
                sx={{
                  width: "96%",
                  p: 0,
                  pl: "4%",
                  height: "23px",
                  borderRadius: "10px",
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  "& .MuiAlert-icon": { fontSize: "16px", mr: "8px" },
                }}
                variant="filled"
                severity="error"
              >
                {errors.crAmount}
              </Alert>
            )}
          </Box>
        </Box>
      </Box>

      {/* Occupation & Annual Income */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        sx={{
          width: "100%",
          flexDirection: "row",
          paddingX: 2,
          boxSizing: "border-box",
          mt: 1,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <Typography>Reference Invoice</Typography>
          <Autocomplete
            freeSolo
            options={Array.isArray(referenceInvoice) ? referenceInvoice : []} // Ensure it is an array
            getOptionLabel={(option) =>
              typeof option === "string"
                ? option
                : `${option.invoiceNumber} ${option.narration} ${option.amount}`
            }
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                key={option.invoiceNumber}
                sx={{
                  fontSize: "14px",
                  padding: "4px 8px",
                  minHeight: "30px",
                }}
              >
                <Chip
                  label={option.invoiceNumber}
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    marginRight: 1,
                    height: "20px",
                    fontSize: "12px",
                  }}
                />
                {option.narration} {option.amount}
              </Box>
            )}
            onInputChange={
              (event, newInputValue) => fetchInvoiceOptions(newInputValue) // Fetch options as user types
            }
            renderInput={(params) => (
              <>
                <TextField
                  {...params}
                  placeholder="Search Member"
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "40px", // Adjust input box height
                      minHeight: "40px",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "6px 8px", // Adjust inner text padding
                      fontSize: "14px", // Reduce font size if needed
                    },
                  }}
                  value={referenceInvoice} // You may want to make sure referenceInvoice is being managed correctly
                  onChange={(e) =>
                    handleInputChange("referenceInvoice", e.target.value)
                  }
                  error={!!errors.referenceInvoice}
                />
                {errors.referenceInvoice && (
                  <Alert
                    sx={{
                      width: "96%",
                      p: 0,
                      pl: "4%",
                      height: "23px",
                      borderRadius: "10px",
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      "& .MuiAlert-icon": { fontSize: "16px", mr: "8px" },
                    }}
                    variant="filled"
                    severity="error"
                  >
                    {errors.referenceInvoice}
                  </Alert>
                )}
              </>
            )}
          />
        </Box>

        {/* Transaction Type */}
        <Box
          sx={{
            flex: 1,
            minWidth: "250px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography>Transaction Type</Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={transactionType || ""}
            onChange={(e) =>
              handleInputChange("transactionType", e.target.value)
            }
            sx={{ width: "100%", height: "40px" }}
            inputProps={{
              style: {
                padding: "6px 8px",
              },
            }}
          >
            <MenuItem value="NEFT">NEFT</MenuItem>
            <MenuItem value="IMPS">IMPS</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="CHEQUE">CHEQUE</MenuItem>
            <MenuItem value="CASH">CASH</MenuItem>
          </Select>
          {errors.transactionType && (
            <Alert
              sx={{
                width: "96%",
                p: 0,
                pl: "4%",
                height: "23px",
                borderRadius: "10px",
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                "& .MuiAlert-icon": {
                  fontSize: "16px",
                  mr: "8px",
                },
              }}
              variant="filled"
              severity="error"
            >
              {errors.transactionType}
            </Alert>
          )}
        </Box>

        {/* Instrument Number */}
        <Box
          sx={{
            flex: 1,
            minWidth: "250px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography>Instrument Number</Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="Enter Instrument Number"
            value={instrumentNumber} // Bind state to the TextField value
            onChange={(e) => setInstrumentNumber(e.target.value)}
          />
        </Box>
        {/* Instrument Date  */}
        <Box sx={{ flex: 1, minWidth: "25%", maxWidth: "25%" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Typography sx={{ mb: 0 }}>Date</Typography>
            <DatePicker
              value={instrumnetDate}
              onChange={(newDate) => setInstrumentDate(newDate)}
              format="dd/MM/yyyy"
              slotProps={{
                textField: { size: "small", fullWidth: true },
              }}
            />
          </LocalizationProvider>
        </Box>
        {/* Instrument Number */}
        <Box
          sx={{
            flex: 1,
            minWidth: "250px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography>Bank Name</Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="Enter Bank name"
            value={instrumentBank} // Bind state to the TextField value
            onChange={(e) => setInstrumentBank(e.target.value)}
          />
        </Box>

        {/* Instrument Number */}
        <Box
          sx={{
            flex: 1,
            minWidth: "250px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography>Branch Name</Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="Enter Branch Name"
            value={instrumentBranch} // Bind state to the TextField value
            onChange={(e) => setInstrumentBranch(e.target.value)}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      {/* Narration */}
      <Box sx={{ px: 2 }}>
        <Typography sx={{ mb: 0 }}>Narration</Typography>
        <TextField
          multiline
          minRows={3}
          fullWidth
          placeholder="Narration"
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
        />
      </Box>

      {/* Buttons */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="center"
        sx={{ px: 2, py: 2 }}
      >
        <Button
          variant="contained"
          sx={{ flex: 1, minWidth: "180px" }}
          onClick={handleSubmit}
        >
          Save
        </Button>
        <Button variant="contained" sx={{ flex: 1, minWidth: "180px" }}>
          Preview
        </Button>
        <Button
          variant="outlined"
          sx={{ flex: 1, minWidth: "180px" }}
          onClick={handleDrawerClose}
        >
          Cancel
        </Button>
      </Box>
      <ToastContainer />
    </Drawer>
  );
};

export default NewReceiptVoucher;
