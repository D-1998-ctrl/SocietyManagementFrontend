import React, { useMemo, useState, useEffect } from 'react';
import {
    Alert, useMediaQuery, Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox, Menu
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from "@mui/material/styles";
import axios from 'axios'; // For API calls

const Meeting = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // State for managing meetings data
    const [meetings, setMeetings] = useState([]);
    const [selectedMeeting, setSelectedMeeting] = useState(null); // For editing
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // For add/edit drawer
    const [formData, setFormData] = useState({
        meetingType: '',
        dateFrom: null,
        dateTo: null,
        description: '',
        place: '',
        comments: '',
    });

    // Fetch meetings data from the API
    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await axios.get('http://localhost:8001/Meeting');
            setMeetings(response.data);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    };

    // Handle row click for editing
    const handleRowClick = (row) => {
        setSelectedMeeting(row);
        setFormData({
            meetingType: row.meetingType,
            dateFrom: new Date(row.dateFrom),
            dateTo: new Date(row.dateTo),
            description: row.description,
            place: row.place,
            comments: row.comments,
        });
        setIsDrawerOpen(true);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle date changes
    const handleDateChange = (name, date) => {
        setFormData({ ...formData, [name]: date });
    };

    // Handle form submission (for both create and update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedMeeting) {
                // Update existing meeting
                await axios.patch(`http://localhost:8001/Meeting/${selectedMeeting._id}`, formData);
            } else {
                // Create new meeting
                await axios.post('http://localhost:8001/Meeting', formData);
            }
            fetchMeetings(); // Refresh the meetings list
            setIsDrawerOpen(false); // Close the drawer
            setSelectedMeeting(null); // Reset selected meeting
            setFormData({ // Reset form data
                meetingType: '',
                dateFrom: null,
                dateTo: null,
                description: '',
                place: '',
                comments: '',
            });
        } catch (error) {
            console.error('Error saving meeting:', error);
        }
    };

    // Handle delete meeting
    const handleDeleteMeeting = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this record?");
        if (!isConfirmed) return;
        try {
            await axios.delete(`http://localhost:8001/Meeting/${id}`);
            fetchMeetings(); // Refresh the meetings list
            setIsDrawerOpen(false); // Close the drawer
            setSelectedMeeting(null); // Reset selected meeting
        } catch (error) {
            console.error('Error deleting meeting:', error);
        }
    };

    // Format date to display only the part before "T"
    const formatDate = (dateString) => {
        return dateString ? dateString.split('T')[0] : '';
    };

    // Table columns
    const columns = useMemo(() => [
        { accessorKey: 'srNo', header: 'Sr No', size: 100 },
        { accessorKey: 'meetingType', header: 'Meeting Type', size: 150 },
        {
            accessorKey: 'dateFrom',
            header: 'Date From',
            size: 150,
            Cell: ({ row }) => formatDate(row.original.dateFrom), // Format date
        },
        {
            accessorKey: 'dateTo',
            header: 'Date To',
            size: 150,
            Cell: ({ row }) => formatDate(row.original.dateTo), // Format date
        },
        { accessorKey: 'place', header: 'Place', size: 150 },
        { accessorKey: 'description', header: 'Description', size: 150 },
        { accessorKey: 'comments', header: 'Comments', size: 150 },
        {
            id: 'actions',
            header: 'Actions',
            size: 150,
            Cell: ({ row }) => (
                <Button onClick={() => handleDeleteMeeting(row.original._id)}>Delete</Button>
            ),
        },
    ], []);

    return (
        <Box>
            <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>
                <Box textAlign={'center'}>
                    <Typography variant='h4'>Meeting</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Button variant="contained" onClick={() => setIsDrawerOpen(true)}>Add New Meeting</Button>
                </Box>

                <Box mt={4}>
                    <MaterialReactTable
                        columns={columns}
                        data={meetings}
                        enableColumnOrdering
                        enableColumnResizing
                        muiTableBodyRowProps={({ row }) => ({
                            onClick: () => handleRowClick(row.original), // Open edit form on row click
                            sx: { cursor: 'pointer' }, // Change cursor to pointer
                        })}
                    />
                </Box>

                {/* Drawer for Add/Edit Meeting */}
                <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={() => {
                        setIsDrawerOpen(false);
                        setSelectedMeeting(null);
                        setFormData({
                            meetingType: '',
                            dateFrom: null,
                            dateTo: null,
                            description: '',
                            place: '',
                            comments: '',
                        });
                    }}
                    PaperProps={{
                        sx: {
                            borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                            width: isSmallScreen ? "100%" : "650px",
                            zIndex: 1000,
                        },
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography m={2} variant="h6"><b>{selectedMeeting ? 'Edit Meeting' : 'Add New Meeting'}</b></Typography>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => setIsDrawerOpen(false)} />
                    </Box>
                    <Divider />

                    <Box display="flex" alignItems="center" gap={2}>
                        <Box flex={1}>
                            <Box m={2}>
                                <Typography>Meeting Type</Typography>
                                <FormControl fullWidth size="small" margin="normal">
                                    <Select
                                        name="meetingType"
                                        value={formData.meetingType}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="Residential">Residential</MenuItem>
                                        <MenuItem value="Commercial">Commercial</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box m={2}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Typography>Date From</Typography>
                                    <DatePicker
                                        value={formData.dateFrom}
                                        onChange={(date) => handleDateChange('dateFrom', date)}
                                        renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Box>

                            <Box m={2}>
                                <Typography>Description</Typography>
                                <TextField
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    size="small"
                                    margin="normal"
                                    placeholder="Description"
                                    fullWidth
                                />
                            </Box>
                        </Box>

                        <Box flex={1}>
                            <Box m={2}>
                                <Typography>Place</Typography>
                                <TextField
                                    name="place"
                                    value={formData.place}
                                    onChange={handleInputChange}
                                    size="small"
                                    margin="normal"
                                    placeholder="Place"
                                    fullWidth
                                />
                            </Box>

                            <Box m={2}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Typography>Date To</Typography>
                                    <DatePicker
                                        value={formData.dateTo}
                                        onChange={(date) => handleDateChange('dateTo', date)}
                                        renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                    />
                                </LocalizationProvider>
                            </Box>

                            <Box m={2}>
                                <Typography>Comments</Typography>
                                <TextField
                                    name="comments"
                                    value={formData.comments}
                                    onChange={handleInputChange}
                                    size="small"
                                    margin="normal"
                                    placeholder="Comments"
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4}>
                        <Button variant="contained" onClick={handleSubmit}>Save</Button>
                        <Button variant="outlined" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                        {selectedMeeting && ( // Show Delete button only in edit mode
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDeleteMeeting(selectedMeeting._id)}
                            >
                                Delete
                            </Button>
                        )}
                    </Box>
                </Drawer>
            </Box>
        </Box>
    );
};

export default Meeting;