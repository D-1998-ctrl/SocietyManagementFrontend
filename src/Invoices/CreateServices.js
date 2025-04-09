// src/pages/ServicesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Drawer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  CircularProgress,
  Divider
} from '@mui/material';
import { Add, Edit, Close } from '@mui/icons-material';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [service, setService] = useState({
    name: '',
    description: '',
    reference: '',
    factor: 1.00
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:8001/Service');
      setServices(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!service.name.trim()) newErrors.name = 'Service name is required';
    if (!service.description.trim()) newErrors.description = 'Description is required';
    if (!service.reference) newErrors.reference = 'Please select a reference';
    if (isNaN(service.factor) || service.factor <= 0) newErrors.factor = 'Factor must be a positive number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setFormLoading(true);
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8001/Service/${service._id}`, service);
        toast.success('Service updated successfully!');
      } else {
        await axios.post('http://localhost:8001/Service', service);
        toast.success('Service created successfully!');
      }
      fetchServices();
      handleCloseDrawer();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} service`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (serviceId) => {
    const serviceToEdit = services.find(s => s._id === serviceId);
    if (serviceToEdit) {
      setService(serviceToEdit);
      setIsEditing(true);
      setDrawerOpen(true);
    }
  };

  const handleCreateClick = () => {
    setService({
      name: '',
      description: '',
      reference: '',
      factor: 1.00
    });
    setIsEditing(false);
    setErrors({});
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setIsEditing(false);
    setErrors({});
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Services Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateClick}
          sx={{ textTransform: 'none' }}
        >
          Create Service
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Service Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Reference</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Factor</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service._id} hover>
                    <TableCell>{service.name}</TableCell>
                    <TableCell sx={{ 
                      maxWidth: 300,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {service.description}
                    </TableCell>
                    <TableCell>{service.reference}</TableCell>
                    <TableCell>{service.factor}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary"
                        onClick={() => handleEditClick(service._id)}
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: { width: { xs: '100%', sm: '60%', md: '40%' }, p: 3 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {isEditing ? 'Edit Service' : 'Create Service'}
          </Typography>
          <IconButton onClick={handleCloseDrawer}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Service Name *"
            name="name"
            value={service.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            variant="outlined"
            inputProps={{ maxLength: 100 }}
          />

          <TextField
            fullWidth
            label="Description *"
            name="description"
            value={service.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            inputProps={{ maxLength: 500 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Reference </InputLabel>
              <Select
                label="Reference *"
                name="reference"
                value={service.reference}
                onChange={handleChange}
              >
                <MenuItem value=" ">No Reference Needed</MenuItem>
                <MenuItem value="Area">Area</MenuItem>
                <MenuItem value="CC">CC</MenuItem>
                <MenuItem value="Service Charges">Service Charges</MenuItem>
              </Select>
            
            </FormControl>

            <TextField
              fullWidth
              label="Multiplication Factor *"
              name="factor"
              type="number"
              value={service.factor}
              onChange={handleChange}
              error={!!errors.factor}
              helperText={errors.factor}
              margin="normal"
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleCloseDrawer}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formLoading}
              startIcon={formLoading ? <CircularProgress size={20} /> : null}
            >
              {isEditing ? 'Update Service' : 'Create Service'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ServicesPage;