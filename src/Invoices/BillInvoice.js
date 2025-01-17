



import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ContraVoucherTable from '../Voucher/ContraVoucherTable.json'
import { toWords } from "number-to-words";
import { jsPDF } from "jspdf";
import "jspdf-autotable";


const BillInvoice = () => {
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
    doc.setFont("helvetica","bold");
    doc.text(`${subtotal}`, 40, y);
  
    const amountInWordsY = y + 10;
    doc.setFont("helvetica", "normal"); 
    doc.text("Amount in Words: ", 14, amountInWordsY);
    doc.setFont("helvetica", "bold"); 
    doc.text(`${subTotalInWords}`, 60, amountInWordsY);

  // Save PDF
  doc.save("invoice.pdf");
};
  return (
    <Box>
      <Box >

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}> create Bill Invoice</Button>

        </Box>


        {/* drawer for new mewmber */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: { width: '60%' }, // Set the width here
          }}
        >
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography m={2} variant="h6"><b>Bill Invoice</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box>
          <Divider />
          <Box>


            <Box m={2}>
              <Typography>Member Name</Typography>
              <TextField size="small" margin="normal" placeholder='Member Name' fullWidth />
            </Box>

            <Box display={'flex'} alignItems="center" gap={2} >
              <Box flex={1} m={2}>
                <Box>
                  <Typography>Bill Number:</Typography>
                  <TextField size="small" margin="normal" placeholder='Bill Number:' fullWidth />
                </Box>

                <Box>
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
                </Box>

              </Box>


              <Box flex={1} m={2}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box  >
                      <Typography > Bill Date:</Typography>
                      <DatePicker

                        format="dd/MM/yyyy"
                        sx={{ width: "100%", }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </Box>
                  </LocalizationProvider>
                </Box>



                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box  >
                      <Typography > Due Date:</Typography>
                      <DatePicker

                        format="dd/MM/yyyy"
                        sx={{ width: "100%", }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
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

            <Box mt={2} m={2}>
              <Typography sx={{ fontWeight: 'bold' }}>SubTotal</Typography>
              <TextField
                size="small"
                type="number"
                name="subTotal"
                value={items.reduce((total, item) => total + parseFloat(item.amount || 0), 0)} // Calculate SubTotal

                fullWidth
              />
            </Box>

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
              <TextField size="small" margin="normal" placeholder='Narration' fullWidth />
            </Box>

            <Box m={2}>
              <Typography>Email Address:</Typography>
              <TextField size="small" margin="normal" placeholder='Email Address' fullWidth />
            </Box>




          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} m={1}>
            <Box>
              <Button onClick={handleGeneratePdf} variant='contained'>Generate Pdf </Button>
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



