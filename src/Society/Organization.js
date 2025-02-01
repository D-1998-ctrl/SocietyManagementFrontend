import React, { useMemo, useState } from 'react';
import { Box, Alert, useMediaQuery, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTheme } from "@mui/material/styles";

const Organization = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  //validation
  const [formValues, setFormValues] = useState({
    SocietyName: "",
    AddressLine1: "",
    AddressLine2: "",
    AddressLine3: "",
    State: "",
    Pin: "",
    Mobile: "",
    Email: "",
    Registration: "",
    RegisteredDate: "",
    RegisteringAuthority: "",
    AddressofRegisteringAuthority: "",

  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on change
  };

  const validate = () => {
    const errors = {};

    if (!formValues.SocietyName) errors.SocietyName = "SocietyName is required.";
    if (!formValues.AddressLine1) errors.AddressLine1 = "AddressLine1 is required.";
    if (!formValues.AddressLine2) errors.AddressLine2 = "AddressLine2 is required.";
    if (!formValues.AddressLine3) errors.AddressLine3 = "AddressLine3 is required.";
    if (!formValues.State) errors.State = "State is required.";
    if (!formValues.Pin) errors.Pin = "Pin is required.";
    if (!formValues.Mobile) errors.Mobile = "Mobile no is required.";
    if (!formValues.Email) errors.Email = "Email is required.";

    if (!formValues.Registration) errors.Registration = "Registration is required.";
    if (!formValues.RegisteredDate) errors.RegisteredDate = "Registered Date is required.";
    if (!formValues.RegisteringAuthority) errors.RegisteringAuthority = "Registering Authority is required.";
    if (!formValues.AddressofRegisteringAuthority) errors.AddressofRegisteringAuthority = "Address of Registering Authority is required.";
    

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSave = () => {
    if (validate()) {
      // Perform save action
      console.log("Form submitted:", formValues);

    }
  };



  return (
    <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 2, height: 'auto' }}>
      <Box textAlign={'center'} m={1}>
        <Typography variant='h4'>Society Information</Typography>
      </Box>
      <Divider />

      <Box mt={2} >



        <Box >
          <Typography>Society Name</Typography>
          <TextField size="small" margin="normal" onChange={(e) => handleChange("SocietyName", e.target.value)} value={formValues.SocietyName} error={!!formErrors.SocietyName} fullWidth placeholder='Society Name' />

          {(!!formErrors.SocietyName) && (
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
              {formErrors.SocietyName}
            </Alert>
          )}
        </Box>




        <Box display="flex"
          gap={isSmallScreen ? 1 : 2}>
          <Box flex={1} >

            <Box mt={1}>
              <Typography>Address Line1</Typography>
              <TextField onChange={(e) => handleChange("AddressLine1", e.target.value)} value={formValues.AddressLine1} error={!!formErrors.AddressLine1} size="small" margin="normal" placeholder="Address Line1" fullWidth />
              {(!!formErrors.AddressLine1) && (
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
                  {formErrors.AddressLine1}
                </Alert>
              )}
            </Box>

            <Box>
              <Typography>Address Line3</Typography>
              <TextField onChange={(e) => handleChange("AddressLine3", e.target.value)} value={formValues.AddressLine3} error={!!formErrors.AddressLine3} size="small" margin="normal" placeholder="Address Line3" fullWidth />
              {(!!formErrors.AddressLine3) && (
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
                  {formErrors.AddressLine3}
                </Alert>
              )}
            </Box>

            <Box>
              <Typography>Pin</Typography>
              <TextField onChange={(e) => handleChange("Pin", e.target.value)} value={formValues.Pin} error={!!formErrors.Pin} size="small" margin="normal" placeholder="Pin" fullWidth />
              {(!!formErrors.Pin) && (
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
                  {formErrors.Pin}
                </Alert>
              )}
            </Box>
          </Box>

          <Box flex={1} mt={1} >
            <Box>
              <Typography>Address Line2</Typography>
              <TextField onChange={(e) => handleChange("AddressLine2", e.target.value)} value={formValues.AddressLine2} error={!!formErrors.AddressLine2} size="small" margin="normal" placeholder="AddressLine2" fullWidth />



              {(!!formErrors.AddressLine2) && (
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
                  {formErrors.AddressLine2}
                </Alert>
              )}
            </Box>

            <Box>
              <Typography>State</Typography>
              <FormControl fullWidth size="small" margin="normal" placeholder='State' onChange={(e) => handleChange("State", e.target.value)} value={formValues.State} error={!!formErrors.State}>


                <Select>
                  <MenuItem value="India">India</MenuItem>
                  <MenuItem value="USA">USA</MenuItem>
                  <MenuItem value="SouthAfrica">SouthAfrica</MenuItem>
                </Select>

                {(!!formErrors.State) && (
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
                    {formErrors.State}
                  </Alert>
                )}
              </FormControl>
            </Box>

            <Box>
              <Typography>Mobile No</Typography>
              <TextField onChange={(e) => handleChange("Mobile", e.target.value)} value={formValues.Mobile} error={!!formErrors.Mobile} size="small" margin="normal" placeholder="Mobile No" fullWidth />

              {(!!formErrors.Mobile) && (
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
                  {formErrors.Mobile}
                </Alert>
              )}
            </Box>
          </Box>

        </Box>

        <Box>
          <Typography>Email Id</Typography>
          <TextField onChange={(e) => handleChange("Email", e.target.value)} value={formValues.Email} error={!!formErrors.Email} size="small" margin="normal" placeholder="Email Id" fullWidth />

          {(!!formErrors.Email) && (
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
              {formErrors.Email}
            </Alert>
          )}
        </Box>

        <Box display={'flex'} alignItems="center" gap={2}>
          <Box flex={1}>
            <Box>
              <Typography>Registration</Typography>
              <TextField onChange={(e) => handleChange("Registration", e.target.value)} value={formValues.Registration} error={!!formErrors.Registration} size="small" margin="normal" placeholder="Registration" fullWidth />
              {(!!formErrors.Registration) && (
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
                  {formErrors.Registration}
                </Alert>
              )}
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
                    renderInput={(params) => <TextField {...params} size="small"   
                    />}
                  />
                </Box>
                {(!!formErrors.RegisteredDate) && (
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
                  {formErrors.RegisteredDate}
                </Alert>
              )}
              </LocalizationProvider>
              
        
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography>Registering Authority</Typography>
          <FormControl fullWidth size="small" margin="normal" placeholder='Registering Authority' onChange={(e) => handleChange("RegisteringAuthority", e.target.value)} value={formValues.RegisteringAuthority} error={!!formErrors.RegisteringAuthority}>

            <Select>
              <MenuItem value="Deputy Registrar">Deputy Registrar</MenuItem>
              <MenuItem value="Assistant Registrar">Assistant Registrar</MenuItem>
              <MenuItem value="Cooperative Societies">Cooperative Societies</MenuItem>
              <MenuItem value="ward">Ward</MenuItem>
              <MenuItem value="tal">Tal</MenuItem>
            </Select>
            {(!!formErrors.RegisteringAuthority) && (
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
                {formErrors.RegisteringAuthority}
              </Alert>
            )}

          </FormControl>
        </Box>

        <Box>
          <Typography>Address of Registering Authority</Typography>
          <TextField onChange={(e) => handleChange("AddressofRegisteringAuthority", e.target.value)} value={formValues.AddressofRegisteringAuthority} error={!!formErrors.AddressofRegisteringAuthority} size="small" margin="normal" placeholder="Address of Registering Authority" fullWidth />
          {(!!formErrors.AddressofRegisteringAuthority) && (
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
              {formErrors.AddressofRegisteringAuthority}
            </Alert>
          )}
        </Box>


      </Box>



      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4} mb={4}>
        <Box>
          <Button onClick={handleSave} variant='contained'>Save </Button>
        </Box>

        <Box>
          <Button variant='outlined'>Cancel </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Organization
