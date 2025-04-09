import { Box, Typography } from "@mui/material";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Voucher = () => {
  return (
    <Box>
      <Box>
        <Typography variant="h4">Invoices</Typography>
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
          <NavLink to="/invoice/billinvoice">Bill Invoice</NavLink>
          <NavLink to="/invoice/CreateService">Create Service</NavLink>
          <NavLink to="/invoice/InvoiceTemplate">Invoice Template</NavLink>
          <NavLink to="/invoice/DemoInvoice">Demo Invoice</NavLink>

          {/* <NavLink to="/invoice/billformat">Bill Format</NavLink>
          <NavLink to="/invoice/incomeexpendituresheet">income Expenditure sheet</NavLink>
          <NavLink to="/invoice/balancesheet">Balance Sheet</NavLink>
          <NavLink to="/invoice/auditreport">Audit Report</NavLink>
          <NavLink to="/invoice/investmentsheet">Investment Sheet</NavLink> */}
        </Box>
      </Box>
      <Box sx={{ pt: 5 }}>
        <Outlet/>
      </Box>
    </Box>
  );
};

export default Voucher;
