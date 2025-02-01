
import React, { useMemo, useState } from 'react';
import { Alert, useMediaQuery, Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTheme } from "@mui/material/styles";
const Managingcommittee = () => {
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
        accessorKey: 'Description',
        header: 'Description',
        size: 150,
      },
      {
        accessorKey: 'Comments',
        header: 'Comments',
        size: 150,
      },
      {
        accessorKey: 'DateCreated',
        header: 'Date Created',
        size: 150,
      },
      {
        accessorKey: 'DateFrom',
        header: 'Date From',
        size: 150,
      },
      {
        accessorKey: 'DateTo',
        header: 'Date To',
        size: 150,
      },
      {
        accessorKey: 'Resolution',
        header: 'Resolution',
        size: 150,
      },

      {
        id: 'actions',
        header: 'Actions',
        size: 150,

      },
    ];
  }, []);

  const data = [
    {
      srNo: 1,
      Description: 'Annual board meeting to discuss strategic planning.',
      Comments: 'All members to attend.',
      DateCreated: '2024-12-01',
      DateFrom: '2025-01-01',
      DateTo: '2025-01-01',
      Resolution: 'Approved by board',
    },
  ];



  // for add Board Of Director  drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  //for Board Of Director Search drawer

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
          <Typography variant='h4'>Board Of Directors</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          <Button variant="contained" onClick={handleDrawerOpen}>add Board Of Director</Button>
          {/* <Button variant='contained' onClick={handlefindMemberDrawerOpen}>Board Of Director Search </Button> */}
        </Box>

        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={data}

            enableColumnOrdering
            enableColumnResizing
          />
        </Box>
        {/* drawer for Structure Details  */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: { borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : "650px",
              zIndex: 1000, }, // Set the width here
          }}
          
        >
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography m={2} variant="h6"><b>Board Of Directors</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box>
          <Divider />


          <Box display="flex" alignItems="center" gap={2}>
            <Box flex={1} m={2}>

              <Box >
                <Typography>Description</Typography>
                <TextField size="small" margin="normal" placeholder="Description" fullWidth />
              </Box>


              <Box >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box  >
                    <Typography >Date Created</Typography>
                    <DatePicker

                      format="dd/MM/yyyy"
                      sx={{ width: "100%", }}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>


              <Box >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box  >
                    <Typography >Date To</Typography>
                    <DatePicker

                      format="dd/MM/yyyy"
                      sx={{ width: "100%", }}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>


              <Box >
                <Typography>Chairman</Typography>
                <TextField size="small" margin="normal" placeholder="Chairman" fullWidth />
              </Box>

              <Box >
                <Typography>Secretary</Typography>
                <TextField size="small" margin="normal" placeholder="Secretary" fullWidth />
              </Box>


              <Box >
                <Typography>Treasurer</Typography>
                <TextField size="small" margin="normal" placeholder="Treasurer" fullWidth />
              </Box>


              <Box >
                <Typography>Director</Typography>
                <TextField size="small" margin="normal" placeholder="Director" fullWidth />
              </Box>

            </Box>








            <Box flex={1} m={2}>
              <Box >
                <Typography>Comments</Typography>
                <TextField size="small" margin="normal" placeholder="Comments" fullWidth />
              </Box>




              <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box  >
                    <Typography >Date From</Typography>
                    <DatePicker

                      format="dd/MM/yyyy"
                      sx={{ width: "100%", }}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>

              <Box>
                <Typography>Resolution</Typography>
                <FormControl fullWidth size="small" margin="normal">

                  <Select>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                  </Select>
                </FormControl>
              </Box>
               
              <Box >
                <Typography>Co-Chairman</Typography>
                <TextField size="small" margin="normal" placeholder="Co-Chairman" fullWidth />
              </Box>

              <Box >
                <Typography>Co-Secretary</Typography>
                <TextField size="small" margin="normal" placeholder="Co-Secretary" fullWidth />
              </Box>

              <Box >
                <Typography>
                Co-Treasurer</Typography>
                <TextField size="small" margin="normal" placeholder="Co-Treasurer" fullWidth />
              </Box>
              <Box >
                <Typography>Expert-Director</Typography>
                <TextField size="small" margin="normal" placeholder="Expert-Director" fullWidth />
              </Box>

             



            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4} mb={4}>
                          <Box>
                            <Button variant='contained'>Save </Button>
                          </Box>
                          <Box>
                            <Button variant='contained'>Add Officer </Button>
                          </Box>
                          <Box>
                            <Button onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
                          </Box>
                        </Box>
        </Drawer>


        {/* drawer for Property Details */}
        <Drawer
  anchor="right"
  open={Open}
  onClose={handlefindMemberDrawerClose}
  PaperProps={{
    sx: { width: '40%' }, // Set the width here
  }}
>
  <Box
    sx={{
      padding: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Typography variant="h6">
      <b>Filter Board Of Director</b>
    </Typography>
    <CloseIcon sx={{ cursor: 'pointer' }} onClick={handlefindMemberDrawerClose} />
  </Box>

  <Divider />

  <Box sx={{ padding: 2 }}>
  

    <Box mt={2}>
      <Typography>Comments</Typography>
      <TextField size="small" margin="normal" placeholder="Comments" fullWidth />
    </Box>


    <Box>
      <Typography>Resolution</Typography>
      <FormControl fullWidth size="small" margin="normal">
        <Select>
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          
        </Select>
      </FormControl>
    </Box>

    <Box mt={2}>
      <Typography>Description</Typography>
      <TextField size="small" margin="normal" placeholder="Description" fullWidth />
    </Box>
  </Box>

  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      mt: 4,
      mb: 4,
    }}
  >
    <Button variant="contained">Save</Button>
    <Button onClick={handlefindMemberDrawerClose} variant="outlined">
      Cancel
    </Button>
  </Box>
</Drawer>


      </Box>
    </Box>
  );
};

export default Managingcommittee;


