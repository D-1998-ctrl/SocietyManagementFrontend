import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Chip,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    CircularProgress,
    Tooltip,
    Card,
    CardContent,
    Avatar,
    Autocomplete,
    InputAdornment,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogContent,
    DialogActions,
    Slide,
    DialogTitle,
    Fade
} from '@mui/material';
import {
    Search as SearchIcon,
    Send as SendIcon,
    FilterList as FilterIcon,
    Clear as ClearIcon,
    ArrowBack,
    Save,
    Print,
    CurrencyRupee,
    Title as TitleIcon,
    Visibility,
    Delete
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Constants
const GST_THRESHOLD = 7000;
const GST_RATE = 0.18;

// Helper functions
const calculateInvoiceTotals = (items) => {
    const subTotal = items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
    const gst = subTotal > GST_THRESHOLD ? subTotal * GST_RATE : 0;
    return {
        subTotal,
        gst,
        total: subTotal + gst
    };
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount).replace('₹', '');
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const InvoicePreview = React.memo(({ invoice, selectedMember, selectedTemplate, organization }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    if (!selectedTemplate) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px',
                border: '1px dashed #ccc',
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper
            }}>
                <Typography variant="body1" color="textSecondary">
                    {selectedMember
                        ? 'Select a template to preview the invoice'
                        : 'Select a member and template to preview invoice'}
                </Typography>
            </Box>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid #eee',
                p: 0,
                position: 'relative',
                backgroundColor: theme.palette.background.paper
            }}
            aria-label="Invoice preview"
        >
            {/* Invoice Header */}
            <Box sx={{
                backgroundColor: selectedTemplate.design?.headerColor || theme.palette.primary.main,
                color: 'white',
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: isSmallScreen ? 'column' : 'row',
                gap: 2
            }}>
                <Box sx={{ textAlign: isSmallScreen ? 'center' : 'left' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {organization?.SocietyName || 'SOCIETY NAME'}
                    </Typography>
                    <Typography variant="body2">
                        {organization?.AddressLine1 || 'Address line 1'}
                    </Typography>
                    {organization?.AddressLine2 && (
                        <Typography variant="body2">
                            {organization.AddressLine2}
                        </Typography>
                    )}
                    <Typography variant="body2">
                        {[organization?.AddressLine3, organization?.Pin].filter(Boolean).join(' - ')}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Reg No: {organization?.Registration || 'Not available'}
                    </Typography>
                    {organization?.GSTNumber && (
                        <Typography variant="body2">
                            GSTIN: {organization.GSTNumber}
                        </Typography>
                    )}
                </Box>
                {selectedTemplate.design?.logoUrl && (
                    <Box sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: 'white',
                        p: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1
                    }}>
                        {organization?.logoUrl ? (
                            <img
                                src={organization.logoUrl}
                                alt="Society Logo"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        ) : (
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Logo Here
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>

            {/* Invoice Content */}
            <Box sx={{ p: 3 }}>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                            INVOICE
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Invoice #:</strong> {invoice.invoiceNumber}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Period:</strong> {invoice.period}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {selectedMember && (
                            <>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>Member:</strong> {selectedMember.Name}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>Area:</strong> {selectedMember.Area} sq.ft
                                </Typography>
                                <Typography variant="body2">
                                    <strong>CC #:</strong> {selectedMember.CC}
                                </Typography>
                            </>
                        )}
                    </Grid>
                </Grid>

                {/* Items Table */}
                <TableContainer sx={{ mb: 3, border: '1px solid #eee' }}>
                    <Table aria-label="Invoice items">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Services</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Amount (₹)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice.items.map((item, index) => (
                                <TableRow key={`item-${index}`}>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {item.serviceName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatCurrency(item.rate * item.quantity)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Totals */}
                <Grid container justifyContent="flex-end" sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Table aria-label="Invoice totals">
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                                    <TableCell align="right">{formatCurrency(invoice.subTotal)}</TableCell>
                                </TableRow>
                                {invoice.subTotal > GST_THRESHOLD && (
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>GST (18%)</TableCell>
                                        <TableCell align="right">{formatCurrency(invoice.gst)}</TableCell>
                                    </TableRow>
                                )}
                                <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        {formatCurrency(invoice.total)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>

                {/* Footer */}
                <Box sx={{
                    borderTop: '1px solid #eee',
                    pt: 2,
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    justifyContent: 'space-between',
                    gap: 2
                }}>
                    <Box>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            {selectedTemplate.design?.footerNote || 'Thank you for your business!'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            This is a computer generated invoice and does not require a signature.
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: isSmallScreen ? 'left' : 'right' }}>
                        {organization?.Email && (
                            <Typography variant="body2">
                                Email: {organization.Email}
                            </Typography>
                        )}
                        {organization?.Mobile && (
                            <Typography variant="body2">
                                Contact: {organization.Mobile}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
});

const InvoiceForm = ({
    invoice,
    setInvoice,
    errors,
    setErrors,
    members,
    templates,
    selectedMember,
    setSelectedMember,
    selectedTemplate,
    setSelectedTemplate,
    showPreview,
    setShowPreview,
    isSmallScreen,
    onSave,
    saving,
    onCancel,
    onPrint
}) => {
    const theme = useTheme();

    const handleMemberSelect = useCallback((event, value) => {
        setSelectedMember(value);
        setInvoice(prev => ({
            ...prev,
            memberId: value?._id || '',
        }));

        if (selectedTemplate && value) {
            const updatedItems = invoice.items.map(item => {
                const templateItem = selectedTemplate.items.find(tItem => tItem.serviceId.name === item.serviceName);
                if (templateItem) {
                    return {
                        ...item,
                        rate: calculateRate(
                            templateItem.serviceId.factor,
                            templateItem.serviceId.reference,
                            value[templateItem.serviceId.reference] || 0
                        )
                    };
                }
                return item;
            });

            setInvoice(prev => ({
                ...prev,
                items: updatedItems
            }));
        }
    }, [invoice.items, selectedTemplate, setInvoice, setSelectedMember]);

    const handleTemplateSelect = useCallback((e) => {
        const templateId = e.target.value;
        const template = templates.find(t => t._id === templateId);
        setSelectedTemplate(template);

        if (template && selectedMember) {
            const items = template.items.map(item => ({
                serviceId: item.serviceId._id,
                serviceName: item.serviceId.name,
                description: item.description,
                quantity: item.quantity,
                factor: item.serviceId.factor,
                reference: item.serviceId.reference,
                rate: calculateRate(
                    item.serviceId.factor,
                    item.serviceId.reference,
                    selectedMember[item.serviceId.reference] || 0
                ),
                showDescription: item.showDescription,
                isRateEditable: true
            }));

            setInvoice(prev => ({
                ...prev,
                templateId,
                items
            }));
        }
    }, [selectedMember, setInvoice, setSelectedTemplate, templates]);

    const calculateRate = useCallback((factor, reference, memberValue) => {
        if (reference === 'Area' || reference === 'CC') {
            return parseFloat(memberValue) * parseFloat(factor);
        }
        return parseFloat(factor);
    }, []);

    const handleItemChange = useCallback((index, e) => {
        const { name, value, type } = e.target;
        const newItems = [...invoice.items];

        newItems[index] = {
            ...newItems[index],
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        };

        setInvoice(prev => ({
            ...prev,
            items: newItems
        }));
    }, [invoice.items, setInvoice]);

    const handleRemoveService = useCallback((index) => {
        const newItems = [...invoice.items];
        newItems.splice(index, 1);
        setInvoice(prev => ({
            ...prev,
            items: newItems
        }));
    }, [setInvoice]);

    return (
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TitleIcon sx={{ mr: 1 }} />
                    Invoice Details
                </Typography>
                <Box>
                    {!isSmallScreen && (
                        <Button
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => setShowPreview(!showPreview)}
                            sx={{ mr: 1 }}
                        >
                            {showPreview ? 'Hide Preview' : 'Preview Invoice'}
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={onCancel}
                    >
                        Back
                    </Button>
                </Box>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        options={members}
                        getOptionLabel={(option) => option.Name || ''}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search Member *"
                                variant="outlined"
                                size="small"
                                error={!!errors.member}
                                helperText={errors.member}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                                            {params.InputProps.startAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        value={selectedMember}
                        onChange={handleMemberSelect}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                    />
                </Grid>

                {selectedMember && (
                    <>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Area (sq.ft)"
                                value={selectedMember.Area || ''}
                                variant="outlined"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="CC Number"
                                value={selectedMember.CC || ''}
                                variant="outlined"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                    </>
                )}

                <Grid item xs={12}>
                    <FormControl fullWidth size="small" error={!!errors.template}>
                        <InputLabel>Select Template *</InputLabel>
                        <Select
                            label="Select Template *"
                            value={invoice.templateId}
                            onChange={handleTemplateSelect}
                            disabled={!selectedMember}
                        >
                            {templates.map(template => (
                                <MenuItem key={template._id} value={template._id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{
                                            width: 22,
                                            height: 22,
                                            mr: 1.5,
                                            backgroundColor: template.design?.headerColor || 'primary.main',
                                            color: 'white',
                                            fontSize: '0.7rem'
                                        }}>
                                            {template.name?.charAt(0) || 'T'}
                                        </Avatar>
                                        <Typography variant="body2">{template.name}</Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.template && (
                            <Typography variant="caption" color="error" sx={{ ml: 1.5 }}>
                                {errors.template}
                            </Typography>
                        )}
                    </FormControl>
                </Grid>

                {invoice.items.length > 0 && (
                    <>
                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    Invoice Items
                                </Typography>
                            </Box>
                            <TableContainer
                                component={Paper}
                                elevation={1}
                                sx={{
                                    maxHeight: 400,
                                    overflow: 'auto',
                                    '& .MuiTableCell-root': {
                                        padding: '8px 16px'
                                    }
                                }}
                            >
                                <Table size="small" stickyHeader aria-label="Invoice items">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Qty</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Rate</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Amount</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', width: '50px' }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoice.items.map((item, index) => (
                                            <TableRow key={`item-${index}`}>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {item.serviceName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        name="quantity"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, e)}
                                                        sx={{ width: 100 }}
                                                        inputProps={{
                                                            min: 1,
                                                            'aria-label': `Quantity for ${item.serviceName}`
                                                        }}
                                                        error={!!errors[`item-${index}-quantity`]}
                                                        helperText={errors[`item-${index}-quantity`]}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        name="rate"
                                                        value={item.rate}
                                                        onChange={(e) => handleItemChange(index, e)}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <CurrencyRupee fontSize="small" />
                                                                </InputAdornment>
                                                            ),
                                                            'aria-label': `Rate for ${item.serviceName}`
                                                        }}
                                                        sx={{ width: 120 }}
                                                        error={!!errors[`item-${index}-rate`]}
                                                        helperText={errors[`item-${index}-rate`]}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <TextField
                                                        size="small"
                                                        value={formatCurrency(item.rate * item.quantity)}
                                                        variant="outlined"
                                                        InputProps={{
                                                            readOnly: true,
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <CurrencyRupee fontSize="small" />
                                                                </InputAdornment>
                                                            ),
                                                            'aria-label': `Amount for ${item.serviceName}`
                                                        }}
                                                        sx={{ width: 120 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveService(index)}
                                                        color="error"
                                                        aria-label={`Remove ${item.serviceName}`}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Subtotal: </Typography>
                                            {invoice.subTotal > GST_THRESHOLD && (
                                                <Typography variant="body2">GST (18%):</Typography>
                                            )}
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                Total Amount:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                            
                                            <Typography variant="body2"> ₹  {formatCurrency(invoice.subTotal)}</Typography>
                                            {invoice.subTotal > GST_THRESHOLD && (
                                                <Typography variant="body2">₹ {formatCurrency(invoice.gst)}</Typography>
                                            )}
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                ₹ {formatCurrency(invoice.total)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </>
                )}

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Notes"
                        name="notes"
                        value={invoice.notes}
                        onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                        variant="outlined"
                        multiline
                        rows={3}
                        placeholder="Additional notes or terms..."
                        aria-label="Invoice notes"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        {isSmallScreen && (
                            <Button
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => setShowPreview(true)}
                            >
                                Preview
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            startIcon={<Print />}
                            onClick={onPrint}
                            disabled={!selectedTemplate}
                            aria-label="Print invoice"
                        >
                            Print
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                            onClick={onSave}
                            disabled={saving}
                            aria-label="Save invoice"
                        >
                            {saving ? 'Saving...' : 'Save Invoice'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

const InvoiceList = ({
    invoices,
    loading,
    selectedInvoices,
    setSelectedInvoices,
    searchTerm,
    setSearchTerm,
    filterOpen,
    setFilterOpen,
    selectedServices,
    setSelectedServices,
    onCreateNew,
    onRowClick,
    onSendEmails
}) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSelectInvoice = useCallback((invoiceId) => {
        setSelectedInvoices(prev =>
            prev.includes(invoiceId)
                ? prev.filter(id => id !== invoiceId)
                : [...prev, invoiceId]
        );
    }, [setSelectedInvoices]);

    const handleSelectAllInvoices = useCallback((event) => {
        setSelectedInvoices(event.target.checked ? invoices.map(invoice => invoice._id) : []);
    }, [invoices, setSelectedInvoices]);

    const handleFilterApply = useCallback(() => {
        setFilterOpen(false);
    }, [setFilterOpen]);

    const handleFilterClear = useCallback(() => {
        setSelectedServices([]);
    }, [setSelectedServices]);

    const availableServices = useMemo(() => {
        const services = new Set();
        invoices.forEach(invoice => {
            invoice.items.forEach(item => {
                services.add(item.serviceName);
            });
        });
        return Array.from(services);
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        if (selectedServices.length === 0) {
            return invoices.filter(invoice =>
                invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (invoice.memberId?.Name && invoice.memberId.Name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        return invoices.filter(invoice =>
            (invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (invoice.memberId?.Name && invoice.memberId.Name.toLowerCase().includes(searchTerm.toLowerCase()))) &&
            selectedServices.every(service =>
                invoice.items.some(item => item.serviceName === service)
            )
        )
    }, [invoices, searchTerm, selectedServices]);

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3, overflow: 'hidden' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 2,
                flexDirection: isSmallScreen ? 'column' : 'row',
                gap: isSmallScreen ? 2 : 0
            }}>
                <TextField
                    size="small"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: isSmallScreen ? '100%' : '40%',
                        minWidth: 200
                    }}
                    aria-label="Search invoices"
                />

                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    flexDirection: isSmallScreen ? 'column-reverse' : 'row'
                }}>
                    <Button
                        variant="contained"
                        onClick={onCreateNew}
                        sx={{
                            order: isSmallScreen ? 1 : 0
                        }}
                    >
                        Create New Invoice
                    </Button>

                    <Box sx={{
                        display: 'flex',
                        gap: 1
                    }}>
                        <Button
                            variant="outlined"
                            startIcon={<FilterIcon />}
                            onClick={() => setFilterOpen(!filterOpen)}
                        >
                            Filter
                        </Button>

                        {selectedInvoices.length > 0 && (
                            <Button
                                variant="contained"
                                startIcon={<SendIcon />}
                                onClick={onSendEmails}
                                color="secondary"
                            >
                                Send Email ({selectedInvoices.length})
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>

            {filterOpen && (
                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexDirection: isSmallScreen ? 'column' : 'row',
                        '& > *': {
                            width: isSmallScreen ? '100%' : 'auto'
                        }
                    }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Filter by Services</InputLabel>
                            <Select
                                multiple
                                value={selectedServices}
                                onChange={(e) => setSelectedServices(e.target.value)}
                                input={<OutlinedInput label="Filter by Services" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} size="small" />
                                        ))}
                                    </Box>
                                )}
                            >
                                {availableServices.map((service) => (
                                    <MenuItem key={service} value={service}>
                                        <Checkbox checked={selectedServices.indexOf(service) > -1} />
                                        {service}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            width: isSmallScreen ? '100%' : 'auto'
                        }}>
                            <Button
                                variant="contained"
                                onClick={handleFilterApply}
                                fullWidth={isSmallScreen}
                            >
                                Apply
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={handleFilterClear}
                                fullWidth={isSmallScreen}
                            >
                                Clear
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}

            <TableContainer sx={{
                maxHeight: 'calc(100vh - 300px)',
                overflow: 'auto',
                '& .MuiTableCell-root': {
                    py: 1.5
                }
            }}>
                <Table stickyHeader aria-label="Invoices table">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={
                                        selectedInvoices.length > 0 && selectedInvoices.length < invoices.length
                                    }
                                    checked={invoices.length > 0 && selectedInvoices.length === invoices.length}
                                    onChange={handleSelectAllInvoices}
                                    aria-label="Select all invoices"
                                />
                            </TableCell>
                            <TableCell>Invoice #</TableCell>
                            <TableCell>Member</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Period</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Services</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : filteredInvoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        No invoices found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices.map((invoice) => (
                                <TableRow
                                    key={invoice._id}
                                    hover
                                    onClick={() => onRowClick(invoice)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell
                                        padding="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Checkbox
                                            checked={selectedInvoices.includes(invoice._id)}
                                            onChange={() => handleSelectInvoice(invoice._id)}
                                            aria-label={`Select invoice ${invoice.invoiceNumber}`}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {invoice.invoiceNumber}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {invoice.memberId?.Name || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(invoice.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{invoice.period}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={invoice.status || 'draft'}
                                            size="small"
                                            color={
                                                invoice.status === 'paid' ? 'success' :
                                                    invoice.status === 'pending' ? 'warning' :
                                                        'default'
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip
                                            title={
                                                <Box>
                                                    {invoice.items.map((item, i) => (
                                                        <Typography key={i} variant="body2">
                                                            - {item.serviceName}
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            }
                                            arrow
                                            placement="top"
                                            TransitionComponent={Fade}
                                        >
                                            <Box>
                                                {invoice.items.slice(0, 2).map(item => item.serviceName).join(', ')}
                                                {invoice.items.length > 2 && ` +${invoice.items.length - 2} more`}
                                            </Box>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {formatCurrency(invoice.total || 0)}
                                        </Typography>
                                        {invoice.gst > 0 && (
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                (incl. GST: {formatCurrency(invoice.gst)})
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

const InvoiceManagement = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);
    const [members, setMembers] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [invoice, setInvoice] = useState({
        memberId: '',
        templateId: '',
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        period: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`,
        items: [],
        subTotal: 0,
        gst: 0,
        total: 0,
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Fetch all data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [orgRes, invoicesRes, membersRes, templatesRes] = await Promise.all([
                    axios.get('http://localhost:8001/Organisation'),
                    axios.get('http://localhost:8001/DemoInvoices', {
                        params: { populate: 'memberId,templateId,items.serviceId' }
                    }),
                    axios.get('http://localhost:8001/demoMembers'),
                    axios.get('http://localhost:8001/invoiceTemplate')
                ]);

                setOrganization(orgRes.data[0]);
                setInvoices(invoicesRes.data.data || []);
                setMembers(membersRes.data.data);
                setTemplates(templatesRes.data.data);
            } catch (err) {
                toast.error('Failed to fetch initial data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const { subTotal, gst, total } = calculateInvoiceTotals(invoice.items);
        setInvoice(prev => ({
            ...prev,
            subTotal,
            gst,
            total
        }));
    }, [invoice.items]);

    const handleSendEmails = useCallback(() => {
        const selected = invoices.filter(invoice => selectedInvoices.includes(invoice._id));
        console.log('Sending emails to:', selected);
        toast.success(`Preparing to send ${selected.length} emails`);
    }, [invoices, selectedInvoices]);

    const handleRowClick = useCallback((invoice) => {
        setSelectedMember(invoice.memberId);
        setSelectedTemplate(templates.find(t => t._id === invoice.templateId?._id));

        const formInvoice = {
            ...invoice,
            memberId: invoice.memberId?._id || '',
            templateId: invoice.templateId?._id || '',
            items: invoice.items.map(item => ({
                ...item,
                serviceId: item.serviceId?._id || '',
                serviceName: item.serviceName,
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                factor: item.factor,
                reference: item.reference,
                showDescription: item.showDescription,
                isRateEditable: item.isRateEditable
            }))
        };

        setInvoice(formInvoice);
        setActiveTab(1);
    }, [templates]);

    const validateInvoice = useCallback(() => {
        const newErrors = {};
        if (!invoice.memberId) newErrors.member = 'Member selection is required';
        if (!invoice.templateId) newErrors.template = 'Template selection is required';
        if (invoice.items.length === 0) newErrors.items = 'At least one item is required';

        invoice.items.forEach((item, index) => {
            if (item.quantity <= 0) {
                newErrors[`item-${index}-quantity`] = 'Quantity must be greater than 0';
            }
            if (item.rate <= 0) {
                newErrors[`item-${index}-rate`] = 'Rate must be greater than 0';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [invoice]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!validateInvoice()) return;

        setSaving(true);
        try {
            if (invoice._id) {
                await axios.put(`http://localhost:8001/DemoInvoices/${invoice._id}`, invoice);
                toast.success('Invoice updated successfully!');
            } else {
                await axios.post('http://localhost:8001/DemoInvoices', invoice);
                toast.success('Invoice created successfully!');
            }
            setActiveTab(0); // Return to list view after save
            resetForm();
        } catch (err) {
            console.error('Error saving invoice:', err);
            toast.error(err.response?.data?.message || 'Failed to save invoice');
        } finally {
            setSaving(false);
        }
    }, [invoice, validateInvoice]);

    const handlePrintInvoice = useCallback(() => {
        if (!selectedTemplate) {
            toast.error('Please select a template first');
            return;
        }

        if (!selectedMember) {
            toast.error('Please select a member first');
            return;
        }

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
              <title>Invoice ${invoice.invoiceNumber}</title>
              <style>
                * {
                  box-sizing: border-box;
                  margin: 0;
                  padding: 0;
                }
                body {
                  font-family: 'Roboto', Arial, sans-serif;
                  color: #333;
                  line-height: 0.9;
                }
                .invoice-container {
                  max-width: 1000px;
                  margin: 0 auto;
                  border: 1px solid #eee;
                }
                .invoice-header {
                  background-color: ${selectedTemplate?.design?.headerColor || '#1976d2'};
                  color: white;
                  padding: 24px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                }
                .society-info h2 {
                  font-size: 24px;
                  font-weight: 700;
                  margin-bottom: 4px;
                }
                .society-info p {
                  font-size: 14px;
                  margin-bottom: 4px;
                }
                .logo-container {
                  width: 80px;
                  height: 80px;
                  background-color: white;
                  padding: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .logo-container img {
                  max-width: 100%;
                  max-height: 100%;
                }
                .invoice-content {
                  padding: 24px;
                }
                .invoice-title {
                  font-size: 20px;
                  font-weight: 700;
                  margin-bottom: 16px;
                }
                .invoice-details {
                  display: flex;
                  margin-bottom: 24px;
                }
                .invoice-meta, .member-info {
                  flex: 1;
                }
                .invoice-meta p, .member-info p {
                  margin-bottom: 8px;
                  font-size: 14px;
                }
                .invoice-meta strong, .member-info strong {
                  display: inline-block;
                  width: 80px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 24px;
                  border: 1px solid #eee;
                }
                th {
                  background-color: #f5f5f5;
                  font-weight: 600;
                  text-align: left;
                  padding: 12px;
                  border-bottom: 1px solid #eee;
                }
                td {
                  padding: 12px;
                  border-bottom: 1px solid #eee;
                  vertical-align: top;
                }
                .service-name {
                  font-weight: 600;
                }
                .service-description {
                  font-size: 12px;
                  color: #666;
                  margin-top: 4px;
                }
                .service-reference {
                  font-size: 12px;
                  color: #666;
                }
                .amount-cell {
                  text-align: right;
                }
                .totals-table {
                  width: 50%;
                  margin-left: auto;
                  margin-bottom: 24px;
                }
                .totals-table td {
                  border-bottom: none;
                }
                .total-row {
                  font-weight: 600;
                }
                .notes {
                  margin-top: 24px;
                  padding: 16px;
                  background-color: #f9f9f9;
                  border-radius: 4px;
                }
                .invoice-footer {
                  margin-top: 24px;
                  padding-top: 16px;
                  border-top: 1px solid #eee;
                  display: flex;
                  justify-content: space-between;
                  font-size: 14px;
                }
                .footer-note {
                  font-style: italic;
                  color: #666;
                }
                .footer-contact {
                  text-align: right;
                }
                .terms {
                  margin-top: 20px;
                  font-size: 12px;
                  line-height: 1.4;
                }
                .terms-title {
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                .bank-details {
                  margin-top: 15px;
                  font-size: 12px;
                  line-height: 1.4;
                }
                .bank-title {
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                .footer {
                  margin-top: 20px;
                  text-align: right;
                  font-weight: bold;
                }
                @media print {
                  @page {
                    size: A4;
                    margin: 10mm;
                  }
                  body {
                    margin: 0;
                    padding: 0;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  .invoice-container {
                    border: none;
                  }
                }
              </style>
            </head>
            <body>
              <div class="invoice-container">
                <!-- Header -->
                <div class="invoice-header">
                  <div class="society-info">
                    <h2>${organization?.SocietyName || 'SOCIETY NAME'}</h2>
                    <p>${organization?.AddressLine1 || 'Address line 1'}</p>
                    ${organization?.AddressLine2 ? `<p>${organization.AddressLine2}</p>` : ''}
                    <p>${[organization?.AddressLine3, organization?.Pin].filter(Boolean).join(' - ')}</p>
                    <p>Reg No: ${organization?.Registration || 'Not available'}</p>
                    ${organization?.GSTNumber ? `<p>GSTIN: ${organization.GSTNumber}</p>` : ''}
                  </div>
                  ${organization?.logoUrl ? `
                  <div class="logo-container">
                    <img src="${organization.logoUrl}" alt="Society Logo">
                  </div>
                  ` : ''}
                </div>
                
                <!-- Content -->
                <div class="invoice-content">
                  <h1 class="invoice-title">INVOICE</h1>
                  
                  <div class="invoice-details">
                    <div class="invoice-meta">
                      <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                      <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                      <p><strong>Period:</strong> ${invoice.period}</p>
                    </div>
                    
                    <div class="member-info">
                      <p><strong>Member:</strong> ${selectedMember.Name}</p>
                      <p><strong>Area:</strong> ${selectedMember.Area} sq.ft</p>
                      <p><strong>CC #:</strong> ${selectedMember.CC}</p>
                    </div>
                  </div>
                  
                  <!-- Items Table -->
                  <table>
                    <thead>
                      <tr>
                        <th>Services</th>
                        <th style="text-align: right;">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${invoice.items.map((item) => `
                        <tr>
                          <td>
                            <div class="service-name">${item.serviceName}</div>
                          </td>
                          <td class="amount-cell">${(item.rate * item.quantity).toFixed(2)}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                  
                  <!-- Totals -->
                  <table class="totals-table">
                    <tbody>
                      <tr>
                        <td><strong>Subtotal:</strong></td>
                        <td class="amount-cell">₹${invoice.subTotal.toFixed(2)}</td>
                      </tr>
                      ${invoice.subTotal > GST_THRESHOLD ? `
                      <tr>
                        <td><strong>GST (18%):</strong></td>
                        <td class="amount-cell">₹${invoice.gst.toFixed(2)}</td>
                      </tr>
                      ` : ''}
                      <tr class="total-row">
                        <td><strong>Total:</strong></td>
                        <td class="amount-cell">₹${invoice.total.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <!-- Notes -->
                  ${invoice.notes ? `
                  <div class="notes">
                    <h3>Notes</h3>
                    <p>${invoice.notes}</p>
                  </div>
                  ` : ''}
                  
                  <!-- Terms & Conditions -->
                  <div class="terms">
                    <div class="terms-title">Terms & Conditions</div>
                    <div style="font-style: italic;">E&O.E.</div>
                    <div>1. Cheques to be in favour of "${organization?.SocietyName || "WHITE ROSE CHS LTD"}" & Cheques to be dropped in the cheque drop box.</div>
                    <div>2. Mention your Flat No. and Mobile No. on the reverse of the cheque.</div>
                    <div>3. Non Payment of Bill will attract interest @21 % PA.</div>
                    <div>4. Errors to be intimated within 7 days to Society Office</div>
                  </div>
      
                  <!-- Bank Details -->
                  <div class="bank-details">
                    <div class="bank-title">Bank Details for ${organization?.SocietyName || "WHITE ROSE CO-OPERATIVE HOUSING SOCIETY LTD"}</div>
                    <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                      <span>Bank Name: SVC Bank Ltd.</span>
                      <span>A/c No.: 300003000012169</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                      <span>Branch & IFSC: Bandra & SVCB0000003</span>
                      <span>Sign image</span>
                    </div>
                  </div>
                  
                  <!-- Footer -->
                  <div class="invoice-footer">
                    <div class="footer-note">
                      <p>${selectedTemplate?.design?.footerNote || 'Thank you for your business!'}</p>
                      <p>This is a computer generated invoice and does not require a signature.</p>
                    </div>
                    <div class="footer-contact">
                      ${organization?.Email ? `<p>Email: ${organization.Email}</p>` : ''}
                      ${organization?.Mobile ? `<p>Contact: ${organization.Mobile}</p>` : ''}
                    </div>
                  </div>
                  
                  <!-- Signature -->
                  <div class="footer">
                    Chairman/Secretary/Manager
                  </div>
                </div>
              </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(html);
        printWindow.document.close();

        // Wait for content to load before printing
        printWindow.onload = function () {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        };
    }, [invoice, selectedTemplate, selectedMember, organization]);
    const resetForm = useCallback(() => {
        setInvoice({
            memberId: '',
            templateId: '',
            invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toISOString().split('T')[0],
            period: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`,
            items: [],
            subTotal: 0,
            gst: 0,
            total: 0,
            notes: ''
        });
        setSelectedMember(null);
        setSelectedTemplate(null);
        setErrors({});
    }, []);

    const handleCreateNewInvoice = useCallback(() => {
        resetForm();
        setActiveTab(1);
    }, [resetForm]);

    const handleCancel = useCallback(() => {
        setActiveTab(0);
        resetForm();
    }, [resetForm]);

    return (
        <Box sx={{
            p: isSmallScreen ? 2 : 4,
            backgroundColor: '#f9faff',
            minHeight: '100vh',
            maxWidth: '100%',
            overflowX: 'hidden',
            position: 'relative'
        }}>
            {/* Header with Tabs */}
            <Box sx={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isSmallScreen ? 'flex-start' : 'center',
                mb: 4,
                gap: isSmallScreen ? 2 : 0
            }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: isSmallScreen ? 1 : 0 }}>
                    Invoice Management
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => {
                            setActiveTab(newValue);
                            if (newValue === 0) {
                                resetForm();
                            }
                        }}
                        sx={{
                            alignSelf: isSmallScreen ? 'flex-start' : 'center',
                            maxWidth: '100%'
                        }}
                        aria-label="Invoice management tabs"
                    >
                        <Tab label="View Invoices" aria-controls="invoice-list-tab" />
                        <Tab label={invoice._id ? "Edit Invoice" : "Create Invoice"} aria-controls="invoice-form-tab" />
                    </Tabs>
                </Box>
            </Box>

            {activeTab === 0 ? (
                <InvoiceList
                    invoices={invoices}
                    loading={loading}
                    selectedInvoices={selectedInvoices}
                    setSelectedInvoices={setSelectedInvoices}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterOpen={filterOpen}
                    setFilterOpen={setFilterOpen}
                    selectedServices={selectedServices}
                    setSelectedServices={setSelectedServices}
                    onCreateNew={handleCreateNewInvoice}
                    onRowClick={handleRowClick}
                    onSendEmails={handleSendEmails}
                />
            ) : (
                <Grid container spacing={3} sx={{
                    maxWidth: '100%',
                    margin: 0,
                    '& > .MuiGrid-item': {
                        paddingTop: '0 !important'
                    }
                }}>
                    <Grid item xs={12} md={showPreview ? 6 : 12} sx={{ pr: { md: 2 } }}>
                        <InvoiceForm
                            invoice={invoice}
                            setInvoice={setInvoice}
                            errors={errors}
                            setErrors={setErrors}
                            members={members}
                            templates={templates}
                            selectedMember={selectedMember}
                            setSelectedMember={setSelectedMember}
                            selectedTemplate={selectedTemplate}
                            setSelectedTemplate={setSelectedTemplate}
                            showPreview={showPreview}
                            setShowPreview={setShowPreview}
                            isSmallScreen={isSmallScreen}
                            onSave={handleSubmit}
                            saving={saving}
                            onCancel={handleCancel}
                            onPrint={handlePrintInvoice}
                        />
                    </Grid>

                    {/* Right Panel - Invoice Preview */}
                    {showPreview && !isSmallScreen && (
                        <Grid item xs={12} md={6} sx={{ pl: { md: 2 } }}>
                            <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">
                                        Invoice Preview
                                    </Typography>
                                    <IconButton
                                        onClick={() => setShowPreview(false)}
                                        aria-label="Close preview"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                </Box>
                                <div id="invoice-preview-content">
                                    <InvoicePreview
                                        invoice={invoice}
                                        selectedMember={selectedMember}
                                        selectedTemplate={selectedTemplate}
                                        organization={organization}
                                    />
                                </div>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Mobile Preview Dialog */}
            <Dialog
                fullScreen={isSmallScreen}
                open={isSmallScreen && showPreview}
                onClose={() => setShowPreview(false)}
                TransitionComponent={Transition}
                aria-labelledby="mobile-invoice-preview"
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: theme.palette.background.paper
                    }}
                >
                    Invoice Preview
                    <IconButton
                        onClick={() => setShowPreview(false)}
                        aria-label="Close preview"
                    >
                        <ClearIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: theme.palette.background.paper }}>
                    <div id="invoice-preview-content">
                        <InvoicePreview
                            invoice={invoice}
                            selectedMember={selectedMember}
                            selectedTemplate={selectedTemplate}
                            organization={organization}
                        />
                    </div>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: theme.palette.background.paper }}>
                    <Button onClick={() => setShowPreview(false)}>Close</Button>
                    <Button
                        onClick={handlePrintInvoice}
                        startIcon={<Print />}
                        disabled={!selectedTemplate}
                    >
                        Print
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InvoiceManagement;