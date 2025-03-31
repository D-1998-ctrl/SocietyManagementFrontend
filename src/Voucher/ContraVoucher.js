import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { 
  Alert, Autocomplete, Menu, useMediaQuery, Box, Button, Typography, 
  TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, 
  Card, CardContent, Grid, IconButton, Tooltip, Modal, Paper, CircularProgress
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useTheme } from "@mui/material/styles";
import axios from 'axios';
import { format } from 'date-fns';
import { debounce } from 'lodash';

const ContraVoucher = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingLedgers, setLoadingLedgers] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date(),
    crNameOfCreditor: '',
    nameOfLedger: 'MDCC Bank',
    crAmountWithdraw: 0,
    amount: 0,
    bankFromWhichCashDebited: '',
    amountWithdrawn: 0,
    previousOSBills: '',
    ledgerBankCashMoney: '',
    transactionType: 'NEFT',
    instNo: '',
    chequeNo: '',
    instDate: new Date(),
    bankName: '',
    branchName: '',
    narration: '',
    branch: ''
  });
  const [autoFillAmount, setAutoFillAmount] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Memoized columns for the table
  const columns = useMemo(() => [
    {
      accessorKey: 'date',
      header: 'Date',
      size: 100,
      Cell: ({ cell }) => format(new Date(cell.getValue()), 'dd/MM/yyyy'),
    },
    {
      accessorKey: 'crNameOfCreditor',
      header: 'Creditor',
      size: 150,
    },
    {
      accessorKey: 'nameOfLedger',
      header: 'Ledger Account',
      size: 150,
    },
    {
      accessorKey: 'amountWithdrawn',
      header: 'Amount',
      size: 100,
      Cell: ({ cell }) => `₹${cell.getValue().toLocaleString()}`,
    },
    {
      accessorKey: 'transactionType',
      header: 'Type',
      size: 80,
    },
    {
      accessorKey: 'instNo',
      header: 'Inst. No',
      size: 100,
    },
    {
      accessorKey: 'bankName',
      header: 'Bank',
      size: 150,
    },
    {
      accessorKey: 'narration',
      header: 'Narration',
      size: 200,
      Cell: ({ cell }) => cell.getValue()?.substring(0, 30) + (cell.getValue()?.length > 30 ? '...' : ''),
    },
  ], []);

  // Fetch data with error handling
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8001/contraVoucher');
      setData(response.data);
    } catch (error) {
      setIsError(true);
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized account fetching with backend filtering
  const fetchAccounts = useCallback(async (searchQuery = '') => {
    try {
      setLoadingAccounts(true);
      const response = await axios.get('http://localhost:8001/Account', {
        params: {
          groupId: "1",
          search: searchQuery,
          limit: 100
        }
      });
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  // Optimized ledger fetching with backend filtering
  const fetchLedgers = useCallback(async (searchQuery = '') => {
    try {
      setLoadingLedgers(true);
      const response = await axios.get('http://localhost:8001/Account', {
        params: {
          groupId: "7",
          search: searchQuery,
          limit: 100
        }
      });
      setLedgers(response.data);
    } catch (error) {
      console.error('Error fetching ledgers:', error);
    } finally {
      setLoadingLedgers(false);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useMemo(() => debounce(async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      const response = await axios.get('http://localhost:8001/contraVoucher/search', {
        params: { query }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, 300), []);

  // Handle search term changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // Initial data loading
  useEffect(() => {
    fetchData();
    fetchAccounts();
    fetchLedgers();
  }, [fetchData, fetchAccounts, fetchLedgers]);

  // Auto-fill amount when crAmountWithdraw changes
  useEffect(() => {
    if (autoFillAmount && formData.crAmountWithdraw) {
      setFormData(prev => ({
        ...prev,
        amount: formData.crAmountWithdraw,
        amountWithdrawn: formData.crAmountWithdraw
      }));
    }
  }, [formData.crAmountWithdraw, autoFillAmount]);

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = () => {
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
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              CONTRA VOUCHER
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

          <Paper sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>Voucher No:</strong> {formData.voucherNumber || 'NEW'}</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body2">
                  <strong>Date:</strong> {format(new Date(formData.date), 'dd/MM/yyyy')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Transaction Type:</strong> {formData.transactionType}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', borderBottom: '1px solid #eee', pb: 1 }}>
              Account Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>Creditor:</strong> {formData.crNameOfCreditor}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>Ledger Account:</strong> {formData.nameOfLedger}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', borderBottom: '1px solid #eee', pb: 1 }}>
              Transaction Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2"><strong>Instrument No:</strong> {formData.instNo}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">
                  <strong>Instrument Date:</strong> {format(new Date(formData.instDate), 'dd/MM/yyyy')}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2"><strong>Amount:</strong> ₹{formData.amount.toLocaleString('en-IN')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>Bank Name:</strong> {formData.bankName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>Branch:</strong> {formData.branch}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', borderBottom: '1px solid #eee', pb: 1 }}>
              Narration
            </Typography>
            <Typography variant="body2">{formData.narration}</Typography>
          </Paper>

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

  const handleCrNameChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      crNameOfCreditor: newValue ? newValue.accountName : ''
    }));
  };

  const handleLedgerChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      nameOfLedger: newValue ? newValue.accountName : ''
    }));
  };

  const handleRowClick = (row) => {
    setEditingId(row._id);
    setFormData({
      ...row,
      date: new Date(row.date),
      instDate: new Date(row.instDate)
    });
    setIsDrawerOpen(true);
    setAutoFillAmount(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(autoFillAmount && name === 'crAmountWithdraw' ? {
        amount: value,
        amountWithdrawn: value
      } : {})
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleDrawerOpen = () => {
    setEditingId(null);
    setFormData({
      date: new Date(),
      crNameOfCreditor: '',
      nameOfLedger: 'MDCC Bank',
      crAmountWithdraw: 0,
      amount: 0,
      bankFromWhichCashDebited: '',
      amountWithdrawn: 0,
      previousOSBills: '',
      ledgerBankCashMoney: '',
      transactionType: 'NEFT',
      instNo: '',
      chequeNo: '',
      instDate: new Date(),
      bankName: '',
      branchName: '',
      narration: '',
      branch: ''
    });
    setAutoFillAmount(true);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:8001/contraVoucher/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:8001/contraVoucher', formData);
      }
      fetchData();
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (editingId) {
        await axios.delete(`http://localhost:8001/contraVoucher/${editingId}`);
        fetchData();
        setIsDrawerOpen(false);
      }
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

  const copyAmountToAll = () => {
    setFormData(prev => ({
      ...prev,
      amount: prev.crAmountWithdraw,
      amountWithdrawn: prev.crAmountWithdraw
    }));
  };

  return (
    <Box sx={{ p: isSmallScreen ? 1 : 3 }}>
      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Contra Voucher Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
              data={searchTerm.length >= 2 ? searchResults : data}
              enableColumnOrdering
              enableColumnResizing
              state={{ isLoading: isLoading || isSearching }}
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
            p: 3,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: '#f5f7fa'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingId ? 'Edit Contra Voucher' : 'Create New Contra Voucher'}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Actions">
              <IconButton onClick={handleMenuOpen} size="small">
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handlePreview}>Preview Voucher</MenuItem>
              <MenuItem onClick={handleGeneratePDF}>Generate PDF</MenuItem>
              <MenuItem onClick={handlePrint}>Print Voucher</MenuItem>
            </Menu>
            <IconButton onClick={handleDrawerClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: 3, overflowY: 'auto', height: 'calc(100vh - 120px)' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Voucher Date"
                  value={formData.date}
                  onChange={(date) => handleDateChange('date', date)}
                  format="dd/MM/yyyy"
                  sx={{ width: "100%" }}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                Account Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={accounts}
                getOptionLabel={(option) => option.accountName}
                loading={loadingAccounts}
                onChange={handleCrNameChange}
                value={accounts.find(acc => acc.accountName === formData.crNameOfCreditor) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Creditor Account"
                    size="small"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingAccounts ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.accountName === value.accountName}
                onInputChange={(event, newInputValue) => {
                  fetchAccounts(newInputValue);
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={ledgers}
                getOptionLabel={(option) => option.accountName}
                loading={loadingLedgers}
                onChange={handleLedgerChange}
                value={ledgers.find(led => led.accountName === formData.nameOfLedger) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ledger Account"
                    size="small"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingLedgers ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.accountName === value.accountName}
                onInputChange={(event, newInputValue) => {
                  fetchLedgers(newInputValue);
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                Amount Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Amount to Withdraw"
                type="number"
                name="crAmountWithdraw"
                value={formData.crAmountWithdraw}
                onChange={handleAmountChange}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: '₹',
                  inputProps: { min: 0, step: 'any' }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  label="Amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: '₹',
                    inputProps: { min: 0, step: 'any' }
                  }}
                />
                <Tooltip title={autoFillAmount ? "Auto-fill enabled" : "Auto-fill disabled"}>
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
                  <IconButton onClick={copyAmountToAll} size="small">
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                Transaction Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={handleInputChange}
                  label="Transaction Type"
                >
                  <MenuItem value="NEFT">NEFT</MenuItem>
                  <MenuItem value="IMPS">IMPS</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                  <MenuItem value="RTGS">RTGS</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Instrument No"
                name="instNo"
                value={formData.instNo}
                onChange={handleInputChange}
                size="small"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Instrument Date"
                  value={formData.instDate}
                  onChange={(date) => handleDateChange('instDate', date)}
                  format="dd/MM/yyyy"
                  sx={{ width: "100%" }}
                  renderInput={(params) => <TextField {...params} size="small" />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Amount Withdrawn"
                type="number"
                name="amountWithdrawn"
                value={formData.amountWithdrawn}
                onChange={handleInputChange}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: '₹',
                  inputProps: { min: 0, step: 'any' }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Bank Name"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                size="small"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                size="small"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Narration"
                name="narration"
                value={formData.narration}
                onChange={handleInputChange}
                size="small"
                fullWidth
                multiline
                rows={3}
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
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
                onClick={handleDelete}
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
      <PreviewVoucher 
        data={formData} 
        onClose={() => setPreviewOpen(false)} 
      />
    </Box>
  );
};

export default ContraVoucher;