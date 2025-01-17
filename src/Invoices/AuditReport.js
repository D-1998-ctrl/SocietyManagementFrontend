



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


const AuditReport = () => {
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
      <Box >

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}> create Audit Report</Button>

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
            <Typography m={2} variant="h6"><b>Audit Report</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box>
          <Divider />

          <Box display={'flex'} alignItems="center" gap={2}>
            <Box m={2} flex={1}>
              <Box>
                <Typography>Name of the Society</Typography>
                <TextField size="small" margin="normal" placeholder='Name of the Society' fullWidth />
              </Box>


              <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box  >
                      <Typography >Audit Classification for the Year</Typography>
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
                      <Typography >Date of Registration</Typography>
                      <DatePicker

                        format="dd/MM/yyyy"
                        sx={{ width: "100%", }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </Box>
                  </LocalizationProvider>
              </Box>
         
              <Box>
                <Typography>No. of Branches, Deposits of Shops</Typography>
                <TextField size="small" margin="normal" placeholder='No. of Branches, Deposits of Shops' fullWidth />
              </Box>


              <Box>
                <Typography>Period Covered During the Present Audit</Typography>
                <TextField size="small" margin="normal" placeholder='Period Covered During the Present Audit' fullWidth />
              </Box>



            </Box>

            <Box m={2} flex={1}>
            <Box>
                <Typography>Full Registered Address</Typography>
                <TextField size="small" margin="normal" placeholder='Full Registered Address' fullWidth />
              </Box>

              <Box>
                <Typography>Audit Classification Given</Typography>
                <TextField size="small" margin="normal" placeholder='Audit Classification Given' fullWidth />
              </Box>


              
              <Box>
                <Typography>Area of Operation</Typography>
                <TextField size="small" margin="normal" placeholder='Area of Operation' fullWidth />
              </Box>


              <Box>
                <Typography>Full Name of the Auditor</Typography>
                <TextField size="small" margin="normal" placeholder='Full Name of the Auditor' fullWidth />
              </Box>

            
              <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box  >
                      <Typography >Date on Which Audit was Commenced and Completed</Typography>
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


          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={20} >
            <Box>
              <Button variant='contained'>Submit</Button>
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

export default AuditReport;





