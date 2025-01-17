
import React, { useMemo, useState } from 'react';
import { Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ReceiptVoucherTable from './ReceiptVouchertable.json'

const ReceiptVoucher = () => {


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
            sx: { width: '40%' }, // Set the width here
          }}
        >
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography m={2} variant="h6"><b>Receipt Voucher</b></Typography>
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
              <Box>
                <Typography>Amount Received</Typography>
                <TextField size="small" margin="normal" placeholder='Amount Received' fullWidth />
              </Box>

              <Box>
                <Typography>DR - Bank</Typography>
                <TextField size="small" margin="normal" placeholder='DR - Bank' fullWidth />
              </Box>

              <Box>
                <Typography>Inst. No. (Cheque / Txn No.)</Typography>
                <TextField size="small" margin="normal" placeholder='DR - Bank' fullWidth />
              </Box>

              <Box>
                <Typography>Bank Name</Typography>
                <TextField size="small" margin="normal" placeholder='DR - Bank' fullWidth />
              </Box>
              </Box>


              <Box flex={1} m={2}>
              <Box>
                <Typography>CR - Name of Member</Typography>
                <TextField size="small" margin="normal" placeholder='CR - Name of Member' fullWidth />
              </Box>

              <Box>
                <Typography>Ref: Previous O/S Bills</Typography>
                <TextField size="small" margin="normal" placeholder='Ref: Previous O/S Bills' fullWidth />
              </Box>

              <Box>
                <Typography>Transaction Type</Typography>
                <TextField size="small" margin="normal" placeholder='Transaction Type' fullWidth />
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

            <Box>
                <Typography>Branch</Typography>
                <TextField size="small" margin="normal" placeholder='Branch' fullWidth />
              </Box>
        
              </Box>
            </Box>
            

            <Box m={2}>
                <Typography>Narration</Typography>
                <TextField size="small" margin="normal" placeholder='Narration' fullWidth />
              </Box>


   
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={10}>
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

export default ReceiptVoucher;


