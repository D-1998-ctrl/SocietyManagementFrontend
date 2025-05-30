import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Drawer,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Grid,
  useMediaQuery,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Input,
} from '@mui/material';
import dayjs from "dayjs";
import { MaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { format, parse } from 'date-fns';
import enGB from 'date-fns/locale/en-GB'; // Import locale for DD/MM/YYYY format

const GroupMembers = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    infoTitle: "Mr",
    firstName: "",
    middleName: "",
    surname: "",
    dateOfBirth: "",
    gender: "male",
    occupation: "",
    annual: "",
    email: "",
    mobile: "",
    adharCardNo: "",
    panCardNo: "",
    addressType: "Residential",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    propertyType: "Residential",
    unitNumber: "",
    wingName: "",
    floor: "",
    unitType: "",
    fourWheelerParking: "",
    twoWheelerParking: "",
    contactTitle: "Mr",
    contactFirstName: "",
    contactMiddleName: "",
    contactSurname: "",
    contactEmail: "",
    contactMobile: "",
    nominationTitle: "Mr",
    nominationFirstName: "",
    nominationMiddleName: "",
    nominationSurname: "",
    nominationEmail: "",
    nominationMobile: "",
    dateOfNomination: "",
    dateOfAdmission: "",
    dateOfEntranceFeePayment: "",
    dateOfCessationOfMembership: "",
    reasonOfCessation: "",
    ageOfAccount: "",
    remark: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [members, setMembers] = useState([])


  useEffect(() => {


    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8001/Member');
      const result = await response.json();
      setMembers(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on change
  };

  // Validate form fields
  const validateFields = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
      isValid = false;
    }

    if (!formData.surname.trim()) {
      newErrors.surname = "Surname is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.mobile || !formData.mobile.toString().trim()) {
      newErrors.mobile = "Mobile no is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile.toString())) {
      newErrors.mobile = "Invalid mobile number format";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateFields()) {
      const url = selectedUser ? `http://localhost:8001/Member/${selectedUser._id}` : "http://localhost:8001/Member";
      const method = selectedUser ? "put" : "post";

      // First, handle the Member submission
      axios[method](url, formData)
        .then((response) => {
          console.log("Member submitted successfully:", response.data);

          // Only create account for new members (not when editing)
          if (!selectedUser) {
            const accountData = {
              accountName: `${formData.firstName} ${formData.middleName || ''} ${formData.surname}`.trim(),
              groupId: '3', // Must be string as per schema
              subGroupId: '17', // Must be string and is now required
              opening: 0, // Must be number (not string)
              drOrCr: 'DR', // Must be either 'DR' or 'CR'
              typeCode: 'Balance Sheet' // Must match enum values
            };

            console.log("Account data being sent:", accountData);

            // Make the second API call to create the account
            return axios.post("http://localhost:8001/Account", accountData)
              .then(accountResponse => {
                console.log("Account created successfully:", accountResponse.data);
                return response;
              });
          }
          return response;
        })
        .then(() => {
          handleDrawerClose();
          fetchData();
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          if (error.response) {
            console.error("Server response data:", error.response.data);
            console.error("Server response status:", error.response.status);
            // You can add user-friendly error messages here
            if (error.response.data.error.includes('subGroupId')) {
              alert('Please provide a valid subGroupId');
            }
          }
        });
    }
  };


  const deleteUser = async () => {

    const isConfirmed = window.confirm("Are you sure you want to delete Record ?");
    if (!isConfirmed) return;

    try {
      await fetch(`http://localhost:8001/Member/${selectedUser._id}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };



  const handleDrawerClose = () => {
    setIsDrawerOpen(false); // Close the drawer
    setSelectedUser(null); // Clear the selected user
    setFormData({ // Reset form data
      infoTitle: "Mr",
      firstName: "",
      middleName: "",
      surname: "",
      dateOfBirth: "",
      gender: "male",
      occupation: "",
      annual: "",
      email: "",
      mobile: "",
      adharCardNo: "",
      panCardNo: "",
      addressType: "Residential",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      propertyType: "Residential",
      unitNumber: "",
      wingName: "",
      floor: "",
      unitType: "",
      fourWheelerParking: "",
      twoWheelerParking: "",
      contactTitle: "Mr",
      contactFirstName: "",
      contactMiddleName: "",
      contactSurname: "",
      contactEmail: "",
      contactMobile: "",
      nominationTitle: "Mr",
      nominationFirstName: "",
      nominationMiddleName: "",
      nominationSurname: "",
      nominationEmail: "",
      nominationMobile: "",
      dateOfNomination: "",
      dateOfAdmission: "",
      dateOfEntranceFeePayment: "",
      dateOfCessationOfMembership: "",
      reasonOfCessation: "",
      ageOfAccount: "",
      remark: "",
    });
  };

  const columns = [
    { accessorKey: 'infoTitle', header: 'Title',size :100 },
    {
      accessorKey: 'firstName', header: 'First Name', Cell: ({ row }) => (
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => navigate("/MemberDashboard/overview")}
        >
          {row.original.firstName}
        </span>
      ),
    },
    { accessorKey: 'middleName', header: 'Middle Name' },
    { accessorKey: 'surname', header: 'Surname' },
    {
      accessorKey: 'dateOfBirth', header: 'Date of Birth', size: 150, Cell: ({ cell }) =>
        cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy') : '-',
    },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'occupation', header: 'Occupation' },
    { accessorKey: 'annual', header: 'Annual Income' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'mobile', header: 'Mobile' },
    { accessorKey: 'adharCardNo', header: 'Adhar Card No' },
    { accessorKey: 'panCardNo', header: 'PAN Card No' },
    { accessorKey: 'addressType', header: 'Address Type' },
    { accessorKey: 'addressLine1', header: 'Address Line 1' },
    { accessorKey: 'addressLine2', header: 'Address Line 2' },
    { accessorKey: 'city', header: 'City' },
    { accessorKey: 'state', header: 'State' },
    { accessorKey: 'zipCode', header: 'Zip Code' },
    { accessorKey: 'country', header: 'Country' },
    { accessorKey: 'propertyType', header: 'Property Type' },
    { accessorKey: 'unitNumber', header: 'Unit Number' },
    { accessorKey: 'wingName', header: 'Wing Name' },
    { accessorKey: 'floor', header: 'Floor' },
    { accessorKey: 'unitType', header: 'Unit Type' },
    { accessorKey: 'fourWheelerParking', header: 'Four Wheeler Parking' },
    { accessorKey: 'twoWheelerParking', header: 'Two Wheeler Parking' },
    { accessorKey: 'contactTitle', header: 'Contact Title' },
    { accessorKey: 'contactFirstName', header: 'Contact First Name' },
    { accessorKey: 'contactMiddleName', header: 'Contact Middle Name' },
    { accessorKey: 'contactSurname', header: 'Contact Surname' },
    { accessorKey: 'contactEmail', header: 'Contact Email' },
    { accessorKey: 'contactMobile', header: 'Contact Mobile' },
    { accessorKey: 'nominationTitle', header: 'Nomination Title' },
    { accessorKey: 'nominationFirstName', header: 'Nomination First Name' },
    { accessorKey: 'nominationMiddleName', header: 'Nomination Middle Name' },
    { accessorKey: 'nominationSurname', header: 'Nomination Surname' },
    { accessorKey: 'nominationEmail', header: 'Nomination Email' },
    { accessorKey: 'nominationMobile', header: 'Nomination Mobile' },
    {
      accessorKey: 'dateOfNomination', header: 'Date of Nomination', size: 150, Cell: ({ cell }) =>
        cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy') : '-',
    },
    {
      accessorKey: 'dateOfAdmission', header: 'Date of Admission', size: 150, Cell: ({ cell }) =>
        cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy') : '-',
    },
    {
      accessorKey: 'dateOfEntranceFeePayment', header: 'Date of Entrance Fee Payment', size: 150, Cell: ({ cell }) =>
        cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy') : '-',
    },
    {
      accessorKey: 'dateOfCessationOfMembership', header: 'Date of Cessation of Membership', size: 150, Cell: ({ cell }) =>
        cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy') : '-',
    },
    { accessorKey: 'reasonOfCessation', header: 'Reason of Cessation' },
    { accessorKey: 'ageOfAccount', header: 'Age of Account' },
    { accessorKey: 'remark', header: 'Remark' }
  ];
  // Handle form reset
  const handleCancel = () => {
    setFormData({
      infoTitle: "Mr",
      firstName: "",
      middleName: "",
      surname: "",
      dateOfBirth: "",
      gender: "male",
      occupation: "",
      annual: "",
      email: "",
      mobile: "",
      adharCardNo: "",
      panCardNo: "",
      addressType: "Residential",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      propertyType: "Residential",
      unitNumber: "",
      wingName: "",
      floor: "",
      unitType: "",
      fourWheelerParking: "",
      twoWheelerParking: "",
      contactTitle: "Mr",
      contactFirstName: "",
      contactMiddleName: "",
      contactSurname: "",
      contactEmail: "",
      contactMobile: "",
      nominationTitle: "Mr",
      nominationFirstName: "",
      nominationMiddleName: "",
      nominationSurname: "",
      nominationEmail: "",
      nominationMobile: "",
      dateOfNomination: "",
      dateOfAdmission: "",
      dateOfEntranceFeePayment: "",
      dateOfCessationOfMembership: "",
      reasonOfCessation: "",
      ageOfAccount: "",
      remark: "",
    });
    setErrors({});
    setSelectedUser(null);
    handleDrawerClose();
  };

  // Handle row click
  const handleRowClick = (row) => {
    const formattedData = {
      ...row,
      dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : null,
      dateOfNomination: row.dateOfNomination ? new Date(row.dateOfNomination) : null,
      dateOfAdmission: row.dateOfAdmission ? new Date(row.dateOfAdmission) : null,
      dateOfEntranceFeePayment: row.dateOfEntranceFeePayment ? new Date(row.dateOfEntranceFeePayment) : null,
      dateOfCessationOfMembership: row.dateOfCessationOfMembership ? new Date(row.dateOfCessationOfMembership) : null,
    };

    setSelectedUser(row);
    setFormData(formattedData);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };
  // Options for dropdowns
  const options = [
    { value: "Mr", label: "Mr" },
    { value: "Miss", label: "Miss" },
    { value: "Misses", label: "Misses" },
  ];

  return (
    <Box>
      <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>
        <Box textAlign={'center'}>
          <Typography variant="h4">Member Group</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button
            variant="contained"
            onClick={() => {
              setIsDrawerOpen(true);
              setIsEditMode(false);
              setFormData({
                infoTitle: "Mr",
                firstName: "",
                middleName: "",
                surname: "",
                dateOfBirth: "",
                gender: "male",
                occupation: "",
                annual: "",
                email: "",
                mobile: "",
                adharCardNo: "",
                panCardNo: "",
                addressType: "Residential",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                zipCode: "",
                country: "India",
                propertyType: "Residential",
                unitNumber: "",
                wingName: "",
                floor: "",
                unitType: "",
                fourWheelerParking: "",
                twoWheelerParking: "",
                contactTitle: "Mr",
                contactFirstName: "",
                contactMiddleName: "",
                contactSurname: "",
                contactEmail: "",
                contactMobile: "",
                nominationTitle: "Mr",
                nominationFirstName: "",
                nominationMiddleName: "",
                nominationSurname: "",
                nominationEmail: "",
                nominationMobile: "",
                dateOfNomination: "",
                dateOfAdmission: "",
                dateOfEntranceFeePayment: "",
                dateOfCessationOfMembership: "",
                reasonOfCessation: "",
                ageOfAccount: "",
                remark: "",
              });
            }}
          >
            New Member
          </Button>
        </Box>

        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={members}
            enableColumnOrdering
            enableColumnResizing
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleRowClick(row.original),
              sx: { cursor: 'pointer' },
            })}
          />
        </Box>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              width: isSmallScreen ? "100%" : "60%",
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              zIndex: 1000,
            },
          }}
        >
          <Box sx={{ padding: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography m={2} variant="h6">
              <b>{selectedUser ? "Edit Member" : "Add Member"}</b>
            </Typography>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleCancel} />
          </Box>

          {/* Form Fields */}
          <Box sx={{ padding: 2 }}>
            {/* Section 1: Info */}
            <Divider />
            <Typography m={1} variant="h6">
              <b>Info</b>
            </Typography>

            {/* Title, First Name, Middle Name, Surname */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 0 }}>
              {/* Title Select Box */}
              <Box sx={{ flex: 1, minWidth: "70px", maxWidth: "100px", mt: 2, display: "flex", flexDirection: "column" }}>
                <Typography sx={{ mb: 1 }}>Title *</Typography>
                <Select
                  sx={{ minWidth: "100%" }}
                  size="small"
                  labelId="member-select-label"
                  id="member-select"
                  value={formData.infoTitle}
                  onChange={(e) => handleInputChange("infoTitle", e.target.value)}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* First Name TextField */}
              <Box sx={{ flex: 1, minWidth: "200px", maxWidth: "250px" }}>
                <Typography sx={{ mt: 2 }}>First Name *</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  sx={{ mt: 1.5 }}
                />
                {errors.firstName && (
                  <Alert
                    sx={{
                      width: "96%",
                      p: 0,
                      pl: "4%",
                      height: "23px",
                      borderRadius: "10px",
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      "& .MuiAlert-icon": {
                        fontSize: "16px",
                        mr: "8px",
                      },
                    }}
                    variant="filled"
                    severity="error"
                  >
                    {errors.firstName}
                  </Alert>
                )}
              </Box>

              {/* Middle Name TextField */}
              <Box sx={{ flex: 1, minWidth: "200px", maxWidth: "250px" }}>
                <Typography sx={{ mt: 2 }}>Middle Name</Typography>
                <TextField
                  size="small"
                  placeholder="Middle Name"
                  fullWidth
                  value={formData.middleName}
                  onChange={(e) => handleInputChange("middleName", e.target.value)}
                  sx={{ mt: 1.5 }}
                />
              </Box>

              {/* Surname TextField */}
              <Box sx={{ flex: 1, minWidth: "200px", maxWidth: "250px" }}>
                <Typography sx={{ mt: 2 }}>Surname *</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Surname"
                  value={formData.surname}
                  onChange={(e) => handleInputChange("surname", e.target.value)}
                  sx={{ mt: 1.5 }}
                />
                {errors.surname && (
                  <Alert
                    sx={{
                      width: "96%",
                      p: 0,
                      pl: "4%",
                      height: "23px",
                      borderRadius: "10px",
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      "& .MuiAlert-icon": {
                        fontSize: "16px",
                        mr: "8px",
                      },
                    }}
                    variant="filled"
                    severity="error"
                  >
                    {errors.surname}
                  </Alert>
                )}
              </Box>
            </Box>

            {/* Date of Birth and Gender */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              {/* Date of Birth Box */}
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box>
                    <Typography>Date Of Birth</Typography>
                    <DatePicker
                      value={formData.dateOfBirth || null} // Handle null values
                      onChange={(newDate) => handleInputChange("dateOfBirth", newDate)}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: false,
                          helperText: "",
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          error={false}
                          helperText={""}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#d1d5db",
                              },
                              "&:hover fieldset": {
                                borderColor: "#9ca3af",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#2563eb",
                              },
                            },
                            "& .MuiInputBase-root": { fontSize: "14px" },
                            "& .MuiSvgIcon-root": { fontSize: "20px" },
                            mt: 2,
                          }}
                        />
                      )}
                      sx={{
                        width: "100%",
                        mt: 2,
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>

              {/* Gender Selection Box */}
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Gender</Typography>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                >
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
              </Box>
            </Box>

            {/* Occupation and Annual Income */}
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              {/* Occupation Box */}
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Occupation</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                />
              </Box>

              {/* Annual Income Box */}
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Annual Income</Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData.annual}
                  label="Annual Income"
                  onChange={(e) => handleInputChange("annual", e.target.value)}
                  sx={{ mt: 1, minWidth: "100%", height: "40px" }}
                  inputProps={{
                    style: {
                      padding: "6px 8px",
                    },
                  }}
                >
                  <MenuItem value="Below 2L">Below 2L</MenuItem>
                  <MenuItem value="2 +">2L +</MenuItem>
                  <MenuItem value="5 +">5L +</MenuItem>
                  <MenuItem value="10 +">10L +</MenuItem>
                  <MenuItem value="20 +">20L +</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Email and Mobile Number */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              {/* Email Box */}
              <Box sx={{ flex: 1, minWidth: "250px", alignSelf: "stretch" }}>
                <Typography>Email*</Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  {errors.email && (
                    <Alert
                      sx={{
                        width: "96%",
                        p: "0",
                        pl: "4%",
                        height: "23px",
                        borderRadius: "10px",
                        borderTopLeftRadius: "0",
                        borderTopRightRadius: "0",
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                        "& .MuiAlert-icon": {
                          fontSize: "16px",
                          mr: "8px",
                        },
                      }}
                      variant="filled"
                      severity="error"
                    >
                      {errors.email}
                    </Alert>
                  )}
                </Box>
              </Box>

              {/* Mobile Number Box */}
              <Box sx={{ flex: 1, minWidth: "250px", alignSelf: "stretch" }}>
                <Typography>Mobile No*</Typography>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "4px 10px",
                    "&:focus-within": {
                      borderColor: "#1976d2",
                      boxShadow: "0 0 4px rgba(25, 118, 210, 0.5)",
                    },
                  }}
                >
                  <Input
                    type="text"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    disableUnderline
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                    }}
                    fullWidth
                  />
                </Box>
                {errors.mobile && (
                  <Alert
                    sx={{
                      width: "96%",
                      p: "0",
                      pl: "4%",
                      height: "23px",
                      borderRadius: "10px",
                      borderTopLeftRadius: "0",
                      borderTopRightRadius: "0",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      mt: 0,
                      "& .MuiAlert-icon": {
                        fontSize: "16px",
                        mr: "8px",
                      },
                    }}
                    variant="filled"
                    severity="error"
                  >
                    {errors.mobile}
                  </Alert>
                )}
              </Box>
            </Box>

            {/* Aadhar Card and PAN Card */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              {/* Aadhar Card Box */}
              <Box sx={{ flex: 1, minWidth: "250px", alignSelf: "stretch" }}>
                <Typography>Aadhar Card</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Enter Aadhar card number"
                  value={formData.adharCardNo}
                  onChange={(e) => handleInputChange("adharCardNo", e.target.value)}
                  inputProps={{
                    maxLength: 12,
                  }}
                />
                {errors.adharCardNo && (
                  <Alert
                    sx={{
                      width: "96%",
                      p: "0",
                      pl: "4%",
                      height: "23px",
                      borderRadius: "10px",
                      borderTopLeftRadius: "0",
                      borderTopRightRadius: "0",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      mt: -1,
                      "& .MuiAlert-icon": {
                        fontSize: "16px",
                        mr: "8px",
                      },
                    }}
                    variant="filled"
                    severity="error"
                  >
                    {errors.adharCardNo}
                  </Alert>
                )}
              </Box>

              {/* PAN Card Box */}
              <Box sx={{ flex: 1, minWidth: "250px", alignSelf: "stretch" }}>
                <Typography>PAN Card No</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Enter PAN card number"
                  value={formData.panCardNo}
                  onChange={(e) => {
                    let value = e.target.value.toUpperCase();
                    value = value.replace(/[^A-Z0-9]/g, "");
                    if (value.length <= 10) {
                      handleInputChange("panCardNo", value);
                    }
                  }}
                  inputProps={{
                    maxLength: 10,
                    style: { textTransform: "uppercase" },
                  }}
                />
                {errors.panCardNo && (
                  <Alert
                    sx={{
                      width: "96%",
                      p: "0",
                      pl: "4%",
                      height: "23px",
                      borderRadius: "10px",
                      borderTopLeftRadius: "0",
                      borderTopRightRadius: "0",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      mt: -1,
                      "& .MuiAlert-icon": {
                        fontSize: "16px",
                        mr: "8px",
                      },
                    }}
                    variant="filled"
                    severity="error"
                  >
                    {errors.panCardNo}
                  </Alert>
                )}
              </Box>
            </Box>

            {/* Section 2: Address */}
            <Divider sx={{ m: 1 }} />
            <Typography m={1} variant="h6">
              <b>Address</b>
            </Typography>

            {/* Address Type */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography>Address Type</Typography>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={formData.addressType}
                  onChange={(e) => handleInputChange("addressType", e.target.value)}
                  name="radio-buttons-group"
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel value="Residential" control={<Radio />} label="Residential" />
                  <FormControlLabel value="Office" control={<Radio />} label="Office" />
                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                </RadioGroup>
              </Box>
            </Box>

            {/* Address Line 1 */}
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Address Line 1</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Address Line 1"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                />
              </Box>
            </Box>

            {/* Address Line 2 */}
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Address Line 2</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Address Line 2"
                  value={formData.addressLine2}
                  onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                />
              </Box>
            </Box>

            {/* City/Village and State */}
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>City/Village</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="City/Village"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>State</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                />
              </Box>
            </Box>

            {/* Country and Zip Code */}
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Country</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Enter Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Zip Code</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Zip code"
                  type="number"
                  sx={{
                    "& input[type='number']": {
                      "-webkit-appearance": "none",
                      "moz-appearance": "textfield",
                      appearance: "none",
                    },
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  }}
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                />
                {errors.zipCode && (
                  <Alert
                    sx={{
                      width: "96%",
                      p: 0,
                      pl: "4%",
                      height: "23px",
                      borderRadius: "10px",
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      "& .MuiAlert-icon": {
                        fontSize: "16px",
                        mr: "8px",
                      },
                    }}
                    variant="filled"
                    severity="error"
                  >
                    {errors.zipCode}
                  </Alert>
                )}
              </Box>
            </Box>

            {/* Section 3: Property Details */}
            <Divider sx={{ m: 1 }} />
            <Typography m={1} variant="h6">
              <b>Property Details</b>
            </Typography>

            {/* Property Type */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography>Property Type</Typography>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange("propertyType", e.target.value)}
                  name="radio-buttons-group"
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel value="Residential" control={<Radio />} label="Residential" />
                  <FormControlLabel value="Commercial" control={<Radio />} label="Commercial" />
                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                </RadioGroup>
              </Box>
            </Box>

            {/* Unit Number and Wing Name */}
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Unit Number*</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Enter Unit Number"
                  value={formData.unitNumber}
                  onChange={(e) => handleInputChange("unitNumber", e.target.value)}
                />
                {errors.unitNumber && (
                  <Alert
                    sx={{
                      width: "96%",
                      p: 0,
                      pl: "4%",
                      height: "23px",
                      borderRadius: "10px",
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      fontSize: "11px",
                      display: "flex",
                      mt: -1,
                      alignItems: "center",
                      "& .MuiAlert-icon": {
                        fontSize: "16px",
                        mr: "8px",
                      },
                    }}
                    variant="filled"
                    severity="error"
                  >
                    {errors.unitNumber}
                  </Alert>
                )}
              </Box>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Wing Name</Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData.wingName}
                  label="Wing Name"
                  onChange={(e) => handleInputChange("wingName", e.target.value)}
                  sx={{ mt: 1, minWidth: "100%", height: "40px" }}
                  inputProps={{
                    style: {
                      padding: "6px 8px",
                    },
                  }}
                >
                  <MenuItem value="wing A">Wing A</MenuItem>
                  <MenuItem value="wing B">Wing B</MenuItem>
                  <MenuItem value="wing C">Wing C</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Floor and Unit Type */}
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Floor</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Enter Floor"
                  value={formData.floor}
                  onChange={(e) => handleInputChange("floor", e.target.value)}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Unit Type</Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData.unitType}
                  label="Unit Type"
                  onChange={(e) => handleInputChange("unitType", e.target.value)}
                  sx={{ mt: 1, minWidth: "100%", height: "40px" }}
                  inputProps={{
                    style: {
                      padding: "6px 8px",
                    },
                  }}
                >
                  <MenuItem value="1 BHK">1 BHK</MenuItem>
                  <MenuItem value="2 BHK">2 BHK</MenuItem>
                  <MenuItem value="3 BHK">3 BHK</MenuItem>
                </Select>
              </Box>
            </Box>

            {/* Four Wheeler Parking and Two Wheeler Parking */}
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Four Wheeler Parking</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Enter Four Wheeler Parking"
                  value={formData.fourWheelerParking}
                  onChange={(e) => handleInputChange("fourWheelerParking", e.target.value)}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Two Wheeler Parking</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Enter Two Wheeler Parking"
                  value={formData.twoWheelerParking}
                  onChange={(e) => handleInputChange("twoWheelerParking", e.target.value)}
                />
              </Box>
            </Box>

            {/* Section 4: Contact Person */}
            <Divider sx={{ m: 1 }} />
            <Typography m={1} variant="h6">
              <b>Contact Person</b>
            </Typography>

            {/* Title, First Name, Middle Name, Surname */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 0 }}>
              {/* Title Select Box */}
              <Box sx={{ flex: 1, minWidth: "70px", maxWidth: "100px", mt: 2, display: "flex", flexDirection: "column" }}>
                <Typography sx={{ mb: 1 }}>Title *</Typography>
                <Select
                  sx={{ minWidth: "100%" }}
                  size="small"
                  labelId="member-select-label"
                  id="member-select"
                  value={formData.contactTitle}
                  onChange={(e) => handleInputChange("contactTitle", e.target.value)}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* First Name TextField */}
              <Box sx={{ flex: 1, minWidth: "200px", maxWidth: "250px" }}>
                <Typography sx={{ mt: 2 }}>First Name *</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="First Name"
                  value={formData.contactFirstName}
                  onChange={(e) => handleInputChange("contactFirstName", e.target.value)}
                  sx={{ mt: 1.5 }}
                />
              </Box>

              {/* Middle Name TextField */}
              <Box sx={{ flex: 1, minWidth: "200px", maxWidth: "250px" }}>
                <Typography sx={{ mt: 2 }}>Middle Name</Typography>
                <TextField
                  size="small"
                  placeholder="Middle Name"
                  fullWidth
                  value={formData.contactMiddleName}
                  onChange={(e) => handleInputChange("contactMiddleName", e.target.value)}
                  sx={{ mt: 1.5 }}
                />
              </Box>

              {/* Surname TextField */}
              <Box sx={{ flex: 1, minWidth: "200px", maxWidth: "250px" }}>
                <Typography sx={{ mt: 2 }}>Surname *</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Surname"
                  value={formData.contactSurname}
                  onChange={(e) => handleInputChange("contactSurname", e.target.value)}
                  sx={{ mt: 1.5 }}
                />
              </Box>
            </Box>

            {/* Email and Mobile Number */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              {/* Email Box */}
              <Box sx={{ flex: 1, minWidth: "250px", alignSelf: "stretch" }}>
                <Typography>Email*</Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  {errors.email && (
                    <Alert
                      sx={{
                        width: "96%",
                        p: "0",
                        pl: "4%",
                        height: "23px",
                        borderRadius: "10px",
                        borderTopLeftRadius: "0",
                        borderTopRightRadius: "0",
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                        "& .MuiAlert-icon": {
                          fontSize: "16px",
                          mr: "8px",
                        },
                      }}
                      variant="filled"
                      severity="error"
                    >
                      {errors.email}
                    </Alert>
                  )}
                </Box>
              </Box>

              {/* Mobile Number Box */}
              <Box sx={{ flex: 1, minWidth: "250px", alignSelf: "stretch" }}>
                <Typography>Mobile No*</Typography>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "4px 10px",
                    "&:focus-within": {
                      borderColor: "#1976d2",
                      boxShadow: "0 0 4px rgba(25, 118, 210, 0.5)",
                    },
                  }}
                >
                  <Input
                    type="text"
                    value={formData.contactMobile}
                    onChange={(e) => handleInputChange("contactMobile", e.target.value)}
                    disableUnderline
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                    }}
                    fullWidth
                  />
                </Box>
                {errors.contactMobile && (
                  <Alert
                    sx={{
                      width: "96%",
                      p: "0",
                      pl: "4%",
                      height: "23px",
                      borderRadius: "10px",
                      borderTopLeftRadius: "0",
                      borderTopRightRadius: "0",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      mt: 0,
                      "& .MuiAlert-icon": {
                        fontSize: "16px",
                        mr: "8px",
                      },
                    }}
                    variant="filled"
                    severity="error"
                  >
                    {errors.contactMobile}
                  </Alert>
                )}
              </Box>
            </Box>

            {/* Section 5: Nomination */}
            <Divider sx={{ m: 1 }} />
            <Typography m={1} variant="h6">
              <b>Nomination</b>
            </Typography>

            {/* Title, First Name, Middle Name, Surname */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 0 }}>
              {/* Title Select Box */}
              <Box sx={{ flex: 1, minWidth: "70px", maxWidth: "100px", mt: 2, display: "flex", flexDirection: "column" }}>
                <Typography sx={{ mb: 1 }}>Title *</Typography>
                <Select
                  sx={{ minWidth: "100%" }}
                  size="small"
                  labelId="member-select-label"
                  id="member-select"
                  value={formData.nominationTitle}
                  onChange={(e) => handleInputChange("nominationTitle", e.target.value)}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* First Name TextField */}
              <Box sx={{ flex: 1, minWidth: "200px", maxWidth: "250px" }}>
                <Typography sx={{ mt: 2 }}>First Name *</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="First Name"
                  value={formData.nominationFirstName}
                  onChange={(e) => handleInputChange("nominationFirstName", e.target.value)}
                  sx={{ mt: 1.5 }}
                />
              </Box>

              {/* Middle Name TextField */}
              <Box sx={{ flex: 1, minWidth: "200px", maxWidth: "250px" }}>
                <Typography sx={{ mt: 2 }}>Middle Name</Typography>
                <TextField
                  size="small"
                  placeholder="Middle Name"
                  fullWidth
                  value={formData.nominationMiddleName}
                  onChange={(e) => handleInputChange("nominationMiddleName", e.target.value)}
                  sx={{ mt: 1.5 }}
                />
              </Box>

              {/* Surname TextField */}
              <Box sx={{ flex: 1, minWidth: "200px", maxWidth: "250px" }}>
                <Typography sx={{ mt: 2 }}>Surname *</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Surname"
                  value={formData.nominationSurname}
                  onChange={(e) => handleInputChange("nominationSurname", e.target.value)}
                  sx={{ mt: 1.5 }}
                />
              </Box>
            </Box>

            {/* Email and Mobile Number */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              {/* Email Box */}
              <Box sx={{ flex: 1, minWidth: "250px", alignSelf: "stretch" }}>
                <Typography>Email*</Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your email"
                    value={formData.nominationEmail}
                    onChange={(e) => handleInputChange("nominationEmail", e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  {errors.email && (
                    <Alert
                      sx={{
                        width: "96%",
                        p: "0",
                        pl: "4%",
                        height: "23px",
                        borderRadius: "10px",
                        borderTopLeftRadius: "0",
                        borderTopRightRadius: "0",
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                        "& .MuiAlert-icon": {
                          fontSize: "16px",
                          mr: "8px",
                        },
                      }}
                      variant="filled"
                      severity="error"
                    >
                      {errors.email}
                    </Alert>
                  )}
                </Box>
              </Box>

              {/* Mobile Number Box */}
              <Box sx={{ flex: 1, minWidth: "250px", alignSelf: "stretch" }}>
                <Typography>Mobile No*</Typography>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "4px 10px",
                    "&:focus-within": {
                      borderColor: "#1976d2",
                      boxShadow: "0 0 4px rgba(25, 118, 210, 0.5)",
                    },
                  }}
                >
                  <Input
                    type="text"
                    value={formData.nominationMobile}
                    onChange={(e) => handleInputChange("nominationMobile", e.target.value)}
                    disableUnderline
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                    }}
                    fullWidth
                  />
                </Box>
                {errors.nominationMobile && (
                  <Alert
                    sx={{
                      width: "96%",
                      p: "0",
                      pl: "4%",
                      height: "23px",
                      borderRadius: "10px",
                      borderTopLeftRadius: "0",
                      borderTopRightRadius: "0",
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      mt: 0,
                      "& .MuiAlert-icon": {
                        fontSize: "16px",
                        mr: "8px",
                      },
                    }}
                    variant="filled"
                    severity="error"
                  >
                    {errors.nominationMobile}
                  </Alert>
                )}
              </Box>
            </Box>

            {/* Date of Nomination */}
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box>
                    <Typography>Date of Nomination</Typography>
                    <DatePicker
                      value={formData.dateOfNomination}
                      onChange={(newDate) => handleInputChange("dateOfNomination", newDate)}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: false,
                          helperText: "",
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          error={false}
                          helperText={""}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#d1d5db",
                              },
                              "&:hover fieldset": {
                                borderColor: "#9ca3af",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#2563eb",
                              },
                            },
                            "& .MuiInputBase-root": { fontSize: "14px" },
                            "& .MuiSvgIcon-root": { fontSize: "20px" },
                            mt: 2,
                          }}
                        />
                      )}
                      sx={{
                        width: "100%",
                        mt: 2,
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>
            </Box>

            {/* Section 6: Other */}
            <Divider sx={{ m: 1 }} />
            <Typography m={1} variant="h6">
              <b>Other</b>
            </Typography>

            {/* Date of Admission, Date of Entrance Fee Payment, Date of Cessation of Membership */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 0 }}>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box>
                    <Typography>Date of Admission</Typography>
                    <DatePicker
                      value={formData.dateOfAdmission}
                      onChange={(newDate) => handleInputChange("dateOfAdmission", newDate)}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: false,
                          helperText: "",
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          error={false}
                          helperText={""}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#d1d5db",
                              },
                              "&:hover fieldset": {
                                borderColor: "#9ca3af",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#2563eb",
                              },
                            },
                            "& .MuiInputBase-root": { fontSize: "14px" },
                            "& .MuiSvgIcon-root": { fontSize: "20px" },
                            mt: 2,
                          }}
                        />
                      )}
                      sx={{
                        width: "100%",
                        mt: 2,
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box>
                    <Typography>Date of Entrance Fee Payment</Typography>
                    <DatePicker
                      value={formData.dateOfEntranceFeePayment}
                      onChange={(newDate) => handleInputChange("dateOfEntranceFeePayment", newDate)}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: false,
                          helperText: "",
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          error={false}
                          helperText={""}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#d1d5db",
                              },
                              "&:hover fieldset": {
                                borderColor: "#9ca3af",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#2563eb",
                              },
                            },
                            "& .MuiInputBase-root": { fontSize: "14px" },
                            "& .MuiSvgIcon-root": { fontSize: "20px" },
                            mt: 2,
                          }}
                        />
                      )}
                      sx={{
                        width: "100%",
                        mt: 2,
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box>
                    <Typography>Date of Cessation of Membership</Typography>
                    <DatePicker
                      value={formData.dateOfCessationOfMembership}
                      onChange={(newDate) => handleInputChange("dateOfCessationOfMembership", newDate)}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          error: false,
                          helperText: "",
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          error={false}
                          helperText={""}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                borderColor: "#d1d5db",
                              },
                              "&:hover fieldset": {
                                borderColor: "#9ca3af",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#2563eb",
                              },
                            },
                            "& .MuiInputBase-root": { fontSize: "14px" },
                            "& .MuiSvgIcon-root": { fontSize: "20px" },
                            mt: 2,
                          }}
                        />
                      )}
                      sx={{
                        width: "100%",
                        mt: 2,
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>
            </Box>

            {/* Reason of Cessation, Age of Account, Remark */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ paddingX: 2, boxSizing: "border-box", width: "100%", mt: 1 }}>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Reason of Cessation</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Enter reason of cessation"
                  value={formData.reasonOfCessation}
                  onChange={(e) => handleInputChange("reasonOfCessation", e.target.value)}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Age of Account</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Enter age of account"
                  value={formData.ageOfAccount}
                  onChange={(e) => handleInputChange("ageOfAccount", e.target.value)}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <Typography>Remark</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  placeholder="Enter remark"
                  value={formData.remark}
                  onChange={(e) => handleInputChange("remark", e.target.value)}
                />
              </Box>
            </Box>

            {/* Submit and Cancel Buttons */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                {selectedUser ? "Update" : "Create"}
              </Button>
              <Button fullWidth variant="contained" color="secondary" onClick={handleCancel} sx={{ ml: 5 }}>
                Cancel
              </Button>

              {selectedUser ? <Button fullWidth variant="contained" color="error" onClick={deleteUser} sx={{ ml: 5 }}>
                Delete
              </Button> : null}
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default GroupMembers;