
import React, { useState, useEffect,useMemo } from 'react';
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
import PaymentVoucherTable from '../Voucher/PaymentVoucherTable.json'

const IncomeSheet = () => {
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
  return (
    <Box>
      <Box >

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}> create Income & Expenditure </Button>

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
            sx: { width: '60%' }, // Set the width here
          }}
        >
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography m={2} variant="h6"><b>INCOME & EXPENDITURE STATEMENT FOR THE YEAR ENDED 31ST MARCH 20___</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box>
          <Divider />
          <Box>



            <Box m={2}>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SR NO.</TableCell>
                      <TableCell>31.03.2024 Amount</TableCell>
                      <TableCell>Expenditure</TableCell>
                      <TableCell>31.03.2023 Amount</TableCell>
                      <TableCell>31.03.2023 Amount</TableCell>
                      <TableCell>Income</TableCell>
                      <TableCell>31.03.2024 Amount</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell> {/* Display Serial Number */}
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            name="amount2024"
                            placeholder="31.03.2024 Amount"
                            value={item.amount2024}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            name="expenditure"
                            placeholder="Expenditure"
                            value={item.expenditure}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            name="amount2023_1"
                            placeholder="31.03.2023 Amount"
                            value={item.amount2023_1}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            name="amount2023_2"
                            placeholder="31.03.2023 Amount"
                            value={item.amount2023_2}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            name="income"
                            placeholder="Income"
                            value={item.income}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            name="amount2024_final"
                            placeholder="31.03.2024 Amount"
                            value={item.amount2024_final}
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
                value={items.reduce((total, item) =>
                  total + parseFloat(item.amount2024 || 0) + parseFloat(item.amount2023_1 || 0), 0)} // Calculate SubTotal for 31.03.2024 and 31.03.2023 Amounts only once
                fullWidth
              />
            </Box>


            <Box mt={2} m={2}>
              <Typography sx={{ fontWeight: "bold" }}>Place</Typography>
              <TextField size="small" margin="normal" placeholder='Place' fullWidth />
            </Box>


            <Box m={2}>
              <Typography>Name of Society</Typography>
              <TextField size="small" margin="normal" placeholder='Name of Society' fullWidth />
            </Box>

            <Box m={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box  >
                      <Typography > Date</Typography>
                      <DatePicker

                        format="dd/MM/yyyy"
                        sx={{ width: "100%", }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </Box>
                  </LocalizationProvider>
            </Box>




          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} m={1}>
            <Box>
              <Button  variant='contained'>Generate Pdf </Button>
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

export default IncomeSheet;




