import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box
} from '@mui/material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import "jspdf-autotable";
import jsPDF from "jspdf";

const TrialBalance = () => {
    const [vouchers, setVouchers] = useState([]);
    const [groupedVouchers, setGroupedVouchers] = useState({});

    // Group vouchers by LedgerId
    const groupByLedgerId = (vouchers) => {
        return vouchers.reduce((acc, voucher) => {

            const ledgerId = voucher.LedgerId._id;

            if (!acc[ledgerId]) {

                acc[ledgerId] = {
                    ledger: voucher.LedgerId,
                    vouchers: [],
                };
            }


            acc[ledgerId].vouchers.push(voucher);

            return acc;
        }, {});
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8001/Voucher/');
                const data = response.data;
                setVouchers(data);
                const grouped = groupByLedgerId(data);
                setGroupedVouchers(grouped);

                // Log accountName for each group
                Object.values(grouped).forEach(group => {
                    console.log("Account Name:", group.ledger.accountName);
                });

            } catch (error) {
                console.error("Error fetching vouchers:", error);
            }
        };
        fetchData();
    }, []);
    console.log(groupedVouchers)



//print data
const generateLedgerPDF = (groupedVouchers) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Trial And Balance', 14, 15);
    
    // Prepare table data
    const tableData = Object.entries(groupedVouchers).map(([ledgerId, group]) => {
        const opening = group.ledger.opening || 0;
        const totalDebit = group.vouchers.reduce((sum, voucher) => sum + (voucher.DrAmount || 0), 0);
        const totalCredit = group.vouchers.reduce((sum, voucher) => sum + (voucher.CrAmount || 0), 0);
        const closingBalance = opening + totalDebit - totalCredit;
        
        return [
            group.ledger.accountName,
            opening.toFixed(2),
            totalDebit.toFixed(2),
            totalCredit.toFixed(2),
            closingBalance.toFixed(2)
        ];
    });
    
    // Calculate grand totals
    if (Object.keys(groupedVouchers).length > 0) {
        const totalOpening = Object.values(groupedVouchers).reduce((sum, group) => 
            sum + (group.ledger.opening || 0), 0);
        const totalDebit = Object.values(groupedVouchers).reduce((sum, group) => 
            sum + group.vouchers.reduce((s, v) => s + (v.DrAmount || 0), 0), 0);
        const totalCredit = Object.values(groupedVouchers).reduce((sum, group) => 
            sum + group.vouchers.reduce((s, v) => s + (v.CrAmount || 0), 0), 0);
        const totalClosing = totalOpening + totalDebit - totalCredit;
        
        // Add grand total row
        tableData.push([
            'Grand Total',
            totalOpening.toFixed(2),
            totalDebit.toFixed(2),
            totalCredit.toFixed(2),
            totalClosing.toFixed(2)
        ]);
    }
    
    // Add the main table
doc.autoTable({
    head: [['Account Name', 'Opening Balance', 'Debit Amount', 'Credit Amount', 'Closing Balance']],
    body: tableData,
    startY: 25,
    styles: { 
        cellPadding: 3, 
        fontSize: 9
    },
    headStyles: { 
        fillColor: [41, 128, 185], 
        textColor: 255,
        fontStyle: 'bold'
    },
    columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' }
    },
    didParseCell: function (data) {
        const isLastRow = data.row.index === tableData.length - 1;
        if (isLastRow && data.section === 'body') {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [240, 240, 240];
        }
    }
});
    
    // Generate PDF as blob and open in new window
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    
    // Revoke the object URL after some time to free up memory
    setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
    }, 1000);
};


    return (


        <Box>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Box>
                    <h2>Vouchers</h2>
                </Box>

                <Box  sx={{cursor:'pointer', color:'#2c85de',}}>
                    <LocalPrintshopIcon  onClick={() => generateLedgerPDF(groupedVouchers)}  sx={{fontSize:40}} />
                </Box>

            </Box>



            {/* <Box>
                <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Account Name</th>
                             <th>Opening Balance</th>
                             <th>Total Debit</th>
                            <th>Total Credit</th>
                            
                           
                            <th>Closing Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedVouchers).map(([ledgerId, group]) => {
                            // Calculate totals for each account
                            const totalCredit = group.vouchers.reduce((sum, voucher) => sum + (voucher.CrAmount || 0), 0);
                            const totalDebit = group.vouchers.reduce((sum, voucher) => sum + (voucher.DrAmount || 0), 0);

                            // Get opening and closing balances (adjust these based on your data structure)

                            const closingBalance = group.ledger.opening + totalDebit - totalCredit;;

                            return (
                                <tr key={ledgerId}>
                                    <td>{group.ledger.accountName}</td>
                                     <td>{group.ledger.opening}</td>
                                      <td>{totalDebit.toFixed(2)}</td>
                                    <td>{totalCredit.toFixed(2)}</td>
                                   
                                   
                                    <td>{closingBalance.toFixed(2)}</td>
                                </tr>
                            );
                        })}

                        
                        {Object.keys(groupedVouchers).length > 0 && (
                            <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                <td>Grand Total</td>
                                <td>
                                    {Object.values(groupedVouchers).reduce((sum, group) =>
                                        sum + group.vouchers.reduce((s, v) => s + (v.CrAmount || 0), 0), 0).toFixed(2)
                                    }
                                </td>
                                <td>
                                    {Object.values(groupedVouchers).reduce((sum, group) =>
                                        sum + group.vouchers.reduce((s, v) => s + (v.DrAmount || 0), 0), 0).toFixed(2)
                                    }
                                </td>

                                <td></td>
                                <td></td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Box> */}

            {/* <Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="ledger table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Account Name</b></TableCell>
                                <TableCell align="right"><b>Opening Balance</b></TableCell>
                                <TableCell align="right"><b> Debit Amount</b></TableCell>
                                <TableCell align="right"><b> Credit Amount</b></TableCell>
                                <TableCell align="right"><b>Closing Balance</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(groupedVouchers).map(([ledgerId, group]) => {
                                const totalCredit = group.vouchers.reduce((sum, voucher) => sum + (voucher.CrAmount || 0), 0);
                                const totalDebit = group.vouchers.reduce((sum, voucher) => sum + (voucher.DrAmount || 0), 0);
                                const closingBalance = group.ledger.opening + totalDebit - totalCredit;

                                return (
                                    <TableRow key={ledgerId}>
                                        <TableCell component="th" scope="row">
                                            {group.ledger.accountName}
                                        </TableCell>
                                        <TableCell align="right">{group.ledger.opening}</TableCell>
                                        <TableCell align="right">{totalDebit.toFixed(2)}</TableCell>
                                        <TableCell align="right">{totalCredit.toFixed(2)}</TableCell>
                                        <TableCell align="right">{closingBalance}</TableCell>
                                    </TableRow>
                                );
                            })}

                       
                          {Object.keys(groupedVouchers).length > 0 && (
    <TableRow sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
        <TableCell><b>Grand Total</b></TableCell>
        <TableCell></TableCell>
        <TableCell align="right">
            <b>
                {Object.values(groupedVouchers).reduce((sum, group) =>
                    sum + group.vouchers.reduce((s, v) => s + (v.DrAmount || 0), 0), 0
                ).toFixed(2)}
            </b>
        </TableCell>
        <TableCell align="right">
            <b>
                {Object.values(groupedVouchers).reduce((sum, group) =>
                    sum + group.vouchers.reduce((s, v) => s + (v.CrAmount || 0), 0), 0
                ).toFixed(2)}
            </b>
        </TableCell>
        <TableCell></TableCell>
    </TableRow>
)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box> */}
            <Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="ledger table">
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Account Name</b></TableCell>
                                <TableCell align="right"><b>Opening Balance</b></TableCell>
                                <TableCell align="right"><b>Debit Amount</b></TableCell>
                                <TableCell align="right"><b>Credit Amount</b></TableCell>
                                <TableCell align="right"><b>Closing Balance</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(groupedVouchers).map(([ledgerId, group]) => {
                                const opening = group.ledger.opening || 0;
                                const totalDebit = group.vouchers.reduce((sum, voucher) => sum + (voucher.DrAmount || 0), 0);
                                const totalCredit = group.vouchers.reduce((sum, voucher) => sum + (voucher.CrAmount || 0), 0);
                                const closingBalance = opening + totalDebit - totalCredit;

                                return (
                                    <TableRow key={ledgerId}>
                                        <TableCell component="th" scope="row">
                                            {group.ledger.accountName}
                                        </TableCell>
                                        <TableCell align="right">{opening.toFixed(2)}</TableCell>
                                        <TableCell align="right">{totalDebit.toFixed(2)}</TableCell>
                                        <TableCell align="right">{totalCredit.toFixed(2)}</TableCell>
                                        <TableCell align="right">{closingBalance.toFixed(2)}</TableCell>
                                    </TableRow>
                                );
                            })}

                            {/* Grand Total Row */}
                            {Object.keys(groupedVouchers).length > 0 && (() => {
                                const totalOpening = Object.values(groupedVouchers).reduce((sum, group) =>
                                    sum + (group.ledger.opening || 0), 0);
                                const totalDebit = Object.values(groupedVouchers).reduce((sum, group) =>
                                    sum + group.vouchers.reduce((s, v) => s + (v.DrAmount || 0), 0), 0);
                                const totalCredit = Object.values(groupedVouchers).reduce((sum, group) =>
                                    sum + group.vouchers.reduce((s, v) => s + (v.CrAmount || 0), 0), 0);
                                const totalClosing = totalOpening + totalDebit - totalCredit;

                                return (
                                    <TableRow sx={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
                                        <TableCell><b>Grand Total</b></TableCell>
                                        <TableCell align="right"><b>{totalOpening.toFixed(2)}</b></TableCell>

                                        <TableCell align="right"><b>{totalDebit.toFixed(2)}</b></TableCell>
                                        <TableCell align="right"><b>{totalCredit.toFixed(2)}</b></TableCell>

                                        <TableCell align="right"><b>{totalClosing.toFixed(2)}</b></TableCell>
                                    </TableRow>
                                );
                            })()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </Box>



    );
};

export default TrialBalance;
