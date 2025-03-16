import React, { useState, useEffect, useMemo } from 'react';
import {
  Alert,
  Autocomplete,
  useMediaQuery,
  Box,
  Button,
  Typography,
  TextField,
  Drawer,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toWords } from 'number-to-words';
import Textarea from '@mui/joy/Textarea';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';
import { format, parseISO } from 'date-fns';
import html2canvas from 'html2canvas';

const BillInvoice = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [organisation, setOrganisation] = useState({ SocietyName: '' });

  // State for form fields
  const [formValues, setFormValues] = useState({
    memberId: '',
    invoiceNumber: '',
    invoiceDate: null,
    period: '',
    dueDate: null,
    narration: '',
    amtInWords: '',
  });

  const [DetailsData, setDetailsData] = useState([{ serviceId: '', amounts: '' }]);
  const [data, setData] = useState([]);
  const [memberOptions, setMemberOptions] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
    { id: 4, name: 'Bob Brown' },
  ]);

  // State for preview and report generation
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch data from API
  useEffect(() => {
    fetchData();
    fetchMemberOptions();
    fetchOrganisationData();
  }, []);

  // Fetch InvoiceHeader data
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8001/InvoiceHeader');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching InvoiceHeader data:', error);
    }
  };

  const fetchOrganisationData = async () => {
    try {
      const response = await fetch('http://localhost:8001/Organisation');
      const result = await response.json();
      setOrganisation(result); // Assuming the API returns an object with a `SocietyName` field
    } catch (error) {
      console.error('Error fetching organisation data:', error);
    }
  };

  // Fetch DR Member Name options
  const fetchMemberOptions = async () => {
    try {
      const response = await fetch('/members.json'); // Path to your JSON file
      const result = await response.json();
      setMemberOptions(result);
    } catch (error) {
      console.error('Error fetching member options:', error);
    }
  };

  // Fetch the last invoice number
  const fetchLastInvoiceNumber = async () => {
    try {
      const response = await fetch('http://localhost:8001/InvoiceHeader');
      const result = await response.json();
      if (result.length > 0) {
        const lastInvoiceNumber = Math.max(...result.map((item) => parseInt(item.invoiceNumber, 10)));
        return lastInvoiceNumber + 1;
      }
      return 1; // Default to 1 if no invoices exist
    } catch (error) {
      console.error('Error fetching last invoice number:', error);
      return 1;
    }
  };

  // Handle row click for editing
  const handleRowClick = async (row) => {
    try {
      // Fetch InvoiceHeader data
      const headerResponse = await fetch(`http://localhost:8001/InvoiceHeader/${row._id}`);
      const headerData = await headerResponse.json();
      console.log(row._id)

      // Fetch InvoiceDetail data by invoiceId
      const detailsResponse = await fetch(`http://localhost:8001/InvoiceDetail/InvoiceId/${row._id}`);
      const detailsData = await detailsResponse.json();
      console.log("Details Data = ", detailsData)

      // Set form values from InvoiceHeader
      setFormValues({
        memberId: headerData.memberId || '',
        invoiceNumber: headerData.invoiceNumber || '',
        invoiceDate: headerData.invoiceDate ? parseISO(headerData.invoiceDate) : null,
        period: headerData.period || '',
        dueDate: headerData.dueDate ? parseISO(headerData.dueDate) : null,
        narration: headerData.narration || '',
        amtInWords: headerData.amtInWords || '',
      });

      // Ensure we correctly map `serviceIds` and `amounts`
      if (detailsData.length > 0) {
        const itemsData = detailsData.flatMap(detail =>
          detail.serviceIds.map((serviceId, index) => ({
            serviceId: serviceId,
            amounts: detail.amounts[index] || '', // Match index to ensure correct mapping
          }))
        );
        setDetailsData(itemsData);
      } else {
        setDetailsData([{ serviceId: '', amounts: '' }]); // Set default if no details found
      }

      // Set edit state
      setEditData(row);
      setIsEditing(true);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setDetailsData([{ serviceId: '', amounts: '' }]); // Set default value if there's an error
    }
  };


  // Handle form input changes
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...DetailsData];
    updatedItems[index][name] = value;
    setDetailsData(updatedItems);

    // Automatically update amount in words
    const totalAmount = updatedItems.reduce((total, item) => total + parseFloat(item.amounts || 0), 0);
    setFormValues((prev) => ({ ...prev, amtInWords: toWords(totalAmount) }));
  };

  // Add item to the list
  const handleAddItem = () => {
    setDetailsData([...DetailsData, { serviceId: '', amounts: '' }]);
  };

  // Remove item from the list
  const handleRemoveItem = (index) => {
    const updatedItems = DetailsData.filter((_, i) => i !== index);
    setDetailsData(updatedItems);

    // Update amount in words after removal
    const totalAmount = updatedItems.reduce((total, item) => total + parseFloat(item.amounts || 0), 0);
    setFormValues((prev) => ({ ...prev, amtInWords: toWords(totalAmount) }));
  };

  // Handle form field changes
  const handleFormChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // Handle save changes
  const handleSave = async () => {
    const headerPayload = {
      ...formValues,
      invoiceDate: formValues.invoiceDate ? format(formValues.invoiceDate, 'yyyy-MM-dd') : '',
      dueDate: formValues.dueDate ? format(formValues.dueDate, 'yyyy-MM-dd') : '',
    };

    try {
      let headerResponse, headerData;

      if (isEditing) {
        // Update existing InvoiceHeader
        headerResponse = await fetch(`http://localhost:8001/InvoiceHeader/${editData._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(headerPayload),
        });

        headerData = { _id: editData._id }; // Use existing _id for invoice details
      } else {
        // Create new InvoiceHeader
        headerResponse = await fetch('http://localhost:8001/InvoiceHeader', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(headerPayload),
        });

        headerData = await headerResponse.json(); // Get the newly created InvoiceHeader _id
      }

      if (!headerResponse.ok) {
        throw new Error('Failed to save InvoiceHeader');
      }

      console.log('✅ InvoiceHeader Saved:', headerData);

      // Prepare InvoiceDetail Payload (Array of Objects)
      const detailsPayload = {
        invoiceId: headerData._id, // Use ObjectId, not invoiceNumber
        serviceIds: DetailsData.map(item => item.serviceId),
        amounts: DetailsData.map(item => item.amounts.toString()), // Ensure amounts are strings as per schema
      };

      console.log('📤 Sending Invoice Details:', detailsPayload);

      let detailsResponse;
      if (isEditing) {
        // Update existing InvoiceDetails
        detailsResponse = await fetch(`http://localhost:8001/InvoiceDetail/${editData._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(detailsPayload),
        });
      } else {
        // Create new InvoiceDetails
        detailsResponse = await fetch('http://localhost:8001/InvoiceDetail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(detailsPayload),
        });
      }

      if (!detailsResponse.ok) {
        throw new Error('Failed to save InvoiceDetails');
      }

      console.log('✅ InvoiceDetails Saved Successfully');

      fetchData(); // Refresh Data
      setIsEditing(false);
      setEditData(null);
      setIsPreviewOpen(true); // Open preview after saving
      alert('Data submitted successfully!');

      // Clear Form
      setFormValues({
        memberId: '',
        invoiceNumber: '',
        invoiceDate: null,
        period: '',
        dueDate: null,
        narration: '',
        amtInWords: '',
      });
      setDetailsData([{ serviceId: '', amounts: '' }]);
    } catch (error) {
      console.error('❌ Error saving data:', error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8001/InvoiceHeader/${editData.id}`, {
        method: 'DELETE',
      });
      fetchData();
      setIsDrawerOpen(false);
      setIsEditing(false);
      setEditData(null);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setEditData(null);
  };

  // Handle drawer open
  const handleDrawerOpen = async () => {
    const nextInvoiceNumber = await fetchLastInvoiceNumber();
    setFormValues((prev) => ({
      ...prev,
      invoiceNumber: nextInvoiceNumber.toString(),
      invoiceDate: null,
      dueDate: null,
    }));
    setIsDrawerOpen(true);
    setIsEditing(false);
    setEditData(null);
  };

  // Columns for the table
  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', size: 100 },
      { accessorKey: 'memberId', header: 'DR Member Name', size: 150 },
      { accessorKey: 'invoiceNumber', header: 'Bill Number', size: 150 },
      {
        accessorKey: 'invoiceDate', header: 'Bill Date', size: 150, Cell: ({ cell }) =>
          cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy') : '-',
      },
      { accessorKey: 'period', header: 'Period', size: 150 },
      {
        accessorKey: 'dueDate', header: 'Due Date', size: 150, Cell: ({ cell }) =>
          cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy') : '-',
      },
    ],
    []
  );

  const particularsOptions = [
    { id: 1, name: 'Sinking Fund Contribution' },
    { id: 2, name: 'Repair Fund Contribution' },
    { id: 3, name: 'Common Property Tax Contribution' },
    { id: 4, name: 'Water Charges Contribution' },
    { id: 5, name: 'Electricity Charges Contribution' },
    { id: 6, name: 'Service Charges Contribution' },
  ];

  const Receipt = ({ formValues, DetailsData, societyName }) => {

    const totalAmount = DetailsData.reduce((total, item) => total + parseFloat(item.amounts || 0), 0);

    return (
      <Box
        id="secure-receipt"
        sx={{
          padding: 3,
          border: "2px solid #000",
          borderRadius: "10px",
          maxWidth: "650px",
          margin: "auto",
          background: "linear-gradient(135deg, #f3f3f3, #ffffff)",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
          position: "relative",
          userSelect: "none",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            alignSelf: "center",
            transform: "rotate(-30deg)",
            opacity: 0.2,
            fontSize: "40px",
            fontWeight: "bold",
            color: "red",
            pointerEvents: "none",
            mt:"70%",
            ml:"10%"
          }}
        >
          {societyName} Bill
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            mb: 2,
            color: "#0909ff",
          }}
        >
          {societyName} Society Bill
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>DR Member</TableCell>
                <TableCell>{formValues.memberId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Bill No.:</TableCell>
                <TableCell>{formValues.invoiceNumber}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Bill Date:</TableCell>
                <TableCell>{formValues.invoiceDate ? format(formValues.invoiceDate, "dd-MMM-yy") : ""}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Period:</TableCell>
                <TableCell>{formValues.period}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Due Date:</TableCell>
                <TableCell>{formValues.dueDate ? format(formValues.dueDate, "dd-MMM-yy") : ""}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>SR NO.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Particulars</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {DetailsData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.serviceId}</TableCell>
                  <TableCell>{item.amounts}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} align="right" sx={{ fontWeight: "bold" }}>
                  Total Amount
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{totalAmount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography sx={{ mt: 2, fontWeight: "bold" }}>
          Amount in Words: INR {toWords(totalAmount)} Only
        </Typography>

        <Typography sx={{ mt: 2 }}>Narration: {formValues.narration}</Typography>

        <Typography sx={{ mt: 6, textAlign: "right", fontWeight: "bold" }}>
          Authorised Signatory
        </Typography>
      </Box>
    );
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleGenerateReport = () => {
    const receiptElement = document.getElementById('receipt');
    if (receiptElement) {
      html2canvas(receiptElement).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'receipt.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    } else {
      console.error('Receipt element not found');
    }
  };

  return (
    <Box>
      <Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={()=>{
            handleDrawerOpen();
            setFormValues({
              memberId: '',
              invoiceNumber: '',
              invoiceDate: null,
              period: '',
              dueDate: null,
              narration: '',
              amtInWords: '',
            });
            setDetailsData([{ serviceId: '', amounts: '' }]);
          }}>
            Create Bill Invoice
          </Button>
        </Box>

        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={data}
            enableColumnOrdering
            enableColumnResizing
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleRowClick(row.original),
              sx: { cursor: 'pointer' },
            })}
          />
        </Box>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleCancel}
          PaperProps={{
            sx: {
              width: isSmallScreen ? '100%' : '60%',
              borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
              zIndex: 1000,
            },
          }}
          key={isDrawerOpen} // Force re-render on drawer open
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 3, borderBottom: '1px solid #ccc' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {isEditing ? 'Edit Bill Invoice' : 'Create Bill Invoice'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MoreVertIcon sx={{ cursor: 'pointer', color: 'black' }} />
              <CloseIcon onClick={handleCancel} sx={{ cursor: 'pointer' }} />
            </Box>
          </Box>

          <Divider />
          <Box>
            <Box m={2}>
              <Typography>DR Member Name</Typography>
              <Autocomplete
                options={memberOptions}
                sx={{ mt: 2, mb: 2, backgroundColor: '#fff' }}
                size="small"
                onChange={(e, value) => handleFormChange('memberId', value ? value.id : '')}
                value={memberOptions.find((option) => option.id === formValues.memberId) || null}
                getOptionLabel={(option) => option.name || ''}
                renderInput={(params) => <TextField {...params} placeholder="Member Name" />}
                isClearable={true}
              />
            </Box>

            <Box display={'flex'} alignItems="center" gap={2}>
              <Box flex={1} m={2}>
                <Box>
                  <Typography>Bill Number</Typography>
                  <TextField
                    type="number"
                    size="small"
                    margin="normal"
                    placeholder="Bill Number"
                    fullWidth
                    value={formValues.invoiceNumber}
                    onChange={(e) => handleFormChange('invoiceNumber', e.target.value)}
                  />
                </Box>

                <Box>
                  <Typography>Period</Typography>
                  <TextField
                    size="small"
                    type="text"
                    margin="normal"
                    onChange={(e) => handleFormChange('period', e.target.value)}
                    value={formValues.period}
                    placeholder="Period"
                    fullWidth
                  />
                </Box>
              </Box>

              <Box flex={1} m={2}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box>
                      <Typography>Bill Date</Typography>
                      <DatePicker
                        format="dd/MM/yyyy"
                        sx={{ width: '100%' }}
                        value={formValues.invoiceDate}
                        onChange={(newValue) => handleFormChange('invoiceDate', newValue)}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </Box>
                  </LocalizationProvider>
                </Box>

                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box>
                      <Typography>Due Date</Typography>
                      <DatePicker
                        format="dd/MM/yyyy"
                        sx={{ width: '100%' }}
                        value={formValues.dueDate}
                        onChange={(newValue) => handleFormChange('dueDate', newValue)}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </Box>
                  </LocalizationProvider>
                </Box>
              </Box>
            </Box>

            <Box m={2}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SR NO.</TableCell>
                      <TableCell>Particulars</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {DetailsData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Autocomplete
                            options={particularsOptions}
                            value={particularsOptions.find((option) => option.id === item.serviceId) || null}
                            onChange={(e, newValue) => {
                              const updatedItems = [...DetailsData];
                              updatedItems[index].serviceId = newValue ? newValue.id : '';
                              setDetailsData(updatedItems);
                            }}
                            getOptionLabel={(option) => option.name || ''}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Particulars"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            name="amounts"
                            placeholder="Amount"
                            value={item.amounts}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          {DetailsData.length > 1 && (
                            <Button variant="contained" onClick={() => handleRemoveItem(index)}>
                              Remove
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
                        Sub-Total
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        {DetailsData.reduce((total, item) => total + parseFloat(item.amounts || 0), 0)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Button variant="contained" color="primary" onClick={handleAddItem} sx={{ mt: 2 }}>
                Add Item
              </Button>
            </Box>

            <Box mt={2} m={2}>
              <Typography sx={{ fontWeight: 'bold' }}>Amount in Words:</Typography>
              <TextField
                size="small"
                type="text"
                name="amtInWords"
                value={formValues.amtInWords}
                fullWidth
                onChange={(e) => handleFormChange('amtInWords', e.target.value)}
              />
            </Box>

            <Box m={2}>
              <Typography>Narration:</Typography>
              <Textarea
                minRows={3}
                value={formValues.narration}
                onChange={(e) => handleFormChange('narration', e.target.value)}
                placeholder="Narration"
                fullWidth
              />
            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} m={1}>
            {isPreviewOpen && (
              <Box sx={{ mt: 2 }}>
                <Receipt formValues={formValues} DetailsData={DetailsData} societyName={organisation[0].SocietyName} />
                <Button onClick={handleGenerateReport} variant="contained" sx={{ mt: 2 }}>
                  Generate Report
                </Button>
              </Box>
            )}

            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} m={1}>
              {isEditing && (
                <Button onClick={handleDelete} variant="contained" color="error">
                  Delete
                </Button>
              )}
              <Button onClick={handleSave} variant="contained">
                Save
              </Button>
              <Button onClick={handlePreview} variant="contained">
                Preview Report
              </Button>
              <Button onClick={handleCancel} variant="outlined">
                Cancel
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default BillInvoice;