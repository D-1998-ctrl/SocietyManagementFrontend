import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Select, MenuItem, FormControl,} from '@mui/material';

const Documents = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const options = [
        { value: "Member1", label: "Member1" },
        { value: "Member2", label: "Member2" },
        { value: "Member3", label: "Member3" },

    ];
    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (

        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

            }}
        >
            <Box
                sx={{
                    background: 'rgb(236 242 246)',
                    borderRadius: '10px',
                    p: 5,
                    height: 'auto',
                }}
            >
                <Box textAlign="center">
                    <Typography variant="h4">View</Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <label className="tag-input-label">Plot</label>
                        <TextField placeholder="Plot number" margin="normal" size="small" width="50%" />
                        <Button variant="contained">View files</Button>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <label className="tag-input-label">Member</label>
                        <FormControl sx={{ width: '250px' }} size="small">
                            <Select
                                labelId="priority-select-label"
                                id="priority-select"
                                value={selectedOption}
                                onChange={handleChange}
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained">View</Button>
                    </Box>
                </Box>
            </Box>
        </Box>


    )
}

export default Documents
