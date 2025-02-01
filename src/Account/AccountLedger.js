


import React, { useMemo, useState } from 'react';
import { Alert, useMediaQuery, Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import Accounttable from "../Account/Accounttable.json"
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import subgrouptable from './subgrouptable.json'
import { useTheme } from "@mui/material/styles";



const AccountLedger = () => {
const theme = useTheme();
const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'srNo',
                header: 'Sr No',
                size: 100,
            },
            {
                accessorKey: 'Group',
                header: 'Group',
                size: 150,
            },
            {
                accessorKey: 'subGroup',
                header: 'Sub Group',
                size: 150,
            },
            {
                accessorKey: 'AccountName',
                header: 'Account Name',
                size: 150,
            },
            {
                accessorKey: 'yearOpening',
                header: 'Year Opening',
                size: 250,
            },
            {
                accessorKey: 'TypeCode',
                header: 'Type Code',
                size: 200,
            },
            {
                accessorKey: 'DebitcreditCard',
                header: 'Debit/credit Card',
                size: 150,
            },


            {
                id: 'actions',
                header: 'Actions',
                size: 150,

            },
        ];
    }, []);



    const Subgroupcolumns = useMemo(() => {
        return [
            {
                accessorKey: 'srNo',
                header: 'Sr No',
                size: 100,
            },
            {
                accessorKey: 'Groupnames',
                header: 'Group Name',
                size: 150,
            },
            {
                accessorKey: 'subGroupcode',
                header: 'Sub Group Code',
                size: 150,
            },
            {
                accessorKey: 'subGroupName',
                header: 'Sub Group Name',
                size: 150,
            },

            {
                id: 'actions',
                header: 'Actions',
                size: 150,

            },
        ];
    }, []);

    // const data = [
    //     {
    //         srNo: 1,
    //         Group: 'Municipal Authority',
    //         subGroup: 'Yes',
    //         AccountName: '99 years',
    //         yearOpening: '500000',
    //         TypeCode: '12345',
    //         DebitcreditCard: 'Springfield',

    //     },
    // ];



    // for Add Ledger Account drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    //for Add Sub Group drawer

    const [Open, setOpen] = useState(false);
    const handlefindMemberDrawerOpen = () => {
        setOpen(true);
    };

    const handlefindMemberDrawerClose = () => {
        setOpen(false);
    };


    //for Add new Sub Group drawer

    const [Opennewsubgruop, setOpenNewSubgroup] = useState(false);
    const handleOpennewsubgruopDrawerOpen = () => {
        setOpenNewSubgroup(true);
    };

    const handleOpennewsubgruopDrawerClose = () => {
        setOpenNewSubgroup(false);
    };
    return (
        <Box>
            <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>
                <Box textAlign={'center'}>
                    <Typography variant='h4'>Ledger Account Management</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
                    <Button variant="contained" onClick={handleDrawerOpen}>Add Ledger Account</Button>
                    <Button variant='contained' onClick={handlefindMemberDrawerOpen}>Add Sub Group</Button>
                    {/* <Button variant='contained' >Add Filter</Button> */}
                </Box>

                <Box mt={4}>
                    <MaterialReactTable
                        columns={columns}
                        data={Accounttable}

                        enableColumnOrdering
                        enableColumnResizing
                    />
                </Box>
                {/* drawer for Structure Details  */}
                <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={handleDrawerClose}
                    PaperProps={{
                        sx: { borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                            width: isSmallScreen ? "100%" : "650px",
                            zIndex: 1000, },
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography m={2} variant="h6"><b>Ledger Account Management</b></Typography>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
                    </Box>
                    <Divider />


                    <Box>

                        <Box m={2}>
                            <Box>
                                <Typography>Group</Typography>
                                <FormControl fullWidth size="small" margin="normal">

                                    <Select>
                                        <MenuItem value="Private">Group 1</MenuItem>
                                        <MenuItem value="FreeHold">Group 2</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>


                            <Box>
                                <Typography>Account Name</Typography>
                                <TextField size="small" margin="normal" placeholder='Account Name' fullWidth />
                            </Box>


                            <Box>
                                <Typography>Type Code</Typography>
                                <FormControl fullWidth size="small" margin="normal">

                                    <Select>
                                        <MenuItem value="Private">Balance Sheet</MenuItem>
                                        <MenuItem value="FreeHold">Profit-loss</MenuItem>
                                        <MenuItem value="FreeHold">Business</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>



                        </Box>








                        <Box flex={1} m={2}>
                            <Box>
                                <Typography>Sub Group</Typography>
                                <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                    <Select>
                                        <MenuItem value="Private">Sub group1</MenuItem>
                                        <MenuItem value="FreeHold">Sub group2</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>


                            <Box>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Box  >
                                        <Typography > Year Opening</Typography>
                                        <DatePicker

                                            format="dd/MM/yyyy"
                                            sx={{ width: "100%", }}
                                            renderInput={(params) => <TextField {...params} size="small" />}
                                        />
                                    </Box>
                                </LocalizationProvider>
                            </Box>


                            <Box>
                                <Typography>Type Code</Typography>
                                <FormControl fullWidth size="small" margin="normal">

                                    <Select>
                                        <MenuItem value="Private">Card1</MenuItem>
                                        <MenuItem value="FreeHold">Card2</MenuItem>

                                    </Select>
                                </FormControl>
                            </Box>




                        </Box>



                    </Box>


                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4}>
                        <Box>
                            <Button variant='contained'>Serch </Button>
                        </Box>

                        <Box>
                            <Button onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
                        </Box>
                    </Box>
                </Drawer>


                {/* drawer for subgrouptable */}
                <Drawer
                    anchor="right"
                    open={Open}
                    onClose={handlefindMemberDrawerClose}
                    PaperProps={{
                        sx: { borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                            width: isSmallScreen ? "100%" : "650px",
                            zIndex: 1000, }, // Set the width here
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography m={2} variant="h6"><b>Manage Sub Group</b></Typography>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handlefindMemberDrawerClose} />
                    </Box>
                    <Divider />



                    <Box m={2}>


                        <Box>
                            <Button onClick={handleOpennewsubgruopDrawerOpen} variant='contained'>Add New Sub Group</Button>
                        </Box>
                        <Box mt={4}>
                            <MaterialReactTable
                                columns={Subgroupcolumns}
                                data={subgrouptable}

                                enableColumnOrdering
                                enableColumnResizing
                            />
                        </Box>
                    </Box>






                    {/* 
                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4} mb={4}>
                        <Box>
                            <Button variant='contained'>Save </Button>
                        </Box>

                        <Box>
                            <Button onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
                        </Box>
                    </Box> */}
                </Drawer>
                {/* drawer for add new  subgruop */}

                <Drawer
                    anchor="right"
                    open={Opennewsubgruop}
                    onClose={handleOpennewsubgruopDrawerClose}
                    PaperProps={{
                        sx: { borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                            width: isSmallScreen ? "100%" : "650px",
                            zIndex: 1000, },
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography m={2} variant="h6"><b>Ledger Account Management</b></Typography>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleOpennewsubgruopDrawerClose} />
                    </Box>
                    <Divider />


                    <Box>



                        <Box >
                            <Typography>Group</Typography>
                            <FormControl fullWidth size="small" margin="normal">

                                <Select>
                                    <MenuItem value="Group1">Group1</MenuItem>
                                    <MenuItem value="Group2">Group2</MenuItem>

                                </Select>
                            </FormControl>
                        </Box>





                        <Box>
                            <Typography>Sub Group Code</Typography>
                            <TextField size="small" margin="normal" placeholder='Sub Group Code' fullWidth />
                        </Box>


                        <Box>
                            <Typography>Sub Group Name</Typography>
                            <TextField size="small" margin="normal" placeholder='Sub Group Name' fullWidth />
                        </Box>



                    </Box>


                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4}>
                        <Box>
                            <Button variant='contained'>Save </Button>
                        </Box>

                        <Box>
                            <Button onClick={handleOpennewsubgruopDrawerClose} variant='outlined'>Cancel </Button>
                        </Box>
                    </Box>
                </Drawer>


            </Box>
        </Box>
    );
};

export default AccountLedger;


