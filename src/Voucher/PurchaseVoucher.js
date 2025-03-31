import React, { useMemo, useState, useEffect } from 'react';
import {
  Alert, useMediaQuery, Box, Button, Typography, TextField, Drawer,
  Divider, IconButton, Autocomplete, Modal, Paper, Grid, Tooltip,
  Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Textarea from '@mui/joy/Textarea';
import { useTheme } from "@mui/material/styles";
import axios from 'axios';
import { format } from 'date-fns';

const PurchaseVoucher = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const API_URL = 'http://localhost:8001/purchaseVoucher';
  const ACCOUNT_API_URL = 'http://localhost:8001/Account';

  // State for form data
  const [formData, setFormData] = useState({
    date: new Date(),
    refBillNo: '',
    drNameOfLedger: '',
    crTdsPayable: '',
    sgst: '',
    billDate: new Date(),
    crNameOfCreditor: '',
    amountOfBill: '',
    amount: '',
    cgst: '',
    billNo: '',
    billPeriod: '',
    narration: '',
    customerNo: ''
  });

  const [purchaseVouchers, setPurchaseVouchers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [creditorAccounts, setCreditorAccounts] = useState([]);
  const [ledgerAccounts, setLedgerAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [autoFillAmount, setAutoFillAmount] = useState(true);

  // Fetch all purchase vouchers
  const fetchPurchaseVouchers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setPurchaseVouchers(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setPurchaseVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(ACCOUNT_API_URL);
      const accountsData = response.data?.data || [];
      setAccounts(accountsData);

      // Filter accounts by groupId with null checks
      const creditors = response.data.filter(account => account.groupId === "2");
      const ledgers =response.data.filter(account => account.groupId === "25");

      console.log(creditors, ledgers)
      setCreditorAccounts(creditors);
      setLedgerAccounts(ledgers);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setAccounts([]);
      setCreditorAccounts([]);
      setLedgerAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseVouchers();
    fetchAccounts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle autocomplete changes
  const handleAutocompleteChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  // Handle row click for editing
  const handleRowClick = (rowData) => {
    setFormData({
      date: new Date(rowData.date),
      refBillNo: rowData.refBillNo,
      drNameOfLedger: rowData.drNameOfLedger,
      crTdsPayable: rowData.crTdsPayable,
      sgst: rowData.sgst,
      billDate: new Date(rowData.billDate),
      crNameOfCreditor: rowData.crNameOfCreditor,
      amountOfBill: rowData.amountOfBill,
      amount: rowData.amount,
      cgst: rowData.cgst,
      billNo: rowData.billNo,
      billPeriod: rowData.billPeriod,
      narration: rowData.narration,
      customerNo: rowData.customerNo || ''
    });
    setCurrentId(rowData._id);
    setIsEditing(true);
    setIsDrawerOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(`${API_URL}/${currentId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      await fetchPurchaseVouchers();
      handleDrawerClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${currentId}`);
      await fetchPurchaseVouchers();
      handleDrawerClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form and close drawer
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      date: new Date(),
      refBillNo: '',
      drNameOfLedger: '',
      crTdsPayable: '',
      sgst: '',
      billDate: new Date(),
      crNameOfCreditor: '',
      amountOfBill: '',
      amount: '',
      cgst: '',
      billNo: '',
      billPeriod: '',
      narration: '',
      customerNo: ''
    });
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    setIsEditing(false);
  };

  const columns = useMemo(() => {
    return [
      
      {
        accessorKey: 'date',
        header: 'Date',
        size: 150,
        Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : ''
      },
      {
        accessorKey: 'crNameOfCreditor',
        header: 'Creditor Invoice Generator',
        size: 150,
      },
      {
        accessorKey: 'billNo',
        header: 'Bill No',
        size: 150,
      },
      {
        accessorKey: 'amountOfBill',
        header: 'Amount of Bill',
        size: 150,
      },
      {
        accessorKey: 'drNameOfLedger',
        header: 'Head Ledger',
        size: 150,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        size: 150,
      },
      {
        accessorKey: 'crTdsPayable',
        header: 'TDS Payable',
        size: 150,
      },
      {
        accessorKey: 'sgst',
        header: 'SGST@9%',
        size: 150,
      },
      {
        accessorKey: 'cgst',
        header: 'CGST@9%',
        size: 150,
      },
      {
        accessorKey: 'customerNo',
        header: 'Customer No',
        size: 150,
      },
      {
        accessorKey: 'billPeriod',
        header: 'Bill Period',
        size: 150,
      },
      {
        accessorKey: 'billDate',
        header: 'Bill Date',
        size: 150,
        Cell: ({ cell }) => cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : ''
      },
      {
        accessorKey: 'narration',
        header: 'Narration',
        size: 150,
      },
    ];
  }, []);

  useEffect(() => {
    if (autoFillAmount && formData.amountOfBill) {
      setFormData(prev => ({
        ...prev,
        amount: formData.amountOfBill,
        sgst: (formData.amountOfBill * 0.09).toFixed(2),
        cgst: (formData.amountOfBill * 0.09).toFixed(2)
      }));
    }
  }, [formData.amountOfBill, autoFillAmount]);

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = () => {
    // PDF generation implementation would go here
    alert('PDF generation would be implemented here');
  };

  const PreviewVoucher = ({ data, onClose }) => {
    return (
      <Modal open={previewOpen} onClose={onClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isSmallScreen ? '95%' : '60%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
          outline: 'none'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c85de' }}>
              PURCHASE VOUCHER
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Print">
                <IconButton onClick={handlePrint} size="small">
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Generate PDF">
                <IconButton onClick={handleGeneratePDF} size="small">
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Voucher Header */}
          <Paper sx={{ p: 3, mb: 3, border: '2px solid #e0e0e0' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>Voucher No:</strong> {formData.voucherNumber}</Typography>
                <Typography variant="body2"><strong>Type:</strong> Purchase</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body2">
                  <strong>Date:</strong> {format(new Date(formData.date), 'dd/MM/yyyy')}
                </Typography>
                <Typography variant="body2">
                  <strong>Bill Date:</strong> {format(new Date(formData.billDate), 'dd/MM/yyyy')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Accounting Entry */}
          <Paper sx={{ p: 3, mb: 3, border: '2px solid #e0e0e0' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>DEBIT</Typography>
                <Typography variant="body2"><strong>Account:</strong> {formData.drNameOfLedger}</Typography>
                <Typography variant="body2"><strong>Amount:</strong> ₹{formData.amountOfBill?.toLocaleString('en-IN')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>CREDIT</Typography>
                <Typography variant="body2"><strong>Account:</strong> {formData.crNameOfCreditor}</Typography>
                <Typography variant="body2"><strong>Amount:</strong> ₹{formData.amount?.toLocaleString('en-IN')}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Tax Details */}
          <Paper sx={{ p: 3, mb: 3, border: '2px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', borderBottom: '1px solid #eee', pb: 1 }}>
              Tax Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2"><strong>SGST @9%:</strong> ₹{formData.sgst?.toLocaleString('en-IN')}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2"><strong>CGST @9%:</strong> ₹{formData.cgst?.toLocaleString('en-IN')}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2"><strong>TDS Payable:</strong> ₹{formData.crTdsPayable?.toLocaleString('en-IN')}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Transaction Details */}
          <Paper sx={{ p: 3, mb: 3, border: '2px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', borderBottom: '1px solid #eee', pb: 1 }}>
              Transaction Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2"><strong>Bill No:</strong> {formData.billNo}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2"><strong>Ref Bill No:</strong> {formData.refBillNo}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2"><strong>Bill Period:</strong> {formData.billPeriod}</Typography>
              </Grid>
              {formData.customerNo && (
                <Grid item xs={12}>
                  <Typography variant="body2"><strong>Customer No:</strong> {formData.customerNo}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Narration */}
          <Paper sx={{ p: 3, mb: 3, border: '2px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Narration
            </Typography>
            <Typography variant="body2">{formData.narration || 'No narration provided'}</Typography>
          </Paper>

          {/* Authorization Section */}
          <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed #ccc' }}>
            <Grid container spacing={2}>
              <Grid item xs={4} textAlign="center">
                <Typography variant="body2" sx={{ borderTop: '1px solid #000', pt: 1 }}>
                  <strong>Prepared By</strong>
                </Typography>
              </Grid>
              <Grid item xs={4} textAlign="center">
                <Typography variant="body2" sx={{ borderTop: '1px solid #000', pt: 1 }}>
                  <strong>Checked By</strong>
                </Typography>
              </Grid>
              <Grid item xs={4} textAlign="center">
                <Typography variant="body2" sx={{ borderTop: '1px solid #000', pt: 1 }}>
                  <strong>Authorized Signatory</strong>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    );
  };


  return (
    <Box sx={{ p: isSmallScreen ? 1 : 3 }}>
    <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c85de' }}>
            Purchase Voucher Management
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleDrawerOpen}
            sx={{
              backgroundColor: '#2c85de',
              '&:hover': { backgroundColor: '#1a6cb3' },
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            Create New Voucher
          </Button>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ 
          backgroundColor: 'background.paper', 
          borderRadius: '8px', 
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <MaterialReactTable
            columns={columns}
            data={purchaseVouchers}
            enableColumnOrdering
            enableColumnResizing
            state={{ isLoading: loading }}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleRowClick(row.original),
              sx: { 
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(44, 133, 222, 0.08)' }
              },
            })}
            muiTablePaperProps={{
              elevation: 0,
              sx: { boxShadow: 'none' }
            }}
          />
        </Box>
      </CardContent>
    </Card>

    {/* Enhanced Drawer */}
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={handleDrawerClose}
      PaperProps={{
        sx: {
          width: isSmallScreen ? "100%" : '45%',
          minWidth: isSmallScreen ? '100%' : '500px',
          borderRadius: isSmallScreen ? "0" : "12px 0 0 12px",
          zIndex: theme.zIndex.drawer + 1,
        },
      }}
    >
      <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f5f7fa' }}>
        <Typography m={2} variant="h6" sx={{ fontWeight: 600 }}>
          {isEditing ? 'Edit' : 'Create'} Purchase Voucher
        </Typography>
        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
      </Box>
      <Divider />

      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Voucher Date"
                value={formData.date}
                onChange={(date) => handleDateChange('date', date)}
                format="dd/MM/yyyy"
                sx={{ width: "100%", mb: 2 }}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </LocalizationProvider>

            <TextField
              label="Ref: Bill No"
              name="refBillNo"
              value={formData.refBillNo}
              onChange={handleInputChange}
              size="small"
              margin="normal"
              fullWidth
              required
              disabled={loading}
            />

            <Autocomplete
              label="DR: Name of Ledger"
              options={ledgerAccounts}
              getOptionLabel={(option) => option.accountName}
              loading={loading}
              onChange={(event, newValue) => {
                handleAutocompleteChange('drNameOfLedger', newValue?.accountName || '');
              }}
              value={ledgerAccounts.find(acc => acc.accountName === formData.drNameOfLedger) || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="DR: Name of Ledger"
                  size="small"
                  margin="normal"
                  fullWidth
                  required
                />
              )}
              isOptionEqualToValue={(option, value) => option.accountName === value?.accountName}
            />

            <TextField
              label="CR: TDS Payable"
              name="crTdsPayable"
              value={formData.crTdsPayable}
              onChange={handleInputChange}
              size="small"
              margin="normal"
              fullWidth
              required
              type="number"
              disabled={loading}
              InputProps={{
                startAdornment: '₹',
                inputProps: { min: 0, step: 'any' }
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Bill Date"
                value={formData.billDate}
                onChange={(date) => handleDateChange('billDate', date)}
                format="dd/MM/yyyy"
                sx={{ width: "100%", mt: 2 }}
                renderInput={(params) => <TextField {...params} size="small" disabled={loading} />}
              />
            </LocalizationProvider>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              label="CR: Name of Creditor"
              options={creditorAccounts}
              getOptionLabel={(option) => option.accountName}
              loading={loading}
              onChange={(event, newValue) => {
                handleAutocompleteChange('crNameOfCreditor', newValue?.accountName || '');
              }}
              value={creditorAccounts.find(acc => acc.accountName === formData.crNameOfCreditor) || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="CR: Name of Creditor"
                  size="small"
                  margin="normal"
                  fullWidth
                  required
                />
              )}
              isOptionEqualToValue={(option, value) => option.accountName === value?.accountName}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="Amount of Bill"
                name="amountOfBill"
                value={formData.amountOfBill}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFormData(prev => ({
                    ...prev,
                    amountOfBill: value,
                    ...(autoFillAmount ? { 
                      amount: value,
                      sgst: (value * 0.09).toFixed(2),
                      cgst: (value * 0.09).toFixed(2)
                    } : {})
                  }));
                }}
                size="small"
                margin="normal"
                fullWidth
                required
                type="number"
                disabled={loading}
                InputProps={{
                  startAdornment: '₹',
                  inputProps: { min: 0, step: 'any' }
                }}
              />
              <Tooltip title={autoFillAmount ? "Auto-sync enabled" : "Auto-sync disabled"}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setAutoFillAmount(!autoFillAmount)}
                  sx={{ 
                    minWidth: 0,
                    backgroundColor: autoFillAmount ? '#e3f2fd' : 'inherit'
                  }}
                >
                  {autoFillAmount ? 'Auto' : 'Manual'}
                </Button>
              </Tooltip>
              <Tooltip title="Copy amount to all fields">
                <IconButton 
                  onClick={() => {
                    const amount = parseFloat(formData.amountOfBill) || 0;
                    setFormData(prev => ({
                      ...prev,
                      amount: amount,
                      sgst: (amount * 0.09).toFixed(2),
                      cgst: (amount * 0.09).toFixed(2)
                    }));
                  }} 
                  size="small"
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <TextField
              label="Amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              size="small"
              margin="normal"
              fullWidth
              required
              type="number"
              disabled={loading}
              InputProps={{
                startAdornment: '₹',
                inputProps: { min: 0, step: 'any' }
              }}
            />

            <TextField
              label="SGST @9%"
              name="sgst"
              value={formData.sgst}
              onChange={handleInputChange}
              size="small"
              margin="normal"
              fullWidth
              required
              type="number"
              disabled={loading}
              InputProps={{
                startAdornment: '₹',
                inputProps: { min: 0, step: 'any' }
              }}
            />

            <TextField
              label="CGST @9%"
              name="cgst"
              value={formData.cgst}
              onChange={handleInputChange}
              size="small"
              margin="normal"
              fullWidth
              required
              type="number"
              disabled={loading}
              InputProps={{
                startAdornment: '₹',
                inputProps: { min: 0, step: 'any' }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Bill Period"
              name="billPeriod"
              value={formData.billPeriod}
              onChange={handleInputChange}
              size="small"
              margin="normal"
              fullWidth
              required
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <Textarea
              label="Narration"
              name="narration"
              value={formData.narration}
              onChange={handleInputChange}
              minRows={3}
              placeholder='Enter narration details'
              fullWidth
              disabled={loading}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ 
          mt: 3, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ 
                backgroundColor: '#2c85de',
                '&:hover': { backgroundColor: '#1a6cb3' },
                borderRadius: '8px'
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : isEditing ? 'Update' : 'Save'}
            </Button>
            <Button 
              onClick={handleDrawerClose} 
              variant="outlined" 
              sx={{ ml: 2, borderRadius: '8px' }} 
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>

          {isEditing && (
            <Box>
              <Button 
                variant="outlined" 
                onClick={handlePreview}
                sx={{ borderRadius: '8px', mr: 2 }}
              >
                Preview Voucher
              </Button>
              <Tooltip title="Delete">
                <IconButton 
                  onClick={() => setConfirmDelete(true)} 
                  color="error" 
                  disabled={loading}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>

    {/* Preview Modal */}
    <PreviewVoucher 
      data={formData} 
      onClose={() => setPreviewOpen(false)} 
    />

    {/* Delete Confirmation Dialog */}
    <Dialog
      open={confirmDelete}
      onClose={() => setConfirmDelete(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this purchase voucher? This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
        <Button onClick={handleDelete} color="error" autoFocus>
          Confirm Delete
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);
};

export default PurchaseVoucher;