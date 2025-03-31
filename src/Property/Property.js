import React, { useMemo, useState, useEffect } from 'react';
import {
  Alert,
  useMediaQuery,
  Box,
  Grid,
  Button,
  Typography,
  TextField,
  Drawer,
  Divider,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputLabel,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";



const Property = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [propertyData, setPropertyData] = useState([]); // State to store property data
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer
  const [selectedProperty, setSelectedProperty] = useState(null); // State to store selected property for edit/view
  const [isEditMode, setIsEditMode] = useState(false); // State to toggle edit mode

  // Fetch property data from API
  useEffect(() => {
    fetchPropertyData();
  }, []);

  const fetchPropertyData = async () => {
    try {
      const response = await axios.get('http://localhost:8001/Property/getAll');
      console.log('Fetched Data:', response.data.properties); // Log fetched data
      setPropertyData(response.data.properties);
    } catch (error) {
      console.error('Error fetching property data:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const data = new FormData();

      // Append non-file fields
      Object.keys(formData).forEach((key) => {
        if (key !== "leaseDeedExecutionDoc") {
          data.append(key, formData[key]);
        }
      });

      // Append the file if it exists
      if (formData.leaseDeedExecutionDoc) {
        data.append("leaseDeedExecutionDoc", formData.leaseDeedExecutionDoc);
      }

      if (isEditMode) {
        // Update existing property
        await axios.put(`http://localhost:8001/Property/update/${formData._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        console.log("Function Called")
        await axios.post("http://localhost:8001/Property/create", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchPropertyData(); // Refresh data after submission
      setIsDrawerOpen(false); // Close the drawer
      setSelectedProperty(null); // Reset selected property
      setIsEditMode(false); // Reset edit mode
    } catch (error) {
      console.error("Error submitting property data:", error);
    }
  };

  // Handle delete property
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this property?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8001/Property/${id}`);
      fetchPropertyData(); // Refresh data after deletion
      setIsDrawerOpen(false); // Close the drawer
      setSelectedProperty(null); // Reset selected property
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };


  // Handle row click to view/edit property
  const handleRowClick = (row) => {
    setSelectedProperty(row.original); // Set selected property
    setIsDrawerOpen(true); // Open the drawer
    setIsEditMode(true); // Enable edit mode
  };

  // Columns for the table
  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'srNo',
        header: 'Sr No',
        size: 100,
      },
      {
        accessorKey: 'landAuthority',
        header: 'Land Authority',
        size: 150,
      },
      {
        accessorKey: 'leaseDeedExecution',
        header: 'Lease Deed Executed',
        size: 150,
      },
      {
        accessorKey: 'leasePeriod',
        header: 'Lease Period',
        size: 150,
      },
      {
        accessorKey: 'leaseRentPremium',
        header: 'Lease Rent Premium(Rs)',
        size: 250,
      },
      {
        accessorKey: 'CTSNo',
        header: 'CTS No',
        size: 200,
      },
      {
        accessorKey: 'Village',
        header: 'Village',
        size: 150,
      },
      {
        accessorKey: 'plotNo',
        header: 'Plot No',
        size: 150,
      },
      {
        accessorKey: 'plotArea',
        header: 'Plot Area',
        size: 150,
      },
      {
        accessorKey: 'onEast',
        header: 'Boundary East',
        size: 150,
      },
      {
        accessorKey: 'onWest',
        header: 'Boundary West',
        size: 150,
      },
      {
        accessorKey: 'onNorth',
        header: 'Boundary North',
        size: 200,
      },
      {
        accessorKey: 'onSouth',
        header: 'Boundary South',
        size: 200,
      },
      {
        accessorKey: 'propertyTaxPremiumGSTINBills',
        header: 'Property Tax Premium GSTIN Bill',
        size: 300,
      },
      {
        accessorKey: 'waterBillGenerationDates',
        header: 'Water Bill Generation Dates',
        size: 250,
      },
      {
        accessorKey: 'electricitySupplyServiceProvider',
        header: 'Electricity Supply Service Provider',
        size: 250,
      },
      {
        accessorKey: 'numOfElectricityConnections',
        header: 'Number Of Electricity Connections',
        size: 250,
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 150,
        Cell: ({ row }) => (
          <Box>
            <Button onClick={() => handleRowClick(row)}>Edit</Button>
            <Button onClick={() => handleDelete(row.original._id)}>Delete</Button>
          </Box>
        ),
      },
    ];
  }, []);

  return (
    <Box>
      <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>
        <Box textAlign={'center'}>
          <Typography variant="h4">Property</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={() => setIsDrawerOpen(true)}>
            Add Property
          </Button>
        </Box>

        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={propertyData}
            enableColumnOrdering
            enableColumnResizing
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleRowClick(row),
              sx: { cursor: 'pointer' },
            })}
          />
        </Box>

        {/* Drawer for Property Details */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedProperty(null);
            setIsEditMode(false);
          }}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
              width: isSmallScreen ? '100%' : '650px',
              zIndex: 1000,
            },
          }}
        >
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography m={2} variant="h6">
              <b>{isEditMode ? 'Edit Property' : 'Add Property'}</b>
            </Typography>
            <CloseIcon
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                setIsDrawerOpen(false);
                setSelectedProperty(null);
                setIsEditMode(false);
              }}
            />
          </Box>
          <Divider />

          <PropertyForm
            selectedProperty={selectedProperty}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsDrawerOpen(false);
              setSelectedProperty(null);
              setIsEditMode(false);
            }}
            onDelete={handleDelete}
          />
        </Drawer>
      </Box>
    </Box>
  );
};

// Property Form Component
const PropertyForm = ({ selectedProperty, onSubmit, onCancel, onDelete }) => {
  const [formData, setFormData] = useState(
    selectedProperty || {
      landAuthority: '',
      leaseDeedExecution: '',
      leaseDeedExecutionRegNum: '',
      leaseDeedExecutionDoc: null,
      leaseDeedExecutionDate: '',
      leasePeriod: '',
      leaseRentPremium: '',
      CTSNo: '',
      Village: '',
      plotNo: '',
      plotArea: '',
      onEast: '',
      onWest: '',
      onNorth: '',
      onSouth: '',
      conveyanceDeed: '',
      conveyanceDeedRegNum: '',
      conveyanceDeedDate: '',
      landConveyanceInNameOf: '',
      nonAgricultureTax: '',
      nATaxPremium: '',
      propertyTaxAuthority: '',
      propertyTaxNo: '',
      propertyTaxPremium: '',
      propertyTaxPremiumGSTINBills: '',
      waterSupplyAuthority: '',
      numOfWaterConnections: '',
      waterConnectionNum: '',
      waterBillGenerationDates: '',
      waterBillGenerationDatesGSTINBills: '',
      electricitySupplyServiceProvider: '',
      numOfElectricityConnections: '',
    }
  );

  const [fileUploaded, setFileUploaded] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, leaseDeedExecutionDoc: file });
      setFileUploaded(true); // Indicate a file is uploaded
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2}>
        <Grid container spacing={2} m={3}>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Land Authority</InputLabel>
              <Select
                name="landAuthority"
                value={formData.landAuthority}
                onChange={handleChange}
              >
                <MenuItem value="Private">Private</MenuItem>
                <MenuItem value="FreeHold">FreeHold</MenuItem>
                <MenuItem value="MHADA">MHADA</MenuItem>
                <MenuItem value="CIDCO">CIDCO</MenuItem>
                <MenuItem value="SRA">SRA</MenuItem>
                <MenuItem value="BMC">BMC</MenuItem>
                <MenuItem value="CollectorLand">Collector Land</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Lease Deed Execution</InputLabel>
              <Select
                name="leaseDeedExecution"
                value={formData.leaseDeedExecution}
                onChange={handleChange}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Row 2 */}
          {formData.leaseDeedExecution === "Yes" && (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Lease Deed Execution Reg Num"
                  name="leaseDeedExecutionRegNum"
                  value={formData.leaseDeedExecutionRegNum}
                  onChange={handleChange}
                />
              </Grid>

              {/* File Upload Section */}
              <Grid item xs={6}>
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {fileUploaded ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="body2">
                      {formData.leaseDeedExecutionDoc.name}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => document.getElementById("file-upload").click()}
                    >
                      Re-upload
                    </Button>
                  </Box>
                ) : (
                  <label htmlFor="file-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      style={{ marginTop: "16px", marginBottom: "8px" }}
                    >
                      Upload Lease Deed Document
                    </Button>
                  </label>
                )}
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Lease Deed Execution Date"
                  name="leaseDeedExecutionDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.leaseDeedExecutionDate}
                  onChange={handleChange}
                />
              </Grid>
            </>
          )}

          {/* Row 3 */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Lease Period"
              name="leasePeriod"
              value={formData.leasePeriod}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Lease Rent Premium"
              name="leaseRentPremium"
              value={formData.leaseRentPremium}
              onChange={handleChange}
            />
          </Grid>

          {/* Row 4 */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="CTS Number"
              name="CTSNo"
              value={formData.CTSNo}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Village"
              name="Village"
              value={formData.Village}
              onChange={handleChange}
            />
          </Grid>

          {/* Row 5 */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Plot Number"
              name="plotNo"
              value={formData.plotNo}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Plot Area"
              name="plotArea"
              value={formData.plotArea}
              onChange={handleChange}
            />
          </Grid>

          {/* Row 6 */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="On East"
              name="onEast"
              value={formData.onEast}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="On West"
              name="onWest"
              value={formData.onWest}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Row 7 */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="On North"
              name="onNorth"
              value={formData.onNorth}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="On South"
              name="onSouth"
              value={formData.onSouth}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Row 8 */}
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Conveyance Deed</InputLabel>
              <Select
                name="conveyanceDeed"
                value={formData.conveyanceDeed}
                onChange={handleChange}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {formData.conveyanceDeed === "Yes" && (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Conveyance Deed Reg Num"
                  name="conveyanceDeedRegNum"
                  value={formData.conveyanceDeedRegNum}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Conveyance Deed Date"
                  name="conveyanceDeedDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.conveyanceDeedDate}
                  onChange={handleChange}
                />
              </Grid>
            </>
          )}

          {/* Row 9 */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Land Conveyance In Name Of"
              name="landConveyanceInNameOf"
              value={formData.landConveyanceInNameOf}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Non Agricultural Tax</InputLabel>
              <Select
                name="nonAgricultureTax"
                value={formData.nonAgricultureTax}
                onChange={handleChange}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Row 10 */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="NA Tax Premium"
              name="nATaxPremium"
              value={formData.nATaxPremium}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Property Tax Authority</InputLabel>
              <Select
                name="propertyTaxAuthority"
                value={formData.propertyTaxAuthority}
                onChange={handleChange}
              >
                {["BMC", "CIDCO", "PMC"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Row 11 */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Property Tax Number"
              name="propertyTaxNo"
              value={formData.propertyTaxNo}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Property Tax Premium"
              name="propertyTaxPremium"
              value={formData.propertyTaxPremium}
              onChange={handleChange}
            />
          </Grid>

          {/* Row 12 */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Property Tax Premium GSTIN Bills"
              name="propertyTaxPremiumGSTINBills"
              value={formData.propertyTaxPremiumGSTINBills}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Water Supply Authority</InputLabel>
              <Select
                name="waterSupplyAuthority"
                value={formData.waterSupplyAuthority}
                onChange={handleChange}
              >
                {["BMC", "CIDCO", "PMC"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Row 13 */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Number of Water Connections"
              name="numOfWaterConnections"
              value={formData.numOfWaterConnections}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Water Connection Number"
              name="waterConnectionNum"
              value={formData.waterConnectionNum}
              onChange={handleChange}
            />
          </Grid>

          {/* Row 14 */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Water Bill Generation Dates"
                value={formData.waterBillGenerationDates ? dayjs(formData.waterBillGenerationDates) : null}
                onChange={(newValue) =>
                  handleChange({
                    target: { name: "waterBillGenerationDates", value: newValue ? newValue.toISOString() : null },
                  })
                }
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Water Bill Generation Dates GSTIN Bills"
              name="waterBillGenerationDatesGSTINBills"
              value={formData.waterBillGenerationDatesGSTINBills}
              onChange={handleChange}
            />
          </Grid>

          {/* Row 15 */}
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Electricity Supply Service Provider</InputLabel>
              <Select
                name="electricitySupplyServiceProvider"
                value={formData.electricitySupplyServiceProvider}
                onChange={handleChange}
              >
                {["MAHADISC", "BEST", "TATA Power LTD", "Adani Electricity Mumbai LTD"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="normal"
              label="Number of Electricity Connections"
              name="numOfElectricityConnections"
              value={formData.numOfElectricityConnections}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Box>

      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4} mb={4}>
        <Box>
          <Button variant="contained" onClick={handleFormSubmit}>
            Save
          </Button>
        </Box>
        <Box>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
        </Box>
        {selectedProperty && (
          <Box>
            <Button onClick={() => onDelete(selectedProperty._id)} variant="contained" color="error">
              Delete
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Property;