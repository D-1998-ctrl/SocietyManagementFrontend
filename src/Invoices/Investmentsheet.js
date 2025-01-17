import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Drawer, Divider,  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import "jspdf-autotable";


const Investmentsheet = () => {
  // for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  //
  const [formData, setFormData] = useState({
    saraswatBank: [{ accountNo: '', principal: '', newRenew: '', accruedInterestFY2122: '', accruedInterest: '', interestPaid: '', closingBalance: '', repairFund: '' }],
    mdccBank: [{ accountNo: '', depositDate: '', openingBalance: '', newRenew: '', accruedInterestFY2223: '', accruedInterest: '', interestPaid: '', tds: '', closingBalance: '', maturityDate: '', fund: '' }]
  });

  const [subtotals, setSubtotals] = useState({
    saraswatBank: {
      principal: 0,
      newRenew: 0,
      accruedInterestFY2122: 0,
      accruedInterest: 0,
      interestPaid: 0,
      closingBalance: 0
    },
    mdccBank: {
      openingBalance: 0,
      newRenew: 0,
      accruedInterestFY2223: 0,
      accruedInterest: 0,
      interestPaid: 0,
      tds: 0,
      closingBalance: 0
    }
  });

  useEffect(() => {
    calculateSubtotals();
  }, [formData.saraswatBank, formData.mdccBank]);


  const handleInputChange = (e, bank, index, field) => {
    const { value } = e.target;
    const newArray = [...formData[bank]]; // Create a copy of the array
    newArray[index][field] = value; // Update the specific field
    setFormData({ ...formData, [bank]: newArray });
  };

  const handleAddRow = (bank) => {
    const newRow = bank === 'saraswatBank'
      ? { accountNo: '', principal: '', newRenew: '', accruedInterestFY2122: '', accruedInterest: '', interestPaid: '', closingBalance: '', repairFund: '' }
      : { accountNo: '', depositDate: '', openingBalance: '', newRenew: '', accruedInterestFY2223: '', accruedInterest: '', interestPaid: '', tds: '', closingBalance: '', maturityDate: '', fund: '' };
    setFormData({ ...formData, [bank]: [...formData[bank], newRow] });
  };

  const handleRemoveRow = (bank, index) => {
    setFormData((prevState) => ({
      ...prevState,
      [bank]: prevState[bank].filter((_, i) => i !== index)
    }));
  };

  const calculateSubtotals = () => {
    const saraswatTotals = formData.saraswatBank.reduce((acc, item) => ({
      principal: acc.principal + (parseFloat(item.principal) || 0),
      newRenew: acc.newRenew + (parseFloat(item.newRenew) || 0),
      accruedInterestFY2122: acc.accruedInterestFY2122 + (parseFloat(item.accruedInterestFY2122) || 0),
      accruedInterest: acc.accruedInterest + (parseFloat(item.accruedInterest) || 0),
      interestPaid: acc.interestPaid + (parseFloat(item.interestPaid) || 0),
      closingBalance: acc.closingBalance + (parseFloat(item.closingBalance) || 0)
    }), { principal: 0, newRenew: 0, accruedInterestFY2122: 0, accruedInterest: 0, interestPaid: 0, closingBalance: 0 });

    const mdccTotals = formData.mdccBank.reduce((acc, item) => ({
      openingBalance: acc.openingBalance + (parseFloat(item.openingBalance) || 0),
      newRenew: acc.newRenew + (parseFloat(item.newRenew) || 0),
      accruedInterestFY2223: acc.accruedInterestFY2223 + (parseFloat(item.accruedInterestFY2223) || 0),
      accruedInterest: acc.accruedInterest + (parseFloat(item.accruedInterest) || 0),
      interestPaid: acc.interestPaid + (parseFloat(item.interestPaid) || 0),
      tds: acc.tds + (parseFloat(item.tds) || 0),
      closingBalance: acc.closingBalance + (parseFloat(item.closingBalance) || 0)
    }), { openingBalance: 0, newRenew: 0, accruedInterestFY2223: 0, accruedInterest: 0, interestPaid: 0, tds: 0, closingBalance: 0 });

    setSubtotals({ saraswatBank: saraswatTotals, mdccBank: mdccTotals });
  };
 


  return (
    <Box>
      <Box >

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button variant="contained" onClick={handleDrawerOpen}> create Investment sheet</Button>

        </Box>


        {/* drawer for new mewmber */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: { width: '60%' }, // Set the width here
          }}
        >
          <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography m={2} variant="h6"><b>Fixed Deposit Form</b></Typography>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleDrawerClose} />
          </Box>
          <Divider />
          <Box>
            <Box m={2}>
              <Typography><b>Saraswat Bank</b></Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Account No</TableCell>
                      <TableCell>Principal</TableCell>
                      <TableCell>New / Renew</TableCell>
                      <TableCell>Accrued Interest FY 21-22</TableCell>
                      <TableCell>Accrued Interest</TableCell>
                      <TableCell>Interest Paid</TableCell>
                      <TableCell>Closing Balance</TableCell>
                      <TableCell>Repair Fund</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.saraswatBank.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            size='small'
                            sx={{ width: '100px' }}
                            type="text"
                            name="accountNo"
                            placeholder="Account No"
                            value={item.accountNo}
                            onChange={(e) => handleInputChange(e, 'saraswatBank', index, 'accountNo')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                           size='small'
                           sx={{ width: '100px' }}
                            type="number"
                            name="principal"
                            placeholder="Principal"
                            value={item.principal}
                            onChange={(e) => handleInputChange(e, 'saraswatBank', index, 'principal')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            sx={{ width: '100px' }}
                            type="number"
                            name="newRenew"
                            placeholder="NewRenew"
                            value={item.newRenew}
                            onChange={(e) => handleInputChange(e, 'saraswatBank', index, 'newRenew')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                           size='small'
                           sx={{ width: '100px' }}
                            type="number"
                            name="accruedInterestFY2122"
                            placeholder="Accrued Interest FY 21-22"
                            value={item.accruedInterestFY2122}
                            onChange={(e) => handleInputChange(e, 'saraswatBank', index, 'accruedInterestFY2122')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            sx={{ width: '100px' }}
                            type="number"
                            name="accruedInterest"
                            placeholder="Accrued Interest"
                            value={item.accruedInterest}
                            onChange={(e) => handleInputChange(e, 'saraswatBank', index, 'accruedInterest')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            sx={{ width: '100px' }}
                            type="number"
                            name="interestPaid"
                            placeholder="Interest Paid"
                            value={item.interestPaid}
                            onChange={(e) => handleInputChange(e, 'saraswatBank', index, 'interestPaid')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                           size='small'
                           sx={{ width: '100px' }}
                            type="number"
                            name="closingBalance"
                            placeholder="Closing Balance"
                            value={item.closingBalance}
                            onChange={(e) => handleInputChange(e, 'saraswatBank', index, 'closingBalance')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                           size='small'
                           sx={{ width: '100px' }}
                            type="text"
                            name="repairFund"
                            placeholder="Repair Fund"
                            value={item.repairFund}
                            onChange={(e) => handleInputChange(e, 'saraswatBank', index, 'repairFund')}
                          />
                        </TableCell>
                        <TableCell>
                          {formData.saraswatBank.length > 1 && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleRemoveRow('saraswatBank', index)}
                            >
                              Remove
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow >
                      <TableCell style={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                      <TableCell>{subtotals.saraswatBank.principal}</TableCell>
                      <TableCell>{subtotals.saraswatBank.newRenew}</TableCell>
                      <TableCell>{subtotals.saraswatBank.accruedInterestFY2122}</TableCell>
                      <TableCell>{subtotals.saraswatBank.accruedInterest}</TableCell>
                      <TableCell>{subtotals.saraswatBank.interestPaid}</TableCell>
                      <TableCell>{subtotals.saraswatBank.closingBalance}</TableCell>
                      <TableCell colSpan={2} />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddRow('saraswatBank')}
                sx={{ mt: 2 }}  // mt: 2 is equivalent to marginTop: 16px
              >
                Add Row
              </Button>

            </Box>



            <Box m={2}>
              <Box m={2} >
                <Typography><b>MDCC Bank</b></Typography>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Account No</TableCell>
                      <TableCell>Deposit Date</TableCell>
                      <TableCell>Opening Balance</TableCell>
                      <TableCell>New / Renew</TableCell>
                      <TableCell>Accrued Interest FY 22-23</TableCell>
                      <TableCell>Accrued Interest</TableCell>
                      <TableCell>Interest Paid</TableCell>
                      <TableCell>TDS</TableCell>
                      <TableCell>Closing Balance</TableCell>
                      <TableCell>Maturity Date</TableCell>
                      <TableCell>Fund</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.mdccBank.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            size='small'
                            sx={{ width: '100px' }}
                            type="text"
                            name="accountNo"
                            placeholder="Account No"
                            value={item.accountNo}
                            onChange={(e) => handleInputChange(e, 'mdccBank', index, 'accountNo')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="date"
                            name="depositDate"
                            placeholder="Deposit Date"
                            value={item.depositDate}
                           
                            onChange={(e) => handleInputChange(e, 'mdccBank', index, 'depositDate')}
                            sx={{ width: '120px' }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                             size='small'
                             sx={{ width: '100px' }}
                            type="number"
                            name="openingBalance"
                            placeholder="Opening Balance"
                            value={item.openingBalance}
                            onChange={(e) => handleInputChange(e, 'mdccBank', index, 'openingBalance')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size='small'
                            sx={{ width: '100px' }}
                            type="text"
                            name="newRenew"
                            placeholder="New/Renew"
                            value={item.newRenew}
                            onChange={(e) => handleInputChange(e, 'mdccBank', index, 'newRenew')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                             size='small'
                             sx={{ width: '100px' }}
                            type="number"
                            name="accruedInterestFY2223"
                            placeholder="Accrued Interest FY 22-23"
                            value={item.accruedInterestFY2223}
                            onChange={(e) => handleInputChange(e, 'mdccBank', index, 'accruedInterestFY2223')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                              size='small'
                              sx={{ width: '100px' }}
                            type="number"
                            name="accruedInterest"
                            placeholder="Accrued Interest"
                            value={item.accruedInterest}
                            onChange={(e) => handleInputChange(e, 'mdccBank', index, 'accruedInterest')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                              size='small'
                              sx={{ width: '100px' }}
                            type="number"
                            name="interestPaid"
                            placeholder="Interest Paid"
                            value={item.interestPaid}
                            onChange={(e) => handleInputChange(e, 'mdccBank', index, 'interestPaid')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                           size='small'
                            type="number"
                            name="tds"
                            placeholder="TDS"
                            value={item.tds}
                            onChange={(e) => handleInputChange(e, 'mdccBank', index, 'tds')}
                            sx={{ width: '100px' }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                               size='small'
                               sx={{ width: '100px' }}
                            type="number"
                            name="closingBalance"
                            placeholder="Closing Balance"
                            value={item.closingBalance}
                            onChange={(e) => handleInputChange(e, 'mdccBank', index, 'closingBalance')}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="date"
                            name="maturityDate"
                            placeholder="Maturity Date"
                            value={item.maturitydate}
                        
                            onChange={(e) => handleInputChange(e, 'mdccBank', index, 'maturitydate')}
                            sx={{ width: '120px' }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                               size='small'
                               sx={{ width: '100px' }}
                            type="text"
                            name="fund"
                            placeholder="Fund"
                            value={item.fund}
                            onChange={(e) => handleInputChange(e, 'mdccBank', index, 'fund')}
                         
                          />
                        </TableCell>
                        <TableCell>
                          {formData.mdccBank.length > 1 && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleRemoveRow('mdccBank', index)}
                            >
                              Remove
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow >
                      <TableCell style={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{subtotals.mdccBank.openingBalance}</TableCell>
                      <TableCell>{subtotals.mdccBank.newRenew}</TableCell>
                      <TableCell>{subtotals.mdccBank.accruedInterestFY2223}</TableCell>
                      <TableCell>{subtotals.mdccBank.accruedInterest}</TableCell>
                      <TableCell>{subtotals.mdccBank.interestPaid}</TableCell>
                      <TableCell>{subtotals.mdccBank.tds}</TableCell>
                      <TableCell>{subtotals.mdccBank.closingBalance}</TableCell>
                      <TableCell colSpan={3}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
                

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddRow('mdccBank')}
                sx={{ mt: 2 }}  // mt: 2 is equivalent to marginTop: 16px
              >
                Add Row
              </Button>
            </Box>








          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={2} m={1}>
            <Box>
              <Button variant='contained'>Generate Pdf </Button>
            </Box>

            <Box>
              <Button onClick={handleDrawerClose} variant='outlined'>Cancel </Button>
            </Box>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default Investmentsheet;





