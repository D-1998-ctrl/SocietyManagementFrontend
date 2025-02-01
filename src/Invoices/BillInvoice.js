



import React, { useState, useEffect, useMemo } from 'react';
import { Alert, Autocomplete, useMediaQuery, Menu, Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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
import Textarea from '@mui/joy/Textarea';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from "@mui/material/styles";

const BillInvoice = () => {
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
  const [memberName, setMemberName] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [billDate, setBillDate] = useState('');
  const [period, setPeriod] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState([{ description: '', amount: '' }]);
  const [subTotal, setSubTotal] = useState(0);
  const [amountInWords, setAmountInWords] = useState('');
  const [narration, setNarration] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

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
    doc.text("Society Bill", 14, 20);

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

    // Save PDF
    doc.save("invoice.pdf");
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
    DRMemberName: "",
    BillNumber: "",
    BillDate: "",
    Period: "",
    DueDate: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handlevalidationChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on change
  };

  const validate = () => {
    const errors = {};

    if (!formValues.DRMemberName) errors.DRMemberName = "DR Membe rName is required.";
    if (!formValues.BillNumber) errors.BillNumber = "Bill Number is required.";
    if (!formValues.BillDate) errors.BillDate = "Bill Date is required.";
    if (!formValues.Period) errors.Period = "Period is required.";
    if (!formValues.DueDate) errors.DueDate = "Due Date is required.";
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
          <Button variant="contained" onClick={handleDrawerOpen}> create Bill Invoice</Button>

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
            },
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
              Create Bill Invoice
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
                <CloseIcon  onClick={handleDrawerClose}/>
              </Box>
            </Box>
          </Box>


          <Divider />
          <Box>



            <Box m={2}>
              <Typography>DR Member Name</Typography>
              <Autocomplete
                // options={options}
                sx={{ mt: 2, mb: 2, backgroundColor: '#fff' }}
                size='small'
                // value={selecteduser}
                // onChange={handleuserChange}
                onChange={(e) => handlevalidationChange("DRMemberName", e.target.value)}
                value={formValues.DRMemberName}
                error={!!formErrors.DRMemberName}

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
              {(!!formErrors.DRMemberName) && (
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
                  {formErrors.DRMemberName}
                </Alert>
              )}
            </Box>

            <Box display={'flex'} alignItems="center" gap={2} >
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
                  <Typography>Period</Typography>
                  <TextField size="small" type='number' margin="normal" onChange={(e) => handlevalidationChange("Period", e.target.value)} value={formValues.Period} error={!!formErrors.Period} placeholder='Period' fullWidth
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

                  {(!!formErrors.Period) && (
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
                      {formErrors.Period}
                    </Alert>
                  )}
                </Box>
                {/* <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box  >
                      <Typography > Period:</Typography>
                      <DatePicker

                        format="dd/MM/yyyy"
                        sx={{ width: "100%", }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </Box>
                  </LocalizationProvider>
                </Box> */}

              </Box>


              <Box flex={1} m={2}>
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

            <Box m={2}>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SR NO.</TableCell>
                      <TableCell>Particulars</TableCell>
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
                            name="Particulars" nvoice Template

                            placeholder=" Particulars"
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
              <Typography>Narration:</Typography>
              <Textarea minRows={3} placeholder='Narration' fullWidth />
            </Box>

            {/* <Box m={2}>
              <Typography>Email Address:</Typography>
              <TextField size="small" margin="normal" placeholder='Email Address' fullWidth />
            </Box> */}




          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} m={1}>
            {/* <Box>
              <Button onClick={handleGeneratePdf} variant='contained'>Generate Pdf </Button>
            </Box> */}

            <Box>
              <Button onClick={handleSave} variant='contained'>Save</Button>
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

export default BillInvoice;



