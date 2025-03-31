import React, { useState, useEffect, useMemo } from 'react';
import {
  Alert,
  useMediaQuery,
  Box,
  Button,
  Typography,
  TextField,
  Drawer,
  Divider,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { format, parse } from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';
import { MaterialReactTable } from 'material-react-table';

const Managingcommittee = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // State for form data
  const [formData, setFormData] = useState({
    _id: null, // Use _id for consistency
    name: '',
    position: '',
    contactNumber: '',
    email: '',
    address: '',
    wingId: '',
    flatId: '',
    startDate: null,
    endDate: null,
    isActive: true,
  });

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wings, setWings] = useState([]);
  const [flats, setFlats] = useState([]);

  // State for table data
  const [tableData, setTableData] = useState([]);

  // State for form mode (add or edit)
  const [isEditMode, setIsEditMode] = useState(false);

  // State for search
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch board members, wings, and flats from the API on component mount
  useEffect(() => {
    fetchBoardMembers();
    fetchWings();
    fetchFlats();
  }, []);

  // Fetch wings from the API
  const fetchWings = async () => {
    try {
      const response = await axios.get('http://localhost:8001/wings'); // Adjust API endpoint
      setWings(response.data);
    } catch (error) {
      console.error('Error fetching wings:', error);
    }
  };

  // Fetch flats from the API
  const fetchFlats = async () => {
    try {
      const response = await axios.get('http://localhost:8001/UnitType'); // Adjust API endpoint
      setFlats(response.data);
    } catch (error) {
      console.error('Error fetching flats:', error);
    }
  };

  // Fetch board members from the API
  const fetchBoardMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8001/BoardMembers'); // Replace with your API endpoint
      setTableData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch board members');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (for both add and edit)
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Format dates to YYYY-MM-DD for API
      const payload = {
        ...formData,
        startDate: formData.startDate ? format(new Date(formData.startDate), 'yyyy-MM-dd') : null,
        endDate: formData.endDate ? format(new Date(formData.endDate), 'yyyy-MM-dd') : null,
      };

      let response;
      if (isEditMode) {
        // Update existing record
        response = await axios.patch(`http://localhost:8001/BoardMembers/${formData._id}`, payload);
      } else {
        // Add new record
        response = await axios.post('http://localhost:8001/BoardMembers', payload);
      }

      if (response.status === 200 || response.status === 201) {
        fetchBoardMembers(); // Refresh the table data
        handleDrawerClose(); // Close the drawer
      }
    } catch (err) {
      setError(err.message || 'Failed to save board member');
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  // Handle row click to open form in edit mode
  const handleRowClick = (row) => {
    setFormData({
      _id: row._id, // Use _id for consistency
      name: row.name,
      position: row.position,
      contactNumber: row.contactNumber,
      email: row.email,
      address: row.address,
      wingId: row.wingId,
      flatId: row.flatId,
      startDate: row.startDate ? new Date(row.startDate) : null,
      endDate: row.endDate ? new Date(row.endDate) : null,
      isActive: row.isActive,
    });

    setIsEditMode(true); // Set to edit mode
    setIsDrawerOpen(true); // Open drawer
  };

  // Handle delete functionality
  const handleDelete = async () => {

    const isConfirmed = window.confirm("Are you sure you want to delete this record ?");
    if (!isConfirmed) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`http://localhost:8001/BoardMembers/${formData._id}`);
      if (response.status === 200) {
        fetchBoardMembers(); // Refresh the table data
        handleDrawerClose(); // Close the drawer
      }
    } catch (err) {
      setError(err.message || 'Failed to delete board member');
    } finally {
      setLoading(false);
    }
  };

  // Function to get Wing Name by ID
  const getWingNameById = (wingId) => {
    if (!wingId) return '-';
    const wing = wings.find((wing) => wing._id === wingId);
    return wing ? wing.name : '-';
  };

  // Function to get Flat Number by ID
  const getFlatNumberById = (flatId) => {
    if (!flatId) return '-';
    const flat = flats.find((flat) => flat._id === flatId);
    return flat ? flat.name : '-';
  };

  // Columns for Material React Table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'position',
        header: 'Position',
      },
      {
        accessorKey: 'contactNumber',
        header: 'Contact Number',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'wingId',
        header: 'Wing Name',
        Cell: ({ cell }) => {
          const wingId = cell.getValue();
          console.log('Wing ID:', wingId); // Debugging
          return getWingNameById(wingId);
        },
      },
      {
        accessorKey: 'flatId',
        header: 'Flat Number',
        Cell: ({ cell }) => {
          const flatId = cell.getValue();
          console.log('Flat ID:', flatId); // Debugging
          return getFlatNumberById(flatId);
        },
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        Cell: ({ cell }) =>
          cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy') : '-',
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        Cell: ({ cell }) =>
          cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy') : '-',
      },
      {
        accessorKey: 'isActive',
        header: 'Is Active',
        Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
      },
    ],
    [wings, flats] // Add wings and flats as dependencies
  );

  // for add Board Of Director drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsEditMode(false); // Set to add mode
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setFormData({
      _id: null,
      name: '',
      position: '',
      contactNumber: '',
      email: '',
      address: '',
      wingId: '',
      flatId: '',
      startDate: null,
      endDate: null,
      isActive: true,
    });
  };

  return (
    <Box>
      <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>
        <Box textAlign={'center'}>
          <Typography variant="h4">Board Of Directors</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          <Button variant="contained" onClick={handleDrawerOpen}>
            Add Board Of Director
          </Button>
        </Box>

        {/* Display error message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Search Bar
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box> */}

        {/* Material React Table */}
        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={tableData}
            enableColumnOrdering
            enablePagination
            enableSorting
            enableRowActions={false} // Disable row actions
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleRowClick(row.original), // Open edit form on row click
              sx: { cursor: 'pointer' }, // Change cursor to pointer
            })}
            state={{
              globalFilter: searchQuery,
            }}
            onGlobalFilterChange={setSearchQuery}
          />
        </Box>

        {/* Drawer for adding/editing Board Of Director */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
              width: isSmallScreen ? '100%' : '650px',
              zIndex: 1000,
            },
          }}
        >
          <Box
            sx={{
              background: theme.palette.primary.main,
              color: theme.palette.common.white,
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {isEditMode ? 'Edit Board Member' : 'Add Board Member'}
            </Typography>
            <CloseIcon
              sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              onClick={handleDrawerClose}
            />
          </Box>

          <Divider />

          <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small" margin="normal" variant="outlined">
                  <InputLabel>Position</InputLabel>
                  <Select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    label="Position"
                  >
                    <MenuItem value="President">President</MenuItem>
                    <MenuItem value="Vice President">Vice President</MenuItem>
                    <MenuItem value="Secretary">Secretary</MenuItem>
                    <MenuItem value="Treasurer">Treasurer</MenuItem>
                    <MenuItem value="Member">Member</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="contactNumber"
                  label="Contact Number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  name="wingId"
                  label="Wing Name"
                  value={formData.wingId}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  margin="normal"
                  variant="outlined"
                >
                  {wings.map((wing) => (
                    <MenuItem key={wing._id} value={wing._id}>
                      {wing.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  name="flatId"
                  label="Flat Number"
                  value={formData.flatId}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  margin="normal"
                  variant="outlined"
                >
                  {flats.map((flat) => (
                    <MenuItem key={flat._id} value={flat._id}>
                      {flat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={formData.startDate}
                    onChange={(date) => handleDateChange('startDate', date)}
                    format="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        margin="normal"
                        variant="outlined"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={(date) => handleDateChange('endDate', date)}
                    format="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        margin="normal"
                        variant="outlined"
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              padding: 2,
              background: theme.palette.grey[100],
              borderTop: `1px solid ${theme.palette.divider}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            {isEditMode ? (
              <>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                Save
              </Button>
            )}
            <Button onClick={handleDrawerClose} variant="outlined">
              Cancel
            </Button>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default Managingcommittee;