import React, { useState, useEffect } from "react";
import {
  Box,
  Alert,
  Button,
  Typography,
  TextField,
  Divider,
  FormControl,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Drawer,
  IconButton,
  InputLabel,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const Organization = () => {
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
    RegisteredDate: null,
    RegisteringAuthority: "",
    AddressofRegisteringAuthority: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [data, setData] = useState([]);

  // Fetch data from the API
  useEffect(() => {
   

    fetchBoardMembers();
  }, []);


  const fetchBoardMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8001/Organisation"); // Replace with your API endpoint
      setData(response.data);
      if (response.data.length > 0) {
        setFormValues({
          ...response.data[0],
          RegisteredDate: response.data[0].RegisteredDate
            ? new Date(response.data[0].RegisteredDate)
            : null,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errors = {};
    const requiredFields = [
      "SocietyName",
      "AddressLine1",
      "State",
      "Pin",
      "Mobile",
      "Email",
      "Registration",
      "RegisteredDate",
      "RegisteringAuthority",
      "AddressofRegisteringAuthority",
    ];

    requiredFields.forEach((field) => {
      if (!formValues[field]) {
        errors[field] = `${field} is required.`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formValues,
        RegisteredDate: formValues.RegisteredDate
          ? formValues.RegisteredDate.toISOString()
          : null,
      };

      if (data.length > 0) {
        // Update existing record
        const updatedData = await axios.patch(
          `http://localhost:8001/Organisation/${data[0]._id}`,
          payload
        );
        setData([updatedData.data]);
        alert("Society updated successfully!");
      } else {
        // Create new record
        const newData = await axios.post(
          "http://localhost:8001/Organisation",
          payload
        );
        setData([newData.data]);
        alert("Society created successfully!");
      }

      setIsDrawerOpen(false); // Close drawer after saving
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
    fetchBoardMembers();

  };

  const handleCancel = () => {
    setIsDrawerOpen(false); // Close drawer without saving
  };

  const handleEdit = () => {
    if (data.length > 0) {
      setFormValues({
        ...data[0],
        RegisteredDate: data[0].RegisteredDate
          ? new Date(data[0].RegisteredDate)
          : null,
      });
      setIsDrawerOpen(true); // Open drawer for editing
    }
  };

  const handleDelete = async () => {

    const isConfirmed = window.confirm("Are you sure you want to delete this Record?");
    if (!isConfirmed) return;

    if (data.length > 0) {
      try {
        await axios.delete(`http://localhost:8001/Organisation/${data[0]._id}`);
        setData([]); // Clear existing record
        alert("Society information deleted successfully!");
      } catch (err) {
        setError("An error occurred.");
      }
    }
  };

  return (
    <Box
      sx={{
        background: "rgb(236 242 246)",
        borderRadius: "10px",
        p: 3,
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Society Information
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {data.length > 0 ? (
        <Box>
          {/* Display Existing Record */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {data[0].SocietyName}
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: "Address Line 1", value: data[0].AddressLine1 },
              { label: "Address Line 2", value: data[0].AddressLine2 },
              { label: "Address Line 3", value: data[0].AddressLine3 },
              { label: "State", value: data[0].State },
              { label: "Pin Code", value: data[0].Pin },
              { label: "Mobile No", value: data[0].Mobile },
              { label: "Email", value: data[0].Email },
              { label: "Registration", value: data[0].Registration },
              {
                label: "Registered Date",
                value: data[0].RegisteredDate
                  ? new Date(data[0].RegisteredDate).toLocaleDateString()
                  : "N/A",
              },
              {
                label: "Registering Authority",
                value: data[0].RegisteringAuthority,
              },
              {
                label: "Address of Registering Authority",
                value: data[0].AddressofRegisteringAuthority,
              },
            ].map((field, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Typography variant="body1" fontWeight="bold">
                  {field.label}:
                </Typography>
                <Typography variant="body1">{field.value}</Typography>
              </Grid>
            ))}
          </Grid>

          {/* Edit and Delete Buttons */}
          <Box display="flex" justifyContent="center" gap={2} mt={4}>
            <Button variant="contained" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      ) : (
        <Box display="flex" justifyContent="center">
          <Button variant="contained" onClick={() => setIsDrawerOpen(true)}>
            Add New Society
          </Button>
        </Box>
      )}

      {/* Drawer for Form */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCancel}
        sx={{ "& .MuiDrawer-paper": { width: "40%", p: 3 } }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {data.length > 0 ? "Edit Society" : "Add New Society"}
          </Typography>
          <IconButton onClick={handleCancel}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* Form Fields */}
        <Grid container spacing={2}>
          {/* Society Name */}
          <Grid item xs={12}>
            <TextField
              label="Society Name"
              value={formValues.SocietyName}
              onChange={(e) => handleChange("SocietyName", e.target.value)}
              error={!!formErrors.SocietyName}
              helperText={formErrors.SocietyName}
              fullWidth
            />
          </Grid>

          {/* Address Line 1 and Address Line 2 */}
          <Grid item xs={6}>
            <TextField
              label="Address Line 1"
              value={formValues.AddressLine1}
              onChange={(e) => handleChange("AddressLine1", e.target.value)}
              error={!!formErrors.AddressLine1}
              helperText={formErrors.AddressLine1}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Address Line 2"
              value={formValues.AddressLine2}
              onChange={(e) => handleChange("AddressLine2", e.target.value)}
              error={!!formErrors.AddressLine2}
              helperText={formErrors.AddressLine2}
              fullWidth
            />
          </Grid>

          {/* Address Line 3 and State */}
          <Grid item xs={6}>
            <TextField
              label="Address Line 3"
              value={formValues.AddressLine3}
              onChange={(e) => handleChange("AddressLine3", e.target.value)}
              error={!!formErrors.AddressLine3}
              helperText={formErrors.AddressLine3}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth error={!!formErrors.State}>
              <InputLabel>State</InputLabel>
              <Select
                value={formValues.State}
                onChange={(e) => handleChange("State", e.target.value)}
                label="State"
              >
                <MenuItem value="India">India</MenuItem>
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="SouthAfrica">South Africa</MenuItem>
              </Select>
              {formErrors.State && (
                <Typography color="error" variant="caption">
                  {formErrors.State}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Pin and Mobile */}
          <Grid item xs={6}>
            <TextField
              label="Pin Code"
              value={formValues.Pin}
              onChange={(e) => handleChange("Pin", e.target.value)}
              error={!!formErrors.Pin}
              helperText={formErrors.Pin}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Mobile No"
              value={formValues.Mobile}
              onChange={(e) => handleChange("Mobile", e.target.value)}
              error={!!formErrors.Mobile}
              helperText={formErrors.Mobile}
              fullWidth
            />
          </Grid>

          {/* Email and Registration */}
          <Grid item xs={6}>
            <TextField
              label="Email"
              value={formValues.Email}
              onChange={(e) => handleChange("Email", e.target.value)}
              error={!!formErrors.Email}
              helperText={formErrors.Email}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Registration"
              value={formValues.Registration}
              onChange={(e) => handleChange("Registration", e.target.value)}
              error={!!formErrors.Registration}
              helperText={formErrors.Registration}
              fullWidth
            />
          </Grid>

          {/* Registered Date and Registering Authority */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Registered Date"
                value={formValues.RegisteredDate ? new Date(formValues.RegisteredDate) : null}
                onChange={(value) => handleChange("RegisteredDate", value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!formErrors.RegisteredDate}
                    helperText={formErrors.RegisteredDate}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth error={!!formErrors.RegisteringAuthority}>
              <InputLabel>Registering Authority</InputLabel>
              <Select
                value={formValues.RegisteringAuthority}
                onChange={(e) =>
                  handleChange("RegisteringAuthority", e.target.value)
                }
                label="Registering Authority"
              >
                <MenuItem value="Deputy Registrar">Deputy Registrar</MenuItem>
                <MenuItem value="Assistant Registrar">
                  Assistant Registrar
                </MenuItem>
                <MenuItem value="Cooperative Societies">
                  Cooperative Societies
                </MenuItem>
              </Select>
              {formErrors.RegisteringAuthority && (
                <Typography color="error" variant="caption">
                  {formErrors.RegisteringAuthority}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Address of Registering Authority */}
          <Grid item xs={12}>
            <TextField
              label="Address of Registering Authority"
              value={formValues.AddressofRegisteringAuthority}
              onChange={(e) =>
                handleChange("AddressofRegisteringAuthority", e.target.value)
              }
              error={!!formErrors.AddressofRegisteringAuthority}
              helperText={formErrors.AddressofRegisteringAuthority}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Save and Cancel Buttons */}
        <Box display="flex" justifyContent="center" gap={2} mt={4}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Save
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </Drawer>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default Organization;