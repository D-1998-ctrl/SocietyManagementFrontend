
import React, { useMemo, useState } from 'react';
import { Alert, Autocomplete, Menu, useMediaQuery, Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import PaymentVoucherTable from '../Voucher/PaymentVoucherTable.json'
import Textarea from '@mui/joy/Textarea';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from "@mui/material/styles";


const PaymentVoucher = () => {
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

  //
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}> create  Payment Voucher</Button>
          {/* <Button variant='contained' onClick={handlefindMemberDrawerOpen}>Find Member</Button> */}
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
              width: isSmallScreen ? "100%" : '40%',
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

            <Typography variant="h6">
              <b>Payment Voucher</b>
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
                  <MenuItem>Preview Report</MenuItem>
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
            <Box m={1} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
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
            </Box>

            <Box display={'flex'} alignItems={'center'} gap={2} m={1}>
              <Box flex={1}>

                <Box >
                  <Typography>Dr Name of Creditor</Typography>
                  <Autocomplete
                    sx={{ mt: 2, mb: 2, backgroundColor: '#fff' }}
                    size="small"
                    // options={accountOptions}
                    // value={name}
                    // onChange={(event, newValue) => setName(newValue)}
                    getOptionLabel={(option) => option.label}
                    isClearable={true}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>

                <Box >
                  <Typography>Cr Bank</Typography>
                  <FormControl fullWidth size="small" margin="normal" >

                    <Select  >
                      <MenuItem value="MDCC Bank">MDCC Bank</MenuItem>
                      <MenuItem value="Saraswat Bank">Saraswat Bank</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>

                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box flex={1}>

                <Box>
                  <Typography>Dr Amount Paid</Typography>
                  <TextField
                    type="number"
                    // error={!!errors.crAmountReceived}
                    // value={crAmountReceived}
                    // onChange={(e) => setCrAmountReceived(e.target.value)}
                    // helperText={errors.crAmountReceived}
                    size="small"
                    margin="normal"
                    placeholder="Cr Amount Received"
                    fullWidth
                    InputProps={{
                      inputProps: { style: { appearance: 'textfield' }, step: 'any' },
                    }}
                    sx={{
                      '& input[type="number"]': {
                        MozAppearance: 'textfield',
                        WebkitAppearance: 'textfield',
                      },
                      '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                    }}
                  />
                </Box>

                <Box mt={1}>
                  <Typography>Cr Amount Paid</Typography>
                  <TextField
                    type="number"
                    // error={!!errors.crAmountReceived}
                    // value={crAmountReceived}
                    // onChange={(e) => setCrAmountReceived(e.target.value)}
                    // helperText={errors.crAmountReceived}
                    size="small"
                    margin="normal"
                    placeholder="Cr Amount Received"
                    fullWidth
                    InputProps={{
                      inputProps: { style: { appearance: 'textfield' }, step: 'any' },
                    }}
                    sx={{
                      '& input[type="number"]': {
                        MozAppearance: 'textfield',
                        WebkitAppearance: 'textfield',
                      },
                      '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography textAlign={'center'} variant='h6'>Bank Allocations</Typography>
            </Box>

            <Box display={'flex'} alignItems={'center'} gap={2} m={1} >
              <Box flex={1}>
                <Box >
                  <Typography>Transaction Type</Typography>
                  <FormControl fullWidth size="small" margin="normal">

                    <Select >
                      <MenuItem value="NEFT">NEFT</MenuItem>
                      <MenuItem value="IMPS">IMPS</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                      <MenuItem value="Cheque">Cheque</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box >
                  <Typography>Inst.No</Typography>
                  <FormControl fullWidth size="small" margin="normal"  >

                    <Select >
                      <MenuItem value="Cheque">Cheque</MenuItem>
                      <MenuItem value="NoTxn">No./Txn</MenuItem>
                      <MenuItem value="No">No.</MenuItem>

                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box flex={1}>
                <Box>
                  <Typography>Amount Paid</Typography>
                  <TextField
                    type="number"
                    size="small"
                    margin="normal"
                    placeholder="Amount Paid"
                    fullWidth
                    InputProps={{
                      inputProps: { style: { appearance: 'textfield' }, step: 'any' },
                    }}
                    sx={{
                      '& input[type="number"]': {
                        MozAppearance: 'textfield',
                        WebkitAppearance: 'textfield',
                      },
                      '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none',
                        margin: 0,
                      },
                    }}
                  />
                </Box>

                <Box >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box  >
                      <Typography >Inst. Date</Typography>
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

export default PaymentVoucher;


