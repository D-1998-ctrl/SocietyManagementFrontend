import React, { useMemo, useState, useEffect } from 'react';
import {
  Alert, Autocomplete, Menu, useMediaQuery, Box, Button, Typography,
  TextField, Drawer, Divider, FormControl, Select, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions, Modal, Paper, Grid,
  IconButton, Tooltip, Card, CardContent
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Textarea from '@mui/joy/Textarea';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTheme } from "@mui/material/styles";
import axios from 'axios';
import { format } from 'date-fns';

const PaymentVoucher = () => {
  const REACT_APP_URL =process.env.REACT_APP_URL
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [autoFillAmount, setAutoFillAmount] = useState(true);

  const [formData, setFormData] = useState({
    srNo: '',
    date: new Date(),
    nameOfCreditor: '',
    amountPaidDr: 0,
    previousOSBills: '',
    bank: 'MDCC Bank',
    drName: '',
    amountPaidCr: 0,
    transactionType: 'NEFT',
    instNo: '',
    chequeNo: '',
    instDate: new Date(),
    narration: ''
  });
  const fetchAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const response = await axios.get(`${REACT_APP_URL}/Account`);
      // Filter accounts where groupId is not 7
      const filteredAccounts = response.data.filter(account => account.groupId.groupCode !== 7);
      console.log('accntg',response.data)
      setAccounts(filteredAccounts);
      setLoadingAccounts(false);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setLoadingAccounts(false);
    }
  };

  // Fetch banks data for Cr Bank (groupId = 7)
  const fetchBanks = async () => {
    try {
      setLoadingBanks(true);
      const response = await axios.get(`${REACT_APP_URL}/Account`);
      // Filter accounts with groupId = 7
      const filteredBanks = response.data.filter(account => account.groupId.groupCode === 7);
      setBanks(filteredBanks);
      setLoadingBanks(false);
    } catch (error) {
      console.error('Error fetching banks:', error);
      setLoadingBanks(false);
    }
  };

  // Fetch data from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${REACT_APP_URL}/paymentVoucher`);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAccounts();
    fetchBanks();
  }, []);

  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'PaymentVoucherNumber',
        header: 'Voucher No.',
        size: 120,
        Cell: ({ cell }) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{cell.getValue()}</Typography>
      },
      {
        accessorKey: 'date',
        header: 'Date',
        size: 150,
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
      },
      // {
      //   accessorKey: 'nameOfCreditor',
      //   header: 'Name of Creditor/Expense Head',
      //   size: 150,
      // },
      {
        accessorKey: 'amountPaidDr',
        header: 'Amount Paid Dr',
        size: 150,
      },

      // {
      //   accessorKey: 'bank',
      //   header: 'Bank',
      //   size: 150,
      // },
      // {
      //   accessorKey: 'drName',
      //   header: 'DrName',
      //   size: 150,
      // },
      {
        accessorKey: 'amountPaidCr',
        header: 'Amount Paid Cr',
        size: 150,
      },
      {
        accessorKey: 'transactionType',
        header: 'Transaction Type',
        size: 150,
      },
      {
        accessorKey: 'instNo',
        header: 'Inst No',
        size: 150,
      },

      {
        accessorKey: 'instDate',
        header: 'Inst.Date',
        size: 150,
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
      },
      {
        accessorKey: 'narration',
        header: 'Narration',
        size: 150,
      },
    ];
  }, []);

  const handleRowClick = (row) => {
    setEditingId(row._id);
    setFormData({
      ...row,
      date: new Date(row.date),
      instDate: new Date(row.instDate)
    });
    setIsDrawerOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleCreditorChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      nameOfCreditor: newValue ? newValue._id : '',
      drName: newValue ? newValue._id : ''
    }));
  };

  const handleBankChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      bank: newValue ? newValue._id : ''
    }));
  };

  const handleDrawerOpen = () => {
    setEditingId(null);
    setFormData({
      srNo: '',
      date: new Date(),
      nameOfCreditor: '',
      amountPaidDr: 0,
      previousOSBills: '',
      bank: 'MDCC Bank',
      drName: '',
      amountPaidCr: 0,
      transactionType: 'NEFT',
      instNo: '',
      chequeNo: '',
      instDate: new Date(),
      narration: ''
    });
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        // Update existing record
        await axios.put(`${REACT_APP_URL}/paymentVoucher/${editingId}`, formData);
      } else {
        // Create new record
        await axios.post(`${REACT_APP_URL}/paymentVoucher`, formData);
      }
      fetchData(); // Refresh data
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${REACT_APP_URL}/paymentVoucher/${editingId}`);
      fetchData(); // Refresh data
      setIsDrawerOpen(false);
      setConfirmDelete(false);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (autoFillAmount && formData.amountPaidDr) {
      setFormData(prev => ({
        ...prev,
        amountPaidCr: formData.amountPaidDr
      }));
    }
  }, [formData.amountPaidDr, autoFillAmount]);

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
              PAYMENT VOUCHER
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
                <Typography variant="body2"><strong>Type:</strong> Payment</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body2">
                  <strong>Date:</strong> {format(new Date(formData.date), 'dd/MM/yyyy')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Accounting Entry */}
          <Paper sx={{ p: 3, mb: 3, border: '2px solid #e0e0e0' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>DEBIT</Typography>
                <Typography variant="body2"><strong>Account:</strong> {formData.nameOfCreditor}</Typography>
                <Typography variant="body2"><strong>Amount:</strong> ₹{formData.amountPaidDr.toLocaleString('en-IN')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>CREDIT</Typography>
                <Typography variant="body2"><strong>Account:</strong> {formData.bank}</Typography>
                <Typography variant="body2"><strong>Amount:</strong> ₹{formData.amountPaidCr.toLocaleString('en-IN')}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Transaction Details */}
          <Paper sx={{ p: 3, mb: 3, border: '2px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', borderBottom: '1px solid #eee', pb: 1 }}>
              Payment Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2"><strong>Mode:</strong> {formData.transactionType}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2"><strong>Instrument No:</strong> {formData.instNo}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">
                  <strong>Date:</strong> {format(new Date(formData.instDate), 'dd/MM/yyyy')}
                </Typography>
              </Grid>
              {formData.chequeNo && (
                <Grid item xs={12}>
                  <Typography variant="body2"><strong>Cheque No:</strong> {formData.chequeNo}</Typography>
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
              Payment Voucher Management
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

          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error loading data. Please try again later.
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
              data={data}
              enableColumnOrdering
              enableColumnResizing
              state={{ isLoading }}
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 3,
            borderBottom: "1px solid #ccc",
          }}
        >
          <Typography variant="h6">
            <b>{editingId ? 'Edit Payment Voucher' : 'Create Payment Voucher'}</b>
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <MoreVertIcon sx={{ cursor: 'pointer', color: 'black' }} onClick={handleMenuOpen} />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem>Preview Report</MenuItem>
              <MenuItem>Generate Report</MenuItem>
            </Menu>
            <CloseIcon onClick={handleDrawerClose} sx={{ cursor: "pointer" }} />
          </Box>
        </Box>
        <Divider />

        <Box>
          <Box m={1} display={'flex'} alignItems={'center'} justifyContent={'flex-start'}>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box>
                  <Typography>Date</Typography>
                  <DatePicker
                    value={formData.date}
                    onChange={(date) => handleDateChange('date', date)}
                    format="dd/MM/yyyy"
                    sx={{ width: "100%" }}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} gap={2} m={1}>
            <Box flex={1}>
              <Box>
                <Typography>Dr Name of Creditor</Typography>
                <Autocomplete
                  options={accounts}
                  getOptionLabel={(option) => option.accountName}
                  loading={loadingAccounts}
                  onChange={handleCreditorChange}
                  // value={accounts.find(acc => acc.accountName === formData.nameOfCreditor) || null}
                  value={accounts.find(acc => acc._id === formData.nameOfCreditor) || null}

                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ mt: 2, mb: 2 }}
                      size="small"
                      placeholder="Search creditor..."
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.accountName === value.accountName}
                />
              </Box>
              <Box>
                <Typography>Cr Bank</Typography>
                <Autocomplete
                  options={banks}
                  getOptionLabel={(option) => option.accountName}
                  loading={loadingBanks}
                  onChange={handleBankChange}
                  // value={banks.find(bank => bank.accountName === formData.bank) || null}
                  value={banks.find(bank => bank._id === formData.bank) || null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      margin="normal"
                      placeholder="Search bank..."
                      fullWidth
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.accountName === value.accountName}
                />
              </Box>
            </Box>

            <Box flex={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  label="Amount Paid (Dr)"
                  type="number"
                  name="amountPaidDr"
                  value={formData.amountPaidDr}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setFormData(prev => ({
                      ...prev,
                      amountPaidDr: value,
                      ...(autoFillAmount ? { amountPaidCr: value } : {})
                    }));
                  }}
                  size="small"
                  fullWidth
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
                <Tooltip title="Copy amount to Cr">
                  <IconButton
                    onClick={() => setFormData(prev => ({ ...prev, amountPaidCr: prev.amountPaidDr }))}
                    size="small"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>


              <Box mt={1}>
                <Typography>Cr Amount Paid</Typography>
                <TextField
                  type="number"
                  name="amountPaidCr"
                  value={formData.amountPaidCr}
                  onChange={handleInputChange}
                  size="small"
                  margin="normal"
                  fullWidth
                  InputProps={{
                    inputProps: { min: 0, step: 'any' },
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography textAlign={'center'} variant='h6'>Bank Allocations</Typography>
          </Box>

          <Box display={'flex'} alignItems={'center'} gap={2} m={1}>
            <Box flex={1}>
              <Box>
                <Typography>Transaction Type</Typography>
                <FormControl fullWidth size="small" margin="normal">
                  <Select
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="NEFT">NEFT</MenuItem>
                    <MenuItem value="IMPS">IMPS</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Cheque">Cheque</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography>Inst.No</Typography>
                <TextField
                  name="instNo"
                  value={formData.instNo}
                  onChange={handleInputChange}
                  size="small"
                  margin="normal"
                  fullWidth
                />
              </Box>
            </Box>

            <Box flex={1}>
              <Box>
                <Typography>Amount Paid</Typography>
                <TextField
                  label="Amount Paid (Cr)"
                  type="number"
                  name="amountPaidCr"
                  value={formData.amountPaidCr}
                  onChange={handleInputChange}
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: '₹',
                    inputProps: { min: 0, step: 'any' }
                  }}
                />
              </Box>

              <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box>
                    <Typography>Inst. Date</Typography>
                    <DatePicker
                      value={formData.instDate}
                      onChange={(date) => handleDateChange('instDate', date)}
                      format="dd/MM/yyyy"
                      sx={{ width: "100%" }}
                      renderInput={(params) => <TextField {...params} size="small" />}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>
            </Box>
          </Box>

          <Box m={2}>
            <Typography>Narration:</Typography>
            <Textarea
              name="narration"
              value={formData.narration}
              onChange={handleInputChange}
              minRows={3}
              placeholder='Narration'
              fullWidth
            />
          </Box>
        </Box>

        <Box sx={{
          p: 2,
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}>
          {editingId && (
            <>
              <Button
                variant="outlined"
                onClick={handlePreview}
                sx={{ borderRadius: '8px' }}
              >
                Preview Voucher
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setConfirmDelete(true)}
                sx={{ borderRadius: '8px' }}
              >
                Delete
              </Button>
            </>
          )}
          <Button
            variant="outlined"
            onClick={handleDrawerClose}
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              borderRadius: '8px',
              backgroundColor: '#2c85de',
              '&:hover': { backgroundColor: '#1a6cb3' }
            }}
          >
            {editingId ? 'Update' : 'Save'} Voucher
          </Button>
        </Box>
      </Drawer>

      {/* Delete confirmation dialog */}
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
          <Typography>Are you sure you want to delete this payment voucher? This action cannot be undone.</Typography>
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

export default PaymentVoucher;