
import React, { useMemo, useState } from 'react';
import { Box, Menu, Alert, Autocomplete, useMediaQuery, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import JournalVoucherTable from './JournalVoucherTable.json'
import { useTheme } from "@mui/material/styles";
import Textarea from '@mui/joy/Textarea';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const JournalVoucher = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'srNo',
        header: 'Sr No',
        size: 100,
      },
      {
        accessorKey: 'Date',
        header: 'Date',
        size: 150,
      },
      {
        accessorKey: 'DrName',
        header: 'Dr.Name',
        size: 150,
      },
      {
        accessorKey: 'DrAmount',
        header: 'Dr.Amount',
        size: 150,
      },
      {
        accessorKey: 'CrName',
        header: 'Cr.Name',
        size: 150,
      },
      {
        accessorKey: 'CrAmount',
        header: 'Cr.Amount',
        size: 100,
      },
      {
        accessorKey: 'Narration',
        header: 'Narration',
        size: 150,
      },

      {
        id: 'actions',
        header: 'Actions',
        size: 150,

      },
    ];
  }, []);



  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    { value: "Mr", label: "Mr" },
    { value: "Miss", label: "Miss" },
    { value: "Misses", label: "Misses" },

  ];
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  //for find member drawer
  // for drawer
  const [Open, setOpen] = useState(false);
  const handlefindMemberDrawerOpen = () => {
    setOpen(true);
  };

  const handlefindMemberDrawerClose = () => {
    setOpen(false);
  };


  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //validation
  const [formValues, setFormValues] = useState({
    Date: "",
    DebitLedger: "",
    CreditLedger: "",
    DebitAmount: "",
    CreditAmount: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handlevalidationChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on change
  };

  const validate = () => {
    const errors = {};

    if (!formValues.Date) errors.Date = "Date is required.";
    if (!formValues.DebitLedger) errors.DebitLedger = "Debit Ledger is required.";
    if (!formValues.CreditLedger) errors.CreditLedger = "Credit Ledger is required.";
    if (!formValues.DebitAmount) errors.DebitAmount = "Debit Amount is required.";
    if (!formValues.CreditAmount) errors.CreditAmount = "Credit Amount is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSave = () => {
    if (validate()) {
      // Perform save action
      console.log("Form submitted:", formValues);
      handleDrawerClose();
    }
  };

  return (
    <Box>
      <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}> create Journal Voucher</Button>
          {/* <Button variant='contained' onClick={handlefindMemberDrawerOpen}>Find Member</Button> */}
        </Box>

        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={JournalVoucherTable}
            enableColumnOrdering
            enableColumnResizing
          />
        </Box>
        {/* drawer for new mewmber */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              width: isSmallScreen ? "100%" : '40%',
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              zIndex: 1000,
            }, // Set the width here
          }}
        >
          {/* <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography m={2} variant="h6"><b>Journal Voucher</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box> */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 3,
              borderBottom: "1px solid #ccc",
            }}
          >

            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Journal Voucher
            </Typography>


            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "primary.main",
                }}
              >
                <MoreVertIcon sx={{ cursor: 'pointer', color: 'black' }} onClick={handleMenuOpen} />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem>Preview</MenuItem>
                  <MenuItem >Generate Report </MenuItem>
                </Menu>
              </Box>


              <Box sx={{ cursor: "pointer" }}>
                <CloseIcon onClick={handleDrawerClose} />
              </Box>
            </Box>
          </Box>
          <Divider />
          <Box>
            {/* <Box m={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box  >
                  <Typography > Date</Typography>
                  <DatePicker

                    format="dd/MM/yyyy"
                    sx={{ width: "100%", }}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                </Box>
                {(!!formErrors.Date) && (
                  <Alert severity="error" sx={{
                    width: '92%',
                    p: '2',
                    pl: '4%', height: '23px',
                    borderRadius: '8px',
                    borderTopLeftRadius: '0',
                    borderTopRightRadius: '0',
                    fontSize: '12px',
                    display: 'flex',
                    backgroundColor: "#ffdddd",
                    color: "#a00",
                    alignItems: 'center',
                    '& .MuiAlert-icon': {
                      fontSize: '16px',
                      mr: '8px',
                    },
                  }}>
                    {formErrors.Date}
                  </Alert>
                )}
              </LocalizationProvider>
            </Box> */}
            <Box m={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box>
                  <Typography>Date</Typography>
                  <DatePicker
                    format="dd/MM/yyyy"

                    // value={selectedDate}
                    // onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={() => (
                      <Typography sx={{ width: "100%", p: 1, border: "1px solid #ccc", borderRadius: "4px" }}>
                        {/* {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Select a date"} */}
                      </Typography>
                    )}
                  />
                </Box>
                {!!formErrors.Date && (
                  <Alert
                    severity="error"
                    sx={{
                      width: "92%",
                      p: 2,
                      pl: "4%",
                      height: "23px",
                      borderRadius: "8px",
                      borderTopLeftRadius: "0",
                      borderTopRightRadius: "0",
                      fontSize: "12px",
                      display: "flex",
                      backgroundColor: "#ffdddd",
                      color: "#a00",
                      alignItems: "center",
                      "& .MuiAlert-icon": {
                        fontSize: "16px",
                        mr: "8px",
                      },
                    }}
                  >
                    {formErrors.Date}
                  </Alert>
                )}
              </LocalizationProvider>
            </Box>



            <Box display={'flex'} alignItems="center" gap={2}>
              <Box flex={1} m={2}>
                {/* <Box>
                  <Typography>Debit Ledger</Typography>
                  <TextField size="small" margin="normal" placeholder='Debit Ledger' fullWidth />
                </Box> */}

                <Box>
                  <Typography>Debit Ledger</Typography>
                  <Autocomplete
                    options={options}
                    sx={{ mt: 2, mb: 2, backgroundColor: '#fff' }}
                    size='small'
                    onChange={(e) => handlevalidationChange("DebitLedger", e.target.value)}
                    value={formValues.DebitLedger}
                    error={!!formErrors.DebitLedger}
                    // value={selecteduser}
                    // onChange={handleuserChange}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <>
                        <TextField
                          {...params}
                          // error={!!selectedUserError}

                          placeholder="Debit Ledger"
                        />

                      </>
                    )}
                    isClearable={true}
                  />
                  {(!!formErrors.DebitLedger) && (
                    <Alert severity="error" sx={{
                      width: '92%',
                      p: '2',
                      pl: '4%', height: '23px',
                      borderRadius: '8px',
                      borderTopLeftRadius: '0',
                      borderTopRightRadius: '0',
                      fontSize: '12px',
                      display: 'flex',
                      backgroundColor: "#ffdddd",
                      color: "#a00",
                      alignItems: 'center',
                      '& .MuiAlert-icon': {
                        fontSize: '16px',
                        mr: '8px',
                      },
                    }}>
                      {formErrors.DebitLedger}
                    </Alert>
                  )}
                </Box>

                {/* <Box>
                  <Typography>Credit Ledger</Typography>
                  <TextField size="small" margin="normal" placeholder='Credit Ledger' fullWidth />
                </Box> */}


                <Box>
                  <Typography>Credit Ledger</Typography>
                  <Autocomplete
                    options={options}
                    sx={{ mt: 2, mb: 2, backgroundColor: '#fff' }}
                    size='small'
                    // value={selecteduser}
                    // onChange={handleuserChange}
                    onChange={(e) => handlevalidationChange("CreditLedger", e.target.value)}
                    value={formValues.CreditLedger}
                    error={!!formErrors.CreditLedger}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <>
                        <TextField
                          {...params}
                          // error={!!selectedUserError}

                          placeholder="Credit Ledger"
                        />

                      </>
                    )}
                    isClearable={true}
                  />

                  {(!!formErrors.CreditLedger) && (
                    <Alert severity="error" sx={{
                      width: '92%',
                      p: '2',
                      pl: '4%', height: '23px',
                      borderRadius: '8px',
                      borderTopLeftRadius: '0',
                      borderTopRightRadius: '0',
                      fontSize: '12px',
                      display: 'flex',
                      backgroundColor: "#ffdddd",
                      color: "#a00",
                      alignItems: 'center',
                      '& .MuiAlert-icon': {
                        fontSize: '16px',
                        mr: '8px',
                      },
                    }}>
                      {formErrors.CreditLedger}
                    </Alert>
                  )}
                </Box>
              </Box>


              <Box flex={1} m={2}>
                <Box>
                  <Typography>Debit Amount</Typography>
                  <TextField type='number' size="small" margin="normal" onChange={(e) => handlevalidationChange("DebitAmount", e.target.value)} value={formValues.DebitAmount} error={!!formErrors.DebitAmount} placeholder='Debit Amount' fullWidth

                    InputProps={{
                      inputProps: { style: { MozAppearance: "textfield" }, min: 0 },
                      sx: {
                        "input[type=number]": {
                          "-moz-appearance": "textfield",
                        },
                        "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                          "-webkit-appearance": "none",
                          margin: 0,
                        },
                      },
                    }} />

                  {(!!formErrors.DebitAmount) && (
                    <Alert severity="error" sx={{
                      width: '92%',
                      p: '2',
                      pl: '4%', height: '23px',
                      borderRadius: '8px',
                      borderTopLeftRadius: '0',
                      borderTopRightRadius: '0',
                      fontSize: '12px',
                      display: 'flex',
                      backgroundColor: "#ffdddd",
                      color: "#a00",
                      alignItems: 'center',
                      '& .MuiAlert-icon': {
                        fontSize: '16px',
                        mr: '8px',
                      },
                    }}>
                      {formErrors.DebitAmount}
                    </Alert>
                  )}
                </Box>


                <Box>
                  <Typography>Credit Amount</Typography>
                  <TextField type='number' size="small" margin="normal" onChange={(e) => handlevalidationChange("CreditAmount", e.target.value)} value={formValues.CreditAmount} error={!!formErrors.CreditAmount} placeholder='Credit Amount' fullWidth

                    InputProps={{
                      inputProps: { style: { MozAppearance: "textfield" }, min: 0 },
                      sx: {
                        "input[type=number]": {
                          "-moz-appearance": "textfield",
                        },
                        "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                          "-webkit-appearance": "none",
                          margin: 0,
                        },
                      },
                    }} />

                  {(!!formErrors.CreditAmount) && (
                    <Alert severity="error" sx={{
                      width: '92%',
                      p: '2',
                      pl: '4%', height: '23px',
                      borderRadius: '8px',
                      borderTopLeftRadius: '0',
                      borderTopRightRadius: '0',
                      fontSize: '12px',
                      display: 'flex',
                      backgroundColor: "#ffdddd",
                      color: "#a00",
                      alignItems: 'center',
                      '& .MuiAlert-icon': {
                        fontSize: '16px',
                        mr: '8px',
                      },
                    }}>
                      {formErrors.CreditAmount}
                    </Alert>
                  )}
                </Box>


              </Box>
            </Box>


            <Box m={2}>
              <Typography>Narration:</Typography>
              <Textarea minRows={3} placeholder='Narration' fullWidth />
            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={10}>
            <Box>
              <Button onClick={handleSave} variant='contained'>Save </Button>
            </Box>

            <Box>
              <Button onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default JournalVoucher;
