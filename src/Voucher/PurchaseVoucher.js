
import React, { useMemo, useState } from 'react';
import {Alert, useMediaQuery, Menu, Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import PurchaseVoucherTable from './PurchaseVoucherTable.json'
import Textarea from '@mui/joy/Textarea';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from "@mui/material/styles";

const PurchaseVoucher = () => {
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
        accessorKey: 'CreditorInvoiceGenerator',
        header: 'Creditor Invoice Generator',
        size: 150,
      },
      {
        accessorKey: 'BillNo',
        header: 'Bill No',
        size: 150,
      },

      {
        accessorKey: 'AmountBill',
        header: 'Amount of Bill',
        size: 150,
      },

      {
        accessorKey: 'HeadLedger',
        header: 'Head Ledger',
        size: 150,
      },

      {
        accessorKey: 'Amount',
        header: 'Amount',
        size: 150,
      },

      {
        accessorKey: 'TDSPayable',
        header: 'TDS Payable',
        size: 150,
      },

      {
        accessorKey: 'SGST',
        header: 'SGST@9%',
        size: 150,
      },

      {
        accessorKey: 'CGST',
        header: 'CGST@9%',
        size: 150,
      },

      {
        accessorKey: 'CustomerNo',
        header: 'Customer No',
        size: 150,
      },

      {
        accessorKey: 'BillPeriod',
        header: 'Bill Period',
        size: 150,
      },

      {
        accessorKey: 'BillDate',
        header: 'Bill Date',
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
  return (
    <Box>
      <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}> create  Purchase Voucher</Button>
          {/* <Button variant='contained' onClick={handlefindMemberDrawerOpen}>Find Member</Button> */}
        </Box>

        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={PurchaseVoucherTable}
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
            },
          }}
        >
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography m={2} variant="h6"><b>Purchase Voucher</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box>
          <Divider />
          <Box>

            <Box display={'flex'} alignItems="center" gap={2}>

              <Box flex={1} m={2}>

                <Box >
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
                <Box >
                  <Typography>Ref: Bill No</Typography>
                  <FormControl fullWidth size="small" margin="normal">

                    <Select>
                      <MenuItem value="Bill1">Bill1</MenuItem>
                      <MenuItem value="Bill2">Bill2</MenuItem>
                      <MenuItem value="Bill3">Bill3</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography>DR: Name of Ledger </Typography>
                  <TextField size="small" margin="normal" placeholder='DR: Name of Head / Ledger / Expenses Ledger' fullWidth />
                </Box>

                <Box>
                  <Typography>CR: TDS Payable</Typography>
                  <TextField size="small" margin="normal" placeholder='CR: TDS Payable' fullWidth />
                </Box>

                <Box>
                  <Typography>SGST @ 9%</Typography>
                  <TextField size="small" margin="normal" placeholder='SGST @ 9%' fullWidth />
                </Box>

                {/* <Box>
                  <Typography>Customer No.</Typography>
                  <TextField size="small" margin="normal" placeholder='Customer No.' fullWidth />
                </Box> */}

                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box  >
                      <Typography >Bill Date</Typography>
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
                  <Typography>CR: Name of Creditor</Typography>
                  <TextField size="small" margin="normal" placeholder='CR: Name of Creditor / Invoice Generator' fullWidth />
                </Box>

                <Box>
                  <Typography>Amount of Bill</Typography>
                  <TextField size="small" margin="normal" placeholder='Amount of Bill' fullWidth />
                </Box>

                <Box>
                  <Typography>Amount</Typography>
                  <TextField size="small" margin="normal" placeholder='Amount' fullWidth />
                </Box>


                <Box>
                  <Typography>Rate as per PAN CARD</Typography>
                  <TextField size="small" margin="normal" placeholder='Rate as per PAN CARD' fullWidth />
                </Box>

                <Box>
                  <Typography>CGST @ 9%</Typography>
                  <TextField size="small" margin="normal" placeholder='CGST @ 9%' fullWidth />
                </Box>


                <Box>
                  <Typography>Bill No</Typography>
                  <TextField size="small" margin="normal" placeholder='Bill No' fullWidth />
                </Box>


              </Box>
            </Box>

            <Box m={2}>
              <Typography>Bill Period</Typography>
              <TextField size="small" margin="normal" placeholder='Bill Period' fullWidth />
            </Box>

            <Box m={2}>
            <Typography>Narration:</Typography>
            <Textarea minRows={3} placeholder='Narration' fullWidth />
          </Box>



          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} m={1}>
            <Box>
              <Button variant='contained'>Save </Button>
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

export default PurchaseVoucher;


