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

const BillInvoice = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

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

  const [items, setItems] = useState([{ description: '', amount: '' }]);
  const [data, setData] = useState([]);
  const [memberOptions, setMemberOptions] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
    { id: 4, name: 'Bob Brown' },
  ]);

  // Fetch data from API
  useEffect(() => {
    fetchData();
    fetchMemberOptions();
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
      const response = await fetch(`http://localhost:8001/InvoiceHeader/${row.id}`);
      const itemsData = await response.json();

      setEditData(row);
      setIsEditing(true);
      setIsDrawerOpen(true);
      setFormValues({
        memberId: row.memberId || '',
        invoiceNumber: row.invoiceNumber || '',
        invoiceDate: row.invoiceDate ? parseISO(row.invoiceDate) : null,
        period: row.period || '',
        dueDate: row.dueDate ? parseISO(row.dueDate) : null,
        narration: row.narration || '',
        amtInWords: row.amtInWords || '',
      });
      setItems(itemsData || [{ description: '', amount: '' }]);
    } catch (error) {
      console.error('Error fetching InvoiceDetail data:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index][name] = value;
    setItems(updatedItems);

    // Automatically update amount in words
    const totalAmount = updatedItems.reduce((total, item) => total + parseFloat(item.amount || 0), 0);
    setFormValues((prev) => ({ ...prev, amtInWords: toWords(totalAmount) }));
  };

  // Add item to the list
  const handleAddItem = () => {
    setItems([...items, { description: '', amount: '' }]);
  };

  // Remove item from the list
  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);

    // Update amount in words after removal
    const totalAmount = updatedItems.reduce((total, item) => total + parseFloat(item.amount || 0), 0);
    setFormValues((prev) => ({ ...prev, amtInWords: toWords(totalAmount) }));
  };

  // Handle form field changes
  const handleFormChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // Handle save changes
  const handleSave = async () => {

console.log(editData.id)

    const headerPayload = {
      ...formValues,
      invoiceDate: formValues.invoiceDate ? format(formValues.invoiceDate, 'yyyy-MM-dd') : '',
      dueDate: formValues.dueDate ? format(formValues.dueDate, 'yyyy-MM-dd') : '',
    };

    try {
      let headerResponse;
      if (isEditing) {
        // Update existing record
        headerResponse = await fetch(`http://localhost:8001/InvoiceHeader/${editData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(headerPayload),
        });
      } else {
        headerResponse = await fetch('http://localhost:8001/InvoiceHeader', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(headerPayload),
        });
      }

      const headerData = await headerResponse.json();
      const headerId = headerData.id;

      // Save InvoiceDetail items
      await fetch('http://localhost:8001/InvoiceDetail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          items.map((item) => ({
            ...item,
            headerId,
          }))
        ),
      });

      fetchData();
      setIsDrawerOpen(false);
      setIsEditing(false);
      setEditData(null);
    } catch (error) {
      console.error('Error saving data:', error);
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
      { accessorKey: 'invoiceDate', header: 'Bill Date', size: 150 },
      { accessorKey: 'period', header: 'Period', size: 150 },
      { accessorKey: 'dueDate', header: 'Due Date', size: 150 },
    ],
    []
  );

  return (
    <Box>
      <Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}>
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
                    type="number"
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
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="text"
                            name="description"
                            placeholder="Particulars"
                            value={item.description}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          {items.length > 1 && (
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
                        {items.reduce((total, item) => total + parseFloat(item.amount || 0), 0)}
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
            {isEditing && (
              <Button onClick={handleDelete} variant="contained" color="error">
                Delete
              </Button>
            )}
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
            <Button onClick={handleCancel} variant="outlined">
              Cancel
            </Button>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default BillInvoice;