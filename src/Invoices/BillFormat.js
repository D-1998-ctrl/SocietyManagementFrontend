
import React, { useState, useEffect, useMemo } from 'react';
import { Menu, Alert, Autocomplete, useMediaQuery, Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ContraVoucherTable from '../Voucher/ContraVoucherTable.json'
import { toWords } from "number-to-words";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import PaymentVoucherTable from '../Voucher/PaymentVoucherTable.json'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from "@mui/material/styles";
import Textarea from '@mui/joy/Textarea';

const BillFormat = () => {

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  //

  const [items, setItems] = useState([{ description: '', amount: '' }]);
  const [subTotal, setSubTotal] = useState(0);


  // Recalculate SubTotal whenever items change
  useEffect(() => {
    const newSubTotal = items.reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);
    setSubTotal(newSubTotal);
  }, [items]);

  // Handle form input changes
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);
  };

  // Add item to the list
  const handleAddItem = () => {
    setItems([...items, { description: '', amount: '' }]);
  };

  // Remove item from the list
  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Convert SubTotal to Words
  const subTotalInWords = subTotal > 0 ? toWords(subTotal) : "0";
  //
  const handleGeneratePdf = () => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(16);
    doc.text("Maintenance Bill", 14, 20);

    // Table data
    const tableData = items.map((item, index) => [
      index + 1,
      item.description || "-",
      item.amount || "0",
    ]);

    // AutoTable
    doc.autoTable({
      startY: 30,
      head: [["SR NO.", "Description", "Amount"]],
      body: tableData,
    });

    // Subtotal and Amount in Words
    const subtotal = items.reduce((total, item) => total + parseFloat(item.amount || 0), 0);
    const y = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text("SubTotal: ", 14, y);
    doc.setFont("helvetica", "bold");
    doc.text(`${subtotal}`, 40, y);

    const amountInWordsY = y + 10;
    doc.setFont("helvetica", "normal");
    doc.text("Amount in Words: ", 14, amountInWordsY);
    doc.setFont("helvetica", "bold");
    doc.text(`${subTotalInWords}`, 60, amountInWordsY);

    // Add margin-top for Terms & Conditions
    const termsY = amountInWordsY + 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Terms & Conditions", 14, termsY);
    doc.text(
      "1. Cheques to be in favour of 'WHITE ROSE CHS LTD.' & Cheques to be dropped in the cheque drop box.",
      14,
      termsY + 10
    );
    doc.text("2. Mention your Flat No. and Mobile No. on the reverse of the cheque.", 14, termsY + 20);
    doc.text("3. Non Payment of Bill will attract interest @ 21% PA.", 14, termsY + 30);
    doc.text("4. Errors to be intimated within 7 days to Society Office.", 14, termsY + 40);

    // Bank Details
    const bankY = termsY + 60;
    doc.text("Bank Details", 14, bankY);
    doc.text("For WHITE ROSE CO-OPERATIVE HOUSING SOCIETY LTD", 14, bankY + 10);
    doc.text("Bank Name: SVC Bank Ltd.", 14, bankY + 20);
    doc.text("A/c No.: 300003000012169", 14, bankY + 30);
    doc.text("Branch & IFS Code: Bandra & SVCB0000003", 14, bankY + 40);
    doc.text("Chairman / Secretary / Manager", 14, bankY + 50);

    // Save PDF
    doc.save("MaintenanceBill.pdf");
  };



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
        accessorKey: 'NameofCreditor',
        header: 'Name of Creditor/Expense Head',
        size: 150,
      },
      {
        accessorKey: 'AmountPaidDr',
        header: 'Amount Paid Dr',
        size: 150,
      },

      {
        accessorKey: 'PreviousO/SBills',
        header: 'Previous O/S Bills Raised',
        size: 150,
      },

      {
        accessorKey: 'Bank',
        header: 'Bank',
        size: 150,
      },

      {
        accessorKey: 'DrName',
        header: 'DrName',
        size: 150,
      },

      {
        accessorKey: 'AmountPaidCr',
        header: 'Amount Paid Cr',
        size: 150,
      },

      {
        accessorKey: 'TransactionType',
        header: 'Transaction Type',
        size: 150,
      },

      {
        accessorKey: 'InstNo',
        header: 'Inst No',
        size: 150,
      },

      {
        accessorKey: 'ChequeNo',
        header: 'Cheque No/Txn No',
        size: 150,
      },

      {
        accessorKey: 'InstDate',
        header: 'Inst.Date',
        size: 150,
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


  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  //validation
  const [formValues, setFormValues] = useState({
    MemberName: "",
    Flat: "",
    BillNumber: "",
    BillDate: "",
    BillingPeriod: "",
    DueDate: "",
    Floor: "",
    Wing: "",
    Area: ""
  });

  const [formErrors, setFormErrors] = useState({});

  const handlevalidationChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on change
  };

  const validate = () => {
    const errors = {};

    if (!formValues.MemberName) errors.MemberName = "Membe rName is required.";
    if (!formValues.BillNumber) errors.BillNumber = "Bill Number is required.";
    if (!formValues.BillDate) errors.BillDate = "Bill Date is required.";
    if (!formValues.BillingPeriod) errors.BillingPeriod = "Billing Period is required.";
    if (!formValues.DueDate) errors.DueDate = "Due Date is required.";

    if (!formValues.Floor) errors.Floor = "Floor is required.";
    if (!formValues.Wing) errors.Wing = "Wing is required.";
    if (!formValues.Area) errors.Area = "Area is required.";
    if (!formValues.Flat ) errors.Area = "Area is required.";
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
      <Box >

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}> create Bill Format</Button>

        </Box>



        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={PaymentVoucherTable}
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
              width: isSmallScreen ? "100%" : '60%',
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              zIndex: 1000,
            }, // Set the width here
          }}
        >


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
              Maintenance Bill
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
                  <MenuItem onClick={handleGeneratePdf}>Generate Report </MenuItem>
                </Menu>
              </Box>


              <Box sx={{ cursor: "pointer" }}>
                <CloseIcon onClick={handleDrawerClose} />
              </Box>
            </Box>
          </Box>
          <Divider />
          <Box>




            <Box m={2}>
              <Typography> Member Name</Typography>
              <Autocomplete
                // options={options}
                sx={{ mt: 2, mb: 2, backgroundColor: '#fff' }}
                size='small'
                // value={selecteduser}
                // onChange={handleuserChange}
                onChange={(e) => handlevalidationChange("MemberName", e.target.value)}
                value={formValues.MemberName}
                error={!!formErrors.MemberName}

                isOptionEqualToValue={(option, value) => option.value === value.value}
                getOptionLabel={(option) => option.label || ""}
                renderInput={(params) => (
                  <>
                    <TextField
                      {...params}
                      // error={!!selectedUserError}

                      placeholder="Member Name"
                    />

                  </>
                )}
                isClearable={true}
              />
              {(!!formErrors.MemberName) && (
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
                  {formErrors.MemberName}
                </Alert>
              )}
            </Box>

            <Box display={'flex'} alignItems="center" gap={2} >
              <Box flex={1} m={2}>
                <Box>
                  <Typography>Flat</Typography>
                  <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("Flat", e.target.value)} value={formValues.Flat} error={!!formErrors.Flat} placeholder='Flat' fullWidth />
                  {(!!formErrors.Flat) && (
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
                      {formErrors.Flat}
                    </Alert>
                  )}
                </Box>

                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box  >
                      <Typography > Bill Date</Typography>
                      <DatePicker
                        // onChange={(e) => handlevalidationChange("DueDate", e.target.value)}
                        // value={formValues.DueDate}
                        // error={!!formErrors.DueDate}
                        format="dd/MM/yyyy"
                        sx={{ width: "100%", }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                      {(!!formErrors.BillDate) && (
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
                          {formErrors.BillDate}
                        </Alert>
                      )}
                    </Box>
                  </LocalizationProvider>
                </Box>


              </Box>


              <Box flex={1} m={2}>

                <Box>
                  <Typography>Bill Number</Typography>
                  <TextField type='number' size="small" margin="normal" placeholder='Bill Number:' fullWidth error={!!formErrors.BillNumber} value={formValues.BillNumber} onChange={(e) => handlevalidationChange("BillNumber", e.target.value)}
                    InputProps={{
                      inputProps: { style: { appearance: 'textfield' }, step: 'any' },
                    }}
                    sx={{
                      '& input[type=number]': {
                        MozAppearance: 'textfield',
                        WebkitAppearance: 'textfield',
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                    }} />
                  {(!!formErrors.BillNumber) && (
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
                      {formErrors.BillNumber}
                    </Alert>
                  )}
                </Box>

                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box  >
                      <Typography > Due Date</Typography>
                      <DatePicker

                        format="dd/MM/yyyy"
                        sx={{ width: "100%", }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                      {(!!formErrors.DueDate) && (
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
                          {formErrors.DueDate}
                        </Alert>
                      )}
                    </Box>
                  </LocalizationProvider>
                </Box>

              </Box>


            </Box>

            {/* <Box m={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box  >
                  <Typography >Billing Period</Typography>
                  <DatePicker

                    format="dd/MM/yyyy"
                    sx={{ width: "100%", }}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                </Box>
              </LocalizationProvider>
            </Box> */}
            <Box m={2}>
              <Typography>Billing Period</Typography>
              <TextField size="small" type='number' margin="normal" onChange={(e) => handlevalidationChange("BillingPeriod", e.target.value)} value={formValues.BillingPeriod} error={!!formErrors.BillingPeriod} placeholder='Billing Period' fullWidth
                InputProps={{
                  inputProps: { style: { appearance: 'textfield' }, step: 'any' },
                }}
                sx={{
                  '& input[type=number]': {
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'textfield',
                  },
                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                }} />

              {(!!formErrors.BillingPeriod) && (
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
                  {formErrors.BillingPeriod}
                </Alert>
              )}
            </Box>

            <Box display={'flex'} alignItems="center" gap={2}>
              <Box m={2} flex={1}>
                <Typography>Floor</Typography>
                <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("Floor", e.target.value)} value={formValues.Floor} error={!!formErrors.Floor} placeholder='Floor' fullWidth />
                {(!!formErrors.Floor) && (
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
                    {formErrors.Floor}
                  </Alert>
                )}
              </Box>

              <Box m={2} flex={1}>
                <Typography>Wing</Typography>
                <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("Wing", e.target.value)} value={formValues.Wing} error={!!formErrors.Wing} placeholder='Wing' fullWidth />
                {(!!formErrors.Wing) && (
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
                    {formErrors.Wing}
                  </Alert>
                )}
              </Box>

            </Box>
            <Box m={2} >
              <Typography>Area</Typography>
              <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("Area", e.target.value)} value={formValues.Area} error={!!formErrors.Area} placeholder='Area' fullWidth />

              {(!!formErrors.Area) && (
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
                  {formErrors.Area}
                </Alert>
              )}
            </Box>




            <Box m={2}>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SR NO.</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell> {/* Display Serial Number */}
                        <TableCell>
                          <TextField
                            size='small'
                            type="text"
                            name="description"
                            placeholder="Item Description"
                            value={item.description}
                            onChange={(e) => handleInputChange(e, index)}

                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) => handleInputChange(e, index)}
                            InputProps={{
                              inputProps: { style: { appearance: 'textfield' }, step: 'any' },
                            }}
                            sx={{
                              '& input[type=number]': {
                                MozAppearance: 'textfield',
                                WebkitAppearance: 'textfield',
                              },
                              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                WebkitAppearance: 'none',
                                margin: 0,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {items.length > 1 && (
                            <Button variant="contained" onClick={() => handleRemoveItem(index)}>
                              Remove
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}

                    <TableRow >
                      <TableCell colSpan={2} align="right" sx={{ fontWeight: "bold", }}>
                        Sub-Total
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {items.reduce((total, item) => total + parseFloat(item.amount || 0), 0)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddItem}
                sx={{ mt: 2 }}  // mt: 2 is equivalent to marginTop: 16px
              >
                Add Item
              </Button>

            </Box>

            {/* <Box mt={2} m={2}>
              <Typography sx={{ fontWeight: 'bold' }}>SubTotal</Typography>
              <TextField
                size="small"
                type="number"
                name="subTotal"
                value={items.reduce((total, item) => total + parseFloat(item.amount || 0), 0)} // Calculate SubTotal

                fullWidth
              />
            </Box> */}

            <Box mt={2} m={2}>
              <Typography sx={{ fontWeight: "bold" }}>Amount in Words:</Typography>
              <TextField
                size="small"
                type="text"
                name="subTotalInWords"
                value={subTotalInWords}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>


            <Box m={2}>
              <Typography>Narration</Typography>
              <Textarea minRows={3} placeholder='Narration' fullWidth />
            </Box>

          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} m={1}>
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

export default BillFormat;




