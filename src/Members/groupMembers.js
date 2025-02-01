import React, { useMemo, useState } from 'react';
import { Box, Alert, useMediaQuery, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import data from '../Members/data.json'
import { useNavigate } from 'react-router-dom'
import { useTheme } from "@mui/material/styles";


const GroupMembers = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();
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
        Cell: ({ row }) => (
          <span
            style={{ cursor: 'pointer', color: 'blue' }}
            onClick={() => navigate(`/accountdash/overview`)}
          >
            {row.original.firstName}
          </span>
        ),
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


  const handlefindMemberDrawerClose = () => {
    setOpen(false);
  };

  //validation
  const [formValues, setFormValues] = useState({
    Name: "",
    FirstName: "",
    MiddleName: "",
    SurName: "",
    Dateofbirth: "",
    Occupation: "",
    MobileNo1: "",
    LandlineNo1: "",
    Email1: "",
    PAN: "",
    AddressType: "",
    Gender: "",
    AnnualIncome: "",
    MobileNo2: "",
    LandlineNo2: "",
    Email2: "",
    Aadhar: "",
    Address: "",
    CityVillage: "",

  });

  const [formErrors, setFormErrors] = useState({});

  const handlevalidationChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on change
  };

  const validate = () => {
    const errors = {};

    if (!formValues.Name) errors.Name = "Name is required.";
    if (!formValues.FirstName) errors.FirstName = "FirstName is required.";
    if (!formValues.MiddleName) errors.MiddleName = "MiddleName Name is required.";
    if (!formValues.SurName) errors.SurName = "SurName is required.";
    if (!formValues.Dateofbirth) errors.Dateofbirth = "Date of birth is required.";
    if (!formValues.Occupation) errors.Occupation = "Occupation is required.";
    if (!formValues.MobileNo1) errors.MobileNo1 = "MobileNo1 is required.";
    if (!formValues.LandlineNo1) errors.LandlineNo1 = "Landline No 1 is required.";
    if (!formValues.Email1) errors.Email1 = "Email 1 is required.";
    if (!formValues.PAN) errors.PAN = "PAN is required.";
    if (!formValues.AddressType) errors.AddressType = "Address Type is required.";


    if (!formValues.Gender) errors.Gender = "Gender is required.";
    if (!formValues.AnnualIncome) errors.AnnualIncome = "Annual Income is required.";
    if (!formValues.MobileNo2) errors.MobileNo2 = "Mobile No 2 is required.";
    if (!formValues.LandlineNo2) errors.LandlineNo2 = "LandlineNo2 is required.";
    if (!formValues.Email2) errors.Email2 = "Email2 is required.";
    if (!formValues.Aadhar) errors.Aadhar = "Aadhar is required.";
    if (!formValues.Address) errors.Address = "Address is required.";
    if (!formValues.CityVillage) errors.CityVillage = "CityVillage is required.";


    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSave = () => {
    if (validate()) {
      // Perform save action
      console.log("Form submitted:", formValues);
      handleDrawerClose();
    }
  };


  return (
    <Box>
      <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>
        <Box textAlign={'center'}>
          <Typography variant='h4'>Member Group</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}>New Member</Button>

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
            sx: {
              width: isSmallScreen ? "100%" : '60%',
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",

              zIndex: 1000,
            }, // Set the width here
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
                <FormControl sx={{ width: '120px' }} size="small" margin="normal" onChange={(e) => handlevalidationChange("Name", e.target.value)} value={formValues.Name} error={!!formErrors.Name}>
                  <Select
                    labelId="member-select-label"
                    id="member-select"
                  // value={selectedOption}
                  // onChange={handleChange}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {(!!formErrors.Name) && (
                    <Alert severity="error" sx={{
                      width: '92%',
                      p: '2',
                      pl: '4%', height: '23px',
                      borderRadius: '8px',
                      borderTopLeftRadius: '0',
                      borderTopRightRadius: '0',
                      fontSize: '12px',
                      display: 'flex',
                      backgroundColor: "#ffdddd",
                      color: "#a00",
                      alignItems: 'center',
                      '& .MuiAlert-icon': {
                        fontSize: '16px',
                        mr: '8px',
                      },
                    }}>
                      {formErrors.Name}
                    </Alert>
                  )}
                </FormControl>
              </Box>

              <Box>
                <Typography>FirstName</Typography>
                <TextField onChange={(e) => handlevalidationChange("FirstName", e.target.value)} value={formValues.FirstName} error={!!formErrors.FirstName} size="small" margin="normal" placeholder='FirstName' fullWidth />
                {(!!formErrors.FirstName) && (
                  <Alert severity="error" sx={{
                    width: '92%',
                    p: '2',
                    pl: '4%', height: '23px',
                    borderRadius: '8px',
                    borderTopLeftRadius: '0',
                    borderTopRightRadius: '0',
                    fontSize: '12px',
                    display: 'flex',
                    backgroundColor: "#ffdddd",
                    color: "#a00",
                    alignItems: 'center',
                    '& .MuiAlert-icon': {
                      fontSize: '16px',
                      mr: '8px',
                    },
                  }}>
                    {formErrors.FirstName}
                  </Alert>
                )}
              </Box>

              <Box>
                <Typography>MiddleName</Typography>
                <TextField onChange={(e) => handlevalidationChange("MiddleName", e.target.value)} value={formValues.MiddleName} error={!!formErrors.MiddleName} size="small" margin="normal" placeholder='MiddleName' fullWidth />
                {(!!formErrors.MiddleName) && (
                  <Alert severity="error" sx={{
                    width: '92%',
                    p: '2',
                    pl: '4%', height: '23px',
                    borderRadius: '8px',
                    borderTopLeftRadius: '0',
                    borderTopRightRadius: '0',
                    fontSize: '12px',
                    display: 'flex',
                    backgroundColor: "#ffdddd",
                    color: "#a00",
                    alignItems: 'center',
                    '& .MuiAlert-icon': {
                      fontSize: '16px',
                      mr: '8px',
                    },
                  }}>
                    {formErrors.MiddleName}
                  </Alert>
                )}
              </Box>

              <Box>
                <Typography>SurName</Typography>
                <TextField onChange={(e) => handlevalidationChange("SurName", e.target.value)} value={formValues.SurName} error={!!formErrors.SurName} size="small" margin="normal" placeholder='SurName' fullWidth />
                {(!!formErrors.SurName) && (
                  <Alert severity="error" sx={{
                    width: '92%',
                    p: '2',
                    pl: '4%', height: '23px',
                    borderRadius: '8px',
                    borderTopLeftRadius: '0',
                    borderTopRightRadius: '0',
                    fontSize: '12px',
                    display: 'flex',
                    backgroundColor: "#ffdddd",
                    color: "#a00",
                    alignItems: 'center',
                    '& .MuiAlert-icon': {
                      fontSize: '16px',
                      mr: '8px',
                    },
                  }}>
                    {formErrors.SurName}
                  </Alert>
                )}
              </Box>
            </Box>

            <Box m={2}>
              <Box display={'flex'} alignItems={'center'} gap={5}>
                <Box flex={1} >
                  {/* <Box>
                    <Typography>Date of birth</Typography>

                    <TextField onChange={(e) => handlevalidationChange("Dateofbirth", e.target.value)} value={formValues.Dateofbirth} error={!!formErrors.Dateofbirth} size="small" margin="normal" placeholder='Material Code' fullWidth />
                    {(!!formErrors.Dateofbirth) && (
                      <Alert severity="error" sx={{
                        width: '92%',
                        p: '2',
                        pl: '4%', height: '23px',
                        borderRadius: '8px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        fontSize: '12px',
                        display: 'flex',
                        backgroundColor: "#ffdddd",
                        color: "#a00",
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                          fontSize: '16px',
                          mr: '8px',
                        },
                      }}>
                        {formErrors.Dateofbirth}
                      </Alert>
                    )}
                  </Box> */}

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

                    <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("Occupation", e.target.value)} value={formValues.Occupation} error={!!formErrors.Occupation} fullWidth placeholder='Occupation' />
                    {(!!formErrors.Occupation) && (
                      <Alert severity="error" sx={{
                        width: '92%',
                        p: '2',
                        pl: '4%', height: '23px',
                        borderRadius: '8px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        fontSize: '12px',
                        display: 'flex',
                        backgroundColor: "#ffdddd",
                        color: "#a00",
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                          fontSize: '16px',
                          mr: '8px',
                        },
                      }}>
                        {formErrors.Occupation}
                      </Alert>
                    )}

                  </Box>


                  <Box >
                    <Typography>Mobile No 1</Typography>
                    <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("MobileNo1", e.target.value)} value={formValues.MobileNo1} error={!!formErrors.MobileNo1} fullWidth placeholder='MobileNo 1' />
                    {(!!formErrors.MobileNo1) && (
                      <Alert severity="error" sx={{
                        width: '92%',
                        p: '2',
                        pl: '4%', height: '23px',
                        borderRadius: '8px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        fontSize: '12px',
                        display: 'flex',
                        backgroundColor: "#ffdddd",
                        color: "#a00",
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                          fontSize: '16px',
                          mr: '8px',
                        },
                      }}>
                        {formErrors.MobileNo1}
                      </Alert>
                    )}

                  </Box>

                  <Box >
                    <Typography>Landline No 1</Typography>
                    <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("LandlineNo1", e.target.value)} value={formValues.LandlineNo1} error={!!formErrors.LandlineNo1} fullWidth placeholder='LandlineNo1' />


                    {(!!formErrors.LandlineNo1) && (
                      <Alert severity="error" sx={{
                        width: '92%',
                        p: '2',
                        pl: '4%', height: '23px',
                        borderRadius: '8px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        fontSize: '12px',
                        display: 'flex',
                        backgroundColor: "#ffdddd",
                        color: "#a00",
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                          fontSize: '16px',
                          mr: '8px',
                        },
                      }}>
                        {formErrors.LandlineNo1}
                      </Alert>
                    )}
                  </Box>

                  <Box >
                    <Typography>Email 1</Typography>
                    <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("Email1", e.target.value)} value={formValues.Email1} error={!!formErrors.Email1} fullWidth placeholder='Email 1' />
                    {(!!formErrors.Email1) && (
                      <Alert severity="error" sx={{
                        width: '92%',
                        p: '2',
                        pl: '4%', height: '23px',
                        borderRadius: '8px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        fontSize: '12px',
                        display: 'flex',
                        backgroundColor: "#ffdddd",
                        color: "#a00",
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                          fontSize: '16px',
                          mr: '8px',
                        },
                      }}>
                        {formErrors.Email1}
                      </Alert>
                    )}
                  </Box>
                  <Box >
                    <Typography>PAN</Typography>
                    <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("PAN", e.target.value)} value={formValues.PAN} error={!!formErrors.PAN} fullWidth placeholder='PAN' />
                    {(!!formErrors.PAN) && (
                      <Alert severity="error" sx={{
                        width: '92%',
                        p: '2',
                        pl: '4%', height: '23px',
                        borderRadius: '8px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        fontSize: '12px',
                        display: 'flex',
                        backgroundColor: "#ffdddd",
                        color: "#a00",
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                          fontSize: '16px',
                          mr: '8px',
                        },
                      }}>
                        {formErrors.PAN}
                      </Alert>
                    )}
                  </Box>

                  <Box>
                    <Typography>Address Type</Typography>
                    <FormControl onChange={(e) => handlevalidationChange("AddressType", e.target.value)} value={formValues.AddressType} error={!!formErrors.AddressType} fullWidth size="small" margin="normal">

                      <Select>
                        <MenuItem value="Home">Home</MenuItem>
                        <MenuItem value="Office">Office</MenuItem>
                      </Select>
                      {(!!formErrors.AddressType) && (
                        <Alert severity="error" sx={{
                          width: '92%',
                          p: '2',
                          pl: '4%', height: '23px',
                          borderRadius: '8px',
                          borderTopLeftRadius: '0',
                          borderTopRightRadius: '0',
                          fontSize: '12px',
                          display: 'flex',
                          backgroundColor: "#ffdddd",
                          color: "#a00",
                          alignItems: 'center',
                          '& .MuiAlert-icon': {
                            fontSize: '16px',
                            mr: '8px',
                          },
                        }}>
                          {formErrors.AddressType}
                        </Alert>
                      )}
                    </FormControl>
                  </Box>





                </Box>

                <Box flex={1}>
                  <Box>
                    <Typography>Gender</Typography>
                    <FormControl onChange={(e) => handlevalidationChange("Gender", e.target.value)} value={formValues.Gender} error={!!formErrors.Gender} fullWidth size="small" margin="normal">

                      <Select>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>


                      {(!!formErrors.Gender) && (
                        <Alert severity="error" sx={{
                          width: '92%',
                          p: '2',
                          pl: '4%', height: '23px',
                          borderRadius: '8px',
                          borderTopLeftRadius: '0',
                          borderTopRightRadius: '0',
                          fontSize: '12px',
                          display: 'flex',
                          backgroundColor: "#ffdddd",
                          color: "#a00",
                          alignItems: 'center',
                          '& .MuiAlert-icon': {
                            fontSize: '16px',
                            mr: '8px',
                          },
                        }}>
                          {formErrors.Gender}
                        </Alert>
                      )}
                    </FormControl>
                  </Box>

                  <Box >
                    <Typography>Annual Income</Typography>
                    <FormControl onChange={(e) => handlevalidationChange("AnnualIncome", e.target.value)} value={formValues.AnnualIncome} error={!!formErrors.AnnualIncome} fullWidth size="small" margin="normal">

                      <Select>
                        <MenuItem value="0-1L">0-1L</MenuItem>
                        <MenuItem value="1-5L">1-5L</MenuItem>
                        <MenuItem value="5L+">5L+</MenuItem>
                      </Select>

                      {(!!formErrors.AnnualIncome) && (
                        <Alert severity="error" sx={{
                          width: '92%',
                          p: '2',
                          pl: '4%', height: '23px',
                          borderRadius: '8px',
                          borderTopLeftRadius: '0',
                          borderTopRightRadius: '0',
                          fontSize: '12px',
                          display: 'flex',
                          backgroundColor: "#ffdddd",
                          color: "#a00",
                          alignItems: 'center',
                          '& .MuiAlert-icon': {
                            fontSize: '16px',
                            mr: '8px',
                          },
                        }}>
                          {formErrors.AnnualIncome}
                        </Alert>
                      )}
                    </FormControl>
                  </Box>

                  <Box >
                    <Typography>MobileNo2</Typography>
                    <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("MobileNo2", e.target.value)} value={formValues.MobileNo2} error={!!formErrors.MobileNo2} fullWidth placeholder='MobileNo2' />
                    {(!!formErrors.MobileNo2) && (
                      <Alert severity="error" sx={{
                        width: '92%',
                        p: '2',
                        pl: '4%', height: '23px',
                        borderRadius: '8px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        fontSize: '12px',
                        display: 'flex',
                        backgroundColor: "#ffdddd",
                        color: "#a00",
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                          fontSize: '16px',
                          mr: '8px',
                        },
                      }}>
                        {formErrors.MobileNo2}
                      </Alert>
                    )}
                  </Box>



                  <Box >
                    <Typography>LandlineNo 2</Typography>
                    <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("LandlineNo2", e.target.value)} value={formValues.LandlineNo2} error={!!formErrors.LandlineNo2} fullWidth placeholder='LandlineNo2' />
                    {(!!formErrors.LandlineNo2) && (
                      <Alert severity="error" sx={{
                        width: '92%',
                        p: '2',
                        pl: '4%', height: '23px',
                        borderRadius: '8px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        fontSize: '12px',
                        display: 'flex',
                        backgroundColor: "#ffdddd",
                        color: "#a00",
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                          fontSize: '16px',
                          mr: '8px',
                        },
                      }}>
                        {formErrors.LandlineNo2}
                      </Alert>
                    )}
                  </Box>



                  <Box >
                    <Typography>Email2</Typography>
                    <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("Email2", e.target.value)} value={formValues.Email2} error={!!formErrors.Email2} fullWidth placeholder='Email2' />
                    {(!!formErrors.Email2) && (
                      <Alert severity="error" sx={{
                        width: '92%',
                        p: '2',
                        pl: '4%', height: '23px',
                        borderRadius: '8px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        fontSize: '12px',
                        display: 'flex',
                        backgroundColor: "#ffdddd",
                        color: "#a00",
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                          fontSize: '16px',
                          mr: '8px',
                        },
                      }}>
                        {formErrors.Email2}
                      </Alert>
                    )}
                  </Box>



                  <Box >
                    <Typography>Aadhar</Typography>
                    <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("Aadhar", e.target.value)} value={formValues.Aadhar} error={!!formErrors.Aadhar} fullWidth placeholder='Aadhar' />
                    {(!!formErrors.Aadhar) && (
                      <Alert severity="error" sx={{
                        width: '92%',
                        p: '2',
                        pl: '4%', height: '23px',
                        borderRadius: '8px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        fontSize: '12px',
                        display: 'flex',
                        backgroundColor: "#ffdddd",
                        color: "#a00",
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                          fontSize: '16px',
                          mr: '8px',
                        },
                      }}>
                        {formErrors.Aadhar}
                      </Alert>
                    )}
                  </Box>



                  <Box >
                    <Typography>Address</Typography>
                    <TextField size="small" margin="normal" onChange={(e) => handlevalidationChange("Address", e.target.value)} value={formValues.Address} error={!!formErrors.Address} fullWidth placeholder='Address' />
                    {(!!formErrors.Address) && (
                      <Alert severity="error" sx={{
                        width: '92%',
                        p: '2',
                        pl: '4%', height: '23px',
                        borderRadius: '8px',
                        borderTopLeftRadius: '0',
                        borderTopRightRadius: '0',
                        fontSize: '12px',
                        display: 'flex',
                        backgroundColor: "#ffdddd",
                        color: "#a00",
                        alignItems: 'center',
                        '& .MuiAlert-icon': {
                          fontSize: '16px',
                          mr: '8px',
                        },
                      }}>
                        {formErrors.Address}
                      </Alert>
                    )}
                  </Box>

                </Box>


              </Box>

              <Box >
                <Typography>City/Village</Typography>
                <FormControl onChange={(e) => handlevalidationChange("CityVillage", e.target.value)} value={formValues.CityVillage} error={!!formErrors.CityVillage} fullWidth size="small" margin="normal">

                  <Select>
                    <MenuItem value="City1">City1</MenuItem>
                    <MenuItem value="City2">City2</MenuItem>
                    <MenuItem value="Village1">Village1</MenuItem>
                  </Select>

                  {(!!formErrors.CityVillage) && (
                    <Alert severity="error" sx={{
                      width: '92%',
                      p: '2',
                      pl: '4%', height: '23px',
                      borderRadius: '8px',
                      borderTopLeftRadius: '0',
                      borderTopRightRadius: '0',
                      fontSize: '12px',
                      display: 'flex',
                      backgroundColor: "#ffdddd",
                      color: "#a00",
                      alignItems: 'center',
                      '& .MuiAlert-icon': {
                        fontSize: '16px',
                        mr: '8px',
                      },
                    }}>
                      {formErrors.CityVillage}
                    </Alert>
                  )}
                </FormControl>
              </Box>








            </Box>



          </Box>


          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mb={2}>
            <Box>
              <Button onClick={handleSave} variant='contained' >Save </Button>
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
            <TextField size="small" margin="normal" placeholder='Mobile No' fullWidth />
          </Box>

          <Box m={2}>
            <Typography>Email ID</Typography>
            <TextField size="small" margin="normal" placeholder='Email ID' fullWidth />
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

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4}>
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
