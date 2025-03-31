import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Alert,
  Autocomplete,
  useMediaQuery,
  Button,
  Typography,
  TextField,
  Drawer,
  Divider,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTheme } from "@mui/material/styles";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import axios from 'axios';
import { format } from 'date-fns';

const JournalVoucher = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    date: new Date(),
    debitLedger: "",
    creditLedger: "",
    debitAmount: "",
    creditAmount: "",
    narration: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Sample ledger accounts as per Indian accounting standards
  const ledgerOptions = [
    { value: "Cash", label: "Cash in Hand" },
    { value: "Bank", label: "Bank Account" },
    { value: "Sales", label: "Sales Account" },
    { value: "Purchase", label: "Purchase Account" },
    { value: "Salary", label: "Salary Expenses" },
    { value: "Rent", label: "Rent Expenses" },
    { value: "Electricity", label: "Electricity Charges" },
    { value: "Sundry Debtors", label: "Sundry Debtors" },
    { value: "Sundry Creditors", label: "Sundry Creditors" },
    { value: "Capital", label: "Capital Account" },
    { value: "Drawings", label: "Drawings Account" },
    { value: "Depreciation", label: "Depreciation" },
    { value: "GST Payable", label: "GST Payable" },
    { value: "GST Receivable", label: "GST Receivable" },
    { value: "TDS Payable", label: "TDS Payable" },
    { value: "TDS Receivable", label: "TDS Receivable" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8001/JournalVoucher');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setIsEditMode(true);
    setIsDrawerOpen(true);

    setFormValues({
      date: row.date,
      debitLedger: row.debitLedger,
      creditLedger: row.creditLedger,
      debitAmount: row.debitAmount,
      creditAmount: row.creditAmount,
      narration: row.narration,
    });
  };

  const handleChange = (field, value) => {
    // Special handling for amount fields
    if (field === "debitAmount") {
      setFormValues(prev => ({
        ...prev,
        debitAmount: value,
        creditAmount: value // Automatically update credit amount to match debit
      }));
    } else if (field === "creditAmount") {
      setFormValues(prev => ({
        ...prev,
        creditAmount: value,
        debitAmount: value // Automatically update debit amount to match credit
      }));
    } else {
      setFormValues(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear any existing error for this field
    setFormErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errors = {};
    if (!formValues.date) errors.date = "Date is required";
    if (!formValues.debitLedger) errors.debitLedger = "Debit Ledger is required";
    if (!formValues.creditLedger) errors.creditLedger = "Credit Ledger is required";
    if (!formValues.debitAmount || isNaN(formValues.debitAmount)) errors.debitAmount = "Valid amount is required";
    if (!formValues.creditAmount || isNaN(formValues.creditAmount)) errors.creditAmount = "Valid amount is required";

    // Validate debit and credit amounts match
    if (formValues.debitLedger === formValues.creditLedger) {
      errors.ledgerMatch = "Debit and Credit ledgers cannot be same";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      const payload = {
        ...formValues,
        debitAmount: parseFloat(formValues.debitAmount),
        creditAmount: parseFloat(formValues.creditAmount),
      };

      try {
        if (isEditMode) {
          await axios.put(`http://localhost:8001/JournalVoucher/${selectedRow._id}`, payload);
          setSuccessMessage('Journal voucher updated successfully');
        } else {
          await axios.post('http://localhost:8001/JournalVoucher', payload);
          setSuccessMessage('Journal voucher created successfully');
        }

        const response = await axios.get('http://localhost:8001/JournalVoucher');
        setData(response.data);

        setTimeout(() => {
          setSuccessMessage('');
          setIsDrawerOpen(false);
          setIsEditMode(false);
          setSelectedRow(null);
        }, 2000);
      } catch (error) {
        console.error('Error saving journal voucher:', error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8001/JournalVoucher/${selectedRow._id}`);
      setSuccessMessage('Journal voucher deleted successfully');

      const response = await axios.get('http://localhost:8001/JournalVoucher');
      setData(response.data);

      setTimeout(() => {
        setSuccessMessage('');
        setIsDrawerOpen(false);
        setIsEditMode(false);
        setSelectedRow(null);
      }, 2000);
    } catch (error) {
      console.error('Error deleting journal voucher:', error);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'voucherNumber',
      header: 'Voucher No.',
      size: 120,
      Cell: ({ cell }) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{cell.getValue()}</Typography>
    },
    {
      accessorKey: 'date',
      header: 'Date',
      size: 100,
      Cell: ({ cell }) => format(new Date(cell.getValue()), 'dd/MM/yyyy')
    },
    {
      accessorKey: 'debitLedger',
      header: 'Debit Ledger',
      size: 150
    },
    {
      accessorKey: 'creditLedger',
      header: 'Credit Ledger',
      size: 150
    },
    {
      accessorKey: 'debitAmount',
      header: 'Amount',
      size: 120,
      Cell: ({ cell }) => `₹${parseFloat(cell.getValue()).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      accessorKey: 'narration',
      header: 'Narration',
      size: 200,
      Cell: ({ cell }) => (
        <Tooltip title={cell.getValue()} placement="top">
          <Typography noWrap sx={{ maxWidth: 200 }}>
            {cell.getValue()}
          </Typography>
        </Tooltip>
      )
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      size: 80,
      Cell: ({ row }) => (
        <IconButton onClick={() => handleRowClick(row.original)}>
          <EditIcon fontSize="small" color="primary" />
        </IconButton>
      )
    }
  ], []);

  const VoucherPreview = ({ voucher, onClose }) => {
    if (!voucher) return null;
    
    return (
      <Dialog 
        open={previewOpen} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">JOURNAL VOUCHER</Typography>
          <Box>
            <Tooltip title="Print">
              <IconButton onClick={() => window.print()} size="small" sx={{ color: 'white' }}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ p: 3 }}>
            {/* Voucher Header */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2"><strong>Voucher No:</strong> {voucher.voucherNumber || 'NEW'}</Typography>
                <Typography variant="body2"><strong>Type:</strong> Journal</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body2">
                  <strong>Date:</strong> {format(new Date(voucher.date), 'dd/MM/yyyy')}
                </Typography>
              </Grid>
            </Grid>
            
            {/* Accounting Entry */}
            <TableContainer component={Paper} sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Particulars</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Debit (₹)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Credit (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {voucher.debitLedger}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Dr.
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                      ₹{Number(voucher.debitAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {voucher.creditLedger}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Cr.
                      </Typography>
                    </TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                      ₹{Number(voucher.creditAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ borderTop: '2px solid #000' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      ₹{Number(voucher.debitAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      ₹{Number(voucher.creditAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Narration */}
            <Paper sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Narration
              </Typography>
              <Typography variant="body2">{voucher.narration || 'No narration provided'}</Typography>
            </Paper>
            
            {/* Authorization Section */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed #ccc' }}>
              <Grid container spacing={2}>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ borderTop: '1px solid #000', pt: 1 }}>
                    <strong>Prepared By</strong>
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ borderTop: '1px solid #000', pt: 1 }}>
                    <strong>Checked By</strong>
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ borderTop: '1px solid #000', pt: 1 }}>
                    <strong>Authorized Signatory</strong>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Box sx={{ 
      p: isSmallScreen ? 1 : 3,
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <Paper elevation={3} sx={{ 
        borderRadius: 2, 
        p: 3, 
        height: 'auto',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        {/* Header Section */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexDirection: isSmallScreen ? 'column' : 'row',
          gap: isSmallScreen ? 2 : 0
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 600,
            color: theme.palette.primary.main,
            fontSize: isSmallScreen ? '1.5rem' : '1.75rem'
          }}>
            Journal Vouchers
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setIsDrawerOpen(true);
              setIsEditMode(false);
              setFormValues({
                date: new Date(),
                debitLedger: "",
                creditLedger: "",
                debitAmount: "",
                creditAmount: "",
                narration: ""
              });
            }}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              },
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 1,
              fontSize: isSmallScreen ? '0.875rem' : '1rem'
            }}
          >
            New Journal Voucher
          </Button>
        </Box>

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Data Table */}
        <Box mt={2}>
          <MaterialReactTable
            columns={columns}
            data={data}
            enableColumnOrdering
            enableColumnResizing
            enableStickyHeader
            muiTableContainerProps={{
              sx: { 
                maxHeight: 'calc(100vh - 300px)',
                borderRadius: '8px'
              }
            }}
            muiTablePaperProps={{
              elevation: 0,
              sx: { 
                border: '1px solid #e0e0e0',
                boxShadow: 'none'
              }
            }}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleRowClick(row.original),
              sx: {
                cursor: 'pointer',
                '&:hover': { 
                  backgroundColor: '#f0f7ff'
                }
              },
            })}
            initialState={{
              density: 'compact'
            }}
          />
        </Box>

        {/* Drawer for Form */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => { setIsDrawerOpen(false); setIsEditMode(false); setSelectedRow(null); }}
          PaperProps={{
            sx: {
              width: isSmallScreen ? "100%" : '600px',
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              zIndex: 1000,
            },
          }}
        >
          <Box sx={{
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.primary.main,
            color: 'white'
          }}>
            <Typography variant="h6">
              <b>{isEditMode ? 'Edit Journal Voucher' : 'Create Journal Voucher'}</b>
            </Typography>
            <IconButton onClick={() => { setIsDrawerOpen(false); setIsEditMode(false); setSelectedRow(null); }}>
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
          <Divider />

          <Box sx={{ p: 3, overflowY: 'auto', height: 'calc(100vh - 150px)' }}>
            {formErrors.ledgerMatch && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formErrors.ledgerMatch}
              </Alert>
            )}

            <Grid container spacing={2}>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date *"
                    value={formValues.date ? new Date(formValues.date) : null}
                    onChange={(date) => handleChange("date", date)}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        error: !!formErrors.date,
                        helperText: formErrors.date,
                        fullWidth: true,
                        size: 'small'
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={ledgerOptions}
                  size="small"
                  onChange={(e, value) => handleChange("debitLedger", value?.value || "")}
                  value={ledgerOptions.find((option) => option.value === formValues.debitLedger) || null}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  getOptionLabel={(option) => option.label || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Debit Ledger *"
                      error={!!formErrors.debitLedger}
                      helperText={formErrors.debitLedger}
                    />
                  )}
                  isClearable={true}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={ledgerOptions}
                  size="small"
                  onChange={(e, value) => handleChange("creditLedger", value?.value || "")}
                  value={ledgerOptions.find((option) => option.value === formValues.creditLedger) || null}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  getOptionLabel={(option) => option.label || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Credit Ledger *"
                      error={!!formErrors.creditLedger}
                      helperText={formErrors.creditLedger}
                    />
                  )}
                  isClearable={true}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Amount *"
                  type="number"
                  value={formValues.debitAmount}
                  onChange={(e) => handleChange("debitAmount", e.target.value)}
                  error={!!formErrors.debitAmount}
                  helperText={formErrors.debitAmount}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: '₹',
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Amount *"
                  type="number"
                  value={formValues.creditAmount}
                  onChange={(e) => handleChange("creditAmount", e.target.value)}
                  error={!!formErrors.creditAmount}
                  helperText={formErrors.creditAmount}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: '₹',
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Narration"
                  multiline
                  rows={3}
                  size="small"
                  onChange={(e) => handleChange("narration", e.target.value)}
                  value={formValues.narration}
                  fullWidth
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Footer with action buttons */}
          <Box sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            borderTop: '1px solid #e0e0e0',
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#fff',
            zIndex: 1
          }}>
            {isEditMode && (
              <>
                <Button
                  onClick={() => setPreviewOpen(true)}
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                  sx={{
                    color: theme.palette.error.main,
                    borderColor: theme.palette.error.main,
                    '&:hover': {
                      backgroundColor: theme.palette.error.light,
                      borderColor: theme.palette.error.main
                    }
                  }}
                >
                  Preview
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </>
            )}
            <Button
              onClick={() => { setIsDrawerOpen(false); setIsEditMode(false); setSelectedRow(null); }}
              variant="outlined"
              sx={{
                color: theme.palette.text.secondary,
                borderColor: theme.palette.text.secondary
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                backgroundColor: theme.palette.success.main,
                '&:hover': {
                  backgroundColor: theme.palette.success.dark
                }
              }}
            >
              Save
            </Button>
          </Box>
        </Drawer>

        {/* Voucher Preview Dialog */}
        <VoucherPreview 
          voucher={selectedRow} 
          onClose={() => setPreviewOpen(false)} 
        />
      </Paper>
    </Box>
  );
};

export default JournalVoucher;