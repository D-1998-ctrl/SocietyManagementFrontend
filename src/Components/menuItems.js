


import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';

import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { AccountCircle as AccountCircleIcon, Assessment as AssessmentIcon, } from '@mui/icons-material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SettingsIcon from '@mui/icons-material/Settings';
import Audittemp from '../AuditTempate/Audittemp';
export const menuItems = [


  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardCustomizeRoundedIcon />,
    submenus: [],
  },


  {
    title: "Members",
    path: '/member/membergroup',
    icon: <GroupIcon />,
    // submenus: [
    //   {
    //     title: "Member Group",
    //     path: "/member/membergroup",
    //     icon: <FiberManualRecordIcon />,
    //   },



    // {
    //   title: "Documents",
    //   path: "/member/documents",
    //   icon: <DescriptionIcon />,
    // },
    // {
    //   title: "Member Contribution",
    //   path: "/member/member-contribution",
    //   icon: <AttachMoneyIcon />,
    // },
    // ],
  },

  {
    title: "Property",
    path: '/property',
    icon: <CorporateFareIcon />,
    submenus: [
      // {
      //   title: "Property",
      //   path: "/property/newproperty",
      //   icon: <FaBuilding />,
      // },
      {
        title: "Property",
        path: "/property/updateproperty",
        icon: <FiberManualRecordIcon />,
      },
    ],
  },

  {
    title: "Society",
    path: '/society',
    icon: <GroupIcon />,
    submenus: [
      {
        title: "Organization",
        path: "/society/organization",
        icon: <FiberManualRecordIcon />,
      },
      {
        title: "Meeting",
        path: "/society/meeting",
        icon: <FiberManualRecordIcon />,
      },
      {
        title: "Managing Committee",
        path: "/society/committee",
        icon: <FiberManualRecordIcon />,
      },
    ],
  },

  {
    title: "Account",
    path: '/account',
    icon: <AccountCircleIcon />,
    submenus: [
      {
        title: "Account Ledger",
        path: "/account/accountledger",
        icon: <FiberManualRecordIcon />,
      },

      // {
      //   title: "Trial Balance ",
      //   path: "/account/trialbalance",
      //   icon: <FiberManualRecordIcon />,
      // },

      // {
      //   title: "Profit & Loss",
      //   path: "/account/profitloss",
      //   icon: <FiberManualRecordIcon />,
      // },


      // {
      //   title: "Balance Sheet",
      //   path: "/account/balancesheet",
      //   icon: <FiberManualRecordIcon />,
      // },


      // {
      //   title: "Audit Report",
      //   path: "/account/auditreport",
      //   icon: <FiberManualRecordIcon />,
      // },
    ],
  },

  {
    title: "Voucher",
    path: '/vouchers/journalvoucher',
    icon: <DescriptionIcon />,
    submenus: [],
  },

  {
    title: "Invoice",
    path: '/invoice/billinvoice',
    icon: <DescriptionIcon />,
    submenus: [],
  },



{
    title: "Audit Template",
    path: "/audittemp",
    icon: <DescriptionIcon />,
    submenus: [],
  },




  {
    title: "Reports",
    path: '/report',
    icon: <DescriptionIcon />,
    submenus: [
    
     {
        title: "Trial Balance ",
        path: "/report/trialbalance",
        icon: <FiberManualRecordIcon />,
      },

      {
        title: "Profit & Loss",
        path: "/report/profitloss",
        icon: <FiberManualRecordIcon />,
      },


      {
        title: "Balance Sheet",
        path: "/report/balancesheet",
        icon: <FiberManualRecordIcon />,
      },


      {
        title: "Audit Report",
        path: "/report/auditreport",
        icon: <FiberManualRecordIcon />,
      },
  
  
  
  ],
  },

  {
    title: "Settings",
    path: "/settings",
    icon: <SettingsIcon />,
    submenus: [],
  },


];
