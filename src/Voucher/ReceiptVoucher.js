import React, { useMemo, useState, useEffect } from 'react';
import {
  Box, Button, Drawer, Typography, Divider, TextField, Alert, Select, MenuItem,
  Autocomplete, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Modal, Paper, Grid, Tooltip, Card, CardContent, useMediaQuery,
  useTheme
} from "@mui/material";
import { MaterialReactTable } from 'material-react-table';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import debounce from 'lodash.debounce';
import { format } from 'date-fns';

const ReceiptVoucher = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [receiptVouchers, setReceiptVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const columns = useMemo(() => [
    {
      accessorKey: 'receiptVoucherNumber',
      header: 'Voucher No',
      size: 150,
      Cell: ({ cell }) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {cell.getValue()}
        </Typography>
      )
    },
    {
      accessorKey: 'voucherDate',
      header: 'Receipt Date',
      size: 120,
      Cell: ({ cell }) => (
        <Typography variant="body2">
          {new Date(cell.getValue()).toLocaleDateString('en-IN')}
        </Typography>
      )
    },
    {
      accessorKey: 'crAccount',
      header: 'Member Name',
      size: 180,
      Cell: ({ cell }) => {
        const account = cell.getValue();
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {account?.accountName || ''}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {account?.accountId || ''}
            </Typography>
          </Box>
        );
      }
    },
    {
      accessorKey: 'crAmount',
      header: 'Amount',
      size: 120,
      Cell: ({ cell }) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          ₹{Number(cell.getValue()).toLocaleString('en-IN')}
        </Typography>
      )
    },
    {
      accessorKey: 'transactionType',
      header: 'Payment Mode',
      size: 120,
      Cell: ({ cell }) => (
        <Chip
          label={cell.getValue()}
          size="small"
          sx={{
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            fontWeight: 500
          }}
        />
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 120,
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEditClick(row.original)} size="small">
              <EditIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(row.original._id)} size="small">
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], []);

  const fetchReceiptVouchers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8001/RecieptVoucher');
      setReceiptVouchers(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching receipt vouchers:", err);
      setError(err.message);
      setLoading(false);
      toast.error("Failed to fetch receipt vouchers");
    }
  };

  useEffect(() => {
    fetchReceiptVouchers();
  }, []);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    setIsEditMode(false);
    setSelectedVoucher(null);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedVoucher(null);
    setIsEditMode(false);
  };

  const handleEditClick = (voucher) => {
    setSelectedVoucher(voucher);
    setIsDrawerOpen(true);
    setIsEditMode(true);
  };

  const handlePreviewClick = (voucher) => {
    setSelectedVoucher(voucher);
    setPreviewOpen(true);
  };

  const handleDeleteClick = (id) => {
    setVoucherToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8001/RecieptVoucher/${voucherToDelete}`);
      toast.success('Voucher deleted successfully');
      fetchReceiptVouchers();
    } catch (error) {
      console.error('Error deleting voucher:', error);
      toast.error('Failed to delete voucher');
    } finally {
      setDeleteDialogOpen(false);
      setVoucherToDelete(null);
    }
  };

  const VoucherPreview = ({ voucher, onClose }) => {
    if (!voucher) return null;

    return (
      <Modal open={previewOpen} onClose={onClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isSmallScreen ? '95%' : '60%',
          maxWidth: '100%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
          outline: 'none'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c85de' }}>
              RECEIPT VOUCHER
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Print">
                <IconButton onClick={() => window.print()} size="small">
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download PDF">
                <IconButton onClick={() => alert('PDF generation would be implemented here')} size="small">
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
                <Typography variant="body2"><strong>Voucher No:</strong> {voucher.voucherNumber || 'NEW'}</Typography>
                <Typography variant="body2"><strong>Type:</strong> Receipt</Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography variant="body2">
                  <strong>Date:</strong> {format(new Date(voucher.voucherDate), 'dd/MM/yyyy')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Accounting Entry */}
          <Paper sx={{ p: 3, mb: 3, border: '2px solid #e0e0e0' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#d32f2f' }}>DEBIT</Typography>
                <Typography variant="body2"><strong>Account:</strong> {voucher.drAccount?.accountName || ''}</Typography>
                <Typography variant="body2"><strong>Account Code:</strong> {voucher.drAccount?.accountId || ''}</Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                  <strong>Amount:</strong> ₹{Number(voucher.crAmount).toLocaleString('en-IN')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#2e7d32' }}>CREDIT</Typography>
                <Typography variant="body2"><strong>Account:</strong> {voucher.crAccount?.accountName || ''}</Typography>
                <Typography variant="body2"><strong>Account Code:</strong> {voucher.crAccount?.accountId || ''}</Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                  <strong>Amount:</strong> ₹{Number(voucher.crAmount).toLocaleString('en-IN')}
                </Typography>
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
                <Typography variant="body2"><strong>Payment Mode:</strong> {voucher.transactionType}</Typography>
              </Grid>
              {voucher.instrumentNumber && (
                <Grid item xs={4}>
                  <Typography variant="body2"><strong>Instrument No:</strong> {voucher.instrumentNumber}</Typography>
                </Grid>
              )}
              {voucher.instrumentDate && (
                <Grid item xs={4}>
                  <Typography variant="body2">
                    <strong>Instrument Date:</strong> {format(new Date(voucher.instrumentDate), 'dd/MM/yyyy')}
                  </Typography>
                </Grid>
              )}
              {voucher.instrumentBank && (
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Bank:</strong> {voucher.instrumentBank}</Typography>
                </Grid>
              )}
              {voucher.instrumentBranch && (
                <Grid item xs={6}>
                  <Typography variant="body2"><strong>Branch:</strong> {voucher.instrumentBranch}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Narration */}
          <Paper sx={{ p: 3, mb: 3, border: '2px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Narration
            </Typography>
            <Typography variant="body2">{voucher.narration || 'No narration provided'}</Typography>
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
    <Box sx={{
      background: 'rgb(236 242 246)',
      borderRadius: '10px',
      p: { xs: 2, sm: 3, md: 4, lg: 5 },
      height: 'auto',
      width: '92%'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c85de' }}>
          Receipt Vouchers
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

      <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: "100%" }}>
        <CardContent>
          <MaterialReactTable
            columns={columns}
            data={receiptVouchers}
            enableColumnOrdering
            enableColumnResizing
            state={{ isLoading: loading }}
            muiTableContainerProps={{
              sx: {
                maxHeight: 'calc(100vh - 300px)',
                borderRadius: '8px',
                maxWidth: "100%"
              }
            }}
            muiTablePaperProps={{
              elevation: 0,
              sx: {
                boxShadow: 'none',
                border: '1px solid #e0e0e0'
              }
            }}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleEditClick(row.original),
              sx: {
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(44, 133, 222, 0.08)' }
              },
            })}
          />
        </CardContent>
      </Card>

      <NewReceiptVoucher
        isDrawerOpen={isDrawerOpen}
        handleDrawerClose={handleDrawerClose}
        selectedVoucher={selectedVoucher}
        isEditMode={isEditMode}
        refreshData={fetchReceiptVouchers}
        handlePreviewClick={handlePreviewClick}  // Add this line
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this voucher?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <VoucherPreview
        voucher={selectedVoucher}
        onClose={() => setPreviewOpen(false)}
      />

      <ToastContainer position="bottom-right" />
    </Box>
  );
};

const NewReceiptVoucher = ({
  isDrawerOpen,
  handleDrawerClose,
  selectedVoucher,
  isEditMode,
  refreshData,
  handlePreviewClick  

}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [voucherNo, setVoucherNo] = useState("");
  const [dateOfReceiptVoucher, setDateOfReceiptVoucher] = useState(new Date());
  const [drAccount, setDrAccount] = useState(null);
  const [crAccount, setCrAccount] = useState(null);
  const [crAmount, setCrAmount] = useState("");
  const [referenceInvoice, setRefrenceInvoice] = useState(null);
  const [referenceInvoiceOptions, setRefrenceInvoiceOptions] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [instrumentNumber, setInstrumentNumber] = useState("");
  const [instrumnetDate, setInstrumentDate] = useState(new Date());
  const [instrumentBank, setInstrumentBank] = useState("");
  const [instrumentBranch, setInstrumentBranch] = useState("");
  const [narration, setNarration] = useState("");
  const [membersOptions, setMembersOptions] = useState([]);
  const [drAccountOptions, setDrAccountOptions] = useState([]);
  const [crAccountOptions, setCrAccountOptions] = useState([]);
  const [errors, setErrors] = useState({});

  // Initialize form with selected voucher data
  useEffect(() => {
    if (selectedVoucher) {
      setVoucherNo(selectedVoucher.voucherNumber || '');
      setDateOfReceiptVoucher(new Date(selectedVoucher.voucherDate) || new Date());
      setDrAccount(selectedVoucher.drAccount || null);
      setCrAccount(selectedVoucher.crAccount || null);
      setCrAmount(selectedVoucher.crAmount || '');
      setRefrenceInvoice(selectedVoucher.referenceInvoice || null);
      setTransactionType(selectedVoucher.transactionType || '');
      setInstrumentNumber(selectedVoucher.instrumentNumber || '');
      setInstrumentDate(new Date(selectedVoucher.instrumentDate) || new Date());
      setInstrumentBank(selectedVoucher.instrumentBank || '');
      setInstrumentBranch(selectedVoucher.instrumentBranch || '');
      setNarration(selectedVoucher.narration || '');
    } else {
      // Reset form when creating new voucher
      setVoucherNo("");
      setDateOfReceiptVoucher(new Date());
      setDrAccount(null);
      setCrAccount(null);
      setCrAmount("");
      setRefrenceInvoice(null);
      setTransactionType("");
      setInstrumentNumber("");
      setInstrumentDate(new Date());
      setInstrumentBank("");
      setInstrumentBranch("");
      setNarration("");
    }
  }, [selectedVoucher]);

  const debouncedFetchAccounts2 = useMemo(
    () => debounce(async (query) => {
      try {
        const { data } = await axios.get(`http://localhost:8001/Account`, {
          params: { q: query }
        });
        // Filter for groupId 7 on frontend
        setCrAccountOptions(data.filter(account => account.groupId === "7"));
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast.error("Failed to fetch accounts");
      }
    }, 500),
    []
  );

  const debouncedFetchAccounts = useMemo(
    () => debounce(async (query) => {
      try {
        const { data } = await axios.get(`http://localhost:8001/Account`, {
          params: { q: query }
        });
        console.log("data",data);
        // Filter for groupId 3 on frontend
        setDrAccountOptions(data.filter(account => account.groupId === '3'));
      console.log('drAccountOptions',drAccountOptions)
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast.error("Failed to fetch accounts");
      }
    }, 500),
    []
  );

//No Filtering
  // const debouncedFetchAccounts = useMemo(
  //   () => debounce(async (query) => {
  //     try {
  //       const { data } = await axios.get(`http://localhost:8001/Account`, {
  //         params: { q: query }
  //       });
  //       console.log("API data:", data); // Debug raw data
  //       setDrAccountOptions(data); // Set ALL data without filtering
  //     } catch (error) {
  //       console.error("Error details:", error.response?.data || error.message);
  //       toast.error("Failed to fetch accounts");
  //     }
  //   }, 500),
  //   []
  // );
  const debouncedFetchInvoices = useMemo(
    () => debounce(async (query) => {
      try {
        const { data } = await axios.get(`http://localhost:8001/InvoiceHeader`, {
          params: { q: query }
        });
        setRefrenceInvoiceOptions(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Failed to fetch invoices");
      }
    }, 500),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchAccounts2.cancel();
      debouncedFetchAccounts.cancel();
      debouncedFetchInvoices.cancel();
    };
  }, [debouncedFetchAccounts2, debouncedFetchAccounts, debouncedFetchInvoices]);

  // Load initial data
  useEffect(() => {
    debouncedFetchAccounts2('');
    debouncedFetchAccounts('');
    debouncedFetchInvoices('');
  }, []);

  const handleInputChange = (field, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [field]: "" }));
    if (field === "drAccount") setDrAccount(value);
    if (field === "crAccount") setCrAccount(value);
    if (field === "referenceInvoice") setRefrenceInvoice(value);
    if (field === "transactionType") setTransactionType(value);
    if (field === "crAmount") setCrAmount(value);
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {};

    if (!drAccount) {
      newErrors.drAccount = "DR Account is required";
      isValid = false;
    }
    if (!crAccount) {
      newErrors.crAccount = "CR Account is required";
      isValid = false;
    }
    if (!crAmount) {
      newErrors.crAmount = "Amount is required";
      isValid = false;
    } else if (isNaN(crAmount)) {
      newErrors.crAmount = "Amount must be a number";
      isValid = false;
    }
    if (!transactionType) {
      newErrors.transactionType = "Transaction type is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      const payload = {
       // voucherNumber: voucherNo,
        voucherDate: dateOfReceiptVoucher,
        narration: narration,
        drAccount: {
          _id: drAccount._id,
          accountId: drAccount.accountId,
          accountName: drAccount.accountName,
          drOrCr: drAccount.drOrCr
        },
        crAccount: {
          _id: crAccount._id,
          accountId: crAccount.accountId,
          accountName: crAccount.accountName,
          drOrCr: crAccount.drOrCr
        },
        crAmount: Number(crAmount),
        referenceInvoice: referenceInvoice ? {
          _id: referenceInvoice._id,
          invoiceNumber: referenceInvoice.invoiceNumber
        } : null,
        transactionType: transactionType,
        instrumentNumber: instrumentNumber,
        instrumentDate: instrumnetDate,
        instrumentBank: instrumentBank,
        instrumentBranch: instrumentBranch,
      };

      console.log(payload)

      const apiCall = isEditMode
        ? axios.put(`http://localhost:8001/RecieptVoucher/${selectedVoucher._id}`, payload)
        : axios.post("http://localhost:8001/RecieptVoucher", payload);

      await apiCall;
      toast.success(`Voucher ${isEditMode ? 'updated' : 'created'} successfully`);

      refreshData();
      handleDrawerClose();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} voucher`);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   if (!validateFields()) {
  //     return;
  //   }
  
  //   try {
  //     const payload = {
  //       voucherDate: dateOfReceiptVoucher,
  //       narration: narration,
  //       drAccount: {
  //         _id: drAccount._id,
  //         accountId: drAccount.accountId,
  //         accountName: drAccount.accountName,
  //         drOrCr: drAccount.drOrCr
  //       },
  //       crAccount: {
  //         _id: crAccount._id,
  //         accountId: crAccount.accountId,
  //         accountName: crAccount.accountName,
  //         drOrCr: crAccount.drOrCr
  //       },
  //       crAmount: Number(crAmount),
  //       referenceInvoice: referenceInvoice ? {
  //         _id: referenceInvoice._id,
  //         invoiceNumber: referenceInvoice.invoiceNumber
  //       } : null,
  //       transactionType: transactionType,
  //       instrumentNumber: instrumentNumber,
  //       instrumentDate: instrumnetDate,
  //       instrumentBank: instrumentBank,
  //       instrumentBranch: instrumentBranch,
  //     };
  
  //     console.log("Receipt Voucher Payload:", payload);
  
  //     let receiptVoucherResponse;
  
  //     if (isEditMode) {
  //       receiptVoucherResponse = await axios.put(`http://localhost:8001/RecieptVoucher/${selectedVoucher._id}`, payload);
  //     } else {
  //       receiptVoucherResponse = await axios.post("http://localhost:8001/RecieptVoucher", payload);
  //     }
  
  //     const createdVoucher = receiptVoucherResponse.data;
  //     console.log("Created Receipt Voucher Response:", createdVoucher);
  
  //     const voucherPayload = {
  //       VoucherId: createdVoucher._id,
  //       VoucherType: "Receipt",
  //       LedgerId: [drAccount._id, crAccount._id],
  //       VoucherAmount: Number(crAmount),
  //        VoucherNumber:createdVoucher.receiptVoucherNumber
  //     };
  
  //     console.log("Voucher Payload:", voucherPayload);
  
  //     await axios.post("http://localhost:8001/Voucher/", voucherPayload);
  
  //     toast.success(`Voucher ${isEditMode ? 'updated' : 'created'} successfully`);
  
  //     refreshData();
  //     handleDrawerClose();
  //   } catch (error) {
  //     console.error("Error:", error.response?.data || error.message);
  //     toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} voucher`);
  //   }
  // };
  

  const renderDrAccountDropdown = () => (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>DR Account</Typography>
      <Autocomplete
        options={drAccountOptions}
        getOptionLabel={(option) =>
          `${option.accountId || ''} - ${option.accountName || ''}`
        }
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option._id}>
            <Chip
              label={option.accountId}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                mr: 1,
                fontSize: '0.75rem'
              }}
            />
            {option.accountName}
          </Box>
        )}
        value={drAccount}
        onChange={(event, newValue) => handleInputChange("drAccount", newValue)}
        onInputChange={(event, newInputValue) => {
          debouncedFetchAccounts(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search DR Account"
            variant="outlined"
            size="small"
            error={!!errors.drAccount}
            helperText={errors.drAccount}
          />
        )}
        filterOptions={(options) => options}
      />
    </Box>
  );

  const renderCrMemberDropdown = () => (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>CR Member Account</Typography>
      <Autocomplete
        options={crAccountOptions}
        getOptionLabel={(option) =>
          `${option.accountId || ''} - ${option.accountName || ''}`
        }
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option._id}>
            <Chip
              label={option.accountId}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                mr: 1,
                fontSize: '0.75rem'
              }}
            />
            {option.accountName}
          </Box>
        )}
        value={crAccount}
        onChange={(event, newValue) => handleInputChange("crAccount", newValue)}
        onInputChange={(event, newInputValue) => {
          debouncedFetchAccounts2(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search CR Account"
            variant="outlined"
            size="small"
            error={!!errors.crAccount}
            helperText={errors.crAccount}
          />
        )}
        filterOptions={(options) => options}
      />
    </Box>
  );

  const renderInvoiceDropdown = () => (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Reference Invoice</Typography>
      <Autocomplete
        options={referenceInvoiceOptions}
        getOptionLabel={(option) =>
          `${option.invoiceNumber || ''} - ${option.narration || ''}`
        }
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option._id}>
            <Chip
              label={option.invoiceNumber}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                mr: 1,
                fontSize: '0.75rem'
              }}
            />
            {option.narration} (₹{option.amount})
          </Box>
        )}
        value={referenceInvoice}
        onChange={(event, newValue) => handleInputChange("referenceInvoice", newValue)}
        onInputChange={(event, newInputValue) => {
          debouncedFetchInvoices(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search Invoice"
            variant="outlined"
            size="small"
            error={!!errors.referenceInvoice}
            helperText={errors.referenceInvoice}
          />
        )}
        filterOptions={(options) => options}
      />
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={handleDrawerClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "80%", md: "70%", lg: "50%" },
          maxWidth: '100vw',
          borderRadius: "10px 0 0 10px",
          zIndex: 1000,
          height: '100vh',
          overflowY: 'auto'
        }
      }}
    >
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        borderBottom: "1px solid #ccc",
        position: 'sticky',
        top: 0,
        bgcolor: 'background.paper',
        zIndex: 1
      }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {isEditMode ? 'Edit Receipt Voucher' : 'Create Receipt Voucher'}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CloseIcon onClick={handleDrawerClose} sx={{ cursor: "pointer" }} />
        </Box>
      </Box>

      <Box sx={{ p: 3, overflowY: 'auto' }}>
        <Grid container spacing={2}>
          {/* Voucher Number and Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Voucher Number"
              size="small"
              fullWidth
              value={voucherNo}
              onChange={(e) => setVoucherNo(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Voucher Date"
                value={dateOfReceiptVoucher}
                onChange={(newDate) => setDateOfReceiptVoucher(newDate)}
                format="dd/MM/yyyy"
                slotProps={{ textField: { size: "small", fullWidth: true } }}
                sx={{ mb: 2 }}
              />
            </LocalizationProvider>
          </Grid>

          {/* DR Account */}
          <Grid item xs={12}>
            {renderDrAccountDropdown()}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* CR Account and Amount */}
          <Grid item xs={12} sm={8}>
            {renderCrMemberDropdown()}
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Amount (₹)"
              size="small"
              fullWidth
              type="number"
              value={crAmount}
              onChange={(e) => handleInputChange("crAmount", e.target.value)}
              error={!!errors.crAmount}
              helperText={errors.crAmount}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: '₹',
              }}
            />
          </Grid>

          {/* Reference Invoice */}
          <Grid item xs={12}>
            {renderInvoiceDropdown()}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          {/* Transaction Details */}
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Transaction Type"
              size="small"
              fullWidth
              value={transactionType}
              onChange={(e) => handleInputChange("transactionType", e.target.value)}
              error={!!errors.transactionType}
              helperText={errors.transactionType}
              sx={{ mb: 2 }}
            >
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="CHEQUE">Cheque</MenuItem>
              <MenuItem value="NEFT">NEFT</MenuItem>
              <MenuItem value="RTGS">RTGS</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Instrument Number"
              size="small"
              fullWidth
              value={instrumentNumber}
              onChange={(e) => setInstrumentNumber(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Instrument Date"
                value={instrumnetDate}
                onChange={(newDate) => setInstrumentDate(newDate)}
                format="dd/MM/yyyy"
                slotProps={{ textField: { size: "small", fullWidth: true } }}
                sx={{ mb: 2 }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Bank Details */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Bank Name"
              size="small"
              fullWidth
              value={instrumentBank}
              onChange={(e) => setInstrumentBank(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Branch Name"
              size="small"
              fullWidth
              value={instrumentBranch}
              onChange={(e) => setInstrumentBranch(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Narration */}
          <Grid item xs={12}>
            <TextField
              label="Narration"
              multiline
              minRows={3}
              fullWidth
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Grid>

          {/* Action Buttons */}
         
          <Grid item xs={12}>
            
            <Box sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2
            }}>
               {isEditMode && (
            <Button
              variant="outlined"
              startIcon={<PictureAsPdfIcon />}
              onClick={() => handlePreviewClick(selectedVoucher)}
              sx={{
                minWidth: '120px',
                borderRadius: '8px'
              }}
            >
              Preview
            </Button>
          )}
              <Button
                variant="outlined"
                onClick={handleDrawerClose}
                sx={{
                  minWidth: '120px',
                  borderRadius: '8px'
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  minWidth: '120px',
                  borderRadius: '8px',
                  backgroundColor: '#2c85de',
                  '&:hover': { backgroundColor: '#1a6cb3' }
                }}
              >
                {isEditMode ? 'Update' : 'Save'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default ReceiptVoucher;