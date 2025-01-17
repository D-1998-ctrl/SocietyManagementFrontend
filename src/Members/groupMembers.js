import React, { useMemo, useState } from 'react';
import { Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel,Checkbox } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import data from '../Members/data.json'
const GroupMembers = () => {


  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'srNo',
        header: 'Sr No',
        size: 100,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        size: 150,
      },
      {
        accessorKey: 'middleName',
        header: 'Middle Name',
        size: 150,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 150,
      },
      {
        accessorKey: 'dob',
        header: 'Date of Birth',
        size: 150,
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        size: 100,
      },
      {
        accessorKey: 'annualIncome',
        header: 'Annual Income',
        size: 150,
      },
      {
        accessorKey: 'mobileNo1',
        header: 'Mobile No 1',
        size: 150,
      },
      {
        accessorKey: 'mobileNo2',
        header: 'Mobile No 2',
        size: 150,
      },
      {
        accessorKey: 'landline1',
        header: 'Landline 1',
        size: 150,
      },
      {
        accessorKey: 'landline2',
        header: 'Landline 2',
        size: 150,
      },
      {
        accessorKey: 'email1',
        header: 'Email 1',
        size: 200,
      },
      {
        accessorKey: 'email2',
        header: 'Email 2',
        size: 200,
      },
      {
        accessorKey: 'pan',
        header: 'PAN',
        size: 150,
      },
      {
        accessorKey: 'aadhar',
        header: 'Aadhar',
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
        <Box textAlign={'center'}>
          <Typography variant='h4'>Member Group</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}>New Member</Button>
          {/* <Button variant='contained' onClick={handlefindMemberDrawerOpen}>Find Member</Button> */}
        </Box>

        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={data}
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
            <Typography m={2} variant="h6"><b>Manage Member</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box>
          <Divider />


          <Box>
            <Box display={'flex'} justifyContent={'space-between'} m={2}>
              <Box>
                <Typography>Name</Typography>
                <FormControl sx={{ width: '120px' }} size="small" margin="normal">
                  <Select
                    labelId="member-select-label"
                    id="member-select"
                    value={selectedOption}
                    onChange={handleChange}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography>FirstName</Typography>
                <TextField size="small" margin="normal" placeholder='FirstName' fullWidth />
              </Box>

              <Box>
                <Typography>MiddleName</Typography>
                <TextField size="small" margin="normal" placeholder='MiddleName' fullWidth />
              </Box>

              <Box>
                <Typography>SurName</Typography>
                <TextField size="small" margin="normal" placeholder='SurName' fullWidth />
              </Box>
            </Box>

            <Box m={2}>
              <Box display="flex" justifyContent="space-between">

                <Box >
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box  >
                      <Typography > Date of birth</Typography>
                      <DatePicker

                        format="dd/MM/yyyy"
                        sx={{ width: "100%", }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </Box>
                  </LocalizationProvider>
                  <Box>
                    <Typography>Occupation</Typography>
                    <TextField size="small" margin="normal" placeholder='Occupation' sx={{ width: '420px' }} />
                  </Box>
                  <Box >
                    <Typography>Mobile No 1</Typography>
                    <TextField size="small" margin="normal" placeholder='Mobile No 1' sx={{ width: '420px' }} />
                  </Box>
                  <Box >
                    <Typography>Landline No 1</Typography>
                    <TextField size="small" margin="normal" placeholder='Landline No 1' sx={{ width: '420px' }} />
                  </Box>
                  <Box >
                    <Typography>Email 1</Typography>
                    <TextField size="small" margin="normal" placeholder='Email 1' sx={{ width: '420px' }} />
                  </Box>
                  <Box >
                    <Typography>PAN</Typography>
                    <TextField size="small" margin="normal" placeholder='PAN' sx={{ width: '420px' }} />
                  </Box>
                  <Box>
                    <Typography>Address Type</Typography>
                    <FormControl fullWidth size="small" margin="normal">

                      <Select>
                        <MenuItem value="Home">Home</MenuItem>
                        <MenuItem value="Office">Office</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                </Box>


                <Box>
                  <Box>
                    <Typography>Gender</Typography>
                    <FormControl fullWidth size="small" margin="normal">

                      <Select>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box >
                    <Typography>Annual Income</Typography>
                    <FormControl fullWidth size="small" margin="normal">

                      <Select>
                        <MenuItem value="0-1L">0-1L</MenuItem>
                        <MenuItem value="1-5L">1-5L</MenuItem>
                        <MenuItem value="5L+">5L+</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box >
                    <Typography>Mobile No 2</Typography>
                    <TextField size="small" margin="normal" placeholder='Mobile No 2' sx={{ width: '420px' }} />
                  </Box>
                  <Box >
                    <Typography>Landline No 2</Typography>
                    <TextField size="small" margin="normal" placeholder='Landline No 2' sx={{ width: '420px' }} />
                  </Box>
                  <Box>
                    <Typography>Email 2</Typography>
                    <TextField size="small" margin="normal" placeholder='Email 2' sx={{ width: '420px' }} />
                  </Box>
                  <Box >
                    <Typography>Aadhar</Typography>
                    <TextField size="small" margin="normal" placeholder='Aadhar' sx={{ width: '420px' }} />
                  </Box>
                  <Box >
                    <Typography>Address</Typography>
                    <TextField size="small" margin="normal" placeholder='Address' sx={{ width: '420px' }} />
                  </Box>
                  <Box >
                    <Typography>City/Village</Typography>
                    <FormControl fullWidth size="small" margin="normal">
                      <InputLabel>Select City/Village</InputLabel>
                      <Select>
                        <MenuItem value="City1">City1</MenuItem>
                        <MenuItem value="City2">City2</MenuItem>
                        <MenuItem value="Village1">Village1</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            </Box>



          </Box>


          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mb={2}>
            <Box>
              <Button variant='contained'>Save </Button>
            </Box>

            <Box>
              <Button onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
            </Box>
          </Box>
        </Drawer>


        {/* drawer for find mewmber */}
        <Drawer
          anchor="right"
          open={Open}
          onClose={handlefindMemberDrawerClose}
          PaperProps={{
            sx: { width: '40%' }, // Set the width here
          }}
        >
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography m={2} variant="h6"><b>Filter Member</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handlefindMemberDrawerClose} />
          </Box>
          <Divider />

          
          <Box m={2}>
            <Typography>Mobile No</Typography>
            <TextField size="small" margin="normal" placeholder='Mobile No' fullWidth/>
          </Box>

          <Box m={2}>
            <Typography>Email ID</Typography>
            <TextField size="small" margin="normal" placeholder='Email ID' fullWidth/>
          </Box>

          <Box ml={2}>
            <Typography variant='h6'>Salutation</Typography>
            <Box display={'flex'} alignItems={'center'} gap={5}   >
              <Box>  <Checkbox /> Mr</Box>
              <Box>  <Checkbox /> Ms</Box>
              <Box>  <Checkbox /> Mrs</Box>
              <Box>  <Checkbox /> Smt</Box>
            </Box>
          </Box>


          
          <Box ml={2} mt={2}>
            <Typography variant='h6'>Occupation</Typography>
            <Box display={'flex'} alignItems={'center'} gap={5}   >
              <Box>  <Checkbox /> Engineer</Box>
              <Box>  <Checkbox />Doctor</Box>
              <Box>  <Checkbox />Teacher</Box>
              <Box>  <Checkbox /> Artist</Box>
            </Box>
          </Box>


          <Box ml={2} mt={2}>
            <Typography variant='h6'>Annual Income</Typography>
            <Box display={'flex'} alignItems={'center'} gap={5}   >
            <Box>
  <Checkbox />
  <label>&lt;20k</label>
</Box>
              <Box>  <Checkbox />20k-50k</Box>
              <Box>  <Checkbox />50k-100k</Box>
              <Box>  <Checkbox /> <label>&gt;100k</label></Box>
            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2}  mt={4}>
            <Box>
              <Button variant='contained'>Serch </Button>
            </Box>

            <Box>
              <Button onClick={handlefindMemberDrawerClose} variant='outlined'>Cancel </Button>
            </Box>
          </Box>
        </Drawer>


      </Box>
    </Box>
  );
};

export default GroupMembers;
