import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, TextField, Drawer, Divider, FormControl,
    Select, MenuItem, CircularProgress, useMediaQuery,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

// Data extracted from the Excel file
const groups = [
    { groupCode: '1', groupName: 'CASH IN HAND', typeCode: 'B' },
    { groupCode: '2', groupName: 'SUNDRY CREDITORS', typeCode: 'B' },
    { groupCode: '3', groupName: 'SUNDRY DEBTORS', typeCode: 'B' },
    { groupCode: '4', groupName: 'ACCOUNTS PAYABLES', typeCode: 'B' },
    { groupCode: '5', groupName: 'ACCOUNTS RECEIVABLE', typeCode: 'B' },
    { groupCode: '6', groupName: 'ADMIN. EXPENSES', typeCode: 'P' },
    { groupCode: '7', groupName: 'BANK ACCOUNTS', typeCode: 'B' },
    { groupCode: '8', groupName: 'BANK OCC ACCOUNTS', typeCode: 'B' },
    { groupCode: '9', groupName: 'CAPITAL ACCOUNT (FIXED)', typeCode: 'B' },
    { groupCode: '10', groupName: 'CURRENT ASSETS', typeCode: 'B' },
    { groupCode: '11', groupName: 'CURRENT LIABILITIES', typeCode: 'B' },
    { groupCode: '12', groupName: 'DEPOSITS (ASSETS)', typeCode: 'B' },
    { groupCode: '13', groupName: 'DUTIES/TAXES', typeCode: 'P' },
    { groupCode: '14', groupName: 'EXPENDITURE ACCOUNT', typeCode: 'P' },
    { groupCode: '15', groupName: 'EXPENSES (DIRECT)', typeCode: 'P' },
    { groupCode: '16', groupName: 'EXPENSES (INDIRECT)', typeCode: 'P' },
    { groupCode: '17', groupName: 'FIXED ASSETS', typeCode: 'B' },
    { groupCode: '18', groupName: 'IMMOVABLE PROPERTIES', typeCode: 'B' },
    { groupCode: '19', groupName: 'INCOME / REVENUE', typeCode: 'P' },
    { groupCode: '20', groupName: 'INVESTMENTS', typeCode: 'B' },
    { groupCode: '21', groupName: 'LOANS & ADVANCES(ASSETS)', typeCode: 'B' },
    { groupCode: '22', groupName: 'LOANS (LIABILITIES)', typeCode: 'B' },
    { groupCode: '23', groupName: 'MFG./TRADING EXPENSES', typeCode: 'T' },
    { groupCode: '24', groupName: 'PROVISIONS', typeCode: 'T' },
    { groupCode: '25', groupName: 'PURCHASE', typeCode: 'T' },
    { groupCode: '26', groupName: 'RESERVE & SURPLUS', typeCode: 'B' },
    { groupCode: '27', groupName: 'SALARY & ALLOWANCE', typeCode: 'P' },
    { groupCode: '28', groupName: 'SALES', typeCode: 'T' },
    { groupCode: '29', groupName: 'SECURED LOANS', typeCode: 'B' },
    { groupCode: '30', groupName: 'CLOSING STOCK', typeCode: 'B' },
    { groupCode: '31', groupName: 'TEMPERORY ACCOUNT', typeCode: 'NULL' },
    { groupCode: '32', groupName: 'CAPITAL ACCOUNT (CURRENT)', typeCode: 'B' },
    { groupCode: '33', groupName: 'ADVANCES TO SUPPLIERS', typeCode: 'P' },
    { groupCode: '34', groupName: 'ADVANCES TO WORKERS', typeCode: 'P' },
    { groupCode: '35', groupName: 'A.Y.', typeCode: 'NULL' },
    { groupCode: '36', groupName: 'ADV.INCOME TAX', typeCode: 'P' },
    { groupCode: '37', groupName: 'PLA EXCISE', typeCode: 'P' },
    { groupCode: '38', groupName: 'LABOUR CHARGES', typeCode: 'P' },
    { groupCode: '39', groupName: 'OTHER SALES', typeCode: 'T' },
    { groupCode: '40', groupName: 'MOTOR EXPENSES', typeCode: 'P' },
    { groupCode: '41', groupName: 'OTHER ADMINISTRATIVE EXP.', typeCode: 'P' },
    { groupCode: '42', groupName: 'ADVANCES', typeCode: 'B' },
    { groupCode: '43', groupName: 'INDIRECT EXPENSES', typeCode: 'P' },
    { groupCode: '44', groupName: 'PERSONNEL COST', typeCode: 'P' },
    { groupCode: '45', groupName: 'BUILDING EXPENSES', typeCode: 'P' },
    { groupCode: '46', groupName: 'COMMUNICATION EXPENSES', typeCode: 'P' },
    { groupCode: '47', groupName: 'CONSULTANT & TRAINING', typeCode: 'P' },
    { groupCode: '48', groupName: 'MOTOR EXPENSES', typeCode: 'P' },
    { groupCode: '49', groupName: 'OPENING STOCK', typeCode: 'T' },
    { groupCode: '50', groupName: 'GROSS PROFIT', typeCode: 'T' },
    { groupCode: '51', groupName: 'NET PROFIT & LOSS', typeCode: 'P' },
    { groupCode: '52', groupName: 'PROFIT & LOSS', typeCode: 'B' },
    { groupCode: '53', groupName: 'PROVISION PAYABLE', typeCode: 'B' },
];

const subgroups = [
    { subGroupCode: '1', subGroupName: 'ADVANCES_OFFICE CONSTRUCTION' },
    { subGroupCode: '2', subGroupName: 'SUNDRY DEBTORS' },
    { subGroupCode: '3', subGroupName: 'EXPENSES PAYABLE' },
    { subGroupCode: '4', subGroupName: 'SUNDRY CREDITORS' },
    { subGroupCode: '5', subGroupName: 'ADVANCE FOR EXPENSES' },
    { subGroupCode: '6', subGroupName: 'DEPOSITS (ASSETS)' },
    { subGroupCode: '7', subGroupName: 'LOANS & ADVANCES (ASSET)' },
    { subGroupCode: '8', subGroupName: 'BUILDING EXPENSES' },
    { subGroupCode: '9', subGroupName: 'ADVERTISEMENT EXPENSES' },
    { subGroupCode: '10', subGroupName: 'COMMUNICATION EXPENSES' },
    { subGroupCode: '11', subGroupName: 'CONSULTANT & TRAINING' },
    { subGroupCode: '12', subGroupName: 'MOTOR EXPENSES' },
    { subGroupCode: '13', subGroupName: 'OTHER ADMINISTRATIVE EXPENSES' },
    { subGroupCode: '14', subGroupName: 'PERSONNEL COST' },
    { subGroupCode: '15', subGroupName: 'TRAVELLING & ENTERTAINMENT EXPENSES' },
    { subGroupCode: '16', subGroupName: 'SHIPPING & PACKAGING CHARGES' },
];

const AccountLedger = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        accountName: '',
        groupId: '',
        subGroupId: '',
        opening: '',
        drOrCr: '',
        typeCode: '',
    });

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

    const handleRowClick = async (row) => {
        try {
            const response = await axios.get(`http://localhost:8001/Account/${row._id}`);
            setSelectedRow(response.data);
            setFormData(response.data);
            setIsDrawerOpen(true);
        } catch (error) {
            console.error('Error fetching account details:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            if (selectedRow) {
                await axios.patch(`http://localhost:8001/Account/${selectedRow._id}`, formData);
            } else {
                await axios.post('http://localhost:8001/Account', formData);
            }
            fetchAccounts();
            setFormData({
                accountName: '',
                groupId: '',
                subGroupId: '',
                opening: '',
                drOrCr: '',
                typeCode: '',
            });
            setSelectedRow(null);
            setIsDrawerOpen(false);
        } catch (error) {
            console.error('Error saving account:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await axios.delete(`http://localhost:8001/Account/${selectedRow._id}`);
            fetchAccounts();
            setIsDrawerOpen(false);
        } catch (error) {
            console.error('Error deleting account:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        { accessorKey: 'accountId', header: 'Account ID' },
        { accessorKey: 'accountName', header: 'Account Name' },
        {
            accessorKey: 'groupId',
            header: 'Group',
            Cell: ({ cell }) => {
                const group = groups.find(g => g.groupCode === cell.getValue());
                return group ? group.groupName : cell.getValue();
            }
        },
        {
            accessorKey: 'subGroupId',
            header: 'Sub Group',
            Cell: ({ cell }) => {
                const subgroup = subgroups.find(sg => sg.subGroupCode === cell.getValue());
                return subgroup ? subgroup.subGroupName : cell.getValue();
            }
        },
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
                        setIsDrawerOpen(true);
                        setFormData({
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

                <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}
                    PaperProps={{
                        sx: {
                            width: isSmallScreen ? '100%' : '40%',
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
                                MenuProps={{
                                    PaperProps: {
                                        sx: { maxHeight: 200, maxWidth: 250 } // Adjust height and width
                                    }
                                }}
                            >
                                <MenuItem sx={{ height: 40 }} value="" disabled>Select Group</MenuItem>
                                {groups.map(group => (
                                    <MenuItem key={group.groupCode} value={group.groupCode} sx={{ height: 40 }}>
                                        {group.groupName} ({group.groupCode})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <Select
                                name="subGroupId"
                                value={formData.subGroupId}
                                onChange={handleInputChange}
                                displayEmpty
                                MenuProps={{
                                    PaperProps: {
                                        sx: { maxHeight: 200, maxWidth: 250 } // Adjust height and width
                                    }
                                }}
                            >
                                <MenuItem sx={{ height: 40 }} value="" disabled>Select Sub Group</MenuItem>
                                {subgroups.map(subgroup => (
                                    <MenuItem key={subgroup.subGroupCode} value={subgroup.subGroupCode} sx={{ height: 40 }}>
                                        {subgroup.subGroupName} ({subgroup.subGroupCode})
                                    </MenuItem>
                                ))}
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
                            type="number"
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