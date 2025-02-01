
import React, { useMemo, useState } from 'react';
import { Autocomplete, Alert, useMediaQuery, Menu, FormHelperText, Box, Button, Typography, TextField, Drawer, Divider, Paper, FormControl, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paperm } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ReceiptVoucherTable from './ReceiptVouchertable.json'
import Textarea from '@mui/joy/Textarea';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from "@mui/material/styles";


const ReceiptVoucher = () => {
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
        accessorKey: 'ReceiptDate',
        header: 'Receipt Date',
        size: 150,
      },
      {
        accessorKey: 'MemberName',
        header: 'Member Name',
        size: 150,
      },
      {
        accessorKey: 'AmountReceived',
        header: 'Amount Received',
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
  const accountOptions = [
    { label: 'Aditya ' },
    { label: 'Ankush' },
    { label: 'Anuja' }
  ];
  // const [type, setType] = useState('');
  // const [name, setName] = useState(null); // Autocomplete expects null initially
  // const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);


  const handleReceiptVoucher = () => {
    if (!type || !name || !amount) return;

    setTransactions([
      ...transactions,
      { id: transactions.length + 1, type, name: name.label, amount }
    ]);

    // Reset form fields
    setType('');
    setName(null);
    setAmount('');
  };

  //
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //validation

  const [type, setType] = useState('');
  const [name, setName] = useState(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(null);
  const [bankName, setBankName] = useState('');
  const [instDate, setInstDate] = useState(null);
  const [narration, setNarration] = useState('');
  const [crNameOfMember, setCrNameOfMember] = useState('');
  const [crAmountReceived, setCrAmountReceived] = useState('');
  const[DrBank,setDrBank] = useState('');
  const[ AmountReceived,setAmountReceived] = useState('');
  const[TransactionType,setTransactionType] = useState('');
  const[InstNo,setInstNo] = useState('');
  const[Branch,setBranch] = useState('');
  const [errors, setErrors] = useState({
    type: '',
    name: '',
    amount: '',
    bankName: '',
    narration: '',
    crNameOfMember: '',
    crAmountReceived:'',
    DrBank:'',
    AmountReceived:'',
    TransactionType:'',
    InstNo:'',
    instDate:'',
    Branch:'',


  });
  const validateForm = () => {
    const newErrors = {};
    if (!type) newErrors.type = 'This field is required';
     if (!name) newErrors.name = 'This field is required';
    if (!amount || isNaN(amount) || amount <= 0) newErrors.amount = 'Please enter a valid amount';
    if (!bankName) newErrors.bankName = 'This field is required';
    if (!narration) newErrors.narration = 'This field is required';
    if (!crNameOfMember) newErrors.crNameOfMember = 'This field is required';
    if (!crAmountReceived || isNaN(crAmountReceived) || crAmountReceived <= 0) newErrors.crAmountReceived = 'Please enter a valid amount';

    if (!DrBank) newErrors.DrBank = 'This field is required';
    if (!AmountReceived) newErrors.AmountReceived = 'This field is required';
    if (!TransactionType) newErrors.TransactionType = 'This field is required';
    if (!InstNo) newErrors.InstNo = 'This field is required';
    if (!instDate) newErrors.instDate = 'This field is required';
    if (!Branch) newErrors.Branch = 'This field is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      handleReceiptVoucher();
    }
  };
  return (
    <Box>
      <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}> create  Receipt Voucher</Button>
          {/* <Button variant='contained' onClick={handlefindMemberDrawerOpen}>Find Member</Button> */}
        </Box>

        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={ReceiptVoucherTable}
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
              width: isSmallScreen ? "100%" : '50%',
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
              Receipt Voucher
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
            <Box m={2} display={'flex'} alignItems={'center'} justifyContent={'flex-end'}>
              <Box >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box  >
                    <Typography > Date</Typography>
                    <DatePicker
                   

                      format="dd/MM/yyyy"
                      sx={{ width: "100%", }}
                      renderInput={(params) => <TextField {...params} size="small"  />}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>
            </Box>

            <Box display={'flex'} alignItems={'center'} gap={2} m={2}>
              <Box flex={1} >
                <Box>
                  <Typography>Cr Name Of Member</Typography>
                  <TextField error={!!errors.crNameOfMember} value={crNameOfMember} onChange={(e) => setCrNameOfMember(e.target.value)} helperText={errors.crNameOfMember} size="small" margin="normal" placeholder='Cr Name Of Member' fullWidth />
                </Box>
              </Box>


              <Box flex={1} >
                <Box>
                  <Typography>Cr Amount Received</Typography>
                  <TextField
                    type="number"
                    error={!!errors.crAmountReceived}
                    value={crAmountReceived}
                    onChange={(e) => setCrAmountReceived(e.target.value)}
                    helperText={errors.crAmountReceived}
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

            <Box display={'flex'} alignItems={'center'} gap={2} m={2}>
              <Box flex={1}>
                <Box >
                  <Typography>Cr/Dr</Typography>
                  <FormControl fullWidth size="small" margin="normal" error={!!errors.type}>

                    <Select value={type} onChange={(e) => setType(e.target.value)}>
                      <MenuItem value="Cr">Cr</MenuItem>
                      <MenuItem value="Dr">Dr</MenuItem>
                    </Select>
                    {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                  </FormControl>
                </Box>
              </Box>

              <Box flex={4}>
                {/* <Box m={1}>
                  <Typography>Name</Typography>
                  <Autocomplete
                    // options={options}
                    sx={{ mt: 2, mb: 2, backgroundColor: '#fff' }}
                    size='small'
                    // value={selecteduser}
                    // onChange={handleuserChange}
                    options={accountOptions}
                    getOptionLabel={(option) => option.label}
                    value={name}
                    onChange={(event, newValue) => setName(newValue)}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <>
                        <TextField
                          {...params}
                          // error={!!selectedUserError}
                          placeholder="Name"
                        />
                      </>
                    )}
                    isClearable={true}
                  />
                </Box> */}
                <Box m={1}>
                  <Typography>Name</Typography>
                  <Autocomplete
                    sx={{ mt: 2, mb: 2, backgroundColor: '#fff' }}
                    size="small"
                    options={accountOptions}
                    value={name}
                    onChange={(event, newValue) => setName(newValue)}
                    getOptionLabel={(option) => option.label}
                    isClearable={true}
                    renderInput={(params) => <TextField {...params} error={!!errors.name} helperText={errors.name} />}
                  />
                </Box>
              </Box>


              <Box flex={3}>
                <Box>
                  <Typography>Amount</Typography>
                  <TextField
                    type="number"
                    size="small"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    error={!!errors.amount}
                    helperText={errors.amount}
                    margin="normal"
                    placeholder="Amount"
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
              <Box mt={3}>
                <Button variant="contained" onClick={handleReceiptVoucher}>Add</Button >
              </Box>
            </Box>

            <Box m={2}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SR NO.</TableCell>
                      <TableCell>Dr/Cr</TableCell>
                      <TableCell>Account Name</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, m: 2 }}>
            <Box flex={1} >
              <Box >
                <Typography>Dr Bank</Typography>
                <FormControl fullWidth size="small" margin="normal" error={!!errors.DrBank}>

                  <Select value={DrBank} onChange={(e) => setDrBank(e.target.value)} >
                    <MenuItem value="MDCC Bank">MDCC Bank</MenuItem>
                    <MenuItem value="Saraswat Bank">Saraswat Bank</MenuItem>
                    <MenuItem value="Cash">Cash</MenuItem>

                  </Select>
                </FormControl>
              </Box>


              <Box >
                <Typography>Transaction Type</Typography>
                <FormControl fullWidth size="small" margin="normal" error={!!errors.TransactionType}>

                  <Select value={TransactionType} onChange={(e) => setTransactionType(e.target.value)}  >
                    <MenuItem value="NEFT">NEFT</MenuItem>
                    <MenuItem value="IMPS">IMPS</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Cheque">Cheque</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box >
                <Typography>Inst.No</Typography>
                <FormControl fullWidth size="small" margin="normal" error={!!errors.InstNo} >

                  <Select value={InstNo} onChange={(e) => setInstNo(e.target.value)}  >
                    <MenuItem value="Cheque">Cheque</MenuItem>
                    <MenuItem value="NoTxn">No./Txn</MenuItem>
                    <MenuItem value="No">No.</MenuItem>

                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography>Bank Name</Typography>
                <TextField size="small" margin="normal"
                 error={!!errors.bankName}
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  helperText={errors.bankName} placeholder='Bank Name'
                  fullWidth />
              </Box>
            </Box>

            <Box flex={1}>
              <Box>
                <Typography>Amount Received</Typography>
                <TextField
                  type="number"
                  size="small"
                  margin="normal"
                  placeholder="Amount Received"
                  value={AmountReceived} 
                  onChange={(e) => setAmountReceived(e.target.value)}
                  error={!!errors.AmountReceived}
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

              <Box>
                <Typography>Amount</Typography>
                <TextField
                  type="number"
                  size="small"
                  margin="normal"
                  placeholder="Amount"
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

              <Box mt={1}>
                <Typography>Branch</Typography>
                <TextField size="small" margin="normal" placeholder='Branch'
                  fullWidth />
              </Box>
            </Box>

          </Box>


          <Box m={2}>
            <Typography>Narration:</Typography>
            <Textarea minRows={3} placeholder='Narration' fullWidth />
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2}>
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

export default ReceiptVoucher;



