
import { useState, useEffect } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  Grid,
  Box
} from '@mui/material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import "jspdf-autotable";
import jsPDF from "jspdf";
function BalanceSheet() {
  const REACT_APP_URL =process.env.REACT_APP_URL
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([])
  const [vouchers, setVouchers] = useState({});
  const [boardofMembers, setboardofMembers] = useState([]);

  useEffect(() => {
    const fetchBalanceSheet = async () => {
      try {
        const response = await fetch(`${REACT_APP_URL}/Account/api/accounts/balance-sheet`, {
          method: "GET",
          redirect: "follow"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch balance sheet data");
        }

        const result = await response.json();
        console.log('result',result)
        setAssets(result.assets);
        setLiabilities(result.liabilities)
        setboardofMembers(result.boardofMembers)

        // fetchAllVouchers(result.assets);
        // fetchliablitiesVouchers(result.liabilities)
      } catch (error) {
        console.error("Error fetching balance sheet:", error);

      }
    };

    // const fetchAllVouchers = async (assets) => {
    //   try {
    //     const vouchersMap = {};

    //     await Promise.all(assets.map(async (asset) => {
    //       const ledgerId = asset._id;
    //       try {
    //         const response = await fetch(`http://localhost:8001/Voucher/ledger/${ledgerId}`);
    //         if (!response.ok) {
    //           console.error(`Failed to fetch vouchers for ledger ${ledgerId}`);
    //           return;
    //         }
    //         const voucherData = await response.json();
    //         vouchersMap[ledgerId] = voucherData;
    //       } catch (err) {
    //         console.error(`Error fetching vouchers for ledger ${ledgerId}:`, err);
    //       }
    //     }));


    //     setVouchers(prev => ({ ...prev, ...vouchersMap }));
    //   } catch (error) {
    //     console.error("Error fetching vouchers:", error);
    //   }
    // };

    // const fetchliablitiesVouchers = async (liabilities) => {
    //   try {
    //     const vouchersMap = {};

    //     await Promise.all(liabilities.map(async (liabilities) => {
    //       const ledgerId = liabilities._id;
    //       try {
    //         const response = await fetch(`http://localhost:8001/Voucher/ledger/${ledgerId}`);
    //         if (!response.ok) {
    //           console.error(`Failed to fetch vouchers for ledger ${ledgerId}`);
    //           return;
    //         }
    //         const voucherData = await response.json();
    //         vouchersMap[ledgerId] = voucherData;
    //       } catch (err) {
    //         console.error(`Error fetching vouchers for ledger ${ledgerId}:`, err);
    //       }
    //     }));


    //     setVouchers(prev => ({ ...prev, ...vouchersMap }));
    //   } catch (error) {
    //     console.error("Error fetching vouchers:", error);
    //   }
    // };

    fetchBalanceSheet();
  }, []);


  const generateBalanceSheetPDF = (assets, liabilities, vouchers, boardOfMembers) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Balance Sheet', 14, 15);

    const buildTableData = (items) => {
      return items.map(item => {
        const ledgerVouchers = vouchers[item._id] || [];
        const totalDebit = ledgerVouchers.reduce((sum, v) => sum + (v.DrAmount || 0), 0);
        const totalCredit = ledgerVouchers.reduce((sum, v) => sum + (v.CrAmount || 0), 0);
        const amount = totalDebit - totalCredit + parseFloat(item.opening || 0);
        return [
          item.accountName,
          parseFloat(item.opening || 0).toFixed(2),
          totalDebit.toFixed(2),
          totalCredit.toFixed(2),
          amount.toFixed(2)
        ];
      });
    };

    const getTotalRow = (items) => {
      const totalAmount = items.reduce((sum, item) => {
        const ledgerVouchers = vouchers[item._id] || [];
        const totalDebit = ledgerVouchers.reduce((sum, v) => sum + (v.DrAmount || 0), 0);
        const totalCredit = ledgerVouchers.reduce((sum, v) => sum + (v.CrAmount || 0), 0);
        return sum + (totalDebit - totalCredit + parseFloat(item.opening || 0));
      }, 0);
      return ['Total', '', '', '', totalAmount.toFixed(2)];
    };

    let startY = 25;

    // ASSETS TABLE
    doc.setFontSize(12);
    doc.text('Assets', 14, startY);
    startY += 5;
    const assetsTable = buildTableData(assets);
    assetsTable.push(getTotalRow(assets));

    doc.autoTable({
      head: [['Account Name', 'Opening', 'Debit', 'Credit', 'Amount']],
      body: assetsTable,
      startY: startY,
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      didParseCell: function (data) {
        const isLastRow = data.row.index === assetsTable.length - 1;
        if (isLastRow && data.section === 'body') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [240, 240, 240];
        }
      }
    });

    startY = doc.lastAutoTable.finalY + 10;

    // LIABILITIES TABLE
    doc.text('Liabilities', 14, startY);
    startY += 5;
    const liabilitiesTable = buildTableData(liabilities);
    liabilitiesTable.push(getTotalRow(liabilities));

    doc.autoTable({
      head: [['Account Name', 'Opening', 'Debit', 'Credit', 'Amount']],
      body: liabilitiesTable,
      startY: startY,
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      didParseCell: function (data) {
        const isLastRow = data.row.index === liabilitiesTable.length - 1;
        if (isLastRow && data.section === 'body') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [240, 240, 240];
        }
      }
    });

    // Signature Section
    startY = doc.lastAutoTable.finalY + 20;
    const importantMembers = boardOfMembers.filter(member =>
      ['President', 'Secretary', 'Treasurer'].includes(member.position)
    );

    importantMembers.forEach((member, index) => {
      const x = 14 + (index * 65); // Adjust spacing between signatures
      doc.text(member.name, x, startY);
      doc.setFont(undefined, 'bold');
      doc.text(member.position, x, startY + 5);
      doc.setFont(undefined, 'normal');
      doc.line(x, startY + 15, x + 50, startY + 15); // Signature line
      doc.text("Signature", x, startY + 20);
    });

    // Open in new tab
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 1000);
  };



  return (
    <Box>
      <Paper elevation={3} sx={{ padding: 3, margin: 3 }}>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Box>
            <h2>Balance Sheet</h2>
          </Box>

          <Box sx={{ cursor: 'pointer', color: '#2c85de', }}>
            <LocalPrintshopIcon onClick={() => generateBalanceSheetPDF(assets, liabilities, vouchers, boardofMembers)} sx={{ fontSize: 40 }} />
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* Assets Section - Left */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>Assets</Typography>
            {assets.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><b>Account Name</b></TableCell>
                      <TableCell align="right"><b>Opening</b></TableCell>
                      <TableCell align="right"><b>Debit</b></TableCell>
                      <TableCell align="right"><b>Credit</b></TableCell>
                      <TableCell align="right"><b>Amount</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assets.map((item) => {
                      const ledgerVouchers = vouchers[item._id] || [];
                      const totalDebitassets = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.DrAmount || 0), 0);
                      const totalCreditassets = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.CrAmount || 0), 0);
                      const Amountassets = totalDebitassets - totalCreditassets + (item.opening)

                      return (
                        <TableRow key={item._id}>
                          <TableCell>{item.accountName}</TableCell>
                          <TableCell align="right">{parseFloat(item.opening).toFixed(2)}</TableCell>
                          <TableCell align="right">{totalDebitassets.toFixed(2)}</TableCell>
                          <TableCell align="right">{totalCreditassets.toFixed(2)}</TableCell>
                          <TableCell align="right">{Amountassets.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell colSpan={4} align="right"><b>Total:</b></TableCell>
                      {/* <TableCell align="right">
                        <b>
                          {assets.reduce((sum, item) => {
                            const ledgerVouchers = vouchers[item._id] || [];
                            const totalDebitassets = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.DrAmount || 0), 0);
                            const totalCreditassets = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.CrAmount || 0), 0);
                            return sum + (totalDebitassets - totalCreditassets + parseFloat(item.opening));
                          }, 0).toFixed(2)}
                        </b>
                      </TableCell> */}
                      <TableCell align="right">
                        <b>
                          {assets.reduce((sum, item) => {
                            const ledgerVouchers = vouchers[item._id] || [];
                            const totalDebitassets = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.DrAmount || 0), 0);
                            const totalCreditassets = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.CrAmount || 0), 0);
                            const Amountassets = totalDebitassets - totalCreditassets + parseFloat(item.opening);
                            return sum + Amountassets;
                          }, 0).toFixed(2)}
                        </b>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No asset records found</Typography>
            )}
          </Grid>

          {/* Liabilities Section - Right */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 1 }}>Liabilities</Typography>
            {liabilities.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><b>Account Name</b></TableCell>
                      <TableCell align="right"><b>Opening</b></TableCell>
                      <TableCell align="right"><b>Debit</b></TableCell>
                      <TableCell align="right"><b>Credit</b></TableCell>
                      <TableCell align="right"><b>Amount</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {liabilities.map((item) => {
                      const ledgerVouchers = vouchers[item._id] || [];
                      const totalDebit = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.DrAmount || 0), 0);
                      const totalCredit = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.CrAmount || 0), 0);
                      const Amount = totalDebit - totalCredit + item.opening
                      return (
                        <TableRow key={item._id}>
                          <TableCell>{item.accountName}</TableCell>
                          <TableCell align="right">{parseFloat(item.opening).toFixed(2)}</TableCell>
                          <TableCell align="right">{totalDebit.toFixed(2)}</TableCell>
                          <TableCell align="right">{totalCredit.toFixed(2)}</TableCell>
                          <TableCell align="right">{Amount.toFixed(2)}</TableCell>

                        </TableRow>
                      );
                    })}

                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell colSpan={4} align="right"><b>Total:</b></TableCell>

                      <TableCell align="right">
                        <b>
                          {liabilities.reduce((sum, item) => {
                            const ledgerVouchers = vouchers[item._id] || [];
                            const totalDebit = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.DrAmount || 0), 0);
                            const totalCredit = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.CrAmount || 0), 0);
                            const Amount = totalDebit - totalCredit + item.opening
                            return sum + Amount;
                          }, 0).toFixed(2)}
                        </b>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No liabilities records found</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {boardofMembers.length > 0 && (
        <Box elevation={3} sx={{ p: 2, mt: 15 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            {boardofMembers
              .filter(member =>
                ['President', 'Secretary', 'Treasurer'].includes(member.position)
              )
              .map((member, index) => (
                <Box key={index} sx={{ textAlign: 'center', mx: 2 }}>

                  {/* Signature */}
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Signature:
                  </Typography>
                  <Box sx={{ borderBottom: '1px solid black', width: 200, mt: 4 }} />
                  {/* Name */}
                  <Typography variant="body1">
                    {member.name}
                  </Typography>

                  {/* Position */}
                  <Typography variant="body1" fontWeight="bold">
                    {member.position}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Box>
      )}

    </Box>
  );
}

export default BalanceSheet;