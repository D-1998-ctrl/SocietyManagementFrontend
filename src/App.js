
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import GroupMembers from './Members/groupMembers';
import Documents from './Members/Documents';
import MemberContri from './Members/MemberContri'
import Property from './Property/Property';
import Organization from './Society/Organization';
import Meeting from './Society/Meeting';
import Managingcommittee from './Society/Managingcommittee';
import AccountLedger from './Account/AccountLedger';
import Dashboard from './Dashboard';
import Voucher from './Voucher/voucher'
import ContraVoucher from './Voucher/ContraVoucher';
import PaymentVoucher from './Voucher/PaymentVoucher';
import PurchaseVoucher from './Voucher/PurchaseVoucher';
import ReceiptVoucher from './Voucher/ReceiptVoucher';
import JournalVoucher from './Voucher/JournalVoucher';
import Invoice from './Invoices/Invoice';
import BillInvoice from './Invoices/BillInvoice';
import BillFormat from './Invoices/BillFormat';
import IncomeSheet from './Invoices/IncomeSheet';
import Balancesheet from './Invoices/Balancesheet';
import AuditReport from './Invoices/AuditReport';
import Investmentsheet from './Invoices/Investmentsheet';
import Accountdash from './Members/Accountdash'
import Overview from './pages/Overview';
import Info from './pages/Info';
import Settings from './Settings/Settings';
import CreateService from './Invoices/CreateServices';
import InvoiceTemplate from './Invoices/Invoice_Template';
import DemoInvoice from './Invoices/DemoInvoice';
// import LogIn from './pages/LogIn';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path='/' element={<LogIn/>}/> */}
        <Route path='/' element={<Sidebar />} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/member/membergroup" element={<GroupMembers />} />
          <Route path="/member/documents" element={<Documents />} />
          <Route path="/member/member-contribution" element={<MemberContri />} />
          <Route path="/MemberDashboard/overview" element={<Overview />} />
          <Route path="/property/updateproperty" element={<Property />} />
          <Route path="/society/organization" element={<Organization />} />
          <Route path="/society/meeting" element={<Meeting />} />
          <Route path="/society/committee" element={<Managingcommittee />} />
          <Route path="/account/accountledger" element={<AccountLedger />} />
          {/* <Route path="/accountdash" element={<Accountdash />} /> */}

          <Route>
            <Route path="/accountdash" element={<Accountdash />}>
              <Route path="overview" element={<Overview />} />
              <Route path="info" element={<Info />} />
            </Route>
          </Route>

          <Route>
            <Route path="/vouchers" element={<Voucher />}>
              <Route path="journalvoucher" element={<JournalVoucher />} />
              <Route path="receiptvoucher" element={<ReceiptVoucher />} />
              <Route path="purchasevoucher" element={<PurchaseVoucher />} />
              <Route path="paymentvoucher" element={<PaymentVoucher />} />
              <Route path="contravoucher" element={<ContraVoucher />} />
            </Route>
          </Route>


          <Route>
            <Route path="/invoice" element={<Invoice />}>
              <Route path="billinvoice" element={<BillInvoice />} />
              <Route path="DemoInvoice" element={<DemoInvoice />} />
              <Route path="CreateService" element={<CreateService />} />
              <Route path="InvoiceTemplate" element={<InvoiceTemplate />} />
              <Route path="billformat" element={<BillFormat />} />
              <Route path="incomeexpendituresheet" element={<IncomeSheet />} />
              <Route path="auditreport" element={<AuditReport />} />
              <Route path="investmentsheet" element={<Investmentsheet />} />
              <Route path="balancesheet" element={<Balancesheet />} />
            </Route>
          </Route>

          <Route path='settings' element={<Settings />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;

