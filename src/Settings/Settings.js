import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Divider, Drawer, FormControl, Select, MenuItem, InputLabel, Card, CardContent, CardActions, CardMedia, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import img from '../imgs/img11.jpg';  // Default Wing Image
import img2 from '../imgs/download.jpg';  // Default Unit Image
import { IoClose } from "react-icons/io5";

const Settings = () => {
    const [OpenWingDrawer, setOpenWingDrawer] = useState(false);
    const [OpenUnitDrawer, setOpenUnitDrawer] = useState(false);
    const [OpenParkingDrawer, setOpenParkingDrawer] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [unitTypes, setUnitTypes] = useState([]);
    const [parkingTypes, setParkingTypes] = useState([]);
    const [wings, setWings] = useState([]); // Store Wings
    const [units, setUnits] = useState([]); // Store Units
    const [unitTypes2, setUnitTypes2] = useState([]); // Store all Unit Types
    const [parkings, setParkings] = useState([]);

    useEffect(() => {
        fetchWings();
        fetchUnits();
        fetchParkings();
        fetchUnitTypes();
        fetchParkingTypes();
    }, []);

    // Define missing state variables
    const [wingForm, setWingForm] = useState({
        _id: '',
        name: '',
        totalUnits: '',
        unitTypes: '',
        numberOfFloors: '',
        totalParkings: '',
        parkingType: '',
    });

    const [unitForm, setUnitForm] = useState({
        _id: '',
        name: '',
        area: '',
        propertyType: '',
        unit: '',
    });

    const [parkingForm, setParkingForm] = useState({
        _id: '',
        parkingType: '',
        parkingArea: '',
        location: '',
        slotsAvailable: '',
        unit:''
    });

    useEffect(() => {
        fetchWings();
        fetchUnits();
        fetchUnitTypes();
        fetchParkingTypes();
    }, []);

    const fetchWings = async () => {
        try {
            const response = await fetch('http://localhost:8001/wings');
            const data = await response.json();
            setWings(data);
        } catch (error) {
            console.error("Error fetching wings:", error);
        }
    };

    const fetchUnits = async () => {
        try {
            const response = await fetch('http://localhost:8001/unitType');
            const data = await response.json();
            setUnits(data);
        } catch (error) {
            console.error("Error fetching units:", error);
        }
    };
    const fetchParkings = async () => {
        try {
            const response = await fetch('http://localhost:8001/Parking');
            const data = await response.json();
            setParkings(data);
        } catch (error) {
            console.error("Error fetching parking:", error);
        }
    };

    const fetchUnitTypes = async () => {
        try {
            const response = await fetch('http://localhost:8001/UnitType');
            const data = await response.json();
            setUnitTypes(data);
        } catch (error) {
            console.error("Error fetching unit types:", error);
        }
    };

    const fetchParkingTypes = async () => {
        try {
            const response = await fetch('http://localhost:8001/Parking');
            const data = await response.json();
            setParkingTypes(data);
        } catch (error) {
            console.error("Error fetching parking types:", error);
        }
    };

    const handleDeleteWing = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this wing?");
        if (!isConfirmed) return;
    
        try {
            await fetch(`http://localhost:8001/wings/${id}`, { method: 'DELETE' });
            setWings(wings.filter((wing) => wing._id !== id));
        } catch (error) {
            console.error("Error deleting wing:", error);
        }
    };
    
    const handleDeleteUnit = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this unit?");
        if (!isConfirmed) return;
    
        try {
            await fetch(`http://localhost:8001/unitType/${id}`, { method: 'DELETE' });
            setUnits(units.filter((unit) => unit._id !== id));
        } catch (error) {
            console.error("Error deleting unit:", error);
        }
    };
    
    const handleDeleteParking = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this parking?");
        if (!isConfirmed) return;
    
        try {
            await fetch(`http://localhost:8001/Parking/${id}`, { method: 'DELETE' });
            fetchParkings();
        } catch (error) {
            console.error("Error deleting parking:", error);
        }
    };
    

    const handleSubmit = async (endpoint, formData, resetForm) => {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            alert("Data submitted successfully!");
            resetForm(); // Reset form fields after submission
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("Failed to submit data.");
        }
    };


    const handleUpdateWing = async () => {
        try {
            await fetch(`http://localhost:8001/wings/${wingForm._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(wingForm),
            });
            fetchWings();
            setOpenWingDrawer(false);
        } catch (error) {
            console.error("Error updating wing:", error);
        }
    };

    const handleUpdateUnit = async () => {
        try {
            await fetch(`http://localhost:8001/unitType/${unitForm._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(unitForm),
            });
            fetchUnits();
            setOpenUnitDrawer(false);
        } catch (error) {
            console.error("Error updating unit:", error);
        }
    };

    const handleUpdateParking = async () => {
        console.log(parkingForm)
        try {
            await fetch(`http://localhost:8001/Parking/${parkingForm._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parkingForm),
            });
            fetchParkings();
            setOpenParkingDrawer(false);
        } catch (error) {
            console.error("Error updating parking:", error);
        }
    };



    const handleEditWing = (wing) => {
        setWingForm({ ...wing });
        setEditMode(true);
        setOpenWingDrawer(true);
    };

    const handleEditUnit = (unit) => {
        setUnitForm({ ...unit });
        setEditMode(true);
        setOpenUnitDrawer(true);
    };

    const handleEditParking = (parking) => {
        setParkingForm({ ...parking });
        setEditMode(true);
        setOpenParkingDrawer(true);
    };

    // Function to get Unit Type Names by ID
    const getUnitTypeNames = (unitTypeIds) => {
        if (!unitTypeIds) return "Unknown";
        return unitTypeIds.map((id) => {
            const unitType = unitTypes.find((ut) => ut._id === id);
            return unitType ? unitType.name : "Unknown";
        }).join(', ');
    };

    // Function to get Parking Type Name by ID
    const getParkingTypeName = (parkingTypeId) => {
        if (!parkingTypeId) return "Unknown";
        const parkingType = parkingTypes.find((pt) => pt._id === parkingTypeId);
        return parkingType ? parkingType.parkingType : "Unknown";
    };
    return (
        <Box>
            <Typography variant='h4' textAlign={"center"}>Structure Details</Typography>
            <Box display={'flex'} gap={5}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
                    setOpenWingDrawer(true); setEditMode(false); setWingForm({
                        name: '',
                        totalUnits: '',
                        unitTypes: '',
                        numberOfFloors: '',
                        totalParkings: '',
                        parkingType: '',
                    })
                }}>
                    Wing
                </Button>

                <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
                    setOpenUnitDrawer(true); setEditMode(false); setUnitForm({
                        name: '',
                        area: '',
                        propertyType: '',
                        unit: '',
                    })
                }}>
                    Units
                </Button>

                <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
                    setOpenParkingDrawer(true); setEditMode(false); setParkingForm({
                        parkingType: '',
                        parkingArea: '',
                        unit: '',
                    })
                }}>
                    Parking
                </Button>
            </Box>


            <Box mt={2}>
                <Typography variant="h5" mb={2}>Wings</Typography>
                <Grid container spacing={3}>
                    {wings.map((wing) => (
                        <Grid item xs={2} sm={2} md={2} key={wing._id}>
                            <Card sx={{ maxWidth: 200, boxShadow: 3 }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h6">{wing.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <b>Total Units:</b> {wing.totalUnits}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <b>Unit Types:</b> {getUnitTypeNames(wing.unitTypes)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <b>Total Parkings:</b> {wing.totalParkings}
                                    </Typography>
                                    {/* <Typography variant="body2" color="textSecondary">
                                    <b>Parking Type:</b> {getParkingTypeName(wing.parkingType)}
                                </Typography> */}
                                </CardContent>
                                <CardActions>
                                    <Button onClick={() => handleEditWing(wing)}>Edit</Button>
                                    <Button onClick={() => handleDeleteWing(wing._id)}>Delete</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Display Units as Cards */}
            <Box mt={5}>
                <Typography variant="h5" mb={2}>Units</Typography>
                <Grid container>
                    {units.map((unit) => (
                        <Grid item xs={2} sm={2} md={2} key={unit._id}>
                            <Card sx={{ maxWidth: 200, boxShadow: 3 }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h6">{unit.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <b>Area:</b> {unit.area} {unit.unit}.
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <b>Type:</b> {unit.propertyType}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={() => handleEditUnit(unit)}>Edit</Button>
                                    <Button onClick={() => handleDeleteUnit(unit._id)}>Delete</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box mt={5}>
                    <Typography variant="h5">Parking</Typography>
                    <Grid container>
                        {parkings.map((parking) => (
                            <Grid item xs={2} sm={2} md={2} key={parking._id}>
                                <Card sx={{ maxWidth: 200, boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h6">{parking.parkingType}</Typography>
                                        <Typography variant="body2"><b>Parking Area:</b> {parking.parkingArea} {parking.unit} .</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => handleEditParking(parking)}>Edit</Button>
                                        <Button onClick={() => handleDeleteParking(parking._id)}>Delete</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>


            {/* Wing Drawer */}
            <Drawer anchor="right" open={OpenWingDrawer} onClose={() => setOpenWingDrawer(false)} PaperProps={{ sx: { width: '40%' } }}>
                <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6"><b>Wing Details</b></Typography>
                    <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => setOpenWingDrawer(false)} />
                </Box>
                <Divider />

                <Box p={2}>
                    <TextField label="Wing Name" fullWidth size="small" value={wingForm.name} onChange={(e) => setWingForm({ ...wingForm, name: e.target.value })} />
                    <TextField label="Total Units" fullWidth size="small" sx={{ mt: 2 }} value={wingForm.totalUnits} onChange={(e) => setWingForm({ ...wingForm, totalUnits: e.target.value })} />
                    <TextField label="Number of Floors" fullWidth size="small" sx={{ mt: 2 }} value={wingForm.numberOfFloors} onChange={(e) => setWingForm({ ...wingForm, numberOfFloors: e.target.value })} />

                    {/* User-defined Unit Type */}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Unit Types</InputLabel>
                        <Select
                            value={wingForm.unitTypes}
                            onChange={(e) => setWingForm({ ...wingForm, unitTypes: e.target.value })}
                            onOpen={fetchUnitTypes} // Fetch data when dropdown is clicked
                        >
                            <MenuItem value=""><em>Select Unit Type</em></MenuItem>
                            {unitTypes.map((unit) => (
                                <MenuItem key={unit._id} value={unit._id}>
                                    {unit.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField label="Total Parkings" fullWidth size="small" sx={{ mt: 2 }} value={wingForm.totalParkings} onChange={(e) => setWingForm({ ...wingForm, totalParkings: e.target.value })} />

                    {/* User-defined Parking Type */}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Parking Type</InputLabel>
                        <Select
                            value={wingForm.parkingType}
                            onChange={(e) => setWingForm({ ...wingForm, parkingType: e.target.value })}
                            onOpen={fetchParkingTypes} // Fetch data when dropdown is clicked
                        >
                            <MenuItem value=""><em>Select Parking Type</em></MenuItem>
                            {parkingTypes.map((parking) => (
                                <MenuItem key={parking._id} value={parking._id}>
                                    {parking.parkingType}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box mt={3} display="flex" justifyContent="center">
                        {
                            editMode ?
                                <Button variant='contained' onClick={handleUpdateWing}>Edit</Button>
                                : <Button variant='contained' onClick={() => handleSubmit('http://localhost:8001/wings', wingForm, () => setWingForm({ name: '', totalUnits: '', unitTypes: '', numberOfFloors: '', totalParkings: '', parkingType: '' }))}>Add Wing</Button>

                        }
                    </Box>
                </Box>
            </Drawer>

            {/* Unit Drawer */}
            <Drawer anchor="right" open={OpenUnitDrawer} onClose={() => setOpenUnitDrawer(false)} PaperProps={{ sx: { width: '40%' } }}>
    <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: "#EEEEEE" }}>
            <Typography variant="h6">Create Units</Typography>
            <IoClose onClick={() => setOpenUnitDrawer(false)} style={{ cursor: 'pointer' }} />
        </Box>
        <Divider />
        <Box p={2}>
            <TextField 
                label="Unit Name" 
                fullWidth 
                size="small" 
                value={unitForm.name} 
                onChange={(e) => setUnitForm({ ...unitForm, name: e.target.value })} 
            />

            {/* Area Unit Dropdown (20%) and Area Input (80%) in a Row */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <FormControl sx={{ width: "20%" }}> 
                    <Select 
                        value={unitForm.unit} 
                        onChange={(e) => setUnitForm({ ...unitForm, unit: e.target.value })} 
                        displayEmpty
                        size="small"
                    >
                        <MenuItem value=""><em>Unit</em></MenuItem>
                        <MenuItem value="sq.ft">sq.ft</MenuItem>
                        <MenuItem value="sq.mtr">sq.mtr</MenuItem>
                    </Select>
                </FormControl>

                <TextField 
                    label="Area" 
                    fullWidth 
                    size="small" 
                    value={unitForm.area} 
                    onChange={(e) => setUnitForm({ ...unitForm, area: e.target.value })} 
                />
            </Box>

            {/* Property Type Dropdown */}
            <FormControl fullWidth sx={{ mt: 2 }}>
                <Select 
                    value={unitForm.propertyType} 
                    onChange={(e) => setUnitForm({ ...unitForm, propertyType: e.target.value })} 
                    displayEmpty
                    size="small"
                >
                    <MenuItem value=""><em>Select Property Type</em></MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="residential">Residential</MenuItem>
                </Select>
            </FormControl>

            {/* Submit or Update Button */}
            <Box mt={3} display="flex" justifyContent="center">
                {
                    editMode ? 
                        <Button variant='contained' onClick={handleUpdateUnit}>Save</Button> 
                        : 
                        <Button 
                            variant='contained' 
                            onClick={() => handleSubmit('http://localhost:8001/unitType', unitForm, () => setUnitForm({ name: '', area: '', propertyType: '', unit: '' }))}
                        >
                            Add Unit
                        </Button>
                }
            </Box>
        </Box>
    </Box>
</Drawer>


            {/* Parking Drawer */}
            <Drawer anchor="right" open={OpenParkingDrawer} onClose={() => setOpenParkingDrawer(false)} PaperProps={{ sx: { width: '40%' } }}>
                <Box p={2}>
                    <Typography variant="h6"><b>Parking Details</b></Typography>
                    <Divider sx={{ mb: 2 }} />

                    <TextField label="Parking Type" fullWidth size="small" sx={{ mt: 2 }} value={parkingForm.parkingType} onChange={(e) => setParkingForm({ ...parkingForm, parkingType: e.target.value })} />
                  
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <FormControl sx={{ width: "20%" }}> 
                    <Select 
                        value={parkingForm.unit} 
                        onChange={(e) => setParkingForm({ ...parkingForm, unit: e.target.value })} 
                        displayEmpty
                        size="small"
                    >
                        <MenuItem value=""><em>Unit</em></MenuItem>
                        <MenuItem value="sq.ft">sq.ft</MenuItem>
                        <MenuItem value="sq.mtr">sq.mtr</MenuItem>
                    </Select>
                </FormControl>

                <TextField 
                    label="Parking Area" 
                    fullWidth 
                    size="small" 
                    value={parkingForm.parkingArea}
                     onChange={(e) => setParkingForm({ ...parkingForm, parkingArea: e.target.value })}
                />
            </Box>

                    <Box mt={3} display="flex" justifyContent="center">
                        {
                            editMode ?
                                <Button variant='contained' onClick={handleUpdateParking}>Edit</Button>
                                : <Button variant='contained' onClick={() => handleSubmit('http://localhost:8001/parking', parkingForm, () => setParkingForm({ parkingType: '', parkingArea: '', unit: '' }))}>Save</Button>

                        }
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Settings;
