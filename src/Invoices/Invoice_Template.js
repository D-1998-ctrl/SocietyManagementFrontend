import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  CircularProgress,
  Divider,
  Paper,
  Checkbox,
  FormControlLabel,
  Grid,
  Avatar,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Save,
  ArrowBack,
  AddCircleOutline,
  RemoveCircleOutline,
  Info,
  Description,
  Title as TitleIcon,
  Notes
} from '@mui/icons-material';

const InvoiceTemplateDesigner = () => {
  const { id } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [template, setTemplate] = useState({
    name: '',
    description: '',
    items: [],
    isActive: true,
    design: {
      terms: 'Payment due within 30 days. Late payments subject to 1.5% monthly interest.',
      footerNote: 'Thank you for your prompt payment.'
    }
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Memoized preview component to prevent unnecessary re-renders
  const Preview = useCallback(() => (
    <Paper elevation={1} sx={{ p: 2, border: '1px solid #eee' }}>
      {/* Preview Header */}
      <Box sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        p: 2,
        borderRadius: 1,
        mb: 2,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          SOCIETY NAME
        </Typography>
      </Box>

      {/* Invoice Details */}
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2"><strong>Invoice #:</strong> INV-2023-001</Typography>
          <Typography variant="body2"><strong>Date:</strong> {new Date().toLocaleDateString()}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2"><strong>Member:</strong> John Doe (Unit 101)</Typography>
          <Typography variant="body2"><strong>Period:</strong> {new Date().getFullYear()}-{(new Date().getMonth() + 1).toString().padStart(2, '0')}</Typography>
        </Grid>
      </Grid>

      {/* Items Table */}
      <TableContainer sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', p: 1 }}>Service</TableCell>
              <TableCell sx={{ fontWeight: 'bold', p: 1, textAlign: 'right' }}>Qty</TableCell>
              <TableCell sx={{ fontWeight: 'bold', p: 1, textAlign: 'right' }}>Factor</TableCell>
              <TableCell sx={{ fontWeight: 'bold', p: 1, textAlign: 'right' }}>Reference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {template.items.slice(0, 3).map((item, index) => {
              const service = services.find(s => s._id === item.serviceId);
              return (
                <TableRow key={index}>
                  <TableCell sx={{ p: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {service?.name || 'Service'}
                    </Typography>
                    {/* {item.showDescription && item.description && (
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        {item.description}
                      </Typography>
                    )} */}
                  </TableCell>
                  <TableCell sx={{ p: 1, textAlign: 'right' }}>{item.quantity}</TableCell>
                  <TableCell sx={{ p: 1, textAlign: 'right' }}>
                    {service?.factor || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ p: 1, textAlign: 'right' }}>
                    {service?.reference || 'N/A'}
                  </TableCell>
                </TableRow>
              );
            })}
            {template.items.length > 3 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ p: 1 }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    + {template.items.length - 3} more items
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer */}
      <Box sx={{
        borderTop: '1px solid #eee',
        pt: 1
      }}>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
          <strong>Payment Terms:</strong> {template.design.terms}
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
          {template.design.footerNote}
        </Typography>
      </Box>
    </Paper>
  ), [template.items, template.design.terms, template.design.footerNote, services]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const servicesPromise = axios.get('http://localhost:8001/Service');
        
        if (id) {
          const [servicesRes, templateRes] = await Promise.all([
            servicesPromise,
            axios.get(`http://localhost:8001/invoiceTemplate/${id}`)
          ]);
          setServices(servicesRes.data.data);
          setTemplate(templateRes.data.data);
        } else {
          const servicesRes = await servicesPromise;
          setServices(servicesRes.data.data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error(err.response?.data?.message || 'Failed to fetch data');
        if (id) navigate('/invoice-templates');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDesignChange = (e) => {
    const { name, value } = e.target;
    setTemplate(prev => ({
      ...prev,
      design: {
        ...prev.design,
        [name]: value
      }
    }));
  };

  const handleAddItem = () => {
    setTemplate(prev => ({
      ...prev,
      items: [...prev.items, {
        serviceId: '',
        description: '',
        quantity: 1,
        showDescription: true
      }]
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newItems = [...template.items];

    newItems[index] = {
      ...newItems[index],
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    };

    setTemplate(prev => ({
      ...prev,
      items: newItems
    }));

    // Clear item error when edited
    if (errors[`item-${index}-service`]) {
      setErrors(prev => ({ ...prev, [`item-${index}-service`]: undefined }));
    }
  };

  const handleRemoveItem = (index) => {
    const newItems = [...template.items];
    newItems.splice(index, 1);
    setTemplate(prev => ({
      ...prev,
      items: newItems
    }));
    // Clear any errors for this item
    const newErrors = { ...errors };
    delete newErrors[`item-${index}-service`];
    setErrors(newErrors);
  };

  const handleServiceSelect = (index, serviceId) => {
    const selectedService = services.find(s => s._id === serviceId);
    if (selectedService) {
      const newItems = [...template.items];
      newItems[index] = {
        ...newItems[index],
        serviceId: selectedService._id,
        description: selectedService.description
      };
      setTemplate(prev => ({
        ...prev,
        items: newItems
      }));
      // Clear error when service is selected
      if (errors[`item-${index}-service`]) {
        setErrors(prev => ({ ...prev, [`item-${index}-service`]: undefined }));
      }
    }
  };

  const validateTemplate = () => {
    const newErrors = {};
    if (!template.name.trim()) newErrors.name = 'Template name is required';
    if (template.items.length === 0) newErrors.items = 'At least one item is required';

    // Validate each item has a service selected
    template.items.forEach((item, index) => {
      if (!item.serviceId) {
        newErrors[`item-${index}-service`] = 'Service is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTemplate()) return;

    setSaving(true);
    try {
      if (id) {
        await axios.put(`http://localhost:8001/invoiceTemplate/${id}`, template);
        toast.success('Template updated successfully!');
      } else {
        await axios.post('http://localhost:8001/invoiceTemplate', template);
        toast.success('Template created successfully!');
      }
      navigate('/invoice-templates');
    } catch (err) {
      console.error('Submission error:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         `Failed to ${id ? 'update' : 'create'} template`;
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress size={80} />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: 3,
      backgroundColor: '#f9faff',
      minHeight: '100vh',
      overflow: 'auto'
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={() => navigate('/invoice-templates')} 
            sx={{ mr: 2 }}
            aria-label="Go back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{
            fontWeight: 'bold',
            color: 'primary.main'
          }}>
            {id ? 'Edit Invoice Template' : 'Create Invoice Template'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="medium"
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
          onClick={handleSubmit}
          disabled={saving}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.875rem'
          }}
          aria-label={saving ? 'Saving template' : 'Save template'}
        >
          {saving ? 'Saving...' : 'Save Template'}
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ overflow: 'hidden' }}>
        {/* Left Panel - Template Configuration */}
        <Grid item xs={12} md={6} sx={{ overflow: 'visible' }}>
          <Paper elevation={2} sx={{
            p: 3,
            borderRadius: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              color: 'primary.main'
            }}>
              <TitleIcon sx={{ mr: 1 }} />
              Template Configuration
            </Typography>

            <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Template Name *"
                    name="name"
                    value={template.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    variant="outlined"
                    inputProps={{ 'aria-label': 'Template name' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Description"
                    name="description"
                    value={template.description}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={2}
                    inputProps={{ 'aria-label': 'Template description' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={template.isActive}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          isActive: e.target.checked
                        }))}
                        name="isActive"
                        color="primary"
                      />
                    }
                    label="Active Template"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1
                  }}>
                    <Typography variant="h6" sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'primary.main'
                    }}>
                      <Description sx={{ mr: 1 }} />
                      Invoice Items
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddCircleOutline />}
                      onClick={handleAddItem}
                      aria-label="Add invoice item"
                    >
                      Add Item
                    </Button>
                  </Box>
                  {errors.items && (
                    <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                      {errors.items}
                    </Typography>
                  )}
                </Grid>

                {template.items.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper elevation={1} sx={{
                      p: 2,
                      borderRadius: 1,
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                      position: 'relative',
                      mb: 1
                    }}>
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          color: 'error.main'
                        }}
                        onClick={() => handleRemoveItem(index)}
                        aria-label={`Remove item ${index + 1}`}
                      >
                        <RemoveCircleOutline fontSize="small" />
                      </IconButton>

                      <Grid container spacing={1.5}>
                        <Grid item xs={12}>
                          <FormControl fullWidth size="small" error={!!errors[`item-${index}-service`]}>
                            <InputLabel id={`service-label-${index}`}>Service *</InputLabel>
                            <Select
                              labelId={`service-label-${index}`}
                              label="Service *"
                              value={item.serviceId}
                              onChange={(e) => handleServiceSelect(index, e.target.value)}
                              aria-labelledby={`service-label-${index}`}
                            >
                              {services.map(service => (
                                <MenuItem key={service._id} value={service._id}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{
                                      width: 22,
                                      height: 22,
                                      mr: 1.5,
                                      backgroundColor: 'primary.light',
                                      color: 'primary.contrastText',
                                      fontSize: '0.7rem'
                                    }}>
                                      {service.name.charAt(0)}
                                    </Avatar>
                                    <Typography variant="body2">{service.name}</Typography>
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                            {errors[`item-${index}-service`] && (
                              <Typography variant="caption" color="error">
                                {errors[`item-${index}-service`]}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={item.showDescription}
                                onChange={(e) => handleItemChange(index, e)}
                                name="showDescription"
                                color="primary"
                              />
                            }
                            label={<Typography variant="body2">Show description</Typography>}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Description"
                            name="description"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, e)}
                            variant="outlined"
                            multiline
                            rows={1}
                            inputProps={{ 'aria-label': `Item ${index + 1} description` }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            variant="outlined"
                            InputProps={{
                              inputProps: { 
                                min: 1,
                                'aria-label': `Item ${index + 1} quantity`
                              },
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Info fontSize="small" color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel - Design Customization */}
        <Grid item xs={12} md={6} sx={{ overflow: 'visible' }}>
          <Paper elevation={2} sx={{
            p: 3,
            borderRadius: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              color: 'primary.main'
            }}>
              Design Customization
            </Typography>

            <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Terms & Conditions"
                    name="terms"
                    value={template.design.terms}
                    onChange={handleDesignChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    inputProps={{ 'aria-label': 'Terms and conditions' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Footer Note"
                    name="footerNote"
                    value={template.design.footerNote}
                    onChange={handleDesignChange}
                    variant="outlined"
                    multiline
                    rows={2}
                    inputProps={{ 'aria-label': 'Footer note' }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Invoice Preview
                  </Typography>
                  <Preview />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceTemplateDesigner;