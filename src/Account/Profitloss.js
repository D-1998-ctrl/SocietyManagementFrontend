
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Grid
} from '@mui/material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import "jspdf-autotable";
import jsPDF from "jspdf";


const ProfitAndLossReport = () => {
  const REACT_APP_URL =process.env.REACT_APP_URL
  const [reportData, setReportData] = useState({
    incomeLedgers: [],
    expenseLedgers: [],
    // allRelevantLedgers: [],
    boardMembers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${REACT_APP_URL}/Account/profit-loss/report`, {
          method: "GET",
          redirect: "follow"
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setReportData(result);
        console.log('reportData',result)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <Typography color="error">Error: {error}</Typography>
    </Box>
  );

  // Calculate totals
  const totalExpenses = reportData.expenseLedgers.reduce((sum, ledger) => sum + parseFloat(ledger.opening || 0), 0);
  const totalIncome = reportData.incomeLedgers.reduce((sum, ledger) => sum + parseFloat(ledger.opening || 0), 0);
  //
  const netProfitLoss = totalIncome - totalExpenses;


  //pdf
  const generateProfitLossPDF = (reportData, netProfitLoss, totalExpenses, totalIncome) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Profit and Loss Report', 14, 15);
    doc.setFontSize(12);

    // Prepare table data
    const expenseData = reportData.expenseLedgers.map(ledger => [
      ledger.accountName,
      ledger.opening.toFixed(2),
      ledger.typeCode
    ]);

    const incomeData = reportData.incomeLedgers.map(ledger => [
      ledger.accountName,
      ledger.opening.toFixed(2),
      ledger.typeCode
    ]);




    // Add Expenses section
    doc.setFontSize(14);
    doc.text('Expenses', 14, 30);

    let nextY = 35;
    if (reportData.expenseLedgers.length > 0) {
      doc.autoTable({
        head: [['Account Name', 'Amount', 'Type']],
        body: expenseData,
        startY: nextY,
        styles: { cellPadding: 3, fontSize: 9 },
        headStyles: { fillColor: [240, 240, 240], textColor: 0 }, // neutral gray
        columnStyles: {
          1: { halign: 'center' }
        }
      });
      nextY = doc.lastAutoTable.finalY + 10; // Space after table
    } else {
      doc.text('No expense records found', 14, nextY);
      nextY += 10;
    }

    // Add Income section
    doc.setFontSize(14);
    doc.text('Income', 14, nextY);

    nextY += 5;
    if (reportData.incomeLedgers.length > 0) {
      doc.autoTable({
        head: [['Account Name', 'Amount', 'Type']],
        body: incomeData,
        startY: nextY,
        styles: { cellPadding: 3, fontSize: 9 },
        headStyles: { fillColor: [240, 240, 240], textColor: 0 },
        columnStyles: {
          1: { halign: 'center' }
        }
      });
      nextY = doc.lastAutoTable.finalY + 10;
    } else {
      doc.text('No income records found', 14, nextY);
      nextY += 10;
    }

    // Summary section
    doc.setFontSize(14);
    doc.text('Summary', 14, nextY);

const adjustedTotalExpenses =
  netProfitLoss > 0 ? (totalExpenses + netProfitLoss).toFixed(2) : totalExpenses.toFixed(2);

    const summaryData = [
      ['Total Income', totalIncome.toFixed(2)],
      ['Total Expenses', adjustedTotalExpenses],
      ['Net ' + (netProfitLoss >= 0 ? 'Profit' : 'Loss'), Math.abs(netProfitLoss).toFixed(2)]
    ];

    doc.autoTable({
      body: summaryData,
      startY: nextY + 5,
      styles: { cellPadding: 3, fontSize: 10 },
      bodyStyles: { fontStyle: 'bold' },
      columnStyles: {
        1: { halign: 'right' }
      }
    });

    //boardMembers
    if (reportData.boardMembers?.length > 0) {
      const members = reportData.boardMembers.filter(member =>
        ['President', 'Secretary', 'Treasurer'].includes(member.position)
      );

      if (members.length > 0) {
        nextY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : nextY + 20;

        doc.setFontSize(14);
        doc.text('Board Members', 14, nextY);
        nextY += 10;

        // Column widths and spacing
        const colWidth = 60;
        const startX = 14;
        const spacing = 10;

        // Draw names
        members.forEach((member, index) => {
          doc.setFontSize(12);
          doc.text(member.name, startX + index * (colWidth + spacing), nextY);
        });

        // Draw positions
        nextY += 7;
        members.forEach((member, index) => {
          doc.setFont(undefined, 'bold');
          doc.text(member.position, startX + index * (colWidth + spacing), nextY);
        });

        // Draw signature label
        nextY += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        members.forEach((_, index) => {
          doc.text('Signature:', startX + index * (colWidth + spacing), nextY);
        });

        // Draw signature lines
        nextY += 2;
        members.forEach((_, index) => {
          const lineX = startX + index * (colWidth + spacing);
          doc.line(lineX, nextY + 3, lineX + 50, nextY + 3); // 50px signature line
        });

        nextY += 15;
      }
    }
    // Generate PDF
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 1000);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant="h4" gutterBottom>
          Profit and Loss Report
        </Typography>

        <Box sx={{ cursor: 'pointer', color: '#2c85de', }}>
          <LocalPrintshopIcon onClick={() => generateProfitLossPDF(reportData, netProfitLoss, totalExpenses, totalIncome)} sx={{ fontSize: 40 }} />
        </Box>

      </Box>


      <Grid container spacing={3} sx={{ mb: 3, mt: 2 }}>
        {/* Expenses Section - Left Side */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Expenses
            </Typography>
            {reportData.expenseLedgers.length > 0 ? (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Account Name</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.expenseLedgers.map((ledger) => (
                        <TableRow key={ledger._id}>
                          <TableCell>{ledger.accountName}</TableCell>
                          <TableCell align="center">{ledger.opening}</TableCell>
                          <TableCell>{ledger.typeCode}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography
                  variant="body1"
                  color={netProfitLoss >= 0 ? 'success.main' : 'error.main'}
                  sx={{ mt: 1 }}
                >
                  <strong>Net {netProfitLoss >= 0 ? 'Profit' : 'Loss'}:</strong>{" "}
                  {Math.abs(netProfitLoss).toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography variant="body1">No expense records found</Typography>
            )}
          </Paper>
        </Grid>

        {/* Income Section - Right Side */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Income
            </Typography>
            {reportData.incomeLedgers.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Account Name</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.incomeLedgers.map((ledger) => (
                      <TableRow key={ledger._id}>
                        <TableCell>{ledger.accountName}</TableCell>
                        <TableCell align="center">{ledger.opening}</TableCell>
                        <TableCell>{ledger.typeCode}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1">No income records found</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Summary Section */}
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>


        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 30%' }}>
            <Typography variant="body1">
              <strong>Total Expenses:</strong>{" "}
              {netProfitLoss > 0
                ? (totalExpenses + netProfitLoss).toFixed(2)
                : totalExpenses.toFixed(2)}
            </Typography>

          </Box>
          <Box sx={{ flex: '1 1 17%' }}>
            <Typography variant="body1">
              <strong>Total Income:</strong> {totalIncome.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Board members */}
      {reportData.boardMembers.length > 0 && (
        <Box elevation={3} sx={{ p: 2, mt: 10 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            {reportData.boardMembers
              .filter(member =>
                ['President', 'Secretary', 'Treasurer'].includes(member.position)
              )
              .map((member, index) => (
                <Box key={index} sx={{ textAlign: 'center', mx: 2 }}>
                  {/* Name */}
                  <Typography variant="body1">
                    {member.name}
                  </Typography>

                  {/* Position */}
                  <Typography variant="body1" fontWeight="bold">
                    {member.position}
                  </Typography>

                  {/* Signature */}
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Signature:
                  </Typography>
                  <Box sx={{ borderBottom: '1px solid black', width: 200, mt: 4 }} />
                </Box>
              ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProfitAndLossReport;