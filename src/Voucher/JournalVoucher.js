
import React, { useMemo, useState } from 'react';
import { Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import JournalVoucherTable from './JournalVoucherTable.json'

const JournalVoucher = () => {


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
            sx: { width: '40%' }, // Set the width here
          }}
        >
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography m={2} variant="h6"><b>Journal Voucher</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box>
          <Divider />
          <Box>
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
            <Box display={'flex'} alignItems="center" gap={2}>
              <Box flex={1} m={2}>
              <Box>
                <Typography>Debit Name</Typography>
                <TextField size="small" margin="normal" placeholder='Debit Name' fullWidth />
              </Box>

              <Box>
                <Typography>Credit Name</Typography>
                <TextField size="small" margin="normal" placeholder='Credit Name' fullWidth />
              </Box>
              </Box>


              <Box flex={1} m={2}>
              <Box>
                <Typography>Debit Amount</Typography>
                <TextField size="small" margin="normal" placeholder='Debit Amount' fullWidth />
              </Box>

              <Box>
                <Typography>Credit Amount</Typography>
                <TextField size="small" margin="normal" placeholder='Credit Amount' fullWidth />
              </Box>
              </Box>
            </Box>


            <Box m={2}>
                <Typography>Debit Name</Typography>
                <TextField size="small" margin="normal" placeholder='Debit Name' fullWidth />
              </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={30}>
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

export default JournalVoucher;
