


import React, { useMemo, useState } from 'react';
import { Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import Accounttable from "../Account/Accounttable.json"
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
const AccountLedger = () => {


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
    return (
        <Box>
            <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>
                <Box textAlign={'center'}>
                    <Typography variant='h4'>Ledger Account Management</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 3,mt:4  }}>
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
                        sx: { width: '40%' },
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography m={2} variant="h6"><b>Add Account Ledger</b></Typography>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
                    </Box>
                    <Divider />


                    <Box>




                        {/* <Box display="flex" alignItems="center" gap={2}>
                            <Box flex={1}>
                                <Box m={2} >
                                    <Typography>Group</Typography>
                                    <FormControl fullWidth size="small" margin="normal">

                                        <Select>
                                            <MenuItem value="Home">Group1</MenuItem>
                                            <MenuItem value="Office">Group2</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box m={2} >
                                    <Typography>Account Name</Typography>
                                    <TextField size="small" margin="normal" placeholder='Account Name'  />
                                </Box>
                            </Box>


                            <Box flex={1}>
                                <Box m={2}>
                                    <Typography> Sub Group</Typography>
                                    <FormControl fullWidth size="small" margin="normal">

                                        <Select>
                                            <MenuItem value="Home">Subgroup1</MenuItem>
                                            <MenuItem value="Office">Subgroup2</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box >
                                    <Typography>Year Opening</Typography>
                                    <TextField size="small" margin="normal" placeholder='Year Opening'/>
                                </Box>
                            </Box>
                        </Box> */}

                        <Box display="flex" alignItems="center" gap={2}>
                            <Box flex={1} m={2}>
                                <Box>
                                    <Typography>Group</Typography>
                                    <FormControl fullWidth size="small" margin="normal">

                                        <Select>
                                            <MenuItem value="Private">Group 1</MenuItem>
                                            <MenuItem value="FreeHold">Group 2</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box mt={1}>
                                    <Typography>Lease Period</Typography>
                                    <TextField size="small" margin="normal" placeholder="Lease Period" fullWidth />
                                </Box>

                                <Box mt={1}>
                                    <Typography>CTS No</Typography>
                                    <TextField size="small" margin="normal" placeholder="CTS No" fullWidth />
                                </Box>

                                <Box mt={1}>
                                    <Typography>Plot No</Typography>
                                    <TextField size="small" margin="normal" placeholder="Plot No" fullWidth />
                                </Box>

                                <Typography><b>Boundary Details</b></Typography>

                                <Box mt={1}>
                                    <Typography>On East</Typography>
                                    <TextField size="small" margin="normal" placeholder="On East" fullWidth />
                                </Box>
                                <Box mt={1}>
                                    <Typography>On North</Typography>
                                    <TextField size="small" margin="normal" placeholder="On North" fullWidth />
                                </Box>
                                <Box mt={1}>
                                    <Typography>Conveyance Deed in Favour of Society</Typography>
                                    <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                        <Select>
                                            <MenuItem value="Private">Yes</MenuItem>
                                            <MenuItem value="FreeHold">No</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box mt={1}>
                                    <Typography>NA Tax Premium Rs</Typography>
                                    <TextField size="small" margin="normal" placeholder="NA Tax Premium Rs" fullWidth />
                                </Box>

                                <Box mt={1}>
                                    <Typography>Property Tax No</Typography>
                                    <TextField size="small" margin="normal" placeholder="Property Tax No" fullWidth />
                                </Box>

                                <Box mt={1}>
                                    <Typography>Water Supply Authority</Typography>
                                    <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                        <Select>
                                            <MenuItem value="Private">BMC</MenuItem>
                                            <MenuItem value="FreeHold">CIDCO</MenuItem>
                                            <MenuItem value="FreeHold">PMC</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>


                                <Box mt={1}>
                                    <Typography>Water Connection No</Typography>
                                    <TextField size="small" margin="normal" placeholder="Water Connection No" fullWidth />
                                </Box>

                                <Box mt={1}>
                                    <Typography>Electricity Supply Service Provider</Typography>
                                    <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                        <Select>
                                            <MenuItem value="Private">MAHADISCOM</MenuItem>
                                            <MenuItem value="FreeHold">BEST</MenuItem>
                                            <MenuItem value="FreeHold">Tata Power Ltd</MenuItem>
                                            <MenuItem value="FreeHold">Adani Electricity Mumbai Ltd</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box mt={1}>
                                    <Typography>Water Connection No</Typography>
                                    <TextField size="small" margin="normal" placeholder="Water Connection No" fullWidth />
                                </Box>
                            </Box>








                            <Box flex={1} m={2}>
                                <Box>
                                    <Typography>Lease Deed Executed</Typography>
                                    <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                        <Select>
                                            <MenuItem value="Private">Yes</MenuItem>
                                            <MenuItem value="FreeHold">No</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>


                                <Box mt={1}>
                                    <Typography>Lease Rent Premium Rs</Typography>
                                    <TextField size="small" margin="normal" placeholder="Lease Rent Premium Rs" fullWidth />
                                </Box>

                                <Box mt={1}>
                                    <Typography>Village</Typography>
                                    <TextField size="small" margin="normal" placeholder="Village" fullWidth />
                                </Box>

                                <Box mt={1}>
                                    <Typography>Plot Area</Typography>
                                    <TextField size="small" margin="normal" placeholder="Plot Area" fullWidth />
                                </Box>

                                <Typography>&nbsp;</Typography>

                                <Box mt={1}>
                                    <Typography>On West</Typography>
                                    <TextField size="small" margin="normal" placeholder="On West" fullWidth />
                                </Box>

                                <Box mt={1}>
                                    <Typography>On South</Typography>
                                    <TextField size="small" margin="normal" placeholder="On South" fullWidth />
                                </Box>
                                <Box mt={1}>
                                    <Typography>Non Agricultural Tax</Typography>
                                    <TextField size="small" margin="normal" placeholder="Non Agricultural Tax" fullWidth />
                                </Box>

                                <Box mt={1}>
                                    <Typography>Property Tax Authority</Typography>
                                    <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                        <Select>
                                            <MenuItem value="Private">BMC</MenuItem>
                                            <MenuItem value="FreeHold">CIDCO</MenuItem>
                                            <MenuItem value="FreeHold">PMC</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box mt={1}>
                                    <Typography>Property Tax Premium GSTIN Bills</Typography>
                                    <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                        <Select>
                                            <MenuItem value="Private">Yes</MenuItem>
                                            <MenuItem value="FreeHold">No</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box mt={1}>
                                    <Typography>No of Water Connections</Typography>
                                    <FormControl fullWidth size="small" margin="normal" placeholder='No of Water Connections'>

                                        <Select>
                                            <MenuItem value="Private">1</MenuItem>
                                            <MenuItem value="FreeHold">2</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box mt={1}>
                                    <Typography>Water Bill Generation Dates</Typography>
                                    <TextField size="small" margin="normal" placeholder="Water Bill Generation Dates" fullWidth />
                                </Box>

                                <Box mt={1}>
                                    <Typography>No Electricity Connection</Typography>
                                    <TextField size="small" margin="normal" placeholder="No Electricity Connection" fullWidth />
                                </Box>

                                <Box mt={1}>
                                    <Typography>Water Bill Generation Dates GSTIN Bills</Typography>
                                    <TextField size="small" margin="normal" placeholder="Water Bill Generation Dates GSTIN Bills" fullWidth />
                                </Box>

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


                {/* drawer for Property Details */}
                <Drawer
                    anchor="right"
                    open={Open}
                    onClose={handlefindMemberDrawerClose}
                    PaperProps={{
                        sx: { width: '40%' }, // Set the width here
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography m={2} variant="h6"><b>Property Details</b></Typography>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handlefindMemberDrawerClose} />
                    </Box>
                    <Divider />


                    <Box display="flex" alignItems="center" gap={2}>
                        <Box flex={1} m={2}>
                            <Box>
                                <Typography>Land Authority</Typography>
                                <FormControl fullWidth size="small" margin="normal">

                                    <Select>
                                        <MenuItem value="Private">Private</MenuItem>
                                        <MenuItem value="FreeHold">FreeHold</MenuItem>
                                        <MenuItem value="MHADA">MHADA</MenuItem>
                                        <MenuItem value="CIDCO">CIDCO</MenuItem>
                                        <MenuItem value="SRA">SRA</MenuItem>
                                        <MenuItem value="BMC">BMC</MenuItem>
                                        <MenuItem value="CollectorLand">Collector Land</MenuItem>

                                    </Select>
                                </FormControl>
                            </Box>

                            <Box mt={1}>
                                <Typography>Lease Period</Typography>
                                <TextField size="small" margin="normal" placeholder="Lease Period" fullWidth />
                            </Box>

                            <Box mt={1}>
                                <Typography>CTS No</Typography>
                                <TextField size="small" margin="normal" placeholder="CTS No" fullWidth />
                            </Box>

                            <Box mt={1}>
                                <Typography>Plot No</Typography>
                                <TextField size="small" margin="normal" placeholder="Plot No" fullWidth />
                            </Box>

                            <Typography><b>Boundary Details</b></Typography>

                            <Box mt={1}>
                                <Typography>On East</Typography>
                                <TextField size="small" margin="normal" placeholder="On East" fullWidth />
                            </Box>
                            <Box mt={1}>
                                <Typography>On North</Typography>
                                <TextField size="small" margin="normal" placeholder="On North" fullWidth />
                            </Box>
                            <Box mt={1}>
                                <Typography>Conveyance Deed in Favour of Society</Typography>
                                <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                    <Select>
                                        <MenuItem value="Private">Yes</MenuItem>
                                        <MenuItem value="FreeHold">No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box mt={1}>
                                <Typography>NA Tax Premium Rs</Typography>
                                <TextField size="small" margin="normal" placeholder="NA Tax Premium Rs" fullWidth />
                            </Box>

                            <Box mt={1}>
                                <Typography>Property Tax No</Typography>
                                <TextField size="small" margin="normal" placeholder="Property Tax No" fullWidth />
                            </Box>

                            <Box mt={1}>
                                <Typography>Water Supply Authority</Typography>
                                <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                    <Select>
                                        <MenuItem value="Private">BMC</MenuItem>
                                        <MenuItem value="FreeHold">CIDCO</MenuItem>
                                        <MenuItem value="FreeHold">PMC</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>


                            <Box mt={1}>
                                <Typography>Water Connection No</Typography>
                                <TextField size="small" margin="normal" placeholder="Water Connection No" fullWidth />
                            </Box>

                            <Box mt={1}>
                                <Typography>Electricity Supply Service Provider</Typography>
                                <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                    <Select>
                                        <MenuItem value="Private">MAHADISCOM</MenuItem>
                                        <MenuItem value="FreeHold">BEST</MenuItem>
                                        <MenuItem value="FreeHold">Tata Power Ltd</MenuItem>
                                        <MenuItem value="FreeHold">Adani Electricity Mumbai Ltd</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box mt={1}>
                                <Typography>Water Connection No</Typography>
                                <TextField size="small" margin="normal" placeholder="Water Connection No" fullWidth />
                            </Box>
                        </Box>








                        <Box flex={1} m={2}>
                            <Box>
                                <Typography>Lease Deed Executed</Typography>
                                <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                    <Select>
                                        <MenuItem value="Private">Yes</MenuItem>
                                        <MenuItem value="FreeHold">No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>


                            <Box mt={1}>
                                <Typography>Lease Rent Premium Rs</Typography>
                                <TextField size="small" margin="normal" placeholder="Lease Rent Premium Rs" fullWidth />
                            </Box>

                            <Box mt={1}>
                                <Typography>Village</Typography>
                                <TextField size="small" margin="normal" placeholder="Village" fullWidth />
                            </Box>

                            <Box mt={1}>
                                <Typography>Plot Area</Typography>
                                <TextField size="small" margin="normal" placeholder="Plot Area" fullWidth />
                            </Box>

                            <Typography>&nbsp;</Typography>

                            <Box mt={1}>
                                <Typography>On West</Typography>
                                <TextField size="small" margin="normal" placeholder="On West" fullWidth />
                            </Box>

                            <Box mt={1}>
                                <Typography>On South</Typography>
                                <TextField size="small" margin="normal" placeholder="On South" fullWidth />
                            </Box>
                            <Box mt={1}>
                                <Typography>Non Agricultural Tax</Typography>
                                <TextField size="small" margin="normal" placeholder="Non Agricultural Tax" fullWidth />
                            </Box>

                            <Box mt={1}>
                                <Typography>Property Tax Authority</Typography>
                                <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                    <Select>
                                        <MenuItem value="Private">BMC</MenuItem>
                                        <MenuItem value="FreeHold">CIDCO</MenuItem>
                                        <MenuItem value="FreeHold">PMC</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box mt={1}>
                                <Typography>Property Tax Premium GSTIN Bills</Typography>
                                <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                    <Select>
                                        <MenuItem value="Private">Yes</MenuItem>
                                        <MenuItem value="FreeHold">No</MenuItem>

                                    </Select>
                                </FormControl>
                            </Box>

                            <Box mt={1}>
                                <Typography>No of Water Connections</Typography>
                                <FormControl fullWidth size="small" margin="normal" placeholder='No of Water Connections'>

                                    <Select>
                                        <MenuItem value="Private">1</MenuItem>
                                        <MenuItem value="FreeHold">2</MenuItem>

                                    </Select>
                                </FormControl>
                            </Box>

                            <Box mt={1}>
                                <Typography>Water Bill Generation Dates</Typography>
                                <TextField size="small" margin="normal" placeholder="Water Bill Generation Dates" fullWidth />
                            </Box>

                            <Box mt={1}>
                                <Typography>No Electricity Connection</Typography>
                                <TextField size="small" margin="normal" placeholder="No Electricity Connection" fullWidth />
                            </Box>

                            <Box mt={1}>
                                <Typography>Water Bill Generation Dates GSTIN Bills</Typography>
                                <TextField size="small" margin="normal" placeholder="Water Bill Generation Dates GSTIN Bills" fullWidth />
                            </Box>

                        </Box>
                    </Box>




                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4} mb={4}>
                        <Box>
                            <Button variant='contained'>Save </Button>
                        </Box>

                        <Box>
                            <Button onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
                        </Box>
                    </Box>
                </Drawer>


            </Box>
        </Box>
    );
};

export default AccountLedger;


