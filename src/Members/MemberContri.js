import React from 'react'
import { Box, Button, Typography, TextField, } from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";


const MemberContri = () => {
    return (
        // <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto', }}>

        //     <Box textAlign="center">
        //         <Typography variant="h4"> Member Contribution</Typography>
        //     </Box>
        //     <Box mt={4} >
        //         <LocalizationProvider dateAdapter={AdapterDateFns}>
        //             <Box  display="flex" flexDirection="column" alignItems="center" >
        //                 <Typography className="task-input-label"> Date</Typography>
        //                 <DatePicker
        //                 size='small'
        //                     format="dd/MM/yyyy"
        //                     sx={{ width: "50%", }}
        //                     renderInput={(params) => <TextField {...params} size="small" />}
        //                 />
        //             </Box>
        //         </LocalizationProvider>


        //         <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
        //             <label className="tag-input-label">Member</label>
        //             <TextField
        //                 placeholder="Member"
        //                 margin="normal"
        //                 size="small"
        //                 sx={{ width: '50%' }}

        //             />
        //         </Box>

        //         <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
        //             <label className="tag-input-label">Account Name</label>
        //             <TextField
        //                 placeholder="Account Name"
        //                 margin="normal"
        //                 size="small"
        //                 sx={{ width: '50%' }}
        //             />
        //         </Box>

        //         <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
        //             <label className="tag-input-label">Amount</label>
        //             <TextField
        //                 placeholder="Amount"
        //                 margin="normal"
        //                 size="small"
        //                 sx={{ width: '50%' }}
        //             />
        //         </Box>

        //         <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
        //             <label className="tag-input-label">Narration</label>
        //             <TextField
        //                 placeholder="Narration"
        //                 margin="normal"
        //                 size="small"
        //                 sx={{ width: '50%' }}
        //             />
        //         </Box>
        //     </Box>

        //     <Box display={'flex'} alignItems={'center'} gap={2} flexDirection="row" >
        //         <Button variant='contained'>Save</Button>
        //         <Button variant='outlined' >Close</Button>
        //     </Box>

        // </Box>

        <Box sx={{ background: 'rgb(236 242 246)', borderRadius: '10px', p: 5, height: 'auto' }}>

            <Box textAlign="center">
                <Typography variant="h4"> Member Contribution</Typography>
            </Box>

            <Box mt={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box display="flex" flexDirection="column" alignItems="center" >
                        <Typography  > Date</Typography>
                        <DatePicker
                            size="small"
                            format="dd/MM/yyyy"
                            sx={{ width: "50%" }}
                            renderInput={(params) => <TextField {...params} size="small" />}
                        />
                    </Box>
                </LocalizationProvider>

                <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                    <label>Member</label>
                    <TextField
                        placeholder="Member"
                        margin="normal"
                        size="small"
                        sx={{ width: '50%' }}
                    />
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                    <label className="tag-input-label">Account Name</label>
                    <TextField
                        placeholder="Account Name"
                        margin="normal"
                        size="small"
                        sx={{ width: '50%' }}
                    />
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                    <label className="tag-input-label">Amount</label>
                    <TextField
                        placeholder="Amount"
                        margin="normal"
                        size="small"
                        sx={{ width: '50%' }}
                    />
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                    <label className="tag-input-label">Narration</label>
                    <TextField
                        placeholder="Narration"
                        margin="normal"
                        size="small"
                        sx={{ width: '50%' }}
                    />
                </Box>
            </Box>


            <Box display="flex" justifyContent="center" mt={3} gap={2}>
                <Button variant='contained'>Save</Button>
                <Button variant='outlined'>Close</Button>
            </Box>

        </Box>
    )
}

export default MemberContri
