

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Select, IconButton, Divider, MenuItem, FormControl, Drawer, Chip, Autocomplete, CardMedia, CardActions, Paper, Card, CardContent, CardHeader } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import optiondata from './optiondata.json'
import { openDB } from "idb";
import DeleteIcon from '@mui/icons-material/Delete';
import { MaterialReactTable } from 'material-react-table';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IoClose } from "react-icons/io5";
import CardData from './CardData.json'
import unitcardData from './unitcardData.json'
import img from '../imgs/img11.jpg';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import img2 from '../imgs/download.jpg'

const Settings = () => {


    const colors = ["#fd3241", "#f9b5ac", "#ac6400", "#ff7e39", "#ffea00", "#94ecbe", "#2e8b57", "#76ac1e", "#3cbb50", "#9ed8db", "#0299bb", "#0af4b8", "#466efb", "#0496ff", "#b9c1ff",
        "#e1b1ff", "#9d33d0", "#d834f5", "#ff54b6", "#1d3354", "#767b91", "#8f8f8f", "#c7c7c7", "#9a657e", "#616468", "#511dff", "#85c7db", "#8cd1ff", "#0aefff", "#d4ff00", "#a1ff0a", "#00f43d", "#ffc100",
        "#cdc6a5", "#fed6b1", "#e5dfdf", "#ffeaa7"
    ];
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const [Open, setOpen] = useState(false);
    const handlefindMemberDrawerOpen = () => {
        setOpen(true);
    };

    const handlefindMemberDrawerClose = () => {
        setOpen(false);
    };
    //drawer for units
    const [OpenDrawer, setOpenDrawer] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState([]);
    const handleNewUnitsDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleNewUnitsDrawerClose = () => {
        setOpenDrawer(false);
    };

    const [selectedOptions, setSelectedOptions] = useState([]);



    const handleChange = (event) => {
        const value = event.target.value;
        const selectedOption = options.find(option => option.tagColour === value);
        setSelectedOption(selectedOption);
    };

    const generateOptions = (inputValue) => {
        return colors.map((tagColour, index) => ({
            value: `${inputValue.toLowerCase()}-${index}`,
            tagName: inputValue,
            tagColour: tagColour,
        }));
    };

    const selectWidth = inputValue ? `${inputValue.length * 5 + 40}px` : '';
    const handleInputChange = (inputValue) => {
        setInputValue(inputValue);
        console.log(inputValue)
        const newOptions = generateOptions(inputValue);
        setOptions(newOptions);
    };

    // Initialize IndexedDB
    const initDB = async () => {
        return openDB('MyDatabase', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('storeName')) {
                    db.createObjectStore('storeName', { keyPath: 'id', autoIncrement: true });
                }
            },
        });
    };

    // Fetch items from IndexedDB
    const fetchItems = async () => {
        const db = await initDB();
        const allItems = await db.getAll('storeName');
        const allOptions = allItems.map(item => item.content); // Extract the content from IndexedDB items
        //  setOptions(prevOptions => [...prevOptions, ...allOptions]); // Merge with existing options
        setOptions(allOptions); // Update the options state
        setUnits(allItems);
    };

    const handleAddOption = async () => {
        if (inputValue.trim() && selectedOption) {
            const db = await initDB();
            const newEntry = {
                content: inputValue, // Unit name
                tagColour: selectedOption.tagColour, // Selected color
            };
            await db.add("storeName", newEntry); // Save to IndexedDB
            setInputValue(""); // Clear the input
            setSelectedOption(null); // Clear the selected option
            await fetchItems(); // Refresh options from IndexedDB
            exportAndMergeData(); // Trigger export if needed
        } else {
            console.error("Input value or color not selected!");
        }
    };

    // Define a color palette
    const colorMap = ["primary", "secondary", "error", "warning", "success"];


    const exportAndMergeData = async () => {
        try {
            const db = await initDB();

            // Fetch all items from IndexedDB
            const allItems = await db.getAll("storeName");

            // Merge with the original `optiondata` (ensure it's structured properly)
            const mergedData = allItems.map((item, index) => ({
                id: index + 1, // Generate a unique ID
                content: item.content, // Use the content field from the item
            }));

            // Convert to JSON and create a file
            const json = JSON.stringify(mergedData, null, 2); // Pretty-printed JSON
            const blob = new Blob([json], { type: "application/json" });

            // Trigger download
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "optiondata.json";
            link.click();
        } catch (error) {
            console.error("Error exporting and merging data:", error);
        }
    };

    const handleDeleteOption = async (option) => {
        try {
            const db = await initDB();

            
            const allItems = await db.getAll('storeName');

          
            const itemToDelete = allItems.find((item) => item.content === option);

            if (itemToDelete) {
               
                await db.delete('storeName', itemToDelete.id);

               
                const updatedOptions = options.filter((item) => item !== option);
                setOptions(updatedOptions);

                console.log(`Deleted option: ${option}`);

                
                exportAndMergeData();
            } else {
                console.log("Option not found in IndexedDB");
            }
        } catch (error) {
            console.error("Error deleting option:", error);
        }
    };

    useEffect(() => {
        fetchItems();

    }, []);

    const [units, setUnits] = useState([]);


    //for table
    const columns = [
        {
            accessorKey: 'id', 
            header: 'Sr.no',
            Cell: ({ row }) => row.index + 1, 
        },
        {
            accessorKey: 'content', // Field from data
            header: 'Unit Name',
            Cell: ({ cell, row }) => (
                <Chip
                    label={cell.getValue()}
                    sx={{
                        backgroundColor: row.original.tagColour,
                        color: '#fff',
                        fontWeight: 'bold',
                    }}
                />
            ),
        },

        {
            accessorKey: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <IconButton
                    onClick={() => handleDeleteOption(row.original.content)}
                    color="error"
                >
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <Box>
            <Typography variant='h4' textAlign={"center"} >Structure Details</Typography>
            <Box display={'flex'} gap={5}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handlefindMemberDrawerOpen}
                >
                    Wing
                </Button>


                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewUnitsDrawerOpen}
                >
                    Units
                </Button>
            </Box>


            <Paper>
                <Box mt={2} display={'flex'} gap={4} p={2} >

                    {CardData.slice(0, 4).map((item) => (
                        <Card sx={{ maxWidth: 200, position: 'relative', height: 230 }}>
                            <CardMedia
                                sx={{ height: 80 }}
                                image={img}
                                title="green iguana"
                            />
                            <BorderColorIcon
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    color: 'Black',
                                    cursor: 'pointer',
                                }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {item.NameOfWings}
                                </Typography>
                                

                                <Typography variant="body2" color="text.secondary" sx={{ marginRight: 'auto' }}>
                                    No of Wings: {item.NoOfWings}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ marginRight: 'auto' }}>
                                    Type Of Units: {item.Typeofunits}
                                </Typography>
                                
                            </CardContent>
                            <CardActions>
                                <Box>
                                    <Button size="small">Edit</Button>
                                    <Button size="small">Delete</Button>
                                </Box>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </Paper>




            <Paper>
                <Box mt={5} display={'flex'} gap={4} p={2}>
                    {unitcardData.map((item) => (
                        <Card sx={{ maxWidth: 200, position: 'relative', height: 230 }}>
                            <CardMedia
                                sx={{ height: 80 }}
                                image={img2}
                                title="green iguana"
                            />
                            <BorderColorIcon
                                sx={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    color: 'Black',
                                    cursor: 'pointer',
                                }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {item.Tittle}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Type of Unit: {item.TypeOfUnit}
                                </Typography>
                                {/* <Typography variant="body2" color="text.secondary" sx={{ marginRight: 'auto' }}>
                                    No of Unit: {item.NoOfunits}
                                </Typography> */}
                            </CardContent>
                            <CardActions>
                                <Box>
                                    <Button size="small">Edit</Button>
                                    <Button size="small">Delete</Button>
                                </Box>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            </Paper>




            <Drawer
                anchor="right"
                open={Open}
                onClose={handlefindMemberDrawerClose}
                PaperProps={{
                    sx: { width: '40%' },
                }}
            >
                <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography m={2} variant="h6"><b>Wing Details</b></Typography>
                    <CloseIcon sx={{ cursor: 'pointer' }} onClick={handlefindMemberDrawerClose} />
                </Box>
                <Divider />


                <Box>
                    <Box m={2}>
                        <Typography>No Of Floors</Typography>
                        <TextField size="small" margin="normal" placeholder='No Of Units' fullWidth />
                    </Box>


                    <Box m={2}>
                        <Typography>No Of Units</Typography>
                        <TextField size="small" margin="normal" placeholder='No Of Units' fullWidth />
                    </Box>



                    <Box m={2}>
                        <Typography>Name Of Wings</Typography>
                        <TextField size="small" margin="normal" placeholder='Name Of Wings' fullWidth />
                    </Box>


                    <Box m={2}>
                        <Typography>Type Of Unit</Typography>
                        <Autocomplete
                            multiple
                            options={options}
                            value={selectedOptions}
                            onChange={(event, newValue) => setSelectedOptions(newValue)}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option}
                                        color={option.tagColour[index % option.tagColour.length]}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" size="small" />
                            )}
                            renderOption={(props, option, { selected }) => {
                                const index = options.indexOf(option);
                                return (
                                    <li {...props}>
                                        <Chip
                                            label={option}
                                            color={colorMap[index % colorMap.length]}
                                            style={{ marginRight: 8 }}
                                        />
                                    </li>
                                );
                            }}
                        />
                    </Box>

                </Box>




                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} mt={4}>
                    <Box>
                        <Button variant='contained'>Save </Button>
                    </Box>

                    <Box>
                        <Button onClick={handlefindMemberDrawerClose} variant='outlined'>Cancel </Button>
                    </Box>
                </Box>
            </Drawer>


            {/* drawer for new units */}
            <Drawer
                anchor='right'
                open={OpenDrawer}
                onClose={handleNewUnitsDrawerClose}
                PaperProps={{
                    id: 'tag-drawer',
                    sx: {
                        borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
                        width: isSmallScreen ? '100%' : 800,
                        maxWidth: '100%',
                        [theme.breakpoints.down('sm')]: {
                            width: '100%',
                        },

                    }
                }}
            >
                <Box sx={{ borderRadius: isSmallScreen ? '0' : '15px' }} role="presentation">
                    <Box>
                        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: "#EEEEEE" }}>
                            <Typography variant="h6" >
                                Create Units
                            </Typography>
                            <IoClose onClick={handleNewUnitsDrawerClose} style={{ cursor: 'pointer' }} />
                        </Box>
                        <Divider />
                        <Box sx={{ pr: 2, pl: 2, pt: 2 }}>
                            <Box>
                                <label className='tag-input-label'>Unit Name</label>

                                <TextField
                                    placeholder="Unit Name"
                                    value={inputValue}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    fullWidth

                                    size="small"
                                    sx={{ backgroundColor: '#fff', mt: 1 }}


                                />


                            </Box>
                            <Box sx={{ mt: 3 }}>
                                <label className='tag-input-label'>Unit Color</label>
                                <Select
                                    value={selectedOption ? selectedOption.tagColour : ''}
                                    onChange={handleChange}
                                    labelId="color-select-label"
                                    id="color-select"
                                    size="small"
                                    sx={{ width: '100%', marginTop: '10px', backgroundColor: '#fff' }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                maxHeight: 200,
                                                overflowY: 'auto',
                                            },
                                        },
                                    }}
                                >
                                    {options.map((option) => (
                                        <MenuItem key={option.value} value={option.tagColour}>
                                            <Box sx={{
                                                backgroundColor: option.tagColour,
                                                color: "#fff",
                                                borderRadius: "10px",
                                                width: selectWidth,
                                                textAlign: "center",
                                                padding: "0.1rem 0.6rem",
                                            }}>
                                                {option.tagName}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>

                            </Box>


                            <Box sx={{ mt: 3 }}>
                                <Button variant='contained' onClick={handleAddOption}>Add Unit</Button>
                            </Box>



                            <Box sx={{ mt: 4 }} >
                                <MaterialReactTable
                                    columns={columns}
                                    data={units}
                                    enableColumnFilters={false}
                                    enablePagination={true}
                                    enableSorting={true}
                                    muiTableContainerProps={{
                                        sx: { maxHeight: '400px' },
                                    }}
                                />
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </Box>


    )
}

export default Settings




