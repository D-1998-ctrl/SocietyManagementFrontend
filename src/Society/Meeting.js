
import React, { useMemo, useState } from 'react';
import { Box, Button, Typography, TextField, Drawer, Divider, FormControl, Select, MenuItem, InputLabel, Checkbox, Menu } from '@mui/material';
import { MaterialReactTable, } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import meetingdata from './meetingdata.json'

const Meeting = () => {


    const columns = useMemo(() => {
        return [
            {
                accessorKey: 'srNo',
                header: 'Sr No',
                size: 100,
            },
            {
                accessorKey: 'MeetingType',
                header: 'Meeting Type',
                size: 150,
            },
            {
                accessorKey: 'Datefrom',
                header: 'Date from',
                size: 150,
            },
            {
                accessorKey: 'DateTo',
                header: 'Date To',
                size: 150,
            },
            {
                accessorKey: 'Place',
                header: 'Place',
                size: 150,
            },
            {
                accessorKey: 'Description',
                header: 'Description',
                size: 150,
            },
            {
                accessorKey: 'Comments',
                header: 'Comments',
                size: 150,
            },

            // {
            //     id: 'actions',
            //     header: 'Actions',
            //     size: 150,

            // },
        ];
    }, []);




    const mettingsubjectcolumns = useMemo(() => {
        return [
            {
                accessorKey: 'srNo',
                header: 'Sr No',
                size: 100,
            },
            {
                accessorKey: 'SubjectType',
                header: 'Subject Type',
                size: 150,
            },
            {
                accessorKey: 'Subject',
                header: 'Subject',
                size: 150,
            },

            {
                id: 'actions',
                header: 'Actions',
                size: 150,

            },
        ];
    }, []);

    const mettingsubjectdata = [
        {
            srNo: 1,
            SubjectType: 'Discussion',
            Subject: 'Annual Budget Planning',
            actions: 'Edit/Delete',
        },
    ];


    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // for add new meeting drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);

    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };


    // for Meeting Subject drawer
    const [meetingSubjectDrawerOpen, setMeetingSubjectDrawerOpen] = useState(false);
    const handleMeetingSubjectDrawerOpen = () => {
        setMeetingSubjectDrawerOpen(true);
        handleMenuClose(true)
    };

    const handleMeetingSubjectDrawerClose = () => {
        setMeetingSubjectDrawerOpen(false);
    };

    // for Meeting officer drawer
    const [meetingOfficerDrawerOpen, setMeetingOfficerDrawerOpen] = useState(false);
    const handleMeetingOfficerDrawerOpen = () => {
        setMeetingOfficerDrawerOpen(true);
        handleMenuClose(true)
    };

    const handleMeetingOfficerDrawerClose = () => {
        setMeetingOfficerDrawerOpen(false);
    };

    // for Meeting Resolution drawer
    const [meetingResolutionDrawerOpen, setMeetingResolutionDrawerOpen] = useState(false);
    const handleMeetingResolutionDrawerOpen = () => {
        setMeetingResolutionDrawerOpen(true);
        handleMenuClose(true)
    };

    const handleMeetingResolutionDrawerClose = () => {
        setMeetingResolutionDrawerOpen(false);
    };


    //for Serch meeting drawer

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
                    <Typography variant='h4'>Meeting</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    <Button variant="contained" onClick={handleDrawerOpen}> Add New Meeting</Button>
                    {/* <Button variant='contained' onClick={handlefindMemberDrawerOpen}>Serch Metting</Button> */}
                </Box>

                <Box mt={4}>
                    <MaterialReactTable
                        columns={columns}
                        data={meetingdata}

                        enableColumnOrdering
                        enableColumnResizing
                    />
                </Box>


                {/* drawer for  Add New Meeting  */}
                <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={handleDrawerClose}
                    PaperProps={{
                        sx: { width: '40%' },
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography m={2} variant="h6"><b> Add New Meeting</b></Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MoreVertIcon sx={{ cursor: 'pointer' }} onClick={handleMenuOpen} />
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
                        </Box>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMeetingSubjectDrawerOpen} >Meeting Subject</MenuItem>
                            <MenuItem onClick={handleMeetingOfficerDrawerOpen} >Meeting Officer</MenuItem>
                            <MenuItem onClick={handleMeetingResolutionDrawerOpen} >Meeting Resolution</MenuItem>
                        </Menu>
                    </Box>
                    <Divider />



                    <Divider />

                    <Box display="flex" alignItems="center" gap={2}>
                        <Box flex={1}>
                            <Box m={2}>
                                <Typography>Meeting Type</Typography>
                                <FormControl fullWidth size="small" margin="normal">

                                    <Select>
                                        <MenuItem value="Home">Residential</MenuItem>
                                        <MenuItem value="Office">Commercial</MenuItem>

                                    </Select>
                                </FormControl>
                            </Box>

                            <Box m={2}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Box  >
                                        <Typography > Date From</Typography>
                                        <DatePicker

                                            format="dd/MM/yyyy"
                                            sx={{ width: "100%", }}
                                            renderInput={(params) => <TextField {...params} size="small" />}
                                        />
                                    </Box>
                                </LocalizationProvider>
                            </Box>
                            <Box m={2}>
                                <Typography>Description</Typography>
                                <TextField size="small" margin="normal" placeholder="Description" fullWidth />
                            </Box>
                        </Box>


                        <Box flex={1}>
                            <Box m={2}>
                                <Typography>Place</Typography>
                                <TextField size="small" margin="normal" placeholder="Place" fullWidth />
                            </Box>


                            <Box m={2}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Box  >
                                        <Typography > Date To</Typography>
                                        <DatePicker

                                            format="dd/MM/yyyy"
                                            sx={{ width: "100%", }}
                                            renderInput={(params) => <TextField {...params} size="small" />}
                                        />
                                    </Box>
                                </LocalizationProvider>
                            </Box>

                            <Box m={2}>
                                <Typography>Comments</Typography>
                                <TextField size="small" margin="normal" placeholder="Comments" fullWidth />
                            </Box>
                        </Box>
                    </Box>


                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4}>
                        <Box>
                            <Button variant='contained'>Save </Button>
                        </Box>

                        <Box>
                            <Button onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
                        </Box>
                    </Box>
                </Drawer>
                {/* drawer for meeting subject */}
                <Drawer
                    anchor="right"
                    open={meetingSubjectDrawerOpen}
                    onClose={handleMeetingSubjectDrawerClose}
                    PaperProps={{
                        sx: { width: '45%' },
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography m={2} variant="h6"><b>  Meeting Subject</b></Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>

                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleMeetingSubjectDrawerClose} />
                        </Box>
                    </Box>
                    <Divider />

                    <Box m={2} display={'flex'} alignItems={'center'} justifyContent={'space-between'} gap={5}>
                        <Box flex={1}>
                            <Typography>Subject Type</Typography>
                            <FormControl fullWidth size="small" margin="normal">

                                <Select>
                                    <MenuItem value="Type1">Type1</MenuItem>
                                    <MenuItem value="Type2">Type2</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box flex={1}>
                            <Typography>Subject</Typography>
                            <TextField size="small" margin="normal" placeholder="Subject" fullWidth />
                        </Box>

                    </Box>

                    <Box mt={4} m={2} >
                        <MaterialReactTable
                            columns={mettingsubjectcolumns}
                            data={mettingsubjectdata}
                            enableColumnOrdering
                            enableColumnResizing
                        />
                    </Box>






                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4}>
                        <Box>
                            <Button variant='contained'>Save </Button>
                        </Box>

                        <Box>
                            <Button onClick={handleMeetingSubjectDrawerClose} variant='outlined'>Cancel </Button>
                        </Box>
                    </Box>
                </Drawer>
                {/* drawer for meeting officer */}
                <Drawer
                    anchor="right"
                    open={meetingOfficerDrawerOpen}
                    onClose={handleMeetingOfficerDrawerClose}
                    PaperProps={{
                        sx: { width: '40%' },
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography m={2} variant="h6"><b> Meeting Officer</b></Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>

                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleMeetingOfficerDrawerClose} />
                        </Box>
                    </Box>
                    <Divider />

                    <Box mt={1} m={2}>
                        <Typography>Name</Typography>
                        <TextField size="small" margin="normal" placeholder="Name" fullWidth />
                    </Box>

                    <Box mt={1} m={2}>
                        <Typography>Description</Typography>
                        <TextField size="small" margin="normal" placeholder="Description" fullWidth />
                    </Box>

                    <Box mt={1} m={2}>
                        <Typography>Comments</Typography>
                        <TextField size="small" margin="normal" placeholder="Comments" fullWidth />
                    </Box>

                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4}>
                        <Box>
                            <Button variant='contained'>Save </Button>
                        </Box>

                        <Box>
                            <Button onClick={handleMeetingOfficerDrawerClose} variant='outlined'>Cancel </Button>
                        </Box>
                    </Box>
                </Drawer>
                {/* drawer for meeting Resolution */}
                <Drawer
                    anchor="right"
                    open={meetingResolutionDrawerOpen}
                    onClose={handleMeetingResolutionDrawerClose}
                    PaperProps={{
                        sx: { width: '40%' },
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography m={2} variant="h6"><b>Meeting Resolution</b></Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>

                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleMeetingResolutionDrawerClose} />
                        </Box>
                    </Box>
                    <Divider />

                    <Box>
                        <Box mt={1} m={2}>
                            <Typography>Meeting Type</Typography>
                            <FormControl fullWidth size="small" margin="normal" placeholder='Lease Deed Executed'>

                                <Select>
                                    <MenuItem value="Type1">Type 1</MenuItem>
                                    <MenuItem value="Type2">Type 2</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box mt={1} m={2}>
                            <Typography>Subject</Typography>
                            <TextField size="small" margin="normal" placeholder="Subject" fullWidth />
                        </Box>

                        <Box mt={1} m={2}>
                            <Typography>Comments</Typography>
                            <TextField size="small" margin="normal" placeholder="Comments" fullWidth />
                        </Box>

                        <Box mt={1} m={2}>
                            <Typography>Proposed by</Typography>
                            <TextField size="small" margin="normal" placeholder="Proposed by" fullWidth />
                        </Box>

                        <Box mt={1} m={2}>
                            <Typography>Seconded by</Typography>
                            <TextField size="small" margin="normal" placeholder="Seconded by" fullWidth />
                        </Box>
                    </Box>










                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4}>
                        <Box>
                            <Button variant='contained'>Save </Button>
                        </Box>

                        <Box>
                            <Button onClick={handleMeetingResolutionDrawerClose} variant='outlined'>Cancel </Button>
                        </Box>
                    </Box>
                </Drawer>
                {/* drawer for Search Meeting */}
                <Drawer
                    anchor="right"
                    open={Open}
                    onClose={handlefindMemberDrawerClose}
                    PaperProps={{
                        sx: { width: '40%' }, // Set the width here
                    }}
                >
                    <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography m={2} variant="h6"><b>Search Meeting</b></Typography>
                        <CloseIcon sx={{ cursor: 'pointer' }} onClick={handlefindMemberDrawerClose} />
                    </Box>
                    <Divider />



                    <Box m={2}>
                        <Box>
                            <Typography>Meeting Type</Typography>
                            <FormControl fullWidth size="small" margin="normal">

                                <Select>
                                    <MenuItem value="Residential">Residential</MenuItem>
                                    <MenuItem value="Commercial">Commercial</MenuItem>


                                </Select>
                            </FormControl>
                        </Box>

                        <Box mt={1}>
                            <Typography>Place</Typography>
                            <TextField size="small" margin="normal" placeholder="Place" fullWidth />
                        </Box>

                        <Box mt={1}>
                            <Typography>Description</Typography>
                            <TextField size="small" margin="normal" placeholder="Description" fullWidth />
                        </Box>


                    </Box>




                    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4} mb={4}>
                        <Box>
                            <Button variant='contained'>Search </Button>
                        </Box>

                        <Box>
                            <Button onClick={handlefindMemberDrawerClose} variant='outlined'>Cancel </Button>
                        </Box>
                    </Box>
                </Drawer>


            </Box>
        </Box>
    );
};

export default Meeting;


