
import React, { useMemo, useState } from 'react';
import { Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ContraVoucherTable from '../Voucher/ContraVoucherTable.json'

const ContraVoucher = () => {


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
        accessorKey: 'BankfromwhichcashDebited',
        header: 'Bank from which cash Debited',
        size: 150,
      },
      {
        accessorKey: 'Amountwithdrawn',
        header: 'Amount withdrawn',
        size: 150,
      },

      {
        accessorKey: 'PreviousO/SBills',
        header: 'Previous O/S Bills Raised',
        size: 150,
      },

      {
        accessorKey: 'LedgerBankcashMoney',
        header: 'Ledger Bank/ cash where Money was Deposited',
        size: 150,
      },

      {
        accessorKey: 'Amountwithdrawn',
        header: 'Amount withdrawn',
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
        accessorKey: 'BankName',
        header: 'Bank Name',
        size: 150,
      },
      {
        accessorKey: 'BranchName',
        header: 'Branch Name',
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




 

  // for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  
  return (
    <Box>
      <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}> create  Contra Voucher</Button>
         
        </Box>

        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={ContraVoucherTable}
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
            <Typography m={2} variant="h6"><b>Contra Voucher</b></Typography>
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
                  <Typography>Amount Withdrawn (CR)</Typography>
                  <TextField size="small" margin="normal" placeholder='Amount Withdrawn (CR)' fullWidth />
                </Box>

                <Box >
                  <Typography>Dr.Ledge</Typography>
                  <FormControl fullWidth size="small" margin="normal">

                    <Select>
                      <MenuItem value="MDCC Bank">MDCC Bank</MenuItem>
                      <MenuItem value="Saraswat Bank">Saraswat Bank</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                

                <Box >
                  <Typography>Transaction Type Payment</Typography>
                  <FormControl fullWidth size="small" margin="normal">

                    <Select>
                      <MenuItem value="MDCC Bank">NEFT</MenuItem>
                      <MenuItem value="Saraswat Bank">IMPS</MenuItem>
                      <MenuItem value="Cash">UPI</MenuItem>
                      <MenuItem value="Cash">Cheque</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography>Cheque No./Txn No.</Typography>
                  <TextField size="small" margin="normal" placeholder='Cheque No./Txn No.' fullWidth />
                </Box>


                <Box>
                  <Typography>Bank Name</Typography>
                  <TextField size="small" margin="normal" placeholder='Bank Name' fullWidth />
                </Box>
               
              </Box>


              <Box flex={1} m={2}>
              <Box >
                  <Typography>Cr Bank</Typography>
                  <FormControl fullWidth size="small" margin="normal">

                  <Select>
                      <MenuItem value="MDCC Bank">MDCC Bank</MenuItem>
                      <MenuItem value="Saraswat Bank">Saraswat Bank</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box >
                  <Typography>Bill Contra</Typography>
                  <FormControl fullWidth size="small" margin="normal">

                    <Select>
                      <MenuItem value="Bill1">Bill1</MenuItem>
                      <MenuItem value="Bill2">Bill2</MenuItem>
                      <MenuItem value="Bill3">Bill3</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography>Amount Withdrawn (DR)</Typography>
                  <TextField size="small" margin="normal" placeholder='Amount Withdrawn (DR)' fullWidth />
                </Box>


                <Box>
                  <Typography>Inst.No</Typography>
                  <TextField size="small" margin="normal" placeholder='Inst.No' fullWidth />
                </Box>

                <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box  >
                      <Typography > Inst.Date</Typography>
                      <DatePicker

                        format="dd/MM/yyyy"
                        sx={{ width: "100%", }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </Box>
                  </LocalizationProvider>
                </Box>


                <Box>
                  <Typography>Branch Name</Typography>
                  <TextField size="small" margin="normal" placeholder='Branch Name' fullWidth />
                </Box>
              </Box>
            </Box>


            <Box m={2}>
              <Typography>Narration</Typography>
              <TextField size="small" margin="normal" placeholder='Narration' fullWidth />
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

export default ContraVoucher;



