// import React from 'react'

// const Accountdash = () => {
//   return (
//     <div>
//       Accountdash
//     </div>
//   )
// }

// export default Accountdash


import { Box, Typography } from "@mui/material";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
const Accountdash = () => {
  return (
    <Box>
      <Box>
        <KeyboardBackspaceIcon/>
      </Box>
      <Box className="firmtemp">
        <Box
          className="firmtemp-nav"
          sx={{
            display: "flex",

            mt: 5,
            flexWrap: "wrap", // Allow items to wrap to the next line if they overflow
            justifyContent: "space-around", // Space out items evenly
            "& a": {
              // Styling for the NavLink components
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "4px",
               color: 'primary.main',
              "&:hover": {
                backgroundColor: "primary.light",
                color: "white",
              },
              "&.active": {
                backgroundColor: "primary.main",
                color: "white",
              },
            },
          }}
        >
          <NavLink to="/accountdash/overview">OverView</NavLink>
          <NavLink to="/accountdash/info">Info</NavLink>
          <NavLink to="/accountdash/accounts">Accounts</NavLink>
          <NavLink to="/accountdash/invoices">Invoices</NavLink>
          <NavLink to="/accountdash/property">Property</NavLink>
          <NavLink to="/accountdash/vouchers">Vouchers</NavLink>
        </Box>
      </Box>
      <Box sx={{ pt: 5 }}>
        <Outlet/>
      </Box>
    </Box>
  );
};

export default Accountdash;




