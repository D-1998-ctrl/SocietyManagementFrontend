import React, { useMemo, useState } from 'react';
import { Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Organization = () => {
  return (
    <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 2, height: 'auto' }}>
      <Box textAlign={'center'} m={1}>
        <Typography variant='h4'>Society Information</Typography>
      </Box>
      <Divider />

      <Box mt={2}>
        <Box>
          <Typography>Society Name</Typography>
          <TextField size="small" margin="normal" placeholder="SocietyName" fullWidth />
        </Box>
        <Box display={'flex'} alignItems="center" gap={2}>
          <Box flex={1} >

            <Box mt={1}>
              <Typography>Address Line1</Typography>
              <TextField size="small" margin="normal" placeholder="SocietyName" fullWidth />
            </Box>

            <Box>
              <Typography>Address Line3</Typography>
              <TextField size="small" margin="normal" placeholder="SocietyName" fullWidth />
            </Box>
            <Box>
              <Typography>Pin</Typography>
              <TextField size="small" margin="normal" placeholder="Pin" fullWidth />
            </Box>
          </Box>

          <Box flex={1} mt={1} >
            <Box>
              <Typography>Address Line2</Typography>
              <TextField size="small" margin="normal" placeholder="SocietyName" fullWidth />
            </Box>

            <Box>
              <Typography>State</Typography>
              <FormControl fullWidth size="small" margin="normal" placeholder='State'>

                <Select>
                  <MenuItem value="India">India</MenuItem>
                  <MenuItem value="USA">USA</MenuItem>
                  <MenuItem value="SouthAfrica">SouthAfrica</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography>Mobile No</Typography>
              <TextField size="small" margin="normal" placeholder="Mobile No" fullWidth />
            </Box>
          </Box>

        </Box>

        <Box>
          <Typography>Email Id</Typography>
          <TextField size="small" margin="normal" placeholder="Email Id" fullWidth />
        </Box>

        <Box display={'flex'} alignItems="center" gap={2}>
          <Box flex={1}>
            <Box>
              <Typography>Registration</Typography>
              <TextField size="small" margin="normal" placeholder="Registration" fullWidth />
            </Box>
          </Box>

          <Box flex={1}>

            <Box >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box  >
                  <Typography >Registered Date</Typography>
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

        <Box>
          <Typography>Registering Authority</Typography>
          <FormControl fullWidth size="small" margin="normal" placeholder='Registering Authority'>

            <Select>
              <MenuItem value="Deputy Registrar">Deputy Registrar</MenuItem>
              <MenuItem value="Assistant Registrar">Assistant Registrar</MenuItem>
              <MenuItem value="Cooperative Societies">Cooperative Societies</MenuItem>
              <MenuItem value="ward">Ward</MenuItem>
              <MenuItem value="tal">Tal</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography>Address of Registering Authority</Typography>
          <TextField size="small" margin="normal" placeholder="Address of Registering Authority" fullWidth />
        </Box>


      </Box>

      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4} mb={4}>
        <Box>
          <Button variant='contained'>Save </Button>
        </Box>

        <Box>
          <Button variant='outlined'>Cancel </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Organization
