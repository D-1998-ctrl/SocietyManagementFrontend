import React, { useState, useEffect, useMemo } from 'react';
import {
  Alert,
  Autocomplete,
  useMediaQuery,
  Box,
  Button,
  Typography,
  TextField,
  Drawer,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toWords } from 'number-to-words';
import Textarea from '@mui/joy/Textarea';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';
import { format, parseISO } from 'date-fns';
import html2canvas from 'html2canvas';
import axios from 'axios';

const BillInvoice = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [organisation, setOrganisation] = useState({ SocietyName: '' });

  // State for form fields
  const [formValues, setFormValues] = useState({
    memberId: '',
    invoiceNumber: '',
    invoiceDate: null,
    period: '',
    dueDate: null,
    narration: '',
    amtInWords: '',
  });

  const [DetailsData, setDetailsData] = useState([{ serviceId: '', amounts: '' }]);
  const [data, setData] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memberData, setMemberData] = useState([])

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8001/Member");
      const members = response.data.map((member) => ({
        id: member._id,
        label: `${member.firstName} ${member.middleName} ${member.surname}`,
        floor: member.floor,
        wingName: member.wingName,
        unitNumber: member.unitNumber,
        addressLine2: member.addressLine2,
        firstName: member.firstName,
        middleName: member.middleName,
        surname: member.surname
      }));
      setMemberData(response.data)
      setMemberOptions(members);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

    fetchMembers();
  }, []);

  // State for preview and report generation
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch data from API
  useEffect(() => {
    fetchData();
    fetchMemberOptions();
    fetchOrganisationData();
  }, []);

  // Fetch InvoiceHeader data
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8001/InvoiceHeader');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching InvoiceHeader data:', error);
    }
  };

  const fetchOrganisationData = async () => {
    try {
      const response = await fetch('http://localhost:8001/Organisation');
      const result = await response.json();
      setOrganisation(result); // Assuming the API returns an object with a `SocietyName` field
    } catch (error) {
      console.error('Error fetching organisation data:', error);
    }
  };

  // Fetch DR Member Name options
  const fetchMemberOptions = async () => {
    try {
      const response = await fetch('/members.json'); // Path to your JSON file
      const result = await response.json();
      setMemberOptions(result);
    } catch (error) {
      console.error('Error fetching member options:', error);
    }
  };

  // Fetch the last invoice number
  const fetchLastInvoiceNumber = async () => {
    try {
      const response = await fetch('http://localhost:8001/InvoiceHeader');
      const result = await response.json();
      if (result.length > 0) {
        const lastInvoiceNumber = Math.max(...result.map((item) => parseInt(item.invoiceNumber, 10)));
        return lastInvoiceNumber + 1;
      }
      return 1; // Default to 1 if no invoices exist
    } catch (error) {
      console.error('Error fetching last invoice number:', error);
      return 1;
    }
  };

  // Handle row click for editing
  const handleRowClick = async (row) => {
    try {
      // Fetch InvoiceHeader data
      const headerResponse = await fetch(`http://localhost:8001/InvoiceHeader/${row._id}`);
      const headerData = await headerResponse.json();
      console.log(row._id)

      // Fetch InvoiceDetail data by invoiceId
      const detailsResponse = await fetch(`http://localhost:8001/InvoiceDetail/InvoiceId/${row._id}`);
      const detailsData = await detailsResponse.json();
      console.log("Details Data = ", detailsData)

      // Set form values from InvoiceHeader
      setFormValues({
        memberId: headerData.memberId || '',
        invoiceNumber: headerData.invoiceNumber || '',
        invoiceDate: headerData.invoiceDate ? parseISO(headerData.invoiceDate) : null,
        period: headerData.period || '',
        dueDate: headerData.dueDate ? parseISO(headerData.dueDate) : null,
        narration: headerData.narration || '',
        amtInWords: headerData.amtInWords || '',
      });

      // Ensure we correctly map `serviceIds` and `amounts`
      if (detailsData.length > 0) {
        const itemsData = detailsData.flatMap(detail =>
          detail.serviceIds.map((serviceId, index) => ({
            serviceId: serviceId,
            amounts: detail.amounts[index] || '', // Match index to ensure correct mapping
          }))
        );
        setDetailsData(itemsData);
      } else {
        setDetailsData([{ serviceId: '', amounts: '' }]); // Set default if no details found
      }

      // Set edit state
      setEditData(row);
      setIsEditing(true);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setDetailsData([{ serviceId: '', amounts: '' }]); // Set default value if there's an error
    }
  };

  // Handle form input changes
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...DetailsData];
    updatedItems[index][name] = value;
    setDetailsData(updatedItems);

    // Automatically update amount in words
    const totalAmount = updatedItems.reduce((total, item) => total + parseFloat(item.amounts || 0), 0);
    setFormValues((prev) => ({ ...prev, amtInWords: toWords(totalAmount) }));
  };

  // Add item to the list
  const handleAddItem = () => {
    setDetailsData([...DetailsData, { serviceId: '', amounts: '' }]);
  };

  // Remove item from the list
  const handleRemoveItem = (index) => {
    const updatedItems = DetailsData.filter((_, i) => i !== index);
    setDetailsData(updatedItems);

    // Update amount in words after removal
    const totalAmount = updatedItems.reduce((total, item) => total + parseFloat(item.amounts || 0), 0);
    setFormValues((prev) => ({ ...prev, amtInWords: toWords(totalAmount) }));
  };

  // Handle form field changes
  const handleFormChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // Handle save changes
  const handleSave = async () => {
    const headerPayload = {
      ...formValues,
      invoiceDate: formValues.invoiceDate ? format(formValues.invoiceDate, 'yyyy-MM-dd') : '',
      dueDate: formValues.dueDate ? format(formValues.dueDate, 'yyyy-MM-dd') : '',
    };

    try {
      let headerResponse, headerData;

      if (isEditing) {
        // Update existing InvoiceHeader
        headerResponse = await fetch(`http://localhost:8001/InvoiceHeader/${editData._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(headerPayload),
        });

        headerData = { _id: editData._id }; // Use existing _id for invoice details
      } else {
        // Create new InvoiceHeader
        headerResponse = await fetch('http://localhost:8001/InvoiceHeader', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(headerPayload),
        });

        headerData = await headerResponse.json(); // Get the newly created InvoiceHeader _id
      }

      if (!headerResponse.ok) {
        throw new Error('Failed to save InvoiceHeader');
      }

      console.log('✅ InvoiceHeader Saved:', headerData);

      // Prepare InvoiceDetail Payload (Array of Objects)
      const detailsPayload = {
        invoiceId: headerData._id, // Use ObjectId, not invoiceNumber
        serviceIds: DetailsData.map(item => item.serviceId),
        amounts: DetailsData.map(item => item.amounts.toString()), // Ensure amounts are strings as per schema
      };

      console.log('📤 Sending Invoice Details:', detailsPayload);

      let detailsResponse;
      if (isEditing) {
        // Update existing InvoiceDetails
        detailsResponse = await fetch(`http://localhost:8001/InvoiceDetail/${editData._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(detailsPayload),
        });
      } else {
        // Create new InvoiceDetails
        detailsResponse = await fetch('http://localhost:8001/InvoiceDetail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(detailsPayload),
        });
      }

      if (!detailsResponse.ok) {
        throw new Error('Failed to save InvoiceDetails');
      }

      console.log('✅ InvoiceDetails Saved Successfully');

      fetchData(); // Refresh Data
      setIsEditing(false);
      setEditData(null);
      setIsPreviewOpen(true); // Open preview after saving
      alert('Data submitted successfully!');

      // Clear Form
      setFormValues({
        memberId: '',
        invoiceNumber: '',
        invoiceDate: null,
        period: '',
        dueDate: null,
        narration: '',
        amtInWords: '',
      });
      setDetailsData([{ serviceId: '', amounts: '' }]);
    } catch (error) {
      console.error('❌ Error saving data:', error);
    }
  };

  // Handle delete
  const handleDelete = async () => {

    const isConfirmed = window.confirm("Are you sure you want to delete Record ?");
    if (!isConfirmed) return;

    try {
      await fetch(`http://localhost:8001/InvoiceHeader/${editData._id}`, {
        method: 'DELETE',
      });
      fetchData();
      setIsDrawerOpen(false);
      setIsEditing(false);
      setEditData(null);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsDrawerOpen(false);
    setIsEditing(false);
    setEditData(null);
  };

  // Handle drawer open
  const handleDrawerOpen = async () => {
    const nextInvoiceNumber = await fetchLastInvoiceNumber();
    setFormValues((prev) => ({
      ...prev,
      invoiceNumber: nextInvoiceNumber.toString(),
      invoiceDate: null,
      dueDate: null,
    }));
    setIsDrawerOpen(true);
    setIsEditing(false);
    setEditData(null);
  };

  // Columns for the table
  const columns = useMemo(
    () => [
      { 
        accessorKey: 'memberId', 
        header: 'DR Member Name', 
        size: 150,
        Cell: ({ cell }) => {
          const memberId = cell.getValue();
          const member = memberData.find(m => m._id === memberId);
          return member ? `${member.firstName} ${member.surname}` : memberId;
        }
      },
      { accessorKey: 'invoiceNumber', header: 'Bill Number', size: 150 },
      {
        accessorKey: 'invoiceDate', 
        header: 'Bill Date', 
        size: 150, 
        Cell: ({ cell }) =>
          cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy') : '-',
      },
      { accessorKey: 'period', header: 'Period', size: 150 },
      {
        accessorKey: 'dueDate', 
        header: 'Due Date', 
        size: 150, 
        Cell: ({ cell }) =>
          cell.getValue() ? format(new Date(cell.getValue()), 'dd/MM/yyyy') : '-',
      },
    ],
    [memberData] // Add memberData as dependency
  );


  const particularsOptions = [
    { id: 1, name: 'Sinking Fund Contribution' },
    { id: 2, name: 'Repair Fund Contribution' },
    { id: 3, name: 'Common Property Tax Contribution' },
    { id: 4, name: 'Water Charges Contribution' },
    { id: 5, name: 'Electricity Charges Contribution' },
    { id: 6, name: 'Service Charges Contribution' },
  ];

  const Receipt = ({ formValues, DetailsData, societyName }) => {
    const totalAmount = DetailsData.reduce((total, item) => total + parseFloat(item.amounts || 0), 0);

    // Find the member name based on memberId
    const member = memberOptions.find((option) => option.id === formValues.memberId);
    const memberName = member ? member.label : 'Unknown Member';
    const Mdata = memberData.find((item) => item._id === formValues.memberId)
    console.log("Mdata = ",memberData.find((item) => item._id === formValues.memberId))

    const floor = Mdata ? Mdata.floor : '-';
    const wing =  Mdata ? Mdata.wingName : '-';
    const flat =  Mdata ? Mdata.unitNumber : '-';
    const area =  Mdata ? Mdata.addressLine2 : '-';
    return (
      <Box
        id="secure-receipt"
        sx={{
          padding: 3,
          border: "1px solid #000",
          borderRadius: "4px",
          width: "100%",
          maxWidth: "800px",
          margin: "auto",
          background: "#fff",
          fontFamily: "Arial, sans-serif",
          position: "relative",
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
            {societyName || "WHITE ROSE CO-OPERATIVE HOUSING SOCIETY LTD"}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            Reg.No.: BOM/HSG/714OF1964
          </Typography>
          <Typography variant="body2">
            4, PERRY ROAD, BANDRA (WEST), MUMBAI-400 050
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
            MAINTENANCE BILL
          </Typography>
        </Box>

        {/* Member Information Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Member:</Typography>
            <Typography>{memberName}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>FLAT:</Typography>
            <Typography>{flat}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Bill No.:</Typography>
            <Typography>{formValues.invoiceNumber}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Floor:</Typography>
            <Typography>{floor}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Date:</Typography>
            <Typography>{formValues.invoiceDate ? format(formValues.invoiceDate, "dd-MMM-yy") : ""}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Wing:</Typography>
            <Typography>{wing}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Area:</Typography>
            <Typography>{area}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Due Date:</Typography>
            <Typography>{formValues.dueDate ? format(formValues.dueDate, "dd-MMM-yy") : ""}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Billing Period:</Typography>
            <Typography>{formValues.period || "1-Dec-24 To 31-Dec-24"}</Typography>
          </Box>
        </Box>

        {/* Bill Items Table */}
        <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", border: "1px solid #000" }}>SR NO.</TableCell>
                <TableCell sx={{ fontWeight: "bold", border: "1px solid #000" }}>PARTICULARS</TableCell>
                <TableCell sx={{ fontWeight: "bold", border: "1px solid #000", textAlign: "right" }}>AMOUNT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {DetailsData.map((item, index) => {
                const particular = particularsOptions.find(option => option.id === item.serviceId);
                return (
                  <TableRow key={index}>
                    <TableCell sx={{ border: "1px solid #000" }}>{index + 1}</TableCell>
                    <TableCell sx={{ border: "1px solid #000" }}>
                      {particular ? particular.name : item.serviceId}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #000", textAlign: "right" }}>
                      {parseFloat(item.amounts).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={2} sx={{ fontWeight: "bold", border: "1px solid #000", textAlign: "right" }}>
                  Sub-Total
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", border: "1px solid #000", textAlign: "right" }}>
                  {totalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} sx={{ fontWeight: "bold", border: "1px solid #000", textAlign: "right" }}>
                  Dues/Excess(-)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", border: "1px solid #000", textAlign: "right" }}>
                  {totalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Amount in Words */}
        <Typography sx={{ fontWeight: "bold" }}>
          Amount in Words: INR {toWords(totalAmount)} Only
        </Typography>

        {/* Terms & Conditions */}
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: "bold" }}>Terms & Conditions</Typography>
          <Typography sx={{ fontStyle: "italic" }}>E&O.E.</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            1. Cheques to be in favour of "{societyName || "WHITE ROSE CHS LTD"}" & Cheques to be dropped in the cheque drop box.
          </Typography>
          <Typography variant="body2">
            2. Mention your Flat No. and Mobile No. on the reverse of the cheque.
          </Typography>
          <Typography variant="body2">
            3. Non Payment of Bill will attract interest @21 % PA.
          </Typography>
          <Typography variant="body2">
            4. Errors to be intimated within 7 days to Society Office
          </Typography>
        </Box>

        {/* Remarks */}
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: "bold" }}>Remarks:</Typography>
          <Typography>{formValues.narration || "Maintenance bills for 1-Dec-24 to 31-Dec-24"}</Typography>
        </Box>

        {/* Bank Details */}
        <Box sx={{ mt: 3, borderTop: "1px dashed #000", pt: 2 }}>
          <Typography sx={{ fontWeight: "bold" }}>Bank Details for {societyName || "WHITE ROSE CO-OPERATIVE HOUSING SOCIETY LTD"}</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography>Bank Name: SVC Bank Ltd.</Typography>
            <Typography>A/c No.: 300003000012169</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography>Branch & IFSC: Bandra & SVCB0000003</Typography>
            <Typography>Sign image</Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography sx={{ fontWeight: "bold" }}>Chairman/Secretary/Manager</Typography>
        </Box>
      </Box>
    );
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleGenerateReport = () => {
    const receiptElement = document.getElementById('secure-receipt');
    if (receiptElement) {
      html2canvas(receiptElement).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'receipt.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    } else {
      console.error('Receipt element not found');
    }
  };

  const handlePrint = () => {
    const receiptElement = document.getElementById('secure-receipt');
    const totalAmount = DetailsData.reduce((total, item) => total + parseFloat(item.amounts || 0), 0);

    // Find the member name based on memberId
    const member = memberOptions.find((option) => option.id === formValues.memberId);
    const memberName = member ? member.name : 'Unknown Member';

    if (receiptElement) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${organisation[0]?.SocietyName || 'Maintenance Bill'}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0;
                padding: 20px;
                background: #fff;
              }
              .receipt-container {
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
                border: 1px solid #000;
                padding: 20px;
                position: relative;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .society-name {
                font-weight: bold;
                font-size: 18px;
                text-transform: uppercase;
              }
              .reg-number {
                font-style: italic;
              }
              .address {
                margin-bottom: 10px;
              }
              .bill-title {
                font-weight: bold;
                font-size: 16px;
                margin: 10px 0;
              }
              .member-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
              }
              .info-group {
                display: flex;
                flex-direction: column;
              }
              .info-label {
                font-weight: bold;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
              }
              th, td {
                border: 1px solid #000;
                padding: 8px;
              }
              th {
                font-weight: bold;
                text-align: left;
              }
              .amount-col {
                text-align: right;
              }
              .total-row {
                font-weight: bold;
              }
              .terms {
                margin-top: 15px;
              }
              .terms-title {
                font-weight: bold;
              }
              .bank-details {
                border-top: 1px dashed #000;
                padding-top: 15px;
                margin-top: 15px;
              }
              .bank-title {
                font-weight: bold;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-weight: bold;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                .receipt-container {
                  border: none;
                  padding: 10px;
                }
              }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <div class="header">
                <div class="society-name">${organisation[0]?.SocietyName || 'WHITE ROSE CO-OPERATIVE HOUSING SOCIETY LTD'}</div>
                <div class="reg-number">Reg.No.: BOM/HSG/714OF1964</div>
                <div class="address">4, PERRY ROAD, BANDRA (WEST), MUMBAI-400 050</div>
                <div class="bill-title">MAINTENANCE BILL</div>
              </div>
  
              <div class="member-info">
                <div class="info-group">
                  <span class="info-label">Member:</span>
                  <span>${memberName}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">FLAT:</span>
                  <span>401</span>
                </div>
                <div class="info-group">
                  <span class="info-label">Bill No.:</span>
                  <span>${formValues.invoiceNumber}</span>
                </div>
              </div>
  
              <div class="member-info">
                <div class="info-group">
                  <span class="info-label">Floor:</span>
                  <span>4th Floor</span>
                </div>
                <div class="info-group">
                  <span class="info-label">Date:</span>
                  <span>${formValues.invoiceDate ? format(formValues.invoiceDate, "dd-MMM-yy") : ""}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">Wing:</span>
                  <span>-</span>
                </div>
              </div>
  
              <div class="member-info">
                <div class="info-group">
                  <span class="info-label">Area:</span>
                  <span>-</span>
                </div>
                <div class="info-group">
                  <span class="info-label">Due Date:</span>
                  <span>${formValues.dueDate ? format(formValues.dueDate, "dd-MMM-yy") : ""}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">Billing Period:</span>
                  <span>${formValues.period || "1-Dec-24 To 31-Dec-24"}</span>
                </div>
              </div>
  
              <table>
                <thead>
                  <tr>
                    <th>SR NO.</th>
                    <th>PARTICULARS</th>
                    <th class="amount-col">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  ${DetailsData.map((item, index) => {
        const particular = particularsOptions.find(option => option.id === item.serviceId);
        return `
                      <tr>
                        <td>${index + 1}</td>
                        <td>${particular ? particular.name : item.serviceId}</td>
                        <td class="amount-col">${parseFloat(item.amounts).toFixed(2)}</td>
                      </tr>
                    `;
      }).join('')}
                  <tr class="total-row">
                    <td colspan="2" style="text-align: right;">Sub-Total</td>
                    <td class="amount-col">${totalAmount.toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="2" style="text-align: right;">Dues/Excess(-)</td>
                    <td class="amount-col">${totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
  
              <div style="font-weight: bold;">
                Amount in Words: INR ${toWords(totalAmount)} Only
              </div>
  
              <div class="terms">
                <div class="terms-title">Terms & Conditions</div>
                <div style="font-style: italic;">E&O.E.</div>
                <div>1. Cheques to be in favour of "${organisation[0]?.SocietyName || "WHITE ROSE CHS LTD"}" & Cheques to be dropped in the cheque drop box.</div>
                <div>2. Mention your Flat No. and Mobile No. on the reverse of the cheque.</div>
                <div>3. Non Payment of Bill will attract interest @21 % PA.</div>
                <div>4. Errors to be intimated within 7 days to Society Office</div>
              </div>
  
              <div style="margin-top: 10px;">
                <span style="font-weight: bold;">Remarks:</span>
                <span>${formValues.narration || "Maintenance bills for 1-Dec-24 to 31-Dec-24"}</span>
              </div>
  
              <div class="bank-details">
                <div class="bank-title">Bank Details for ${organisation[0]?.SocietyName || "WHITE ROSE CO-OPERATIVE HOUSING SOCIETY LTD"}</div>
                <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                  <span>Bank Name: SVC Bank Ltd.</span>
                  <span>A/c No.: 300003000012169</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                  <span>Branch & IFSC: Bandra & SVCB0000003</span>
                  <span>Sign image</span>
                </div>
              </div>
  
              <div class="footer">
                Chairman/Secretary/Manager
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      console.error('Receipt element not found');
    }
  };

  return (
    <Box>
      <Box>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={() => {
            handleDrawerOpen();
            setFormValues({
              memberId: '',
              invoiceNumber: '',
              invoiceDate: null,
              period: '',
              dueDate: null,
              narration: '',
              amtInWords: '',
            });
            setDetailsData([{ serviceId: '', amounts: '' }]);
          }}>
            Create Bill Invoice
          </Button>
        </Box>

        <Box mt={4}>
          <MaterialReactTable
            columns={columns}
            data={data}
            enableColumnOrdering
            enableColumnResizing
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => handleRowClick(row.original),
              sx: { cursor: 'pointer' },
            })}
          />
        </Box>

        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleCancel}
          PaperProps={{
            sx: {
              width: isSmallScreen ? '100%' : '60%',
              borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
              zIndex: 1000,
            },
          }}
          key={isDrawerOpen} // Force re-render on drawer open
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 3, borderBottom: '1px solid #ccc' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {isEditing ? 'Edit Bill Invoice' : 'Create Bill Invoice'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MoreVertIcon sx={{ cursor: 'pointer', color: 'black' }} />
              <CloseIcon onClick={handleCancel} sx={{ cursor: 'pointer' }} />
            </Box>
          </Box>

          <Divider />
          <Box>
            <Box m={2}>
              <Typography>DR Member Name</Typography>
              <Autocomplete
                options={memberOptions}
                sx={{ mt: 2, mb: 2, backgroundColor: '#fff' }}
                size="small"
                onChange={(e, value) => handleFormChange('memberId', value ? value.id : '')}
                value={memberOptions.find((option) => option.id === formValues.memberId) || null}
                getOptionLabel={(option) => option.label || ''}  // Changed from option.name to option.label
                renderInput={(params) => <TextField {...params} placeholder="Member Name" />}
                isClearable={true}
              />
            </Box>

            <Box display={'flex'} alignItems="center" gap={2}>
              <Box flex={1} m={2}>
                <Box>
                  <Typography>Bill Number</Typography>
                  <TextField
                    type="number"
                    size="small"
                    margin="normal"
                    placeholder="Bill Number"
                    fullWidth
                    value={formValues.invoiceNumber}
                    onChange={(e) => handleFormChange('invoiceNumber', e.target.value)}
                  />
                </Box>

                <Box>
                  <Typography>Period</Typography>
                  <TextField
                    size="small"
                    type="text"
                    margin="normal"
                    onChange={(e) => handleFormChange('period', e.target.value)}
                    value={formValues.period}
                    placeholder="Period"
                    fullWidth
                  />
                </Box>
              </Box>

              <Box flex={1} m={2}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box>
                      <Typography>Bill Date</Typography>
                      <DatePicker
                        format="dd/MM/yyyy"
                        sx={{ width: '100%' }}
                        value={formValues.invoiceDate}
                        onChange={(newValue) => handleFormChange('invoiceDate', newValue)}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </Box>
                  </LocalizationProvider>
                </Box>

                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box>
                      <Typography>Due Date</Typography>
                      <DatePicker
                        format="dd/MM/yyyy"
                        sx={{ width: '100%' }}
                        value={formValues.dueDate}
                        onChange={(newValue) => handleFormChange('dueDate', newValue)}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </Box>
                  </LocalizationProvider>
                </Box>
              </Box>
            </Box>

            <Box m={2}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SR NO.</TableCell>
                      <TableCell>Particulars</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {DetailsData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Autocomplete
                            options={particularsOptions}
                            value={particularsOptions.find((option) => option.id === item.serviceId) || null}
                            onChange={(e, newValue) => {
                              const updatedItems = [...DetailsData];
                              updatedItems[index].serviceId = newValue ? newValue.id : '';
                              setDetailsData(updatedItems);
                            }}
                            getOptionLabel={(option) => option.name || ''}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Particulars"
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            name="amounts"
                            placeholder="Amount"
                            value={item.amounts}
                            onChange={(e) => handleInputChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          {DetailsData.length > 1 && (
                            <Button variant="contained" onClick={() => handleRemoveItem(index)}>
                              Remove
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="right" sx={{ fontWeight: 'bold' }}>
                        Sub-Total
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        {DetailsData.reduce((total, item) => total + parseFloat(item.amounts || 0), 0)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Button variant="contained" color="primary" onClick={handleAddItem} sx={{ mt: 2 }}>
                Add Item
              </Button>
            </Box>

            <Box mt={2} m={2}>
              <Typography sx={{ fontWeight: 'bold' }}>Amount in Words:</Typography>
              <TextField
                size="small"
                type="text"
                name="amtInWords"
                value={formValues.amtInWords}
                fullWidth
                onChange={(e) => handleFormChange('amtInWords', e.target.value)}
              />
            </Box>

            <Box m={2}>
              <Typography>Narration:</Typography>
              <Textarea
                minRows={3}
                value={formValues.narration}
                onChange={(e) => handleFormChange('narration', e.target.value)}
                placeholder="Narration"
                fullWidth
              />
            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} m={1}>
            {isPreviewOpen && (
              <Box sx={{ mt: 2 }}>
                <Receipt formValues={formValues} DetailsData={DetailsData} societyName={organisation[0].SocietyName} />
                <Button onClick={handleGenerateReport} variant="contained" sx={{ mt: 2 }}>
                  Save Report
                </Button>
                <Button onClick={handlePrint} variant="contained" sx={{ mt: 2, ml: 5 }}>
                  Print
                </Button>
              </Box>
            )}

            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} m={1}>
              {isEditing && (
                <Button onClick={handleDelete} variant="contained" color="error">
                  Delete
                </Button>
              )}
              <Button onClick={handleSave} variant="contained">
                Save
              </Button>
              <Button onClick={handlePreview} variant="contained">
                Preview Report
              </Button>
              <Button onClick={handleCancel} variant="outlined">
                Cancel
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default BillInvoice;