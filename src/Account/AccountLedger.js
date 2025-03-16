import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, TextField, Drawer, Divider, FormControl,
    Select, MenuItem, CircularProgress, useMediaQuery,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

const AccountLedger = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Submission status

    const [formData, setFormData] = useState({
        accountId: '',
        accountName: '',
        groupId: '',
        subGroupId: '',
        opening: '',
        drOrCr: '',
        typeCode: '',
    });

    // Fetch all accounts
    const fetchAccounts = async () => {
        try {
            const response = await axios.get('http://localhost:8001/Account');
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    // Handle row click for editing
    const handleRowClick = async (row) => {
        console.log(row)
        try {
            const response = await axios.get(`http://localhost:8001/Account/${row._id}`);
            setSelectedRow(response.data);
            setFormData(response.data);
            setIsDrawerOpen(true);
        } catch (error) {
            console.error('Error fetching account details:', error);
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Save or update account with animation
    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            if (selectedRow) {
                await axios.patch(`http://localhost:8001/Account/${selectedRow._id}`, formData);
            } else {
                await axios.post('http://localhost:8001/Account', formData);
            }

            fetchAccounts(); // Refresh data

            // Reset form after success
            setFormData({
                accountId: '',
                accountName: '',
                groupId: '',
                subGroupId: '',
                opening: '',
                drOrCr: '',
                typeCode: '',
            });

            setSelectedRow(null);
            setIsDrawerOpen(false); // Close drawer after edit success
        } catch (error) {
            console.error('Error saving account:', error);
        } finally {
            setIsSubmitting(false); // Hide animation
        }
    };

    // Delete account
    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await axios.delete(`http://localhost:8001/Account/${selectedRow._id}`);
            fetchAccounts(); // Refresh data
            setIsDrawerOpen(false);
        } catch (error) {
            console.error('Error deleting account:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Table columns
    const columns = [
        { accessorKey: 'accountId', header: 'Account ID' },
        { accessorKey: 'accountName', header: 'Account Name' },
        { accessorKey: 'groupId', header: 'Group ID' },
        { accessorKey: 'subGroupId', header: 'Sub Group ID' },
        { accessorKey: 'opening', header: 'Opening Balance' },
        { accessorKey: 'drOrCr', header: 'Debit/Credit' },
        { accessorKey: 'typeCode', header: 'Type Code' },
    ];

    return (
        <Box>
            <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>
                <Box textAlign={'center'}>
                    <Typography variant='h4'>Ledger Account Management</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
                    <Button variant="contained" onClick={() => {
                        setIsDrawerOpen(true); setFormData({
                            accountId: '',
                            accountName: '',
                            groupId: '',
                            subGroupId: '',
                            opening: '',
                            drOrCr: '',
                            typeCode: '',
                        });
                    }}>Add Ledger Account</Button>
                </Box>

                <Box mt={4}>
                    <MaterialReactTable
                        columns={columns}
                        data={accounts}
                        enableColumnOrdering
                        enableColumnResizing
                        muiTableBodyRowProps={({ row }) => ({
                            onClick: () => handleRowClick(row.original),
                            sx: { cursor: 'pointer' },
                        })}
                    />
                </Box>

                {/* Drawer for Add/Edit Account */}
                <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
                    PaperProps={{
                        sx: {
                            width: isSmallScreen ? '100%' : '60%',
                            borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
                            zIndex: 1000,
                        },
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6"><b>{selectedRow ? 'Edit Account' : 'Add Account'}</b></Typography>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => setIsDrawerOpen(false)} />
                    </Box>
                    <Divider />

                    <Box sx={{ p: 2 }}>
                        <TextField
                            name="accountName"
                            label="Account Name"
                            placeholder="Enter account name"
                            value={formData.accountName}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />

                        <FormControl fullWidth margin="normal">
                            <Select
                                name="groupId"
                                value={formData.groupId}
                                onChange={handleInputChange}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>Select Group ID</MenuItem>
                                <MenuItem value="Group I">Group I</MenuItem>
                                <MenuItem value="Group II">Group II</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <Select
                                name="subGroupId"
                                value={formData.subGroupId}
                                onChange={handleInputChange}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>Select Sub Group ID</MenuItem>
                                <MenuItem value="SubGroup I">SubGroup I</MenuItem>
                                <MenuItem value="SubGroup II">SubGroup II</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            name="opening"
                            label="Opening Balance"
                            placeholder="Enter opening balance"
                            value={formData.opening}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />

                        <FormControl fullWidth margin="normal">
                            <Select
                                name="drOrCr"
                                value={formData.drOrCr}
                                onChange={handleInputChange}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>Select Debit/Credit</MenuItem>
                                <MenuItem value="DR">Debit</MenuItem>
                                <MenuItem value="CR">Credit</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <Select
                                name="typeCode"
                                value={formData.typeCode}
                                onChange={handleInputChange}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>Select Type Code</MenuItem>
                                <MenuItem value="Balance Sheet">Balance Sheet</MenuItem>
                                <MenuItem value="Profit and Loss Account">Profit and Loss Account</MenuItem>
                                <MenuItem value="Trading Account">Trading Account</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                        <Button variant="contained" onClick={handleSave} disabled={isSubmitting}>
                            {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save'}
                        </Button>
                        {selectedRow && <Button variant="contained" color="error" onClick={handleDelete} disabled={isSubmitting}>
                            {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Delete'}
                        </Button>}
                        <Button variant="outlined" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                    </Box>
                </Drawer>
            </Box>
        </Box>
    );
};

export default AccountLedger;