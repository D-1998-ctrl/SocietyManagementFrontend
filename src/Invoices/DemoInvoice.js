import React, { useState, useEffect } from 'react';
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
    useMediaQuery
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
    Title as TitleIcon
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const InvoiceManagement = () => {
    // State for tabs
    const [activeTab, setActiveTab] = useState(0);

    // state for society information
    const [organization, setOrganization] = useState(null);


    // State for invoice list view
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);

    // State for invoice creation
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

    // Available services for filtering
    const availableServices = [
        'Sinking Fund',
        'Repair Fund',
        'Maintenance',
        'Gym',
        'Swimming Pool'
    ];

    // Fetch all data on component mount
    useEffect(() => {
        fetchInvoices();
        fetchMembers();
        fetchTemplates();
        fetchOrganization(); // Add this line

    }, []);

    // Recalculate totals whenever items change
    useEffect(() => {
        const subTotal = invoice.items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
        const gst = subTotal > 7000 ? subTotal * 0.18 : 0;
        const total = subTotal + gst;

        setInvoice(prev => ({
            ...prev,
            subTotal,
            gst,
            total
        }));
    }, [invoice.items]);

    const fetchOrganization = async () => {
        try {
            const { data } = await axios.get('http://localhost:8001/Organisation');
            setOrganization(data[0]); // Assuming the API returns an array with one organization
        } catch (err) {
            toast.error('Failed to fetch organization details');
            console.error(err);
        }
    };

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:8001/DemoInvoices', {
                params: {
                    populate: 'memberId,templateId,items.serviceId'
                }
            });
            setInvoices(data.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch invoices');
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const { data } = await axios.get('http://localhost:8001/demoMembers');
            setMembers(data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch members');
            setMembers([]);
        }
    };

    const fetchTemplates = async () => {
        try {
            const { data } = await axios.get('http://localhost:8001/invoiceTemplate');
            setTemplates(data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch templates');
            setTemplates([]);
        }
    };

    // Invoice list view handlers
    const handleSelectInvoice = (invoiceId) => {
        setSelectedInvoices(prev =>
            prev.includes(invoiceId)
                ? prev.filter(id => id !== invoiceId)
                : [...prev, invoiceId]
        );
    };

    const handleSelectAllInvoices = (event) => {
        setSelectedInvoices(event.target.checked ? invoices.map(invoice => invoice._id) : []);
    };

    const handleSendEmails = () => {
        const selected = invoices.filter(invoice => selectedInvoices.includes(invoice._id));
        console.log('Sending emails to:', selected);
        toast.success(`Preparing to send ${selected.length} emails`);
    };

    const handleFilterApply = () => {
        // Filter logic would be implemented in your API
        // This is just client-side simulation
        const filtered = invoices.filter(invoice =>
            selectedServices.every(service =>
                invoice.items.some(item => item.serviceName === service)
            )
        );
        setInvoices(filtered);
        setFilterOpen(false);
    };

    const handleFilterClear = () => {
        setSelectedServices([]);
        fetchInvoices();
    };

    const handleRowClick = (invoice) => {
        // Set up the form with the invoice data for editing
        setSelectedMember(invoice.memberId);
        setSelectedTemplate(templates.find(t => t._id === invoice.templateId?._id));

        // Prepare the invoice data for the form
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
        setActiveTab(1); // Switch to create/edit tab
    };

    // Invoice creation/edit handlers
    const handleMemberSelect = (event, value) => {
        setSelectedMember(value);
        setInvoice(prev => ({
            ...prev,
            memberId: value?._id || '',
            items: []
        }));
        setSelectedTemplate(null);
    };

    const handleTemplateSelect = (e) => {
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
    };

    const calculateRate = (factor, reference, memberValue) => {
        if (reference === 'Area' || reference === 'CC') {
            return parseFloat(memberValue) * parseFloat(factor);
        }
        return parseFloat(factor);
    };

    const handleItemChange = (index, e) => {
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInvoice()) return;

        setSaving(true);
        try {
            if (invoice._id) {
                // Update existing invoice
                await axios.put(`http://localhost:8001/DemoInvoices/${invoice._id}`, invoice);
                toast.success('Invoice updated successfully!');
            } else {
                // Create new invoice
                await axios.post('http://localhost:8001/DemoInvoices', invoice);
                toast.success('Invoice created successfully!');
            }
            fetchInvoices();
        } catch (err) {
            console.error('Error saving invoice:', err);
            toast.error(err.response?.data?.message || 'Failed to save invoice');
        } finally {
            setSaving(false);
        }
    };

    const validateInvoice = () => {
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
    };

    const handleRemoveService = (index) => {
        const newItems = [...invoice.items];
        newItems.splice(index, 1);
        setInvoice(prev => ({
            ...prev,
            items: newItems
        }));
    };

    return (
        <Box sx={{
            p: isSmallScreen ? 2 : 4,
            backgroundColor: '#f9faff',
            minHeight: '100vh',
            maxWidth: '100%',
            overflowX: 'hidden'
        }}>
            {/* Header with Tabs - make it more spacious */}
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

                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{
                        alignSelf: isSmallScreen ? 'flex-start' : 'center',
                        maxWidth: '100%'
                    }}
                >
                    <Tab label="View Invoices" />
                    <Tab label={invoice._id ? "Edit Invoice" : "Create Invoice"} />
                </Tabs>
            </Box>

            {activeTab === 0 ? (
                /* INVOICE LIST VIEW */
                <Paper elevation={2} sx={{
                    p: 3,
                    mb: 3,
                    overflow: 'hidden'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
                            sx={{ width: isSmallScreen ? '60%' : '40%' }}
                        />

                        <Box>
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                onClick={() => setFilterOpen(!filterOpen)}
                                sx={{ mr: 1 }}
                            >
                                Filter
                            </Button>

                            {selectedInvoices.length > 0 && (
                                <Button
                                    variant="contained"
                                    startIcon={<SendIcon />}
                                    onClick={handleSendEmails}
                                >
                                    Send Email ({selectedInvoices.length})
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {filterOpen && (
                        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

                                <Button variant="contained" onClick={handleFilterApply}>
                                    Apply
                                </Button>

                                <Button variant="outlined" onClick={handleFilterClear}>
                                    Clear
                                </Button>
                            </Box>
                        </Paper>
                    )}

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={
                                                selectedInvoices.length > 0 && selectedInvoices.length < invoices.length
                                            }
                                            checked={invoices.length > 0 && selectedInvoices.length === invoices.length}
                                            onChange={handleSelectAllInvoices}
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
                                        <TableCell colSpan={8} align="center">
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : invoices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            No invoices found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    invoices
                                        .filter(invoice =>
                                            invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            (invoice.memberId?.Name && invoice.memberId.Name.toLowerCase().includes(searchTerm.toLowerCase()))
                                        )
                                        .map((invoice) => (
                                            <TableRow
                                                key={invoice._id}
                                                hover
                                                onClick={() => handleRowClick(invoice)}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                                    <Checkbox
                                                        checked={selectedInvoices.includes(invoice._id)}
                                                        onChange={() => handleSelectInvoice(invoice._id)}
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
                                                    {invoice.items.slice(0, 2).map(item => item.serviceName).join(', ')}
                                                    {invoice.items.length > 2 && ` +${invoice.items.length - 2} more`}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        ₹{invoice.total?.toFixed(2) || '0.00'}
                                                    </Typography>
                                                    {invoice.gst > 0 && (
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                            (incl. GST: ₹{invoice.gst.toFixed(2)})
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
            ) : (
                <Grid container spacing={3} sx={{
                    maxWidth: '100%',
                    margin: 0,
                    '& > .MuiGrid-item': {
                        paddingTop: '0 !important'
                    }
                }}>
                    <Grid item xs={12} md={5} sx={{ pr: { md: 2 } }}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <TitleIcon sx={{ mr: 1 }} />
                                Invoice Details
                            </Typography>

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
                                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                                Invoice Items
                                            </Typography>
                                            <TableContainer component={Paper} elevation={1} sx={{ maxHeight: 400, overflow: 'auto' }}>
                                                <Table size="small" stickyHeader>
                                                    <TableHead>
                                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                            <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                                                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Qty</TableCell>
                                                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Rate</TableCell>
                                                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Amount</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {invoice.items.map((item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>
                                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                        {item.serviceName}
                                                                    </Typography>
                                                                    {item.showDescription && item.description && (
                                                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                                                                            {item.description}
                                                                        </Typography>
                                                                    )}
                                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                                        {item.reference} @ {item.factor}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <TextField
                                                                        size="small"
                                                                        type="number"
                                                                        name="quantity"
                                                                        value={item.quantity}
                                                                        onChange={(e) => handleItemChange(index, e)}
                                                                        sx={{ width: 70 }}
                                                                        inputProps={{ min: 1 }}
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
                                                                            )
                                                                        }}
                                                                        sx={{ width: 100 }}
                                                                        error={!!errors[`item-${index}-rate`]}
                                                                        helperText={errors[`item-${index}-rate`]}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <TextField
                                                                        size="small"
                                                                        value={(item.rate * item.quantity).toFixed(2)}
                                                                        variant="outlined"
                                                                        InputProps={{
                                                                            readOnly: true,
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <CurrencyRupee fontSize="small" />
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        sx={{ width: 100 }}
                                                                    />
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
                                                            <Typography variant="body2">Subtotal:</Typography>
                                                            {invoice.subTotal > 7000 && (
                                                                <Typography variant="body2">GST (18%):</Typography>
                                                            )}
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                                Total Amount:
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                                            <Typography variant="body2">₹{invoice.subTotal.toFixed(2)}</Typography>
                                                            {invoice.subTotal > 7000 && (
                                                                <Typography variant="body2">₹{invoice.gst.toFixed(2)}</Typography>
                                                            )}
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                                ₹{invoice.total.toFixed(2)}
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
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Print />}
                                            onClick={() => window.print()}
                                        >
                                            Print
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                                            onClick={handleSubmit}
                                            disabled={saving}
                                        >
                                            {saving ? 'Saving...' : 'Save Invoice'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Right Panel - Invoice Preview */}
                    <Grid item xs={12} md={7} sx={{ pl: { md: 2 } }}>
                        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Invoice Preview
                            </Typography>

                            {selectedTemplate ? (
                                <Paper elevation={0} sx={{ border: '1px solid #eee', p: 0, position: 'relative' }}>
                                    {/* Invoice Header */}
                                    <Box sx={{
                                        backgroundColor: selectedTemplate.design?.headerColor || '#1976d2',
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
                                                justifyContent: 'center'
                                            }}>
                                                {organization?.logoUrl ? (
                                                    <img
                                                        src={organization.logoUrl}
                                                        alt="Society Logo"
                                                        style={{ maxWidth: '100%', maxHeight: '100%' }}
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
                                                        {/* <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                            <strong>Area:</strong> {selectedMember.Area} sq.ft
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <strong>CC #:</strong> {selectedMember.CC}
                                                        </Typography> */}
                                                    </>
                                                )}
                                            </Grid>
                                        </Grid>

                                        {/* Items Table */}
                                        <TableContainer sx={{ mb: 3, border: '1px solid #eee' }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Services</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Qty</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Rate (₹)</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Amount (₹)</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {invoice.items.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleRemoveService(index)}
                                                                        sx={{ mr: 1, color: 'error.main' }}
                                                                    >
                                                                        <ClearIcon fontSize="small" />
                                                                    </IconButton>
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                            {item.serviceName}
                                                                        </Typography>
                                                                        {/* {item.showDescription && item.description && (
                                                                            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                                                                                {item.description}
                                                                            </Typography>
                                                                        )} */}
                                                                        {/* <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                                            {item.reference} @ {item.factor}
                                                                        </Typography> */}
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <TextField
                                                                    size="small"
                                                                    type="number"
                                                                    name="quantity"
                                                                    value={item.quantity}
                                                                    onChange={(e) => handleItemChange(index, e)}
                                                                    sx={{ width: 70 }}
                                                                    inputProps={{ min: 1 }}
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
                                                                        )
                                                                    }}
                                                                    sx={{ width: 100 }}
                                                                    error={!!errors[`item-${index}-rate`]}
                                                                    helperText={errors[`item-${index}-rate`]}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <TextField
                                                                    size="small"
                                                                    value={(item.rate * item.quantity).toFixed(2)}
                                                                    variant="outlined"
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <CurrencyRupee fontSize="small" />
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                    sx={{ width: 100 }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        {/* Totals */}
                                        <Grid container justifyContent="flex-end" sx={{ mb: 3 }}>
                                            <Grid item xs={12} md={6}>
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                                                            <TableCell align="right">₹{invoice.subTotal.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                        {invoice.subTotal > 7000 && (
                                                            <TableRow>
                                                                <TableCell sx={{ fontWeight: 'bold' }}>GST (18%)</TableCell>
                                                                <TableCell align="right">₹{invoice.gst.toFixed(2)}</TableCell>
                                                            </TableRow>
                                                        )}
                                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                                ₹{invoice.total.toFixed(2)}
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
                            ) : (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '300px',
                                    border: '1px dashed #ccc',
                                    borderRadius: 1
                                }}>
                                    <Typography variant="body1" color="textSecondary">
                                        {selectedMember
                                            ? 'Please select a template to preview the invoice'
                                            : 'Please select a member and template to preview invoice'}
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default InvoiceManagement;