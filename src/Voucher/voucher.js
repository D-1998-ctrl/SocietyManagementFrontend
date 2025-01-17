import { Box, Typography } from "@mui/material";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Voucher = () => {
  return (
    <Box>
      <Box>
        <Typography variant="h4">Vouchers</Typography>
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
          <NavLink to="/vouchers/journalvoucher">Journal Voucher</NavLink>
          <NavLink to="/vouchers/receiptvoucher">Receipt Voucher</NavLink>
          <NavLink to="/vouchers/purchasevoucher">Purchase Voucher</NavLink>
          <NavLink to="/vouchers/paymentvoucher">Payment Voucher</NavLink>
          <NavLink to="/vouchers/contravoucher">Contra Voucher</NavLink>
          
        </Box>
      </Box>
      <Box sx={{ pt: 5 }}>
        <Outlet/>
      </Box>
    </Box>
  );
};

export default Voucher;
