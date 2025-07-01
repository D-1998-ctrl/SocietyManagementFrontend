import  { useEffect, useState } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Button,
  Typography,
  Container,
  Drawer,
  Divider,
  useMediaQuery,
   Radio, RadioGroup, FormControlLabel,
     TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Collapse,
 IconButton

} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { useTheme } from '@mui/material/styles';
import moment from "moment";

const AuditorForm = () => {
  const REACT_APP_URL =process.env.REACT_APP_URL
   const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
// const [templateSubject, setTemplateSubject] = useState("");
// const [templateContent, setTemplateContent] = useState("");
const [auditorName, setAuditorName] = useState("");
const [address, setAddress] = useState("");
const [mobileNo, setMobileNo] = useState("");


//to get all templates
const [templateOptions, setTemplateOptions] = useState([]);
// const [selectedTemplate, setSelectedTemplate] = useState(null);
const [societyId, setsocietyId] = useState("");

//get all templates
const gettemplates = async () => {
    try {
      const url = `${REACT_APP_URL}/Auditemp/`;
      const response = await fetch(url);
      const data = await response.json();
      setTemplateOptions(data);
      console.log('data',data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const Options = templateOptions.map((temp) => ({
    value: temp._id,
    label: temp.tempName,
  }));


  //fetch society

const [societyName, setSocietyName] = useState('');
const [societyAddress, setSocietyAddress] = useState('');
const[registeringAuthority,setRegisteringAuthority] = useState('');
const[societyRegisterAddress,setsocietyRegisterAddress] = useState('');
const[societyRegisterDate,setsocietyRegisterDate] = useState('');
const[societyRegisterNo,setsocietyRegisterNo] = useState('');
const fetchsociety=async()=>{
 try {
      const url = `${REACT_APP_URL}/Organisation`;
      const response = await fetch(url);
      const data = await response.json();
      console.log('socitry',data)
      setsocietyId(data[0]._id)
      setSocietyName(data[0].SocietyName)
      setSocietyAddress(data[0].AddressLine1)
      setRegisteringAuthority(data[0].RegisteringAuthority)
      setsocietyRegisterAddress(data[0].AddressofRegisteringAuthority)
      setsocietyRegisterDate(data[0].RegisteredDate)
      setsocietyRegisterNo(data[0].Registration)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
}


///create AuditReport

const[presentAuditfromDate,setpresentAuditfromDate]=useState(null)
const[presentAuditToDate,setpresentAuditToDate]=useState(null)

const[AuditcompletedfromDate,setAuditcompletedfromDate]=useState(null)
const[AuditcompletedToDate,setAuditcompletedToDate]=useState(null)

const[AuditsubmittedDate,setAuditsubmittedDate]=useState(null)
const[memberpaidentrancefee,setmemberpaidentrancefee]=useState("no")
const[memberapplicationsfilledproperty,setmemberapplicationsfilledproperty]=useState("no")
const[membersIMSCRules,setmembersIMSCRules]=useState("no")

const[membersJMSCRules,setmembersJMSCRules]=useState("no")
const[decreaseddismissedorregister,setdecreaseddismissedorregister]=useState("no")

const[resignationdulyaccepted,setresignationdulyaccepted]=useState("no")
const[membersnominations,setmembersnominations]=useState("no" )

const[applicationforshares,setapplicationforshares]=useState("no")
const[Isshareregisteruptodate,setIsshareregisteruptodate]=useState("no")
const[entriesincashbook,setentriesincashbook]=useState("no")
const[writtenledger,setwrittenledger]=useState("no")

const[totalofshareledger,settotalofshareledger]=useState("no")
const[sharecertificatesissued,setsharecertificatesissued]=useState("no")

const[sharestransfersandrefunds,setsharestransfersandrefunds]=useState("no")
const[byelawsborrowingssociety,setbyelawsborrowingssociety]=useState("no")

const[hasitbeenexceeded,sethasitbeenexceeded]=useState("no")
const[permissioncompetentauthority,setpermissioncompetentauthority]=useState("no")

  //MEETINGS 
  const [AnnualGeneralMeetingDate, SetAnnualGeneralMeetingDate] = useState(null)
  const [SpecialGeneralMeetingFromDate, setSpecialGeneralMeetingFromDate] = useState(null)
  const [SpecialGeneralMeetingToDate, setSpecialGeneralMeetingToDate] = useState(null)
  const [NoOfBoardMeetings, SetNoOfBoardMeetings] = useState(" ")
  const [NoOfSubCommitteeMeetings, setNoOfSubCommitteeMeetings] = useState(" ")
  const [NoofotherMeetings, setNoofotherMeetings] = useState(" ")

  //6. RECTIFICATION REPORTS :
  const [societysubmittedauditrectification, setsocietysubmittedauditrectification] = useState('');
  // i
  // if yes
  const [societysubmittedauditrectificationDate, setsocietysubmittedauditrectificationDate] = useState(null);
  //if no
  const [societysubmittedauditrectificationReson, setsocietysubmittedauditrectificationReson] = useState('');

  //ii
  const [importantpointsmentionedneglectedSociety, setimportantpointsmentionedneglectedSociety] = useState('');
  //yes
  const [generalremarks, setgeneralremarks] = useState('');

  //7.AUDIT FEE
  const [auditfees, setauditfees] = useState('');
const [detailsaboutoutstandingauditfees, setdetailsaboutoutstandingauditfees] = useState('');

//8.INTERNAL OR LOCAL AUDIT
const [internallocalaudit, setinternallocalaudit] = useState('');
const [CoordinationbetweenAuditor, setCoordinationbetweenAuditor] = useState('');

//9.MANAGING DIRECTOR/MANAGER/ SECRETARY 
const [Nameofofficer, setNameofofficer] = useState('');
const [PaydrawnGrade, setPaydrawnGrade] = useState('');
const [otherallowances, setotherallowances] = useState('');
const [whetherismember, setwhetherismember] = useState('');
const [hasBorrowed, sethasBorrowed] = useState('');
const [otherAmountsDue, setotherAmountsDue] = useState('');
const [listofStaff, setlistofStaff] = useState('');

//10.BREACHES
  const [hasCopyOfActRulesByeLaws, sethasCopyOfActRulesByeLaws] = useState('');
  const [SectionNo, setSectionNo] = useState('');
  const [RulesNos, setRulesNos] = useState('');
  const [ByeLawsNo, setByeLawsNo] = useState('');
  const [rulesundertheByelaws, setrulesundertheByelaws] = useState('');

  //11 PROFIT AND LOSS
  const [Profitorloss, setProfitorloss] = useState('');
const [netProfitDistributed, setnetProfitDistributed] = useState('');


//12. CASH, BANK BALANCE AND SECURITIES :
const [amountcounted, setamountcounted] = useState('');
const [producedByDesignation, setproducedByDesignation] = useState('');
const [infoaccordingCashBook, setinfoaccordingCashBook] = useState('');
const [ArrangementssafetyCash, setArrangementssafetyCash] = useState('');
const [BankReconciliationstatement, setBankReconciliationstatement] = useState('');
const [physicallysecurities, setphysicallysecurities] = useState('');
const [dividendscollected, setdividendscollected] = useState('');
const [relevantcertificates, setrelevantcertificates] = useState('');
const [investmentregister, setinvestmentregister] = useState('');


//13 Movable and immovable property 
const [Isrelevantregister, setIsrelevantregister] = useState('');
const [Verifypropertyphysically, setVerifypropertyphysically] = useState('');
const [Verifyimmovableproperty, setVerifyimmovableproperty] = useState('');
const [propertydulyinsured, setpropertydulyinsured] = useState('');
const [depreciationcharges, setdepreciationcharges] = useState('');
const [rateofdepreciation, setrateofdepreciation] = useState('');


//14
const [draftofauditmemo, setdraftofauditmemo] = useState('');

//////////////////FORM NO 28 //////////////////////////////////////////////////////////////////////
const [AgencysanctioningLoan, setAgencysanctioningLoan] = useState('');
const [Purposeloansanctioned, setPurposeloansanctioned] = useState('');
const [loansanctionedAmount, setloansanctionedAmount] = useState('');
const [Maximumamountdrawn, setMaximumamountdrawn] = useState('');
const [Repaymentsmade, setRepaymentsmade] = useState('');
const [Outstanding, setOutstanding] = useState('');
const [Amountoverdueifany, setAmountoverdueifany] = useState('');
const [Remarks, setRemarks] = useState('');
const [repaymentsloanspunctual, setrepaymentsloanspunctual] = useState('');
const [conditionslaiddown, setconditionslaiddown] = useState('');
const [necessarydocuments, setnecessarydocuments] = useState('');
//2
const [amountsubsidysanctioned, setamountsubsidysanctioned] = useState('');
const [Hassanctionedamount, setHassanctionedamount] = useState('');
//3
const [financialassistancemembership, setfinancialassistancemembership] = useState('');
const [certificatesfromofficers, setcertificatesfromofficers] = useState('');
const [declarationfrommembers, setdeclarationfrommembers] = useState('');
//4
const [detailslandsforconstructions, setdetailslandsforconstructions] = useState('');
const [titledeeds, settitledeeds] = useState('');
const [ConstructionFlats, setConstructionFlats] = useState('');
const [Constructionroads, setConstructionroads] = useState('');
const [OpenSpace, setOpenSpace] = useState('');
const [Otherpurposes, setOtherpurposes] = useState('');

const [layoutsapproved, setlayoutsapproved] = useState('');
const [completioncertificates, setcompletioncertificates] = useState('');
//5
const [buildingconstructioncommenced, setbuildingconstructioncommenced] = useState('');
const [Noofhousesflats, setNoofhousesflats] = useState('');
const [flatsallottedmembers, setflatsallottedmembers] = useState('');
const [termsconditionscontracts, settermsconditionscontracts] = useState('');
const [contractsproperlysanctioned, setcontractsproperlysanctioned] = useState('');
const [tendersofquotation, settendersofquotation] = useState('');
const [workprogresscertificate, setworkprogresscertificate] = useState('');
const [architectsemployed, setarchitectsemployed] = useState('');
const [constructioncompletedtoplans, setconstructioncompletedtoplans] = useState('');
const [propertyregister, setpropertyregister] = useState('');
const [measurementbook, setmeasurementbook] = useState('');
const [Stockregisters, setStockregisters] = useState('');
const [valuationcertificates, setvaluationcertificates] = useState('');
const [expenditureallocated, setexpenditureallocated] = useState('');
const [buildingaccordingplans, setbuildingaccordingplans] = useState('');
const [flatownersociety, setflatownersociety] = useState('');
const [constructioninsured, setconstructioninsured] = useState('');
const [promotersobligation, setpromotersobligation] = useState('');
const [Examineagreements, setExamineagreements] = useState('');
const [favorofmembers, setfavorofmembers] = useState('');
const [Societysinkingfund, setSocietysinkingfund] = useState('');
const [Amountsrepaymentloan, setAmountsrepaymentloan] = useState('');
const [Municipaltaxes, setMunicipaltaxes] = useState('');
const [Leaserent, setLeaserent] = useState('');
const [Servicecharges, setServicecharges] = useState('');
const [Contributionsinkingfund, setContributionsinkingfund] = useState('');
//6
const [recoveriesofloan, setrecoveriesofloan] = useState('');
const [amountsofoverdues, setamountsofoverdues] = useState('');
const [recoveroverdues, setrecoveroverdues] = useState('');
//7
const [expenditureapproved, setexpenditureapproved] = useState('');
///////////////////////////////////////////////////////Schedule//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const [ScheduleI, setScheduleI] = useState('');
const [ScheduleII, setScheduleII] = useState('');
const [ScheduleIII, setScheduleIII] = useState('');
const [ScheduleIIIA, setScheduleIIIA] = useState('');
const [ScheduleIV, setScheduleIV] = useState('');
const [ScheduleV, setScheduleV] = useState('');


  const createAuditorReport = () => {
    reports.forEach((report) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const formattedpresentAuditfromDate = moment(presentAuditfromDate).format("YYYY-MM-DD");
      const formattedpresentAuditToDate = moment(presentAuditToDate).format("YYYY-MM-DD");
      const formattedAuditcompletedfromDate = moment(AuditcompletedfromDate).format("YYYY-MM-DD");
      const formattedAuditcompletedToDate = moment(AuditcompletedToDate).format("YYYY-MM-DD");
      const formattedAuditsubmittedDate = moment(AuditsubmittedDate).format("YYYY-MM-DD");

      const formattedAnnualGeneralMeetingDate = moment(AnnualGeneralMeetingDate).format("YYYY-MM-DD");
      const formattedSpecialGeneralMeetingFromDate = moment(SpecialGeneralMeetingFromDate).format("YYYY-MM-DD");
      const formattedSpecialGeneralMeetingToDate = moment(SpecialGeneralMeetingToDate).format("YYYY-MM-DD");
      const formattedauditrectificationDate = moment(societysubmittedauditrectificationDate).format("YYYY-MM-DD")

      const raw = JSON.stringify({
        tempId: report.template?.value,
        subject: report.subject,
        tempBody: report.content,
        societyId,
        auditorname: auditorName,
        auditoraddress: address,
        auditormobileno: mobileNo,
        // 
        presentAuditfromDate: formattedpresentAuditfromDate,
        presentAuditToDate: formattedpresentAuditToDate,
        AuditcompletedfromDate: formattedAuditcompletedfromDate,
        AuditcompletedToDate: formattedAuditcompletedToDate,
        AuditsubmittedDate: formattedAuditsubmittedDate,
        //MEMBERSHIP
        memberpaidentrancefee: memberpaidentrancefee,
        memberapplicationsfilledproperty: memberapplicationsfilledproperty,
        membersIMSCRules: membersIMSCRules,
        membersJMSCRules: membersJMSCRules,
        decreaseddismissedorregister: decreaseddismissedorregister,
        resignationdulyaccepted: resignationdulyaccepted,
        membersnominations: membersnominations,
        // shares
        applicationforshares: applicationforshares,
        Isshareregisteruptodate: Isshareregisteruptodate,
        entriesincashbook: entriesincashbook,
        writtenledger: writtenledger,
        totalofshareledger: totalofshareledger,
        sharecertificatesissued: sharecertificatesissued,
        sharestransfersandrefunds: sharestransfersandrefunds,
        //OUTSIDE BORROWINGS
        byelawsborrowingssociety: byelawsborrowingssociety,
        hasitbeenexceeded: hasitbeenexceeded,
        permissioncompetentauthority: permissioncompetentauthority,
        ordinary: ordinary,
        Normal: normal,
        Sympathizer: sympathizer,
        Societies: societies,
        others: others,
        //MEETINGS
        AnnualGeneralMeetingDate: formattedAnnualGeneralMeetingDate,
        SpecialGeneralMeetingFromDate: formattedSpecialGeneralMeetingFromDate,
        SpecialGeneralMeetingToDate: formattedSpecialGeneralMeetingToDate,
        NoOfBoardMeetings: NoOfBoardMeetings,
        NoOfSubCommitteeMeetings: NoOfSubCommitteeMeetings,
        NoofotherMeetings: NoofotherMeetings,
        //RECTIFICATION REPORTS
        societysubmittedauditrectification: societysubmittedauditrectification,
        societysubmittedauditrectificationDate: formattedauditrectificationDate,
        societysubmittedauditrectificationReson: societysubmittedauditrectificationReson,
        importantpointsmentionedneglectedSociety: importantpointsmentionedneglectedSociety,
        generalremarks: generalremarks,
        //AUDIT FEE 
        auditfees:auditfees,
        detailsaboutoutstandingauditfees:detailsaboutoutstandingauditfees,
        //INTERNAL OR LOCAL AUDIT
        internallocalaudit:internallocalaudit,
        CoordinationbetweenAuditor:CoordinationbetweenAuditor,
        //MANAGING DIRECTOR/MANAGER/ SECRETARY
        Nameofofficer:Nameofofficer,
        PaydrawnGrade:PaydrawnGrade,
        otherallowances:otherallowances,
        whetherismember:whetherismember,
        hasBorrowed:hasBorrowed,
        otherAmountsDue:otherAmountsDue,
        listofStaff:listofStaff,
        //BREACHES 
        hasCopyOfActRulesByeLaws: hasCopyOfActRulesByeLaws,
        SectionNo: SectionNo,
        RulesNos: RulesNos,
        ByeLawsNo: ByeLawsNo,
        rulesundertheByelaws: rulesundertheByelaws, 
       //PROFIT AND LOSS
       Profitorloss:Profitorloss,
       netProfitDistributed:netProfitDistributed,
       // CASH, BANK BALANCE AND SECURITIES
       amountcounted:amountcounted,
       producedByDesignation:producedByDesignation,
       infoaccordingCashBook:infoaccordingCashBook,
       ArrangementssafetyCash:ArrangementssafetyCash,
       BankReconciliationstatement:BankReconciliationstatement,
       physicallysecurities:physicallysecurities,
       dividendscollected:dividendscollected,
       relevantcertificates:relevantcertificates,
       investmentregister:investmentregister,
       //Movable and immovable property 
       Isrelevantregister:Isrelevantregister,
       Verifypropertyphysically:Verifypropertyphysically,
       Verifyimmovableproperty:Verifyimmovableproperty,
       propertydulyinsured:propertydulyinsured,
       depreciationcharges:depreciationcharges,
       rateofdepreciation:rateofdepreciation,
       //14
       draftofauditmemo:draftofauditmemo,
        //////////////////////////////////////////////////FormNo 28 ////////////////////////////////////////////////////////////////////////////
        AgencysanctioningLoan:AgencysanctioningLoan,
        Purposeloansanctioned:Purposeloansanctioned,
        loansanctionedAmount:loansanctionedAmount,
        Maximumamountdrawn:Maximumamountdrawn,
        Repaymentsmade:Repaymentsmade,
        Outstanding:Outstanding,
        Amountoverdueifany:Amountoverdueifany,
        Remarks:Remarks,
        repaymentsloanspunctual:repaymentsloanspunctual,
        conditionslaiddown: conditionslaiddown,
        necessarydocuments: necessarydocuments,
        //2
        amountsubsidysanctioned: amountsubsidysanctioned,
        Hassanctionedamount: Hassanctionedamount,
        //3
        financialassistancemembership: financialassistancemembership,
        certificatesfromofficers: certificatesfromofficers,
        declarationfrommembers: declarationfrommembers,
        //4
        detailslandsforconstructions: detailslandsforconstructions,
        titledeeds: titledeeds,
        ConstructionFlats: ConstructionFlats,
        Constructionroads: Constructionroads,
        OpenSpace: OpenSpace,
        Otherpurposes: Otherpurposes,
        layoutsapproved: layoutsapproved,
        completioncertificates: completioncertificates,
        //5
        buildingconstructioncommenced:buildingconstructioncommenced,
        Noofhousesflats:Noofhousesflats,
        flatsallottedmembers:flatsallottedmembers,
        termsconditionscontracts:termsconditionscontracts,
        contractsproperlysanctioned:contractsproperlysanctioned,
        tendersofquotation:tendersofquotation,
        workprogresscertificate:workprogresscertificate,
        architectsemployed:architectsemployed,
        constructioncompletedtoplans:constructioncompletedtoplans,
        propertyregister:propertyregister,
        measurementbook:measurementbook,
        Stockregisters:Stockregisters,
        valuationcertificates:valuationcertificates,
        expenditureallocated:expenditureallocated,
        buildingaccordingplans:buildingaccordingplans,
        flatownersociety:flatownersociety,
        constructioninsured:constructioninsured,
        promotersobligation:promotersobligation,
        Examineagreements:Examineagreements,
        favorofmembers:favorofmembers,
        Societysinkingfund:Societysinkingfund,
        Amountsrepaymentloan:Amountsrepaymentloan,
        Municipaltaxes:Municipaltaxes,
        Leaserent:Leaserent,
        Servicecharges:Servicecharges,
        Contributionsinkingfund:Contributionsinkingfund,
        //6
        recoveriesofloan:recoveriesofloan,
        amountsofoverdues:amountsofoverdues,
        recoveroverdues: recoveroverdues,
        //7
        expenditureapproved: expenditureapproved,
        // /////////////////////////// Schedule //////////////////////////////////////////////
        ScheduleI: ScheduleI,
        ScheduleII: ScheduleII,
        ScheduleIII: ScheduleIII,
        ScheduleIIIA: ScheduleIIIA,
        ScheduleIV: ScheduleIV,
        ScheduleV: ScheduleV
      });

    fetch(`${REACT_APP_URL}/Audireport/`, {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
     
       
        toast.success("Report created!");
      })
      .catch((error) => console.error(error));
  });

  
};


useEffect(() => {
  gettemplates();
  fetchsociety();
  fetchAuditReports()
}, []);

//Assets and Liabilities
const [vouchers, setVouchers] = useState({});
  const [boardofMembers, setboardofMembers] = useState([]);
  const [groupedAssets, setGroupedAssets] = useState({});
  const [groupedLiabilities, setGroupedLiabilities] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

const groupAccounts = (accounts) => {
  return accounts.reduce((groups, account) => {
    const groupId = account.groupId?._id || 'ungrouped';
    const groupName = account.groupId?.groupName || 'Other Assets';
    
    if (!groups[groupId]) {
      groups[groupId] = {
        groupName: groupName, 
        accounts: []
      };
    }
    groups[groupId].accounts.push(account);
    return groups;
  }, {});
};

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
        // setAssets(result.assets);
        // setLiabilities(result.liabilities);
        setboardofMembers(result.boardofMembers);
            console.log("boardofMembers",result.boardofMembers)
        // Group assets and liabilities
        setGroupedAssets(groupAccounts(result.assets));
        setGroupedLiabilities(groupAccounts(result.liabilities));

        // fetchAllVouchers(result.assets);
        // fetchliablitiesVouchers(result.liabilities);
      } catch (error) {
        console.error("Error fetching balance sheet:", error);
      }
    };

    // ... rest of your useEffect code remains the same ...
    fetchBalanceSheet();
  }, []);


    // Calculate total for a group
  const calculateGroupTotal = (groupAccounts) => {
    return groupAccounts.reduce((sum, item) => {
      const ledgerVouchers = vouchers[item._id] || [];
      const totalDebit = ledgerVouchers.reduce((sum, v) => sum + (v.DrAmount || 0), 0);
      const totalCredit = ledgerVouchers.reduce((sum, v) => sum + (v.CrAmount || 0), 0);
      return sum + (totalDebit - totalCredit + parseFloat(item.opening || 0));
    }, 0);
   };



///pdf
const generatePDF = () => {
  const doc = new jsPDF();

  // === 1. MULTIPLE AUDIT MEMOS ===
  reports.forEach((report, index) => {
    if (index > 0) doc.addPage(); // Add page for each report after the first

    const pageWidth = doc.internal.pageSize.getWidth();

    // Header - Auditor Name
    doc.setFontSize(15);
    const auditorText = auditorName.toUpperCase();
    const textWidth = doc.getTextWidth(auditorText);
    const centerX = (pageWidth - textWidth) / 2;
    doc.text(auditorText, centerX, 10);

    doc.line(10, 12, 200, 12); // Header underline

    // Address & Mobile
    doc.setFontSize(10);
    doc.text(`Address: ${address}`, 10, 20);
    doc.line(10, 22, 200, 22);
    doc.text(`Mobile: ${mobileNo}`, 160, 27);

    // Ref No & Date
    doc.text(`Ref No: Hsg/2024`, 10, 38);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 38);

    // To section
    doc.text("To,", 10, 48);
    doc.setFont("Helvetica", "bold");
    doc.text(registeringAuthority, 10, 54);
    doc.text(societyName || "Society Name", 10, 60);
    doc.text(societyAddress || "Society Address", 10, 66);
    doc.setFont("Helvetica", "normal");

    // Subject and Body
    doc.setFont("Helvetica", "bold");
    doc.text(`Sub: ${report.subject}`, 10, 76);
    doc.setFont("Helvetica", "normal");

    const bodyLines = doc.splitTextToSize(report.content, 180);
    doc.text("Respected Sir,", 10, 86);
    doc.text(bodyLines, 10, 92);

    const endY = 92 + bodyLines.length * 6;
    doc.text("Thanking You,", 10, endY + 10);
  });

  // === 2. FORM NO. 1 ===
  doc.addPage();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('FORM NO. 1', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`NAME OF THE SOCIETY: ${societyName.toUpperCase()}`, 14, 25);
  doc.text(`FULL REGISTERED ADDRESS: ${societyRegisterAddress}`, 14, 32);
  doc.text(`REGISTRATION No: ${societyRegisterNo}`, 14, 39);
  doc.text(`DATE OF REGISTRATION: ${societyRegisterDate ? societyRegisterDate.slice(0, 10) : 'N/A'}`, 14, 46);
  doc.line(10, 50, 200, 50);

  doc.setFontSize(14);
  doc.text('1. AUDIT INFORMATION:', 14, 60);
  doc.setFontSize(12);

  const auditInfo = [
    ['a. Full name of the Auditor', auditorName],
    ['b. Period covered during the present Audit',
      `${presentAuditfromDate ? new Date(presentAuditfromDate).toLocaleDateString() : ''} to ${presentAuditToDate ? new Date(presentAuditToDate).toLocaleDateString() : ''}`],
    ['c. Date on which Audit was commenced and completed',
      `${AuditcompletedfromDate ? new Date(AuditcompletedfromDate).toLocaleDateString() : ''} to ${AuditcompletedToDate ? new Date(AuditcompletedToDate).toLocaleDateString() : ''}`],
    ['d. Date on which Audit was submitted',
      AuditsubmittedDate ? new Date(AuditsubmittedDate).toLocaleDateString() : '']
  ];

  doc.autoTable({
    startY: 65,
    // head: [['Item', 'Details']],
    body: auditInfo,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });

  doc.setFontSize(14);
  doc.text('2. MEMBERSHIP:', 14, doc.autoTable.previous.finalY + 15);
  doc.setFontSize(12);

  const membershipNumbers = [
    ['1.No. of members ',''],
    ['(a) Individuals', ''],
    ['(i) Ordinary', ordinary],
    ['(ii) Normal', normal],
    ['(iii) Sympathizer', sympathizer],
    ['(b) Societies', societies],
    ['(c) Others (Non Members)', others],
    ['Total', calculateTotal()]
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    body: membershipNumbers,
    theme: 'grid',
    margin: { left: 14 }
  });

  const membershipQuestions = [
    ['2. Have new members been duly admitted?', memberpaidentrancefee],
    ['3. Are their written applications in order?', memberapplicationsfilledproperty],
    ['4. Is the members register kept in Form "I"?', membersIMSCRules],
    ['5. Is a list of members kept in form "J"?', membersJMSCRules],
    ['6. Have due remarks been passed?', decreaseddismissedorregister],
    ['7. Are resignation in order?', resignationdulyaccepted],
    ['8. Have nominations been duly entered?', membersnominations]
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 10,
    // head: [['Question', 'Answer']],
    body: membershipQuestions,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });

  doc.setFontSize(14);
  doc.text('3. SHARES:', 14, doc.autoTable.previous.finalY + 15);
  doc.setFontSize(12);

  const sharesQuestions = [
    ['(i) Is application for shares in order?', applicationforshares],
    ['(ii) Is share register written up-to date?', Isshareregisteruptodate],
    ['(iii) Do entries in share register tally with cash book?', entriesincashbook],
    ['(iv) Is the ledger written up-to-date?', writtenledger],
    ['(v) Does total of share ledger tally with balance sheet?', totalofshareledger],
    ['(vi) Have share certificates been issued?', sharecertificatesissued],
    ['(vii) Are shares transfers and refunds in accordance?', sharestransfersandrefunds]
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    // head: [['Question', 'Answer']],
    body: sharesQuestions,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });

  doc.setFontSize(14);
  doc.text('4. OUTSIDE BORROWINGS:', 14, doc.autoTable.previous.finalY + 15);
  doc.setFontSize(12);

  const borrowingsQuestions = [
    ['(i) What is the limit in the bye-laws for borrowings?', byelawsborrowingssociety],
    ['(ii) Has it been exceeded?', hasitbeenexceeded],
    ['(iii) Has necessary permission been obtained?', permissioncompetentauthority]
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    // head: [['Question', 'Answer']],
    body: borrowingsQuestions,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });


  //meetings
   doc.setFontSize(14);
  doc.text('5. MEETINGS:', 14, doc.autoTable.previous.finalY + 15);
  doc.setFontSize(12);

  // Part (i) - Dates of Meetings
  const meetingsDates = [
    ['(i) Give dates of:', ''],
    ['(a) Annual General Meeting', AnnualGeneralMeetingDate ? new Date(AnnualGeneralMeetingDate).toLocaleDateString() : ''],
    ['(b) Special General Meeting (From)', SpecialGeneralMeetingFromDate ? new Date(SpecialGeneralMeetingFromDate).toLocaleDateString() : ''],
    ['(b) Special General Meeting (To)', SpecialGeneralMeetingToDate ? new Date(SpecialGeneralMeetingToDate).toLocaleDateString() : '']
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    body: meetingsDates,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });

  // Part (ii) - Number of Meetings
  const meetingsCounts = [
    ['(ii) State the number of meetings held during the period:', ''],
    ['(a) Board or Managing Committee Meetings', NoOfBoardMeetings || ''],
    ['(b) Executive or Sub-Committee Meetings', NoOfSubCommitteeMeetings || ''],
    ['(c) Other Meetings', NoofotherMeetings || '']
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 10,
    body: meetingsCounts,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });
//RECTIFICATION REPORTS
doc.setFontSize(14);
doc.text('6. RECTIFICATION REPORTS:', 14, doc.autoTable.previous.finalY + 15);
doc.setFontSize(12);

const rectificationReports = [
  ['(i) Has the society submitted audit rectification reports of previous audit memos?', societysubmittedauditrectification],
  ['If yes, date of submission', societysubmittedauditrectification === 'yes' && societysubmittedauditrectificationDate
    ? new Date(societysubmittedauditrectificationDate).toLocaleDateString()
    : 'N/A'],
  ['If no, reasons for non-submission', societysubmittedauditrectification === 'no'
    ? societysubmittedauditrectificationReson || 'N/A'
    : 'N/A'],
  ['(ii) Have any important points from previous audit memos been neglected by the Society?', importantpointsmentionedneglectedSociety],
  ['If yes, general remarks', importantpointsmentionedneglectedSociety === 'yes'
    ? generalremarks || 'N/A'
    : 'N/A']
];

doc.autoTable({
  startY: doc.autoTable.previous.finalY + 20,
  body: rectificationReports,
  theme: 'grid',
  headStyles: { fillColor: [200, 200, 200] },
  margin: { left: 14 }
});

// === 7. AUDIT FEE ===
  doc.setFontSize(14);
  doc.text('7. AUDIT FEE:', 14, doc.autoTable.previous.finalY + 15);
  doc.setFontSize(12);

  const auditFeeData = [
    ['(i) Amount of audit fees last assessed, period, recovery details:', auditfees || 'N/A'],
    ['(ii) Details about outstanding audit fees and reasons for non-payment:', detailsaboutoutstandingauditfees || 'N/A']
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    body: auditFeeData,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });

  // === 8. INTERNAL OR LOCAL AUDIT ===
  doc.setFontSize(14);
  doc.text('8. INTERNAL OR LOCAL AUDIT:', 14, doc.autoTable.previous.finalY + 15);
  doc.setFontSize(12);

  const internalAuditData = [
    ['(i) Internal/local audit details (by whom, period, memo on record):', internallocalaudit || 'N/A'],
    ['(ii) Coordination between Statutory and Internal Auditor:', CoordinationbetweenAuditor || 'N/A']
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    body: internalAuditData,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });

  // === 9. MANAGING DIRECTOR/MANAGER/SECRETARY ===
  doc.setFontSize(14);
  doc.text('9. MANAGING DIRECTOR/MANAGER/SECRETARY:', 14, doc.autoTable.previous.finalY + 15);
  doc.setFontSize(12);

  const managerData = [
    ['(i) Name of officer (Secretary):', Nameofofficer || 'N/A'],
    ['(ii) Pay drawn Grade:', PaydrawnGrade || 'N/A'],
    ['(iii) Other allowances and facilities:', otherallowances || 'N/A'],
    ['(iv) Is he a member?', whetherismember === 'yes' ? 'Yes' : 'No'],
    ['(v) Borrowed/credit facilities (amount and overdue):', hasBorrowed || 'N/A'],
    ['(vi) Other amounts due from him:', otherAmountsDue === 'yes' ? 'Yes' : 'No'],
    ['(vii) List of Staff (names, designation, qualifications, etc.):', listofStaff || 'N/A']
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    body: managerData,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });

// 10. BREACHES
doc.setFontSize(14);
doc.text('10. BREACHES:', 14, doc.autoTable.previous.finalY + 15);
doc.setFontSize(12);

const breachesData = [
  ['(i) Does the society possess copy of the Act, Rules and its registered Bye-laws?', hasCopyOfActRulesByeLaws === 'yes' ? 'Yes' : 'No'],
  ['(ii) Give only numbers of breaches of the Act, Rules and Bylaws:', ''],
  ['1. Section No', SectionNo || ''],
  ['2. Rules No', RulesNos || ''],
  ['3. Bye Laws No', ByeLawsNo || ''],
  ['(iii) Have any rules been framed under the Byelaws? Are they appropriate authority? Are they properly followed?', rulesundertheByelaws === 'yes' ? 'Yes' : 'No']
];

doc.autoTable({
  startY: doc.autoTable.previous.finalY + 20,
  body: breachesData,
  theme: 'grid',
  margin: { left: 14 },
  columnStyles: { 
    0: { cellWidth: 140, fontStyle: 'bold' },
    1: { cellWidth: 40 }
  }
});

// 11. PROFIT AND LOSS
doc.setFontSize(14);
doc.text('11. PROFIT AND LOSS:', 14, doc.autoTable.previous.finalY + 15);
doc.setFontSize(12);

const profitLossData = [
  ['(i) What is the amount of Profit earned or loss incurred during the last Co-operative year?', Profitorloss || ''],
  ['(ii) State if the net profits are distributed (In case of non business societies figures of surplus or Deficit may be given against query No. II (I) above)', netProfitDistributed || '']
];

doc.autoTable({
  startY: doc.autoTable.previous.finalY + 20,
  body: profitLossData,
  theme: 'grid',
  margin: { left: 14 },
  columnStyles: { 
    0: { cellWidth: 140, fontStyle: 'bold' },
    1: { cellWidth: 40 }
  }
});

// 12. CASH, BANK BALANCE AND SECURITIES
doc.setFontSize(14);
doc.text('12. (A) CASH, BANK BALANCE AND SECURITIES:', 14, doc.autoTable.previous.finalY + 15);
doc.setFontSize(12);

const cashBankData = [
  ['(i) Count cash and sign the cash book stating the amount counted and date of which counted.', amountcounted || ''],
  ['(ii) Who produced the Cash for Counting? Give his name & designation. Is the authorized to keep cash?', producedByDesignation || ''],
  ['(iii) Is it correct according to the Cash Book?', infoaccordingCashBook === 'yes' ? 'Yes' : 'No'],
  ['(iv) Are Arrangements for safety of Cash safe and cash-in-transit adequate?', ArrangementssafetyCash === 'yes' ? 'Yes' : 'No'],
  ['(B) BANK BALANCES:', ''],
  ['(i) Do Bank balance shown in Bank Pass books or bank statements and Bank balance shown in Books of accounts? If not, check reconciliation statements.', BankReconciliationstatement || ''],
  ['(C) SECURITIES:', ''],
  ['1. Verify securities physically and see whether they are in the name of society', physicallysecurities === 'yes' ? 'Yes' : 'No'],
  ['2. Are dividends and interest being duly collected?', dividendscollected === 'yes' ? 'Yes' : 'No'],
  ['3. If securities are lodged with the bank, are relevant certificates obtained?', relevantcertificates === 'yes' ? 'Yes' : 'No'],
  ['4. Is investment register maintains and written up-to-date?', investmentregister === 'yes' ? 'Yes' : 'No']
];

doc.autoTable({
  startY: doc.autoTable.previous.finalY + 20,
  body: cashBankData,
  theme: 'grid',
  margin: { left: 14 },
  columnStyles: { 
    0: { cellWidth: 140, fontStyle: 'bold' },
    1: { cellWidth: 40 }
  }
});

// 13. MOVABLE AND IMMOVABLE PROPERTY
doc.setFontSize(14);
doc.text('13. MOVABLE AND IMMOVABLE PROPERTY:', 14, doc.autoTable.previous.finalY + 15);
doc.setFontSize(12);

const propertyData = [
  ['1. Is relevant register maintained and written up-to-date?', Isrelevantregister === 'yes' ? 'Yes' : 'No'],
  ['2. Verify property physically & obtain its list. Do the balance tally with balance sheet Figures?', Verifypropertyphysically || ''],
  ['3. In case of immovable property including lands verify title deeds and see whether they are in the name of Society', Verifyimmovableproperty || ''],
  ['4. Is the property duly insured where necessary? If so, give details in general remarks.', propertydulyinsured || ''],
  ['5. DEPRECIATION:', ''],
  ['(i) Is due depreciation charges?', depreciationcharges === 'yes' ? 'Yes' : 'No'],
  ['(ii) State the rate of depreciation charges on various assets.', rateofdepreciation || '']
];

doc.autoTable({
  startY: doc.autoTable.previous.finalY + 20,
  body: propertyData,
  theme: 'grid',
  margin: { left: 14 },
  columnStyles: { 
    0: { cellWidth: 140, fontStyle: 'bold' },
    1: { cellWidth: 40 }
  }
});

// 14. AUDIT MEMO DISCUSSION
doc.setFontSize(14);
doc.text('14. AUDIT MEMO DISCUSSION:', 14, doc.autoTable.previous.finalY + 15);
doc.setFontSize(12);

const discussionData = [
  ['Have you discussed the draft of audit memo in the board of managing committee meeting? If not state reasons for the same.', draftofauditmemo === 'yes' ? 'Yes' : 'No']
];

doc.autoTable({
  startY: doc.autoTable.previous.finalY + 20,
  body: discussionData,
  theme: 'grid',
  margin: { left: 14 },
  columnStyles: { 
    0: { cellWidth: 140, fontStyle: 'bold' },
    1: { cellWidth: 40 }
  }
});

  // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // === 3. FORM NO. 28 ===
  doc.addPage();

  // FORM NO. 28 Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('FORM NO. 28', 105, 15, { align: 'center' });
  doc.text('AUDIT MEMO (CO-OP. HOUSING SOCIETIES)', 105, 22, { align: 'center' });
  doc.text('PART II', 105, 29, { align: 'center' });
  doc.text(societyName.toUpperCase(), 105, 36, { align: 'center' });
  doc.line(10, 40, 200, 40);

  // 1. BORROWINGS section
  doc.setFontSize(14);
  doc.text('1. BORROWINGS:', 14, 50);
  doc.setFontSize(12);
  doc.text('i. State the loans obtained by the society for various purposes from Govt. & other agencies:', 14, 58);

  const borrowingsData = [
    ['Agency sanctioning Loan:', AgencysanctioningLoan || ''],
    ['Purpose for which loan is sanctioned:', Purposeloansanctioned || ''],
    ['Amount for loan sanctioned:', loansanctionedAmount || ''],
    ['Maximum amount drawn:', Maximumamountdrawn || ''],
    ['Re-payments made:', Repaymentsmade || ''],
    ['Outstanding:', Outstanding || ''],
    ['Amount overdue if any:', Amountoverdueifany || ''],
    ['Remarks:', Remarks || '']
  ];

  doc.autoTable({
    startY: 65,
    body: borrowingsData,
    theme: 'grid',
    margin: { left: 14 },
    columnStyles: { 
      0: { cellWidth: 90, fontStyle: 'bold' },
      1: { cellWidth: 90 }
    }
  });

  const borrowingQuestions = [
    ['ii. Are repayments of loans punctual?', repaymentsloanspunctual === 'yes' ? 'Yes' : 'No'],
    ['iii. Are all conditions laid down for grant of various loans and credits observed?', conditionslaiddown === 'yes' ? 'Yes' : 'No'],
    ['iv. Are necessary documents executed in favors of the authority sanctioning the loan?', necessarydocuments === 'yes' ? 'Yes' : 'No']
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 10,
    body: borrowingQuestions,
    theme: 'grid',
    margin: { left: 14 },
    columnStyles: { 
      0: { cellWidth: 140, fontStyle: 'bold' },
      1: { cellWidth: 40 }
    }
  });

  // 2. GOVERNMENT FINANCIAL ASSISTANCE
  doc.setFontSize(14);
  doc.text('2. GOVERNMENT FINANCIAL ASSISTANCE:', 14, doc.autoTable.previous.finalY + 15);
  doc.setFontSize(12);

  const govtAssistanceData = [
    ['(i) What is the amount of Government subsidy sanctioned and received by the society?', amountsubsidysanctioned || ''],
    ['(ii) Has Government sanctioned any amount for land development?', Hassanctionedamount === 'yes' ? 'Yes' : 'No']
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    body: govtAssistanceData,
    theme: 'grid',
    margin: { left: 14 },
    columnStyles: { 
      0: { cellWidth: 140, fontStyle: 'bold' },
      1: { cellWidth: 40 }
    }
  });

  // 3. MEMBERSHIP
  doc.setFontSize(14);
  doc.text('3. MEMBERSHIP:', 14, doc.autoTable.previous.finalY + 15);
  doc.setFontSize(12);

  const membershipData = [
    ['(i) State whether in case of backward class of co-operative housing societies, certificates from the social welfare officers are obtained for their eligibility to membership and obtaining of financial assistance?', financialassistancemembership || ''],
    ['(ii) State whether certificates are obtained from officers of the concerned industry in case of subsidized industrial housing scheme?', certificatesfromofficers || ''],
    ['(iii) Have declaration been obtained from members that they and their family members do not own lands or houses.', declarationfrommembers || '']
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    body: membershipData,
    theme: 'grid',
    margin: { left: 14 },
    columnStyles: { 
      0: { cellWidth: 140, fontStyle: 'bold' },
      1: { cellWidth: 40 }
    }
  });

  // 4. LANDS AND THEIR DEVELOPMENT
  doc.setFontSize(14);
  doc.text('4. LANDS AND THEIR DEVELOPMENT:', 14, doc.autoTable.previous.finalY + 15);
  doc.setFontSize(12);

  const landsData = [
    ['(i) State whether lands for constructions of houses have been secured purchased or obtained on lease. Give details for the lands, stating total area, survey nos. & CRS nos. if any, price for which purchased, lease rent etc.', detailslandsforconstructions || ''],
    ['(ii) See the title deeds and ascertain whether they are properly executed in favor of society.', titledeeds === 'yes' ? 'Yes' : 'No'],
    ['(iii) State how the lands has been utilized for:', ''],
    ['(a) Construction of Flats', ConstructionFlats || ''],
    ['(b) Construction of roads', Constructionroads || ''],
    ['(c) Open Space', OpenSpace || ''],
    ['(d) Other purposes (give details)', Otherpurposes || ''],
    ['(iv) Have the layouts and plans for development been approved the Municipal Authorities before actual commencement of the work?', layoutsapproved === 'yes' ? 'Yes' : 'No'],
    ['(v) Have completion certificates been obtained from appropriate authorities for drainage, water supply, roads, etc before period construction work of building is commenced?', completioncertificates === 'yes' ? 'Yes' : 'No']
  ];

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    body: landsData,
    theme: 'grid',
    margin: { left: 14 },
    columnStyles: { 
      0: { cellWidth: 140, fontStyle: 'bold' },
      1: { cellWidth: 40 }
    }
  });



  ///5
 
  doc.setFontSize(14);
  doc.text('5. CONSTRUCTION OF BUILDINGS:', 14, doc.autoTable.previous.finalY + 15);
  doc.setFontSize(12);

  // Section (i)
  const constructionData = [
    ['(i)(a) Have building construction commenced?', buildingconstructioncommenced === 'yes' ? 'Yes' : 'No'],
    ['(i)(b) No. of houses/flats constructed and under construction', Noofhousesflats || 'N/A'],
    ['(i)(c) Have the completed houses and flats allotted to members?', flatsallottedmembers === 'yes' ? 'Yes' : 'No'],
    ['(ii) Are buildings constructed on contract basis? Terms observed?', termsconditionscontracts || 'N/A'],
    ['(iii) Are contracts properly sanctioned by competent authority?', contractsproperlysanctioned === 'yes' ? 'Yes' : 'No'],
    ['(iv) Have tenders/quotation been called with advertisement?', tendersofquotation === 'yes' ? 'Yes' : 'No'],
    ['(v) Are contractors paid after work progress certificates?', workprogresscertificate === 'yes' ? 'Yes' : 'No'],
    ['(vi) Terms for architects employed? Any breaches?', architectsemployed === 'yes' ? 'Yes' : 'No'],
    ['(vii) Completion certificate obtained from engineers/architects?', constructioncompletedtoplans === 'yes' ? 'Yes' : 'No'],
    ['(viii) Is property register kept properly and up-to-date?', propertyregister === 'yes' ? 'Yes' : 'No'],
    ['(ix)(a) Job registers and measurement book maintained?', measurementbook === 'yes' ? 'Yes' : 'No'],
    ['(ix)(b) Stock registers maintained?', Stockregisters === 'yes' ? 'Yes' : 'No'],
    ['(ix)(c) Valuation certificates obtained?', valuationcertificates === 'yes' ? 'Yes' : 'No'],
    ['(ix)(d) Expenditure allocated between capital & revenue?', expenditureallocated === 'yes' ? 'Yes' : 'No'],
    ['(x) Deviations from original plans/estimates?', buildingaccordingplans || 'N/A'],
    ['(xi) For flat owner\'s society: Titles transferred to society?', flatownersociety === 'yes' ? 'Yes' : 'No'],
    ['(xii) Are buildings and constructions insured?', constructioninsured === 'yes' ? 'Yes' : 'No'],
    ['(xiii) Promoters fulfilled obligations in flat owner\'s society?', promotersobligation === 'yes' ? 'Yes' : 'No'],
    ['(xiv) Agreements with promoters in society\'s interest?', Examineagreements === 'yes' ? 'Yes' : 'No'],
    ['(xv) Lease deeds executed for members?', favorofmembers === 'yes' ? 'Yes' : 'No'],
    ['(xvi) Sinking fund created as per bye-laws?', Societysinkingfund === 'yes' ? 'Yes' : 'No'],
    ['(xvii)(a) Repayment loan installments covered?', Amountsrepaymentloan === 'yes' ? 'Yes' : 'No'],
    ['(xvii)(b) Municipal and other taxes covered?', Municipaltaxes === 'yes' ? 'Yes' : 'No'],
    ['(xvii)(c) Lease rent covered?', Leaserent === 'yes' ? 'Yes' : 'No'],
    ['(xvii)(d) Service charges and common expenses covered?', Servicecharges === 'yes' ? 'Yes' : 'No'],
    ['(xvii)(e) Contribution to sinking fund covered?', Contributionsinkingfund === 'yes' ? 'Yes' : 'No']
  ];
 doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    body: constructionData,
    theme: 'grid',
    margin: { left: 14 },
    columnStyles: { 
      0: { cellWidth: 140, fontStyle: 'bold' },
      1: { cellWidth: 40 }
    }
  });
 
  //////////////////////////////////////schdule//////////////////////////////////////////////////////////////////////
   // === 4. SCHEDULES ===
  doc.addPage();

  // Header for Schedules
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SCHEDULES', 105, 15, { align: 'center' });
  doc.text(societyName.toUpperCase(), 105, 22, { align: 'center' });
  doc.text('Statutory audit for the year ended 31st March 2024', 105, 29, { align: 'center' });
  doc.line(10, 35, 200, 35);

  // Initialize yPosition
  let yPosition = 45;

  // Function to add schedule with radio button selection
  const addSchedule = (doc, title, description, value) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, yPosition);
    yPosition += 7;

    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(description, 180);
    doc.text(descLines, 14, yPosition);
    yPosition += descLines.length * 6 + 5;

    doc.text(`${value === 'yes' ? 'Yes' : 'No'}`, 14, yPosition);
    yPosition += 10;

    // Add space between schedules
    yPosition += 5;

    // Check if we need a new page
    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Add all schedules (passing doc and using the state variables)
  addSchedule(doc, 'SCHEDULE –I', 'Transaction involving infringement of the provisions of the Act, Rules and Bye-laws', ScheduleI);
  addSchedule(doc, 'SCHEDULE –II', 'Particular of sums which ought to have been but have not been brought into accounts', ScheduleII);
  addSchedule(doc, 'SCHEDULE –III', 'Improper and Irregular vouchers', ScheduleIII);
  addSchedule(doc, 'SCHEDULE –IIIA', 'Irregularities in the realization moneys', ScheduleIIIA);
  addSchedule(doc, 'SCHEDULE –IV', 'Transaction involving infringement of the provisions of the Act, Rules and Bye-laws', ScheduleIV);
  addSchedule(doc, 'SCHEDULE –V', 'Particular of sums which ought to have been but have not been brought into accounts', ScheduleV);


//////////////////////////////////////////////////////Assets and Liablities///////////////////////////////////////////////////////////////////

 
//   doc.addPage();
//   let y = 10;
//   // doc.text(societyName.toUpperCase(), 105, 22, { align: 'center' });
//    const renderSection = (title, groupedData) => {
//     doc.setFontSize(14);
//     doc.text(title, 14, y);
//     y += 6;

//     Object.entries(groupedData).forEach(([groupId, group]) => {
//       const groupAccounts = group.accounts;
//       const groupTotal = calculateGroupTotal(groupAccounts).toFixed(2);

//       // Group title
//       doc.setFontSize(12);
//       doc.setTextColor(40);
//       doc.text(`${group.groupName}`, 14, y);
//       y += 2;

//       // Group table
//       doc.autoTable({
//         startY: y,
//         theme: 'grid',
//         head: [['Account Name', 'Opening', 'Debit', 'Credit', 'Net Amount']],
//         body: groupAccounts.map((item) => {
//           const ledgerVouchers = vouchers[item._id] || [];
//           const totalDebit = ledgerVouchers.reduce((sum, v) => sum + (v.DrAmount || 0), 0);
//           const totalCredit = ledgerVouchers.reduce((sum, v) => sum + (v.CrAmount || 0), 0);
//           const amount = totalDebit - totalCredit + parseFloat(item.opening || 0);

//           return [
//             item.accountName,
//             parseFloat(item.opening || 0).toFixed(2),
//             totalDebit.toFixed(2),
//             totalCredit.toFixed(2),
//             amount.toFixed(2)
//           ];
//         }),
//         foot: [[
//           { content: `Total`, colSpan: 4, styles: { halign: 'right' , fontStyle: 'bold', textColor: [0, 0, 0],fillColor: false 
//             // fillColor: [255, 255, 255]
//           } },
//           groupTotal
//         ]],
//         // styles: { fontSize: 10 ,fontStyle: 'bold', textColor: [0, 0, 0], fillColor: [255, 255, 255]},
//         headStyles: { fillColor: [41, 128, 185] },
//         margin: { left: 14, right: 14 },
//         didDrawPage: (data) => {
//           y = data.cursor.y + 10; // update Y after table
//         }
//       });
//     });
//   };

//   renderSection('Assets', groupedAssets);
//   doc.addPage();
//   y = 10;
//   renderSection('Liabilities', groupedLiabilities,true);

// ///////////////////////////////	Managing Committee Members /////////////////////////////////////////


//   doc.addPage();
//   y = 10;

//   doc.setFontSize(14);
//   doc.setFont(undefined, "bold");
//   doc.text(" Managing Committee Members :-", 14, y);
//   y += 8;

//   doc.setFontSize(12);
//   doc.setFont(undefined, "normal");
//   doc.text(
//     "The elections for the period 2024-25 to 2029-30 of the managing committee were held on 04th August 2024. The Managing Committee consists of the following members:",
//     14,
//     y,
//     { maxWidth: 180 }
//   );
//   y += 20;

//   boardofMembers.forEach((member, index) => {
//     const title = member.gender === "Female" ? "Smt." : "Shri."; // Optional gender-based prefix
//     const line = `${String.fromCharCode(97 + index)}) ${title} ${member.name} \t\t(${member.position})`;

//     doc.text(line, 14, y);
//     y += 8;

//     if (y > 270) {  // Avoid page overflow
//       doc.addPage();
//       y = 10;
//     }
//   });

doc.addPage();
let y = 10;

// Society Header
const pageWidth = doc.internal.pageSize.getWidth(); // get full page width
const centerX = pageWidth / 2;
doc.setFontSize(16);
doc.setFont(undefined, "bold");
// doc.text("White Rose Co-op. Housing Society Limited", 14, y);
doc.text(societyName.toUpperCase(), centerX, y, { align: 'center' });
y += 8;

doc.setFontSize(12);
doc.setFont(undefined, "normal");
doc.text("Financial Year: 2023-2024", centerX, y, { align: 'center' });
y += 10;

// PART – A Header
doc.setFontSize(14);
doc.setFont(undefined, "bold");
doc.text("PART – A", 14, y);
y += 8;

// Audit Summary
doc.setFontSize(12);
doc.setFont(undefined, "normal");
const partAText = [
  'The accounts of “White Rose Co-op. Housing Society Limited. 4, Perry Road, Bandra (West), Mumbai 400 050 have been audited for the period 01.04.2023 to 31.03.2024 together with books of accounts and information made available to us.',
  '',
  'The Society has appointed to me as a Statutory Auditor in the Special General Body meeting held on 11/08/2024. Statutory Auditor, Shri. Mahesh Dingorkar, Govt. Certified Auditor, Panel No. 12832 who was appointed in the AGM dated 03/12/2023 has submitted his non availability for Audit due to non – confirmation after appointment.',
  '',
  'The statements of accounts viz. Balance Sheet as at 31st March 2024 and the Income & Expenditure Accounts for the year ended on that date which have been prepared and produced by the Society is attached herewith after due verification & subject to the following observation and remarks in Part A, B & C.',
  '',
  '1. Registration Number & Registered Office of Society :-\nRegistration No. of society is BOM / HSG/ 714 of 1964 and Registered address of society is 4, Perry Road, Bandra (West), Mumbai 400 050.',
  '',
  '2. Membership :-\nThere are a total of 26 members in the society. The Society has maintained I, J & Share Registers is Specific format given by Co-operative department. Two Flat purchasers have still not applied for membership of the society',
  '',
  '3. Internal Control System and Management:-\nThe Managing Committee is taking necessary care of internal control system of the society.',
  '',
  '4. Statutory Audit of Society:-\nStatutory Audit for the year 2022 - 2023 done by Shri. Suresh S Jadhav, Govt. Certified Auditor, Panel No. B-2/12834.',
  '',
  '5. Meeting of Society:-\nThe Managing Committee has held the Annual General Body Meeting on 3rd December 2023. The Managing Committee conducted Special General Body Meetings on 27th September 2023 and 14th January 2024 during the year 2023-2024 for the members of the society. The Managing Committee has met 10 times for the Managing Committee meetings.'
];

partAText.forEach(line => {
  const lines = doc.splitTextToSize(line, 180);
  doc.text(lines, 14, y);
  y += lines.length * 6;
  if (y > 270) {
    doc.addPage();
    y = 10;
  }
});

// Page 2: Managing Committee Members
doc.addPage();
y = 10;

doc.setFontSize(14);
doc.setFont(undefined, "bold");
doc.text("Managing Committee Members :-", 14, y);
y += 8;

doc.setFontSize(12);
doc.setFont(undefined, "normal");
doc.text(
  "The elections for the period 2024-25 to 2029-30 of the managing committee were held on 04th August 2024. The Managing Committee consists of the following members:",
  14,
  y,
  { maxWidth: 180 }
);
y += 20;

boardofMembers.forEach((member, index) => {
  const title = member.gender === "Female" ? "Smt." : "Shri.";
  const line = `${String.fromCharCode(97 + index)}) ${title} ${member.name} \t\t(${member.position})`;
  doc.text(line, 14, y);
  y += 8;

  if (y > 270) {
    doc.addPage();
    y = 10;
  }
});

// Page 3: PART – B with Assets and Liabilities
doc.addPage();
y = 10;

doc.setFontSize(14);
doc.setFont(undefined, "bold");
doc.text("PART – B", 14, y);
y += 8;

doc.setFontSize(12);
doc.setFont(undefined, "normal");
const partBLine =
  "Status of Society’s Assets and Liabilities:\nThe Society has the following assets and liabilities during the audit period from 01/04/2023 to 31/03/2024:";
const partBLines = doc.splitTextToSize(partBLine, 180);
doc.text(partBLines, 14, y);
y += partBLines.length * 6;

// Render grouped Assets and Liabilities
const renderSection = (title, groupedData) => {
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(title, 14, y);
  y += 6;

  Object.entries(groupedData).forEach(([groupId, group]) => {
    const groupAccounts = group.accounts;
    const groupTotal = calculateGroupTotal(groupAccounts).toFixed(2);

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.setTextColor(40);
    doc.text(`${group.groupName}`, 14, y);
    y += 2;

    doc.autoTable({
      startY: y,
      theme: 'grid',
      head: [['Account Name', 'Opening', 'Debit', 'Credit', 'Net Amount']],
      body: groupAccounts.map((item) => {
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
      }),
      foot: [[
        {
          content: `Total`, colSpan: 4,
          styles: {
            halign: 'right', fontStyle: 'bold',
            textColor: [0, 0, 0], fillColor: false
          }
        },
        groupTotal
      ]],
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        y = data.cursor.y + 10;
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      }
    });
  });
};

renderSection("Assets", groupedAssets);
doc.addPage();
y = 10;
renderSection("Liabilities", groupedLiabilities);
////
// Add a new page for PART - C
doc.addPage();


// PART - C Title
doc.setFontSize(14);
doc.setFont(undefined, "bold");
doc.text("PART - C", 14, y);
y += 8;

// GENERAL REMARKS & SUGGESTION
doc.setFontSize(12);
doc.text("GENERAL REMARKS & SUGGESTION :-", 14, y);
y += 8;

const remarks = [
  "1. Society should initiate steps to recover outstanding Dues from members. The Managing Committee should send notice & start recovery process u/s 154 B-29 of the MCS Act 1960.",
  "2. Society should file Mandatory return with Registrar of Co-op. Society. And also Income Tax Return and Professional tax return should be filed within prescribed due date.",
  "3. Audit rectification report for the previous year has to be sent within 90 days from the date of obtaining audit report, as in prescribed.",
  "4. The Society to adopt the amended Byelaws of the society as per 97th Constitutional Amendment."
];

doc.setFont(undefined, "normal");
remarks.forEach(line => {
  const splitText = doc.splitTextToSize(line, 180);
  doc.text(splitText, 14, y);
  y += splitText.length * 6;

  if (y > 270) {
    doc.addPage();
    y = 10;
  }
});

// AUDIT CLASSIFICATION
y += 4;
doc.setFont(undefined, "bold");
doc.text("Audit Classification: -", 14, y);
y += 6;

doc.setFont(undefined, "normal");
const classification = "Looking to the working and financial position of the society, the society has been awarded Grade “B” for the period under audit.";
const classificationLines = doc.splitTextToSize(classification, 180);
doc.text(classificationLines, 14, y);
y += classificationLines.length * 6;

// THANKS
y += 4;
doc.setFont(undefined, "bold");
doc.text("Thanks :-", 14, y);
y += 6;

doc.setFont(undefined, "normal");
const thanks = "I am thankful to the Accountant, Managing Committee and members of the society for their kind co-operation to complete the audit. We hope Society will take necessary steps for the growth of the society.";
const thanksLines = doc.splitTextToSize(thanks, 180);
doc.text(thanksLines, 14, y);


  // === 3. SAVE PDF ===
  doc.save('Audit_Report_with_Form1.pdf');
};

// const generatePDF = () => {
//   const doc = new jsPDF();
  
//   // Constants for styling
//   const styles = {
//     header: { size: 15, font: 'helvetica', style: 'bold' },
//     subHeader: { size: 14, font: 'helvetica', style: 'bold' },
//     normal: { size: 12, font: 'helvetica', style: 'normal' },
//     small: { size: 10, font: 'helvetica', style: 'normal' },
//     lineHeight: 6,
//     margin: 14,
//     pageWidth: doc.internal.pageSize.getWidth()
//   };

//   // Helper functions
//   const setFont = (style) => {
//     doc.setFont(style.font, style.style);
//     doc.setFontSize(style.size);
//   };

//   const addCenteredText = (text, y, style = styles.header) => {
//     setFont(style);
//     const textWidth = doc.getTextWidth(text);
//     const centerX = (styles.pageWidth - textWidth) / 2;
//     doc.text(text, centerX, y);
//   };

//   const addHorizontalLine = (y) => {
//     doc.line(10, y, styles.pageWidth - 10, y);
//   };

//   const addSectionHeader = (text, y) => {
//     setFont(styles.subHeader);
//     doc.text(text, styles.margin, y);
//   };

//   const addAutoTable = (data, startY, columnStyles = {}) => {
//     doc.autoTable({
//       startY,
//       body: data,
//       theme: 'grid',
//       margin: { left: styles.margin },
//       columnStyles
//     });
//   };

//   // ========== 1. MULTIPLE AUDIT MEMOS ==========
//   const generateAuditMemos = () => {
//     reports.forEach((report, index) => {
//       if (index > 0) doc.addPage();
      
//       // Header
//       addCenteredText(auditorName.toUpperCase(), 10);
//       addHorizontalLine(12);
      
//       // Address & Contact
//       setFont(styles.small);
//       doc.text(`Address: ${address}`, styles.margin, 20);
//       addHorizontalLine(22);
//       doc.text(`Mobile: ${mobileNo}`, 160, 27);
      
//       // Reference Info
//       doc.text(`Ref No: Hsg/2024`, styles.margin, 38);
//       doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 38);
      
//       // Recipient Info
//       doc.text("To,", styles.margin, 48);
//       setFont({ ...styles.normal, style: 'bold' });
//       doc.text(registeringAuthority, styles.margin, 54);
//       doc.text(societyName || "Society Name", styles.margin, 60);
//       doc.text(societyAddress || "Society Address", styles.margin, 66);
//       setFont(styles.normal);
      
//       // Subject and Body
//       setFont({ ...styles.normal, style: 'bold' });
//       doc.text(`Sub: ${report.subject}`, styles.margin, 76);
//       setFont(styles.normal);
      
//       const bodyLines = doc.splitTextToSize(report.content, 180);
//       doc.text("Respected Sir,", styles.margin, 86);
//       doc.text(bodyLines, styles.margin, 92);
      
//       const endY = 92 + bodyLines.length * styles.lineHeight;
//       doc.text("Thanking You,", styles.margin, endY + 10);
//     });
//   };

//   // ========== 2. FORM NO. 1 ==========
//   const generateForm1 = () => {
//     doc.addPage();
    
//     // Form Header
//     addCenteredText('FORM NO. 1', 15);
//     setFont(styles.normal);
//     doc.text(`NAME OF THE SOCIETY: ${societyName.toUpperCase()}`, styles.margin, 25);
//     doc.text(`FULL REGISTERED ADDRESS: ${societyRegisterAddress}`, styles.margin, 32);
//     doc.text(`REGISTRATION No: ${societyRegisterNo}`, styles.margin, 39);
//     doc.text(`DATE OF REGISTRATION: ${societyRegisterDate ? societyRegisterDate.slice(0, 10) : 'N/A'}`, styles.margin, 46);
//     addHorizontalLine(50);
    
//     // 1. AUDIT INFORMATION
//     addSectionHeader('1. AUDIT INFORMATION:', 60);
//     const auditInfo = [
//       ['a. Full name of the Auditor', auditorName],
//       ['b. Period covered during the present Audit', 
//         `${presentAuditfromDate ? new Date(presentAuditfromDate).toLocaleDateString() : ''} to ${presentAuditToDate ? new Date(presentAuditToDate).toLocaleDateString() : ''}`],
//       ['c. Date on which Audit was commenced and completed',
//         `${AuditcompletedfromDate ? new Date(AuditcompletedfromDate).toLocaleDateString() : ''} to ${AuditcompletedToDate ? new Date(AuditcompletedToDate).toLocaleDateString() : ''}`],
//       ['d. Date on which Audit was submitted',
//         AuditsubmittedDate ? new Date(AuditsubmittedDate).toLocaleDateString() : '']
//     ];
//     addAutoTable(auditInfo, 65);
    
//     // 2. MEMBERSHIP
//     addSectionHeader('2. MEMBERSHIP:', doc.autoTable.previous.finalY + 15);
//     const membershipNumbers = [
//       ['1.No. of members ',''],
//       ['(a) Individuals', ''],
//       ['(i) Ordinary', ordinary],
//       ['(ii) Normal', normal],
//       ['(iii) Sympathizer', sympathizer],
//       ['(b) Societies', societies],
//       ['(c) Others (Non Members)', others],
//       ['Total', calculateTotal()]
//     ];
//     addAutoTable(membershipNumbers, doc.autoTable.previous.finalY + 20);
    
//     const membershipQuestions = [
//       ['2. Have new members been duly admitted?', memberpaidentrancefee],
//       ['3. Are their written applications in order?', memberapplicationsfilledproperty],
//       ['4. Is the members register kept in Form "I"?', membersIMSCRules],
//       ['5. Is a list of members kept in form "J"?', membersJMSCRules],
//       ['6. Have due remarks been passed?', decreaseddismissedorregister],
//       ['7. Are resignation in order?', resignationdulyaccepted],
//       ['8. Have nominations been duly entered?', membersnominations]
//     ];
//     addAutoTable(membershipQuestions, doc.autoTable.previous.finalY + 10);
    
//     // 3. SHARES
//     addSectionHeader('3. SHARES:', doc.autoTable.previous.finalY + 15);
//     const sharesQuestions = [
//       ['(i) Is application for shares in order?', applicationforshares],
//       ['(ii) Is share register written up-to date?', Isshareregisteruptodate],
//       ['(iii) Do entries in share register tally with cash book?', entriesincashbook],
//       ['(iv) Is the ledger written up-to-date?', writtenledger],
//       ['(v) Does total of share ledger tally with balance sheet?', totalofshareledger],
//       ['(vi) Have share certificates been issued?', sharecertificatesissued],
//       ['(vii) Are shares transfers and refunds in accordance?', sharestransfersandrefunds]
//     ];
//     addAutoTable(sharesQuestions, doc.autoTable.previous.finalY + 20);
    
//     // 4. OUTSIDE BORROWINGS
//     addSectionHeader('4. OUTSIDE BORROWINGS:', doc.autoTable.previous.finalY + 15);
//     const borrowingsQuestions = [
//       ['(i) What is the limit in the bye-laws for borrowings?', byelawsborrowingssociety],
//       ['(ii) Has it been exceeded?', hasitbeenexceeded],
//       ['(iii) Has necessary permission been obtained?', permissioncompetentauthority]
//     ];
//     addAutoTable(borrowingsQuestions, doc.autoTable.previous.finalY + 20);
    
//     // 5. MEETINGS
//     addSectionHeader('5. MEETINGS:', doc.autoTable.previous.finalY + 15);
//     const meetingsDates = [
//       ['(i) Give dates of:', ''],
//       ['(a) Annual General Meeting', AnnualGeneralMeetingDate ? new Date(AnnualGeneralMeetingDate).toLocaleDateString() : ''],
//       ['(b) Special General Meeting (From)', SpecialGeneralMeetingFromDate ? new Date(SpecialGeneralMeetingFromDate).toLocaleDateString() : ''],
//       ['(b) Special General Meeting (To)', SpecialGeneralMeetingToDate ? new Date(SpecialGeneralMeetingToDate).toLocaleDateString() : '']
//     ];
//     addAutoTable(meetingsDates, doc.autoTable.previous.finalY + 20);
    
//     const meetingsCounts = [
//       ['(ii) State the number of meetings held during the period:', ''],
//       ['(a) Board or Managing Committee Meetings', NoOfBoardMeetings || ''],
//       ['(b) Executive or Sub-Committee Meetings', NoOfSubCommitteeMeetings || ''],
//       ['(c) Other Meetings', NoofotherMeetings || '']
//     ];
//     addAutoTable(meetingsCounts, doc.autoTable.previous.finalY + 10);
    
//     // 6. RECTIFICATION REPORTS
//     addSectionHeader('6. RECTIFICATION REPORTS:', doc.autoTable.previous.finalY + 15);
//     const rectificationReports = [
//       ['(i) Has the society submitted audit rectification reports of previous audit memos?', societysubmittedauditrectification],
//       ['If yes, date of submission', societysubmittedauditrectification === 'yes' && societysubmittedauditrectificationDate
//         ? new Date(societysubmittedauditrectificationDate).toLocaleDateString()
//         : 'N/A'],
//       ['If no, reasons for non-submission', societysubmittedauditrectification === 'no'
//         ? societysubmittedauditrectificationReson || 'N/A'
//         : 'N/A'],
//       ['(ii) Have any important points from previous audit memos been neglected by the Society?', importantpointsmentionedneglectedSociety],
//       ['If yes, general remarks', importantpointsmentionedneglectedSociety === 'yes'
//         ? generalremarks || 'N/A'
//         : 'N/A']
//     ];
//     addAutoTable(rectificationReports, doc.autoTable.previous.finalY + 20);
    
//     // 7. AUDIT FEE
//     addSectionHeader('7. AUDIT FEE:', doc.autoTable.previous.finalY + 15);
//     const auditFeeData = [
//       ['(i) Amount of audit fees last assessed, period, recovery details:', auditfees || 'N/A'],
//       ['(ii) Details about outstanding audit fees and reasons for non-payment:', detailsaboutoutstandingauditfees || 'N/A']
//     ];
//     addAutoTable(auditFeeData, doc.autoTable.previous.finalY + 20);
    
//     // 8. INTERNAL OR LOCAL AUDIT
//     addSectionHeader('8. INTERNAL OR LOCAL AUDIT:', doc.autoTable.previous.finalY + 15);
//     const internalAuditData = [
//       ['(i) Internal/local audit details (by whom, period, memo on record):', internallocalaudit || 'N/A'],
//       ['(ii) Coordination between Statutory and Internal Auditor:', CoordinationbetweenAuditor || 'N/A']
//     ];
//     addAutoTable(internalAuditData, doc.autoTable.previous.finalY + 20);
    
//     // 9. MANAGING DIRECTOR/MANAGER/SECRETARY
//     addSectionHeader('9. MANAGING DIRECTOR/MANAGER/SECRETARY:', doc.autoTable.previous.finalY + 15);
//     const managerData = [
//       ['(i) Name of officer (Secretary):', Nameofofficer || 'N/A'],
//       ['(ii) Pay drawn Grade:', PaydrawnGrade || 'N/A'],
//       ['(iii) Other allowances and facilities:', otherallowances || 'N/A'],
//       ['(iv) Is he a member?', whetherismember === 'yes' ? 'Yes' : 'No'],
//       ['(v) Borrowed/credit facilities (amount and overdue):', hasBorrowed || 'N/A'],
//       ['(vi) Other amounts due from him:', otherAmountsDue === 'yes' ? 'Yes' : 'No'],
//       ['(vii) List of Staff (names, designation, qualifications, etc.):', listofStaff || 'N/A']
//     ];
//     addAutoTable(managerData, doc.autoTable.previous.finalY + 20);
    
//     // 10. BREACHES
//     addSectionHeader('10. BREACHES:', doc.autoTable.previous.finalY + 15);
//     const breachesData = [
//       ['(i) Does the society possess copy of the Act, Rules and its registered Bye-laws?', hasCopyOfActRulesByeLaws === 'yes' ? 'Yes' : 'No'],
//       ['(ii) Give only numbers of breaches of the Act, Rules and Bylaws:', ''],
//       ['1. Section No', SectionNo || ''],
//       ['2. Rules No', RulesNos || ''],
//       ['3. Bye Laws No', ByeLawsNo || ''],
//       ['(iii) Have any rules been framed under the Byelaws? Are they appropriate authority? Are they properly followed?', rulesundertheByelaws === 'yes' ? 'Yes' : 'No']
//     ];
//     addAutoTable(breachesData, doc.autoTable.previous.finalY + 20, { 
//       0: { cellWidth: 140, fontStyle: 'bold' },
//       1: { cellWidth: 40 }
//     });
    
//     // 11. PROFIT AND LOSS
//     addSectionHeader('11. PROFIT AND LOSS:', doc.autoTable.previous.finalY + 15);
//     const profitLossData = [
//       ['(i) What is the amount of Profit earned or loss incurred during the last Co-operative year?', Profitorloss || ''],
//       ['(ii) State if the net profits are distributed (In case of non business societies figures of surplus or Deficit may be given against query No. II (I) above)', netProfitDistributed || '']
//     ];
//     addAutoTable(profitLossData, doc.autoTable.previous.finalY + 20, { 
//       0: { cellWidth: 140, fontStyle: 'bold' },
//       1: { cellWidth: 40 }
//     });
    
//     // 12. CASH, BANK BALANCE AND SECURITIES
//     addSectionHeader('12. (A) CASH, BANK BALANCE AND SECURITIES:', doc.autoTable.previous.finalY + 15);
//     const cashBankData = [
//       ['(i) Count cash and sign the cash book stating the amount counted and date of which counted.', amountcounted || ''],
//       ['(ii) Who produced the Cash for Counting? Give his name & designation. Is the authorized to keep cash?', producedByDesignation || ''],
//       ['(iii) Is it correct according to the Cash Book?', infoaccordingCashBook === 'yes' ? 'Yes' : 'No'],
//       ['(iv) Are Arrangements for safety of Cash safe and cash-in-transit adequate?', ArrangementssafetyCash === 'yes' ? 'Yes' : 'No'],
//       ['(B) BANK BALANCES:', ''],
//       ['(i) Do Bank balance shown in Bank Pass books or bank statements and Bank balance shown in Books of accounts? If not, check reconciliation statements.', BankReconciliationstatement || ''],
//       ['(C) SECURITIES:', ''],
//       ['1. Verify securities physically and see whether they are in the name of society', physicallysecurities === 'yes' ? 'Yes' : 'No'],
//       ['2. Are dividends and interest being duly collected?', dividendscollected === 'yes' ? 'Yes' : 'No'],
//       ['3. If securities are lodged with the bank, are relevant certificates obtained?', relevantcertificates === 'yes' ? 'Yes' : 'No'],
//       ['4. Is investment register maintains and written up-to-date?', investmentregister === 'yes' ? 'Yes' : 'No']
//     ];
//     addAutoTable(cashBankData, doc.autoTable.previous.finalY + 20, { 
//       0: { cellWidth: 140, fontStyle: 'bold' },
//       1: { cellWidth: 40 }
//     });
    
//     // 13. MOVABLE AND IMMOVABLE PROPERTY
//     addSectionHeader('13. MOVABLE AND IMMOVABLE PROPERTY:', doc.autoTable.previous.finalY + 15);
//     const propertyData = [
//       ['1. Is relevant register maintained and written up-to-date?', Isrelevantregister === 'yes' ? 'Yes' : 'No'],
//       ['2. Verify property physically & obtain its list. Do the balance tally with balance sheet Figures?', Verifypropertyphysically || ''],
//       ['3. In case of immovable property including lands verify title deeds and see whether they are in the name of Society', Verifyimmovableproperty || ''],
//       ['4. Is the property duly insured where necessary? If so, give details in general remarks.', propertydulyinsured || ''],
//       ['5. DEPRECIATION:', ''],
//       ['(i) Is due depreciation charges?', depreciationcharges === 'yes' ? 'Yes' : 'No'],
//       ['(ii) State the rate of depreciation charges on various assets.', rateofdepreciation || '']
//     ];
//     addAutoTable(propertyData, doc.autoTable.previous.finalY + 20, { 
//       0: { cellWidth: 140, fontStyle: 'bold' },
//       1: { cellWidth: 40 }
//     });
    
//     // 14. AUDIT MEMO DISCUSSION
//     addSectionHeader('14. AUDIT MEMO DISCUSSION:', doc.autoTable.previous.finalY + 15);
//     const discussionData = [
//       ['Have you discussed the draft of audit memo in the board of managing committee meeting? If not state reasons for the same.', draftofauditmemo === 'yes' ? 'Yes' : 'No']
//     ];
//     addAutoTable(discussionData, doc.autoTable.previous.finalY + 20, { 
//       0: { cellWidth: 140, fontStyle: 'bold' },
//       1: { cellWidth: 40 }
//     });
//   };

//   // ========== 3. FORM NO. 28 ==========
//   const generateForm28 = () => {
//     doc.addPage();
    
//     // Form Header
//     addCenteredText('FORM NO. 28', 15);
//     addCenteredText('AUDIT MEMO (CO-OP. HOUSING SOCIETIES)', 22);
//     addCenteredText('PART II', 29);
//     addCenteredText(societyName.toUpperCase(), 36);
//     addHorizontalLine(40);
    
//     // 1. BORROWINGS
//     addSectionHeader('1. BORROWINGS:', 50);
//     doc.text('i. State the loans obtained by the society for various purposes from Govt. & other agencies:', styles.margin, 58);
    
//     const borrowingsData = [
//       ['Agency sanctioning Loan:', AgencysanctioningLoan || ''],
//       ['Purpose for which loan is sanctioned:', Purposeloansanctioned || ''],
//       ['Amount for loan sanctioned:', loansanctionedAmount || ''],
//       ['Maximum amount drawn:', Maximumamountdrawn || ''],
//       ['Re-payments made:', Repaymentsmade || ''],
//       ['Outstanding:', Outstanding || ''],
//       ['Amount overdue if any:', Amountoverdueifany || ''],
//       ['Remarks:', Remarks || '']
//     ];
//     addAutoTable(borrowingsData, 65, { 
//       0: { cellWidth: 90, fontStyle: 'bold' },
//       1: { cellWidth: 90 }
//     });
    
//     const borrowingQuestions = [
//       ['ii. Are repayments of loans punctual?', repaymentsloanspunctual === 'yes' ? 'Yes' : 'No'],
//       ['iii. Are all conditions laid down for grant of various loans and credits observed?', conditionslaiddown === 'yes' ? 'Yes' : 'No'],
//       ['iv. Are necessary documents executed in favors of the authority sanctioning the loan?', necessarydocuments === 'yes' ? 'Yes' : 'No']
//     ];
//     addAutoTable(borrowingQuestions, doc.autoTable.previous.finalY + 10, { 
//       0: { cellWidth: 140, fontStyle: 'bold' },
//       1: { cellWidth: 40 }
//     });
    
//     // 2. GOVERNMENT FINANCIAL ASSISTANCE
//     addSectionHeader('2. GOVERNMENT FINANCIAL ASSISTANCE:', doc.autoTable.previous.finalY + 15);
//     const govtAssistanceData = [
//       ['(i) What is the amount of Government subsidy sanctioned and received by the society?', amountsubsidysanctioned || ''],
//       ['(ii) Has Government sanctioned any amount for land development?', Hassanctionedamount === 'yes' ? 'Yes' : 'No']
//     ];
//     addAutoTable(govtAssistanceData, doc.autoTable.previous.finalY + 20, { 
//       0: { cellWidth: 140, fontStyle: 'bold' },
//       1: { cellWidth: 40 }
//     });
    
//     // 3. MEMBERSHIP
//     addSectionHeader('3. MEMBERSHIP:', doc.autoTable.previous.finalY + 15);
//     const membershipData = [
//       ['(i) State whether in case of backward class of co-operative housing societies, certificates from the social welfare officers are obtained for their eligibility to membership and obtaining of financial assistance?', financialassistancemembership || ''],
//       ['(ii) State whether certificates are obtained from officers of the concerned industry in case of subsidized industrial housing scheme?', certificatesfromofficers || ''],
//       ['(iii) Have declaration been obtained from members that they and their family members do not own lands or houses.', declarationfrommembers || '']
//     ];
//     addAutoTable(membershipData, doc.autoTable.previous.finalY + 20, { 
//       0: { cellWidth: 140, fontStyle: 'bold' },
//       1: { cellWidth: 40 }
//     });
    
//     // 4. LANDS AND THEIR DEVELOPMENT
//     addSectionHeader('4. LANDS AND THEIR DEVELOPMENT:', doc.autoTable.previous.finalY + 15);
//     const landsData = [
//       ['(i) State whether lands for constructions of houses have been secured purchased or obtained on lease. Give details for the lands, stating total area, survey nos. & CRS nos. if any, price for which purchased, lease rent etc.', detailslandsforconstructions || ''],
//       ['(ii) See the title deeds and ascertain whether they are properly executed in favor of society.', titledeeds === 'yes' ? 'Yes' : 'No'],
//       ['(iii) State how the lands has been utilized for:', ''],
//       ['(a) Construction of Flats', ConstructionFlats || ''],
//       ['(b) Construction of roads', Constructionroads || ''],
//       ['(c) Open Space', OpenSpace || ''],
//       ['(d) Other purposes (give details)', Otherpurposes || ''],
//       ['(iv) Have the layouts and plans for development been approved the Municipal Authorities before actual commencement of the work?', layoutsapproved === 'yes' ? 'Yes' : 'No'],
//       ['(v) Have completion certificates been obtained from appropriate authorities for drainage, water supply, roads, etc before period construction work of building is commenced?', completioncertificates === 'yes' ? 'Yes' : 'No']
//     ];
//     addAutoTable(landsData, doc.autoTable.previous.finalY + 20, { 
//       0: { cellWidth: 140, fontStyle: 'bold' },
//       1: { cellWidth: 40 }
//     });
    
//     // 5. CONSTRUCTION OF BUILDINGS
//     addSectionHeader('5. CONSTRUCTION OF BUILDINGS:', doc.autoTable.previous.finalY + 15);
//     const constructionData = [
//       ['(i)(a) Have building construction commenced?', buildingconstructioncommenced === 'yes' ? 'Yes' : 'No'],
//       ['(i)(b) No. of houses/flats constructed and under construction', Noofhousesflats || 'N/A'],
//       ['(i)(c) Have the completed houses and flats allotted to members?', flatsallottedmembers === 'yes' ? 'Yes' : 'No'],
//       ['(ii) Are buildings constructed on contract basis? Terms observed?', termsconditionscontracts || 'N/A'],
//       ['(iii) Are contracts properly sanctioned by competent authority?', contractsproperlysanctioned === 'yes' ? 'Yes' : 'No'],
//       ['(iv) Have tenders/quotation been called with advertisement?', tendersofquotation === 'yes' ? 'Yes' : 'No'],
//       ['(v) Are contractors paid after work progress certificates?', workprogresscertificate === 'yes' ? 'Yes' : 'No'],
//       ['(vi) Terms for architects employed? Any breaches?', architectsemployed === 'yes' ? 'Yes' : 'No'],
//       ['(vii) Completion certificate obtained from engineers/architects?', constructioncompletedtoplans === 'yes' ? 'Yes' : 'No'],
//       ['(viii) Is property register kept properly and up-to-date?', propertyregister === 'yes' ? 'Yes' : 'No'],
//       ['(ix)(a) Job registers and measurement book maintained?', measurementbook === 'yes' ? 'Yes' : 'No'],
//       ['(ix)(b) Stock registers maintained?', Stockregisters === 'yes' ? 'Yes' : 'No'],
//       ['(ix)(c) Valuation certificates obtained?', valuationcertificates === 'yes' ? 'Yes' : 'No'],
//       ['(ix)(d) Expenditure allocated between capital & revenue?', expenditureallocated === 'yes' ? 'Yes' : 'No'],
//       ['(x) Deviations from original plans/estimates?', buildingaccordingplans || 'N/A'],
//       ['(xi) For flat owner\'s society: Titles transferred to society?', flatownersociety === 'yes' ? 'Yes' : 'No'],
//       ['(xii) Are buildings and constructions insured?', constructioninsured === 'yes' ? 'Yes' : 'No'],
//       ['(xiii) Promoters fulfilled obligations in flat owner\'s society?', promotersobligation === 'yes' ? 'Yes' : 'No'],
//       ['(xiv) Agreements with promoters in society\'s interest?', Examineagreements === 'yes' ? 'Yes' : 'No'],
//       ['(xv) Lease deeds executed for members?', favorofmembers === 'yes' ? 'Yes' : 'No'],
//       ['(xvi) Sinking fund created as per bye-laws?', Societysinkingfund === 'yes' ? 'Yes' : 'No'],
//       ['(xvii)(a) Repayment loan installments covered?', Amountsrepaymentloan === 'yes' ? 'Yes' : 'No'],
//       ['(xvii)(b) Municipal and other taxes covered?', Municipaltaxes === 'yes' ? 'Yes' : 'No'],
//       ['(xvii)(c) Lease rent covered?', Leaserent === 'yes' ? 'Yes' : 'No'],
//       ['(xvii)(d) Service charges and common expenses covered?', Servicecharges === 'yes' ? 'Yes' : 'No'],
//       ['(xvii)(e) Contribution to sinking fund covered?', Contributionsinkingfund === 'yes' ? 'Yes' : 'No']
//     ];
//     addAutoTable(constructionData, doc.autoTable.previous.finalY + 20, { 
//       0: { cellWidth: 140, fontStyle: 'bold' },
//       1: { cellWidth: 40 }
//     });
//   };

//   // Generate all sections
//   generateAuditMemos();
//   generateForm1();
//   generateForm28();

//   // Save the PDF
//   doc.save('Audit_Report_with_Form1.pdf');
// };


//get all auditreport
const fetchAuditReports=async()=>{
 try {
      const url = `${REACT_APP_URL}/Audireport/`;
      const response = await fetch(url);
      const data = await response.json();
      console.log('AuditReports',data)
       setAuditorName(data[0].auditorname)


    } catch (error) {
      console.error("Error fetching data:", error);
    }
}


//
const [reports, setReports] = useState([
  { template: null, subject: "", content: "" }
]);

const addReportBlock = () => {
  setReports([...reports, { template: null, subject: "", content: "" }]);
};



const handleReportChange = async (index, field, value) => {
  
  const updatedReports = [...reports];
  
  if (field === "template") {
    updatedReports[index].template = value;

    if (value && value.value) {
      try {
        const response = await fetch(`${REACT_APP_URL}/Auditemp/${value.value}`);
        const data = await response.json();
        updatedReports[index].subject = data.subject;
        updatedReports[index].content = data.tempBody;
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    }
  } else {
    updatedReports[index][field] = value;
  }

  setReports(updatedReports);
};

//for form1 drawer
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerClose = () => {
    setIsDrawerOpen(false); // Close the drawer
  };


  //for Drawer form no 28
  const [newDrawerOpen, setNewDrawerOpen] = useState(false);
  const handleNewDrawerClose = () => {
    setNewDrawerOpen(false); // Close the drawer
  };


   //for Schedule Drawer 
  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false);
  const handleScheduleDrawerClose = () => {
    setScheduleDrawerOpen(false); // Close the drawer
  };

  const [ordinary, setOrdinary] = useState("");
  const [normal, setNormal] = useState("");
  const [sympathizer, setSympathizer] = useState("");
  const [societies, setSocieties] = useState("");
  const [others, setOthers] = useState("");

  
const calculateTotal = () => {
    return (
      Number(ordinary || 0) +
      Number(normal || 0) +
      Number(sympathizer || 0) +
      Number(societies || 0) +
      Number(others || 0)
    );
  };













  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Auditor Form
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
         size="small"
          label="Auditor Name"
          value={auditorName}
           onChange={(e) => setAuditorName(e.target.value)}
          fullWidth
          required
        />
        <TextField
         size="small"
          label="Address"
             value={address}
           onChange={(e) => setAddress(e.target.value)}
          fullWidth
          required
        />
        <TextField
         size="small"
          label="Mobile No"
           value={mobileNo}
           onChange={(e) => setMobileNo(e.target.value)}
          type="tel"
          fullWidth
          required
        />
    


  {reports.map((report, index) => (
  <Box key={index} sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2, marginBottom: 2 }}>
    <Autocomplete
      options={Options}
      getOptionLabel={(option) => option.label}
      value={report.template}
      onChange={(event, newValue) => handleReportChange(index, "template", newValue)}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) => (
        <TextField {...params} placeholder="Audit Template" variant="outlined" size="small" />
      )}
    />

    <TextField
      size="small"
      label="Subject"
      value={report.subject}
      onChange={(e) => handleReportChange(index, "subject", e.target.value)}
      fullWidth
      required
      sx={{ mt: 2 }}
    />

    <TextField
      size="small"
      label="Content"
      value={report.content}
      onChange={(e) => handleReportChange(index, "content", e.target.value)}
      fullWidth
      multiline
      minRows={4}
      required
      sx={{ mt: 2 }}
    />
  </Box>
))}

<Box display={'flex'} alignItems={'center'} gap={2}>
<Button onClick={() => setIsDrawerOpen(true)} variant="contained" color="primary"> 
Create Form 1
</Button>

<Button onClick={() => setNewDrawerOpen(true)} variant="contained" color="primary"> 
Create Form 28
</Button>

<Button onClick={() => setScheduleDrawerOpen(true)} variant="contained" color="primary"> 
Schedules
</Button>
</Box>


{/* form1 drawer  */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              width: isSmallScreen ? "100%" : "60%",
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              zIndex: 1000,
            },
          }}
        >


          {/* Form Fields */}

          <Box textAlign={'center'} p={2}>
            <Typography variant='h5' >FORM NO. 1</Typography>
          </Box>
          <Divider />

          <Box m={2}>
            <Box textAlign={'center'}>
              <Typography variant='h6'><b>NAME OF THE SOCIETY : {societyName.toUpperCase()} </b></Typography>
              <Typography variant='h6'><b>FULL REGISTERED ADDRESS : {societyRegisterAddress} </b></Typography>
              <Typography variant='h6'><b> REGISTRATION No : {societyRegisterNo} </b></Typography>
              <Typography variant='h6'><b>DATE OF REGISTRATION : {societyRegisterDate ? societyRegisterDate.slice(0, 10) : 'N/A'} </b></Typography>
            </Box>
            <Divider sx={{ mt: 2 }} />
          </Box>
          {/*AUDIT INFORMATION*/}
          <Box>
            <Box m={2}>
              <Typography variant='h6'><b>1. AUDIT INFORMATION:</b></Typography>
            </Box>

            <Box ml={2}>
              <Typography>a . Full name of the Auditor : {auditorName}</Typography>
            </Box>

            <Box sx={{ padding: 2 }}>

              <Box
                display="flex"
                alignItems="center"

                gap={2}

              >
                <Typography >
                  b . Period covered during the present Audit:
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={{ minWidth: "200px" }}>
                    <DatePicker
                      label="From Date"
                      format="dd/MM/yyyy"
                      value={presentAuditfromDate ? new Date(presentAuditfromDate) : null}
                      onChange={(newValue) => { setpresentAuditfromDate(newValue); }}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          helperText: "",
                        },
                      }}
                      sx={{ width: "100%" }}
                    />
                  </Box>

                  <Box sx={{ minWidth: "200px" }}>
                    <DatePicker
                      label="To Date"
                      value={presentAuditToDate ? new Date(presentAuditToDate) : null}
                      onChange={(newValue) => { setpresentAuditToDate(newValue); }}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          helperText: "",
                        },
                      }}
                      sx={{ width: "100%" }}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>

              <Box mt={1}>
                <Typography>c . Date on which</Typography>

                <Box sx={{ display: 'flex', alignItems: "center", gap: 2, mt: 1 }}>
                  <Typography >1 . Audit was commenced and completed</Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ minWidth: "200px" }}>
                      <DatePicker
                        label="From Date"
                        format="dd/MM/yyyy"
                        value={AuditcompletedfromDate ? new Date(AuditcompletedfromDate) : null}
                        onChange={(newValue) => { setAuditcompletedfromDate(newValue); }}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            helperText: "",
                          },
                        }}
                        sx={{ width: "100%" }}
                      />
                    </Box>

                    <Box sx={{ minWidth: "200px" }}>
                      <DatePicker
                        label="To Date"
                        format="dd/MM/yyyy"
                        value={AuditcompletedToDate ? new Date(AuditcompletedToDate) : null}
                        onChange={(newValue) => { setAuditcompletedToDate(newValue); }}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            helperText: "",
                          },
                        }}
                        sx={{ width: "100%" }}
                      />
                    </Box>
                  </LocalizationProvider>
                </Box>


                <Box sx={{ display: 'flex', alignItems: "center", justifyContent: 'space-between', mt: 1 }}>
                  <Typography>2 . Audit was submitted </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box>
                      <DatePicker
                        label="Audit was submitted"
                        format="dd/MM/yyyy"
                        value={AuditsubmittedDate ? new Date(AuditsubmittedDate) : null}
                        onChange={(newValue) => { setAuditsubmittedDate(newValue); }}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            helperText: "",
                          },
                        }}
                        sx={{ width: "100%" }}
                      />
                    </Box>

                  </LocalizationProvider>
                </Box>

              </Box>
            </Box>


            <Divider />






            {/* Submit and Cancel Buttons */}
            {/* <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                {selectedUser ? "Update" : "Create"}
              </Button>
              <Button fullWidth variant="contained" color="secondary" onClick={handleCancel} sx={{ ml: 5 }}>
                Cancel
              </Button>

              {selectedUser ? <Button fullWidth variant="contained" color="error" onClick={deleteUser} sx={{ ml: 5 }}>
                Delete
              </Button> : null}
            </Box> */}
          </Box>


          {/*MEMBERSHIP*/}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>2. MEMBERSHIP :</b></Typography>
            </Box>


            <Box display="flex" alignItems="flex-start" gap={2} ml={2}>
              <Typography>1. No. of members</Typography>

              <Typography>(a) Individuals</Typography>

              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" gap={30}>
                  <Typography>(i) Ordinary</Typography>
                  <TextField
                    size="small"
                    placeholder="Enter number"
                    value={ordinary}
                    onChange={(e) => setOrdinary(e.target.value)}
                  />
                </Box>

                <Box display="flex" gap={30} mt={1}>
                  <Typography>(ii) Normal</Typography>
                  <TextField
                    size="small"
                    placeholder="Enter number"
                    value={normal}
                    onChange={(e) => setNormal(e.target.value)}
                  />

                </Box>

                <Box display="flex" gap={25} mt={1}>
                  <Typography>(iii)Sympathizer</Typography>
                  <TextField
                    size="small"
                    placeholder="Enter number"
                    value={sympathizer}
                    onChange={(e) => setSympathizer(e.target.value)}
                  />

                </Box>


              </Box>




            </Box>
            <Box display={'flex'} alignItems={'center'} gap={43} ml={21} mt={2} >
              <Typography>(b) Societies </Typography>
              <TextField
                size="small"
                placeholder="Enter number"
                value={societies}
                onChange={(e) => setSocieties(e.target.value)}
              />
            </Box>

            <Box display={'flex'} alignItems={'center'} gap={30} ml={21} mt={2} >
              <Typography>(c) Others(Non Members) </Typography>
              <TextField
                size="small"
                placeholder="Enter number"
                value={others}
                onChange={(e) => setOthers(e.target.value)}
              />
            </Box>


            <Box display={'flex'} alignItems={'center'} gap={50} ml={21} mt={2} >
              <Typography><b>Total</b></Typography>
              <Typography><b>{calculateTotal()}</b></Typography>
            </Box>

            {/*  */}

            <Box display="flex" alignItems="center" gap={19} ml={2}>
              <Typography>
                2. Have new members been duly admitted? Have they paid entrance fee?
              </Typography>


              <RadioGroup row value={memberpaidentrancefee}
                onChange={(e) => setmemberpaidentrancefee(e.target.value)}
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" gap={25} ml={2}>
              <Typography>
                3.Are their written applications in order and are they filled property?
              </Typography>


              <RadioGroup row value={memberapplicationsfilledproperty} onChange={(e) => setmemberapplicationsfilledproperty(e.target.value)} defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" gap={16.5} ml={2}>
              <Typography>
                4. Is the members register kept in Form "I" prescribed under Rules 32
                and 65 <br />(I) of the M.S.C. Rules 1961?
              </Typography>
              <RadioGroup row value={membersIMSCRules} onChange={(e) => setmembersIMSCRules(e.target.value)}  >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>

            </Box>

            <Box display="flex" alignItems="center" gap={13} ml={2}>
              <Typography>
                5. Is a list of members kept in from "J" under Rules 39 of the M.S.C. Rules 1961?
              </Typography>
              <RadioGroup row value={membersJMSCRules} onChange={(e) => setmembersJMSCRules(e.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>

            </Box>

            <Box display="flex" alignItems="center" gap={15} ml={2}>
              <Typography>
                6. Have due remarks been passed against names of the decreased, dismissed <br /> or register?
              </Typography>
              <RadioGroup row value={decreaseddismissedorregister} onChange={(e) => setdecreaseddismissedorregister(e.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>

            </Box>

            <Box display="flex" alignItems="center" gap={39} ml={2}>
              <Typography>
                7.Are resignation in order and are thy duly accepted
              </Typography>
              <RadioGroup row value={resignationdulyaccepted} onChange={(e) => setresignationdulyaccepted(e.target.value)} >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>

            </Box>

            <Box display="flex" alignItems="center" gap={13} ml={2}>
              <Typography>
                8.Have nominations made under Rules 25 of them M.S.C. Rules 1961 been duly <br /> entered in the members register under Rules 26?
              </Typography>
              <RadioGroup row value={membersnominations} onChange={(e) => setmembersnominations(e.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>

            </Box>

          </Box>
          <Divider sx={{ mt: 1 }} />

          {/*SHARES*/}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>3. SHARES :</b></Typography>
            </Box>


            <Box display="flex" alignItems="center" gap={52} ml={2}>
              <Typography>
                (i). Is application for shares in order?
              </Typography>


              <RadioGroup row value={applicationforshares} onChange={(e) => setapplicationforshares(e.target.value)} defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" gap={50} ml={2}>
              <Typography>
                (ii).Is share register written up-to date?
              </Typography>


              <RadioGroup row value={Isshareregisteruptodate} onChange={(e) => setIsshareregisteruptodate(e.target.value)} defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" gap={15} ml={2}>
              <Typography>
                (iii). Do the entries in the share register tally with the entries in the cash book?
              </Typography>
              <Box display="flex" alignItems="center">
                <RadioGroup row value={entriesincashbook} onChange={(e) => setentriesincashbook(e.target.value)} defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

            </Box>

            <Box display="flex" alignItems="center" gap={53} ml={2}>
              <Typography>
                (iv). Is the ledger written up-to-date?
              </Typography>
              <Box display="flex" alignItems="center" >
                <RadioGroup row value={writtenledger} onChange={(e) => setwrittenledger(e.target.value)}>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

            </Box>

            <Box display="flex" alignItems="center" gap={16} ml={2}>
              <Typography>
                (v).Does the total of share ledger balance tally with the figure of share

                capital <br /> in the balance sheet?

              </Typography>

              <RadioGroup row value={totalofshareledger} onChange={(e) => settotalofshareledger(e.target.value)}>

                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" gap={10} ml={2}>
              <Typography>
                (vi).Have share certificates been issued to the share holder for all share subscribed?
              </Typography>
              <Box display="flex" alignItems="center">
                <RadioGroup row value={sharecertificatesissued} onChange={(e) => setsharecertificatesissued(e.target.value)}>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

            </Box>

            <Box display="flex" alignItems="center" gap={8} ml={2}>
              <Typography>
                (vii)Are shares transfers and refunds in accordance with the provision of the bye-laws,<br /> Act & Rules?
              </Typography>

              <RadioGroup
                row
                value={sharestransfersandrefunds}
                onChange={(e) => setsharestransfersandrefunds(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>


            </Box>

          </Box>
          <Divider sx={{ mt: 1 }} />

          {/*OUTSIDE BORROWINGS :  */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>4.	OUTSIDE BORROWINGS  :</b></Typography>
            </Box>


            <Box display="flex" alignItems="center" gap={27} ml={2}>
              <Typography>
                (i). What is the limit in the bye-laws for borrowings of the society?
              </Typography>


              <RadioGroup row value={byelawsborrowingssociety} onChange={(e) => setbyelawsborrowingssociety(e.target.value)} defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" gap={62} ml={2}>
              <Typography>
                (ii).Has it been exceeded?
              </Typography>


              <RadioGroup row value={hasitbeenexceeded} onChange={(e) => sethasitbeenexceeded(e.target.value)} defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" gap={12.5} ml={2}>
              <Typography>
                (iii). If so, state whether necessary permission has from the competent authority?
              </Typography>
              <RadioGroup row value={permissioncompetentauthority} onChange={(e) => setpermissioncompetentauthority(e.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>

            </Box>

          </Box>
          <Divider sx={{ mt: 1 }} />

          {/* MEETINGS */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>5 . MEETINGS : </b></Typography>
            </Box>


            <Box >
              <Typography ml={2} >
                (i). Give dates of :
              </Typography>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2}>
                <Box>
                  <Typography>
                    (a). Annual General Meeting:
                  </Typography>
                </Box>

                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ minWidth: "200px" }}>
                      <DatePicker
                        label="From Date"
                        format="dd/MM/yyyy"
                        value={AnnualGeneralMeetingDate ? new Date(AnnualGeneralMeetingDate) : null}
                        onChange={(newValue) => { SetAnnualGeneralMeetingDate(newValue); }}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            helperText: "",
                          },
                        }}
                        sx={{ width: "100%" }}
                      />
                    </Box>


                  </LocalizationProvider>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={2}  >
                <Box>
                  <Typography ml={2} >
                    (b). Special General Meeting:
                  </Typography>
                </Box>

                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ minWidth: "200px" }}>
                      <DatePicker
                        label="From Date"
                        format="dd/MM/yyyy"
                        value={SpecialGeneralMeetingFromDate ? new Date(SpecialGeneralMeetingFromDate) : null}
                        onChange={(newValue) => { setSpecialGeneralMeetingFromDate(newValue); }}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            helperText: "",
                          },
                        }}
                        sx={{ width: "100%" }}
                      />
                    </Box>


                  </LocalizationProvider>
                </Box>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ minWidth: "200px" }}>
                      <DatePicker
                        label="To Date"
                        format="dd/MM/yyyy"
                        value={SpecialGeneralMeetingToDate ? new Date(SpecialGeneralMeetingToDate) : null}
                        onChange={(newValue) => { setSpecialGeneralMeetingToDate(newValue); }}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            helperText: "",
                          },
                        }}
                        sx={{ width: "100%" }}
                      />
                    </Box>


                  </LocalizationProvider>
                </Box>
              </Box>

              <Box ml={2} mt={2}>
                <Typography>(ii) State the no. of meeting held during the period as follows:</Typography>

                <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={3}  >
                  <Typography>(a) Board or managing Committee Meetings.</Typography>
                  {/* <TextField
                    sx={{ width: 250 }}
                    size="small"
                    placeholder="Enter number"
                   value={setNoofotherMeetings}
                   onChange={(e) => SetNoOfBoardMeetings(e.target.value)}
                  /> */}
                  <TextField
                    sx={{ width: 250 }}
                    size="small"
                    placeholder="Enter number"
                    value={NoOfBoardMeetings}
                    onChange={(e) => SetNoOfBoardMeetings(e.target.value)}
                  />
                </Box>

                <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1}  >
                  <Typography>(b) Executive of Sub-Committee Meetings.</Typography>
                  <TextField
                    sx={{ width: 250 }}
                    size="small"
                    placeholder="Enter number"
                    value={NoOfSubCommitteeMeetings}
                    onChange={(e) => setNoOfSubCommitteeMeetings(e.target.value)}
                  />
                </Box>

                <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1}  >
                  <Typography>(c) other Meeting.</Typography>
                  <TextField
                    sx={{ width: 250 }}
                    size="small"
                    placeholder="Enter number"
                    value={NoofotherMeetings}
                    onChange={(e) => setNoofotherMeetings(e.target.value)}
                  />
                </Box>

              </Box>




            </Box>





          </Box>
          <Divider sx={{ mt: 1 }} />


          {/*6.RECTIFICATION REPORTS*/}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>6 . RECTIFICATION REPORTS : </b></Typography>
            </Box>
            {/* i */}
            <Box display="flex" alignItems="center" gap={11} ml={2}>
              <Typography>
                (i). Has the society submitted audit rectification reports of the pervious audit  <br />  memos?
                If so give dates of submission if not, state the reasons for non-submission.
              </Typography>




              <RadioGroup row
                value={societysubmittedauditrectification}
                onChange={(e) => setsocietysubmittedauditrectification(e.target.value)}
                //  value={byelawsborrowingssociety} onChange={(e) => setbyelawsborrowingssociety(e.target.value)} 
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>


            </Box>

            {societysubmittedauditrectification === 'yes' && (
              <Box display="flex" alignItems="center" justifyContent="flex-start" mt={2} m={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Submission"
                    value={societysubmittedauditrectificationDate}
                    onChange={(newValue) => setsocietysubmittedauditrectificationDate(newValue)}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                </LocalizationProvider>
              </Box>
            )}

            {/* Show TextField if 'no' is selected */}
            {societysubmittedauditrectification === 'no' && (
              <Box mt={2} m={2}>
                <Typography>Reasons for non-submission</Typography>
                <TextField
                  value={societysubmittedauditrectificationReson}
                  onChange={(e) => setsocietysubmittedauditrectificationReson(e.target.value)}
                  variant="standard"
                  placeholder="Enter the reasons for non-submission"
                  fullWidth
                  focused
                  sx={{
                    '& .MuiInput-underline:after': {
                      borderBottomWidth: 1.5,
                    },
                    mt: 1,
                  }}
                  size="small"
                />
              </Box>
            )}

            {/* ii */}
            <Box>
              <Box ml={2} mt={2} display={'flex'} gap={18}>
                <Typography>
                  (ii). Have any important points mentioned in the previous audit memos been <br /> neglected by the Society? If so, state them in general remarks.
                </Typography>

                <RadioGroup row
                  value={importantpointsmentionedneglectedSociety}
                  onChange={(e) => setimportantpointsmentionedneglectedSociety(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

              {importantpointsmentionedneglectedSociety === 'yes' && (
                <Box mt={1} m={2}>
                  <Typography>state general remarks. </Typography>
                  <TextField
                    value={generalremarks}
                    onChange={(e) => setgeneralremarks(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder="state general remarks"
                    fullWidth
                  />
                </Box>
              )}
            </Box>


          </Box>
          <Divider sx={{ mt: 1 }} />

          {/*7 AUDIT FEE  */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>7 . AUDIT FEE : </b></Typography>
            </Box>


            <Box>
              <Box ml={2}>
                <Box>
                  <Typography>
                    (i).Give amount of audit fees last assessed. State the period for which it is assessed. State the dates of recovery of audit fees, name of treasury and amount credited. (Give No. and date treasury Challan):
                  </Typography>
                </Box>

                <Box mt={1}>
                  <Typography>Details about auditfee. </Typography>
                  <TextField
                    value={auditfees}
                    onChange={(e) => setauditfees(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder="Enter Details about auditfee"
                    fullWidth
                  />
                </Box>
              </Box>

              <Box mt={2} ml={2} >
                <Box>
                  <Typography  >
                    (ii). If audit fees have not been paid by the society. Give details about outstanding audit fees and reasons for non-payment.
                  </Typography>


                  <Box mt={1}>
                    <Typography>Give details about outstanding audit fees and reasons for non-payment. </Typography>
                    <TextField
                      value={detailsaboutoutstandingauditfees}
                      onChange={(e) => setdetailsaboutoutstandingauditfees(e.target.value)}
                      variant="standard"
                      sx={{
                        '& .MuiInput-underline:after': {
                          borderBottomWidth: 1.5,
                          // borderBottomColor: '#44ad74',
                        }, mt: 1
                      }}
                      focused
                      size="small"
                      margin="none"
                      placeholder="Enter Give details about outstanding audit fees and reasons for non-payment."
                      fullWidth
                    />
                  </Box>



                </Box>



              </Box>






            </Box>





          </Box>
          <Divider sx={{ mt: 1 }} />

          {/* 8 INTERNAL OR LOCAL AUDIT */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>8 . INTERNAL OR LOCAL AUDIT : </b></Typography>
            </Box>


            <Box>
              <Box ml={2}>
                <Box>
                  <Typography>
                    (i).If there is internal or local audit, state by whom done, period covered & whether memo is on the record of society.
                  </Typography>
                </Box>

                <Box mt={1}>
                  <Typography>Details about audit. </Typography>
                  <TextField
                    value={internallocalaudit}
                    onChange={(e) => setinternallocalaudit(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder="state by whom done, period covered & whether memo is on the record of society"
                    fullWidth
                  />
                </Box>
              </Box>

              <Box mt={2} ml={2} >
                <Box>
                  <Typography  >
                    (ii). State whether there is proper Co-ordination between Statutory Auditor, Internal Auditor.
                  </Typography>


                  <Box mt={1}>
                    <Typography>State whether there is proper Co-ordination between Statutory Auditor, Internal Auditor. </Typography>
                    <TextField
                      value={CoordinationbetweenAuditor}
                      onChange={(e) => setCoordinationbetweenAuditor(e.target.value)}
                      variant="standard"
                      sx={{
                        '& .MuiInput-underline:after': {
                          borderBottomWidth: 1.5,
                          // borderBottomColor: '#44ad74',
                        }, mt: 1
                      }}
                      focused
                      size="small"
                      margin="none"
                      placeholder="State whether there is proper Co-ordination between Statutory Auditor, Internal Auditor."
                      fullWidth
                    />
                  </Box>



                </Box>



              </Box>






            </Box>





          </Box>
          <Divider sx={{ mt: 1 }} />


          {/* 9 MANAGING DIRECTOR/MANAGER/ SECRETARY */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>9 .MANAGING DIRECTOR/MANAGER/ SECRETARY  : </b></Typography>
            </Box>


            <Box>
              <Box ml={2} display={'flex'} alignItems={'center'} gap={2}>
                <Box>
                  <Typography>
                    (i).Name of officer (Secretary):
                  </Typography>
                </Box>

                <Box>

                  <TextField
                    value={Nameofofficer}
                    onChange={(e) => setNameofofficer(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      },
                    }}
                    focused
                    size="small"
                    margin="none"

                    placeholder="Enter Name of officer (Secretary):"

                  />
                </Box>
              </Box>

              <Box ml={2} display={'flex'} alignItems={'center'} gap={10} mt={2}>
                <Box>
                  <Typography>
                    (ii).Pay drawn Grade:
                  </Typography>
                </Box>

                <Box>

                  <TextField
                    value={PaydrawnGrade}
                    onChange={(e) => setPaydrawnGrade(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      },
                    }}
                    focused
                    size="small"
                    margin="none"

                    placeholder="Enter Pay drawn Grade"

                  />
                </Box>
              </Box>

              <Box ml={2} display={'flex'} alignItems={'center'} gap={1} mt={2}>
                <Box>
                  <Typography>
                    (iii).State other allowances, if any, and facilities given such as rent free quarters etc:
                  </Typography>
                </Box>

                <Box>

                  <TextField
                    value={otherallowances}
                    onChange={(e) => setotherallowances(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      },
                    }}
                    focused
                    size="small"
                    margin="none"

                    placeholder="other allowances,facilities"

                  />
                </Box>
              </Box>


              <Box ml={2} display={'flex'} alignItems={'center'} gap={45} mt={2}>
                <Box>
                  <Typography>
                    (iii).State whether he is a member?
                  </Typography>
                </Box>

                <RadioGroup row
                  value={whetherismember}
                  onChange={(e) => setwhetherismember(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>

              </Box>

              <Box ml={2} display={'flex'} alignItems={'center'} gap={9} mt={2}>
                <Box>
                  <Typography>
                    (v).If so, whether he has borrowed or has been given any credit facilities?<br /> State the amount borrowed and the amount of over dues if any.
                  </Typography>
                </Box>

                <Box>

                  <TextField
                    value={hasBorrowed}
                    onChange={(e) => sethasBorrowed(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      },
                    }}
                    focused
                    size="small"
                    margin="none"

                    placeholder="amount borrowed and the amount of over dues"

                  />
                </Box>
              </Box>


              <Box ml={2} display={'flex'} alignItems={'center'} gap={30} mt={2}>
                <Box>
                  <Typography>
                    (vi).If other amounts are due from him, give details?
                  </Typography>
                </Box>

                <RadioGroup row
                  value={otherAmountsDue}
                  onChange={(e) => setotherAmountsDue(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>

              </Box>

              <Box ml={2} mt={2}>
                <Box>
                  <Typography>
                    (vii).Obtain a list of Staff showing names, designation, qualifications, scales, present pay and allowances given, dates from which employed, security furnished etc.
                  </Typography>
                </Box>

                <Box>

                  <TextField

                    value={listofStaff}
                    onChange={(e) => setlistofStaff(e.target.value)}
                    fullWidth
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      },
                    }}
                    focused
                    size="small"
                    margin="none"

                    placeholder="list of Staff showing names,designation,qualifications,scales,present pay and allowances given,dates"

                  />
                </Box>
              </Box>
            </Box>

          </Box>
          <Divider sx={{ mt: 1 }} />


          {/*10.BREACHES */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>10 .BREACHES  : </b></Typography>
            </Box>


            <Box >
              <Box ml={2} display="flex" alignItems="center" gap={8} >
                <Box>
                  <Typography>
                    (i).Do the society posses copy of the Act, Rules and its registered Bye-laws?
                  </Typography>
                </Box>

                <RadioGroup row
                   value={hasCopyOfActRulesByeLaws}
                   onChange={(e) => sethasCopyOfActRulesByeLaws(e.target.value)}
                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

              <Box mt={2} ml={2} >
                <Box>
                  <Typography  >
                    (ii). Give only numbers of breaches of the Act, Rules and Bylaws :
                  </Typography>


                  <Box mt={1} display="flex" alignItems="center" justifyContent={'space-between'}>
                    <Typography>1. Section No </Typography>
                    <TextField
                      value={SectionNo}
                      onChange={(e) => setSectionNo(e.target.value)}
                      variant="standard"
                      sx={{
                        '& .MuiInput-underline:after': {
                          borderBottomWidth: 1.5,
                          // borderBottomColor: '#44ad74',
                        }, mt: 1
                      }}
                      focused
                      size="small"
                      margin="none"
                      placeholder="Enter Section No."

                    />
                  </Box>

                  <Box mt={1} display="flex" alignItems="center" justifyContent={'space-between'}>
                    <Typography>2. Rules  No </Typography>
                    <TextField
                       value={RulesNos}
                      onChange={(e) => setRulesNos(e.target.value)}
                      variant="standard"
                      sx={{
                        '& .MuiInput-underline:after': {
                          borderBottomWidth: 1.5,
                          // borderBottomColor: '#44ad74',
                        }, mt: 1
                      }}
                      focused
                      size="small"
                      margin="none"
                      placeholder="Enter Rules  No."

                    />
                  </Box>

                  <Box mt={1} display="flex" alignItems="center" justifyContent={'space-between'}>
                    <Typography>3. Bye Laws No </Typography>
                    <TextField
                      value={ByeLawsNo}
                      onChange={(e) => setByeLawsNo(e.target.value)} 
                      variant="standard"
                      sx={{
                        '& .MuiInput-underline:after': {
                          borderBottomWidth: 1.5,
                          // borderBottomColor: '#44ad74',
                        }, mt: 1
                      }}
                      focused
                      size="small"
                      margin="none"
                      placeholder="Enter Bye Laws  No."

                    />
                  </Box>

                </Box>



              </Box>


              <Box ml={2} display="flex" alignItems="center" gap={8} mt={3} >
                <Box>
                  <Typography>
                    (iii).Have any rules been framed under the Byelaws? Are they appropriate <br /> authority? Are they properly followed? (These breaches should discuss brief in <br /> general remarks.)
                  </Typography>
                </Box>

                <RadioGroup row
                  value={rulesundertheByelaws}
                  onChange={(e) => setrulesundertheByelaws(e.target.value)}
                
                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>






            </Box>





          </Box>
          <Divider sx={{ mt: 1 }} />


          {/* 11.Profit And Loss */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>11 . PROFIT AND LOSS  : </b></Typography>
            </Box>
            {/* i */}
            <Box display="flex" alignItems="center" gap={11} ml={2}>
              <Typography>
                (i). What is the amount of Profit earned or loss incurred during the last Co-operative year?
              </Typography>




              <TextField
                value={Profitorloss}
                onChange={(e) => setProfitorloss(e.target.value)}
                variant="standard"
                sx={{
                  '& .MuiInput-underline:after': {
                    borderBottomWidth: 1.5,
                    // borderBottomColor: '#44ad74',
                  }, mt: 1
                }}
                focused
                size="small"
                margin="none"
                placeholder="amount of Profit or loss "

              />


            </Box>

            <Box display="flex" alignItems="center" gap={11} ml={2} mt={2}>
              <Typography>
                (ii). State if the net profits are distributed (In case of non business societies <br /> figures of surplus or Deficit may be given against query No. II (I) above)
              </Typography>

              <TextField
                value={netProfitDistributed}
                onChange={(e) => setnetProfitDistributed(e.target.value)}
                variant="standard"
                sx={{
                  '& .MuiInput-underline:after': {
                    borderBottomWidth: 1.5,
                    // borderBottomColor: '#44ad74',
                  }, mt: 1
                }}
                focused
                size="small"
                margin="none"
                placeholder="State if the net profits are distributed  "

              />


            </Box>




          </Box>
          <Divider sx={{ mt: 1 }} />

          {/* 12.CASH, BANK BALANCE AND SECURITIES : */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>12.(A)	CASH, BANK BALANCE AND SECURITIES :</b></Typography>
            </Box>
            {/* i */}
            <Box display="flex" alignItems="center" gap={2} ml={2}>
              <Typography>
                (i) Count cash and sign the cash book stating the amount counted  and  date of which counted.
              </Typography>




              <TextField
                 value={amountcounted}
                onChange={(e) => setamountcounted(e.target.value)}
                variant="standard"
                sx={{
                  '& .MuiInput-underline:after': {
                    borderBottomWidth: 1.5,
                    // borderBottomColor: '#44ad74',
                  }, mt: 1
                }}
                focused
                size="small"
                margin="none"
                placeholder="amount counted and date which counted"

              />


            </Box>
            {/* ii */}
            <Box display="flex" alignItems="center" gap={2} ml={2} mt={2}>
              <Typography>
                (ii). Who produced the Cash for Counting? Give his name & designation. Is the authorized to keep cash?
              </Typography>

              <TextField
                   value={producedByDesignation}
                onChange={(e) => setproducedByDesignation(e.target.value)}
                variant="standard"
                sx={{
                  '& .MuiInput-underline:after': {
                    borderBottomWidth: 1.5,
                    // borderBottomColor: '#44ad74',
                  }, mt: 1
                }}
                focused
                size="small"
                margin="none"
                placeholder="name & designation of Who produced the Cash for Counting "

              />


            </Box>
            {/* iii */}
            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={2}>
              <Typography>
                (iii). Is it correct according to the Cash Book?
              </Typography>

              <RadioGroup row
                value={infoaccordingCashBook}
                onChange={(e) => setinfoaccordingCashBook(e.target.value)}
                
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>


            </Box>
            {/* iv */}
            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={2}>
              <Typography>
                (iv).Are Arrangements for safety of Cash safe and cash-in-transit adequate?
              </Typography>

              <RadioGroup row
                value={ArrangementssafetyCash}
                onChange={(e) => setArrangementssafetyCash(e.target.value)}
                
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>


            </Box>

            {/* B */}
            <Box ml={5.5} mt={1}>
              <Typography variant='h6'><b>(B) BANK BALANCES :</b></Typography>
            </Box>

            <Box ml={2}>
              <Typography>
                (i) Do Bank balance shown in Bank Pass books or bank statements and Bank balance shown in Books of accounts? If not, check reconciliation statements.
              </Typography>

              <TextField
                fullWidth
                variant="standard"
                value={BankReconciliationstatement}
                onChange={(e) => setBankReconciliationstatement(e.target.value)}
                sx={{
                  '& .MuiInput-underline:after': {
                    borderBottomWidth: 1.5,
                    // borderBottomColor: '#44ad74',
                  }, mt: 1
                }}
                focused
                size="small"
                margin="none"
                placeholder="reconciliation statements"

              />
            </Box>

            {/* C */}
            <Box ml={5.5} mt={1}>
              <Typography variant='h6'><b>(C) SECURITIES :-</b></Typography>
            </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} >
              <Typography>
                1.Verify securities physically and see whether they are in the name of society
              </Typography>

              <RadioGroup row
                 value={physicallysecurities}
                 onChange={(e) => setphysicallysecurities(e.target.value)}
                
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>


            </Box>
            {/*  */}
            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} >
              <Typography>
                2.Are dividends and interest being duly collected?
              </Typography>

              <RadioGroup row
                 value={dividendscollected}
                 onChange={(e) => setdividendscollected(e.target.value)}
                
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>


            </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} >
              <Typography>
                3.If securities are lodged with the bank, are relevant certificates obtained?
              </Typography>

              <RadioGroup row
                 value={relevantcertificates}
                onChange={(e) => setrelevantcertificates(e.target.value)}
               
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>


            </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} >
              <Typography>
                4.Is investment register maintains and written up-to-date?
              </Typography>

              <RadioGroup row
                 value={investmentregister}
                 onChange={(e) => setinvestmentregister(e.target.value)}
              
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>


            </Box>




          </Box>
          <Divider sx={{ mt: 1 }} />

          {/* 13. Movable and immovable property : */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>13 .Movable and immovable property :</b></Typography>
            </Box>


            <Box >
              <Box ml={2} display="flex" alignItems="center" justifyContent={'space-between'} >
                <Box>
                  <Typography>
                    1. Is relevant register maintained and written up-to-date?
                  </Typography>
                </Box>

                <RadioGroup row
                   value={Isrelevantregister}
                   onChange={(e) => setIsrelevantregister(e.target.value)}
                  
                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

              <Box ml={2} display="flex" alignItems="center" justifyContent={'space-between'} >
                <Box>
                  <Typography>
                    2. Verify property physically & obtain its list. Do the balance tally with <br />balance sheet Figures?
                  </Typography>
                </Box>

                <Box mt={1}>

                  <TextField
                    value={Verifypropertyphysically}
                    onChange={(e) => setVerifypropertyphysically(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder=" Do the balance tally with balance sheet Figures?"
                    fullWidth
                  />
                </Box>
              </Box>


              <Box ml={2} display="flex" alignItems="center" justifyContent={'space-between'} mt={1} >
                <Box>
                  <Typography>
                    3.In case of immovable property including lands verify title deeds and see <br /> whether they are in the name of Society
                  </Typography>
                </Box>

                <Box >

                  <TextField
                   value={Verifyimmovableproperty}
                    onChange={(e) => setVerifyimmovableproperty(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder="Property Title Check"
                    fullWidth
                  />
                </Box>
              </Box>

              <Box ml={2} display="flex" alignItems="center" justifyContent={'space-between'} mt={1} >
                <Box>
                  <Typography>
                    4.Is the property duly insured where necessary?  If so, give details in general remarks.
                  </Typography>
                </Box>

                <Box >

                  <TextField
                         value={propertydulyinsured}
                    onChange={(e) => setpropertydulyinsured(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder="Insured general remarks"
                    fullWidth
                  />
                </Box>
              </Box>


              <Box ml={2} mt={1} >
                <Box>
                  <Typography>
                    5.DEPRECIATION
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" justifyContent={'space-between'} >
                  <Typography>
                    (i)  Is due depreciation charges?
                  </Typography>
                  <RadioGroup row
                     value={depreciationcharges}
                     onChange={(e) => setdepreciationcharges(e.target.value)}
                   
                    defaultValue="no">
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </Box>

                <Box display="flex" alignItems="center" justifyContent={'space-between'} >
                  <Typography>
                    (ii)State the rate of depreciation charges on various assets.
                  </Typography>

                  <Box mt={1}>

                    <TextField
                      value={rateofdepreciation}
                      onChange={(e) => setrateofdepreciation(e.target.value)}
                      variant="standard"
                      sx={{
                        '& .MuiInput-underline:after': {
                          borderBottomWidth: 1.5,
                          // borderBottomColor: '#44ad74',
                        }, mt: 1
                      }}
                      focused
                      size="small"
                      margin="none"
                      placeholder="rate of depreciation charges"
                      fullWidth
                    />
                  </Box>
                </Box>
              </Box>




            </Box>





          </Box>
          <Divider sx={{ mt: 1 }} />

          {/* 14 */}
          <Box ml={2} display="flex" alignItems="center" gap={8} >
            <Box>
              <Typography><b>14. </b>Have you discussed the draft of audit memo in the board of managing <br /> committee meeting? If not state reasons for the same. </Typography>
            </Box>


            <RadioGroup row
              value={draftofauditmemo}
              onChange={(e) => setdraftofauditmemo(e.target.value)}
              
              defaultValue="no">
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </Box>


          <Box display={'flex'} alignItems={'center'} m={2}>
            <Button
              variant='contained'
              onClick={createAuditorReport}
            >Save
            </Button>
          </Box>

        </Drawer>

{/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        {/* form No 28  */}

         <Drawer
          anchor="right"
          open={newDrawerOpen}
          onClose={handleNewDrawerClose}
          PaperProps={{
            sx: {
              width: isSmallScreen ? "100%" : "60%",
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              zIndex: 1000,
            },
          }}
        >


          {/* Form Fields */}

          <Box textAlign={'center'} p={2}>
            <Typography  >FORM NO. 28</Typography>
           <Typography   >AUDIT MEMO (CO-OP. HOUSING SOCIETIES)</Typography>
           <Typography ><b>PART II</b> </Typography>
           <Typography ><b>{societyName.toUpperCase()} </b> </Typography>
          </Box>
          <Divider />


          {/*BORROWINGS : */}
          <Box ml={2}>
            <Box  mt={1}>
              <Typography variant='h6'><b>1. BORROWINGS : </b></Typography>
            </Box>


            <Box>
              <Typography>i. State the loans obtained by the society for various purposes from Govt. & other agencies :  </Typography>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={2} >
                <Typography>Agency sanctioning Loan : </Typography>
                <TextField
                variant="standard"
                   sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                  size="small"
                  placeholder="Agency sanctioning Loan"
                   value={AgencysanctioningLoan}
                 onChange={(e) => setAgencysanctioningLoan(e.target.value)}
                />
              </Box>

                <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1} >
                <Typography>Purpose for which loan is sanctioned  : </Typography>
                <TextField
                  variant="standard"
                   value={Purposeloansanctioned}
                  onChange={(e) => setPurposeloansanctioned(e.target.value)}
                   sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                  size="small"
                  placeholder="Purpose for which loan is sanctioned "
                 
                />
              </Box>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1} >
                <Typography>Amount for loan sanctioned : </Typography>
                <TextField
                  variant="standard"
                   sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                  size="small"
                  placeholder="Amount for loan sanctioned "
                 value={loansanctionedAmount}
                 onChange={(e) => setloansanctionedAmount(e.target.value)}
                />
              </Box>
              {/*  */}

               <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1} >
                <Typography>Maximum amount drawn : </Typography>
                <TextField
                  variant="standard"
                     value={Maximumamountdrawn}
                  onChange={(e) => setMaximumamountdrawn(e.target.value)}
                   sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                  size="small"
                  placeholder="Maximum amount drawn"
                
                />
              </Box>

                <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1} >
                <Typography>Re-payments made : </Typography>
                <TextField
                  variant="standard"
                   sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                  size="small"
                  placeholder="Re-payments made  "
                   value={Repaymentsmade}
                   onChange={(e) => setRepaymentsmade(e.target.value)}
                />
              </Box>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1} >
                <Typography>Outstanding : </Typography>
                <TextField
                  variant="standard"
                   sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                  size="small"
                  placeholder="Outstanding"
                 value={Outstanding}
                 onChange={(e) => setOutstanding(e.target.value)}
                />
              </Box>

              {/*  */}
                <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1} >
                <Typography>Amount overdue if any : </Typography>
                <TextField
                  variant="standard"
                   sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                  size="small"
                  placeholder="Amount overdue if any"
                   value={Amountoverdueifany}
                   onChange={(e) => setAmountoverdueifany(e.target.value)}
                />
              </Box>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1} >
                <Typography>Remarks :  </Typography>
                <TextField
                  variant="standard"
                   sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                  size="small"
                  placeholder="Remarks"
                 value={Remarks}
                 onChange={(e) => setRemarks(e.target.value)}
                />
              </Box>

            </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} >
              <Typography>ii. Are repayments of loans punctual? </Typography>
                     <RadioGroup row 
                      value={repaymentsloanspunctual} onChange={(e) => setrepaymentsloanspunctual(e.target.value)}
                      defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} >
              <Typography>iii. Are all conditions laid down for grant of various loans and credits observed?<br/> Note breaches if any.  </Typography>
                     <RadioGroup row 
                      value={conditionslaiddown} onChange={(e) => setconditionslaiddown(e.target.value)}
                      defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

             <Box display="flex" alignItems="center" justifyContent={'space-between'} >
              <Typography>iv. Are necessary documents executed in favors of the authority sanctioning the loan?  </Typography>
                     <RadioGroup row 
                      value={necessarydocuments} onChange={(e) => setnecessarydocuments(e.target.value)}
                      defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>


          </Box>
          <Divider sx={{ mt: 1 }} />

          {/*GOVERNMENT FINANCIAL ASSISTANCE */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>2. GOVERNMENT FINANCIAL ASSISTANCE :</b></Typography>
            </Box>


            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2}>
              <Typography>
                (i). What is the amount of Government subsidy sanctioned and received by the society? 
              </Typography>


            <TextField
                     value={amountsubsidysanctioned}
                     onChange={(e) => setamountsubsidysanctioned(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder="amount of subsidy sanctioned"
                  
                  />
            </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={2}>
              <Typography>
                (ii).Has Government sanctioned any amount for land development?  <br/> If So, state the amount. Have development expenses exceeded the said amount 
              </Typography>


              <RadioGroup row 
               value={Hassanctionedamount} onChange={(e) => setHassanctionedamount(e.target.value)} 
              defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

          </Box>
          <Divider sx={{ mt: 1 }} />

          {/*MEMBERSHIP:  */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>3.	MEMBERSHIP  :</b></Typography>
            </Box>


            <Box display="flex" alignItems="center" justifyContent={'space-between'}  ml={2}>
              <Typography>
                (i). State whether in case of backward class of co-operative housing societies,<br/> certificates from the social welfare officers are obtained for their eligibility to <br/> membership and obtaining of financial assistance? 
              </Typography>


            <TextField
                     value={financialassistancemembership}
                     onChange={(e) => setfinancialassistancemembership(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder="State whether in case of backward class of co-operative housing societies"
                    
                  />
            </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1}  ml={2}>
              <Typography>
                (ii). State whether certificates are obtained from officers of the concerned industry <br/> in case of subsidized industrial housing scheme?
              </Typography>


            <TextField
                     value={certificatesfromofficers}
                     onChange={(e) => setcertificatesfromofficers(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder="State whether certificates are obtained from officers"
                    
                  />
            </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={1}>
              <Typography>
                (iii). Have declaration been obtained from members that they and their family <br/> members do not own lands or houses.
              </Typography>
              <TextField
                    value={declarationfrommembers}
                    onChange={(e) => setdeclarationfrommembers(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder="state declaration obtained from members"
                    
                  />

            </Box>

          </Box>
          <Divider sx={{ mt: 1 }} />

          {/* LANDS AND THEIR DEVELOPMENT: */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>4 . LANDS AND THEIR DEVELOPMENT : </b></Typography>
            </Box>


            <Box >


              <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2}>
                <Box>
                  <Typography>
                    (i). State whether lands for constructions of houses have been secured purchased or <br /> obtained on lease. Give details for the lands, stating total area, survey nos. & <br /> CRS nos. if any, price for which purchased, lease rent etc.
                  </Typography>
                </Box>

                <Box>
                  <TextField
                     value={detailslandsforconstructions}
                     onChange={(e) => setdetailslandsforconstructions(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder="details for the lands,total area,survey nos"
                    fullWidth
                  />
                </Box>
              </Box>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={2}  >
                <Box>
                  <Typography ml={2} >
                    (ii). See the title deeds and ascertain whether they are properly executed in favor of society.
                  </Typography>
                </Box>


                <RadioGroup row
                   value={titledeeds}
                   onChange={(e) => settitledeeds(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>

              </Box>

              <Box ml={2} >
                <Typography>(iii) State how the lands has been utilized for:</Typography>

                <Box display="flex" alignItems="center" justifyContent={'space-between'}   >
                  <Typography>(a)	Construction of Flats</Typography>

                  <TextField
                    variant="standard"
                   sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    placeholder="Enter number"
                  value={ConstructionFlats}
                  onChange={(e) => setConstructionFlats(e.target.value)}
                  />
                </Box>

                <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1}  >
                  <Typography>(b)	Construction of roads</Typography>
                  <TextField
                   variant="standard"
                   sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                   
                    size="small"
                    placeholder="Enter number"
                  value={Constructionroads}
                  onChange={(e) => setConstructionroads(e.target.value)}
                  />
                </Box>

                <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1}  >
                  <Typography> (c)	Open Space </Typography>
                  <TextField
                   variant="standard"
                   sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                  placeholder="Open Space"
                  value={OpenSpace}
                  onChange={(e) => setOpenSpace(e.target.value)}
                  />
                </Box>

                <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={1}  >
                  <Typography> (d)	Other purposes (give details)  </Typography>
                  <TextField
                   sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                  placeholder="Open purposes"
                  value={Otherpurposes}
                  onChange={(e) => setOtherpurposes(e.target.value)}
                  />
                </Box>




              </Box>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={2}  >
                <Box>
                  <Typography ml={2} >
                    (iv). Have the layouts and plans for development been approved the <br /> Municipal Authorities before actual commencement of the work?
                  </Typography>
                </Box>


                <RadioGroup row
                  value={layoutsapproved}
                  onChange={(e) => setlayoutsapproved(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>

              </Box>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} mt={2}  >
                <Box>
                  <Typography ml={2} >
                    (v). Have completion certificates been obtained from appropriate authorities <br /> for drainage, water supply, roads, etc before period construction work <br /> of building is commenced?
                  </Typography>
                </Box>


                <RadioGroup row
                  value={completioncertificates}
                  onChange={(e) => setcompletioncertificates(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>

              </Box>


            </Box>
          </Box>
          <Divider sx={{ mt: 1 }} />


          {/*CONSTRUCTION OF BUILDINGS:*/}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>5 . CONSTRUCTION OF BUILDINGS : </b></Typography>
            </Box>
            
            <Box>
                <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2}>
              <Typography>
                (i).(a) Have building construction commenced?
              </Typography>

              <RadioGroup row
                 value={buildingconstructioncommenced}
                 onChange={(e) => setbuildingconstructioncommenced(e.target.value)}
           
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>


            </Box>

              <Box ml={2} mt={2} display={'flex'} gap={18}>
                <Typography>
                  (b). State the No of houses of flats constructed and under construction
                </Typography>

            <TextField
                     value={Noofhousesflats}
                     onChange={(e) => setNoofhousesflats(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder="No of houses of flats constructed and under construction"
                    fullWidth
                  />
              </Box>

              <Box>
             
           
            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2}>
              <Typography>
                (c) Have the completed houses and flats allotted to members?
              </Typography>

              <RadioGroup row
                 value={flatsallottedmembers}
                 onChange={(e) => setflatsallottedmembers(e.target.value)}
           
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>


            </Box>
              </Box>
            </Box>
{/* ii */}
            <Box >
              <Box ml={2} >
                <Typography >(ii).Are building constructed on contract basis? See the terms & conditions of contracts and state whether they been  property observed. Note breaches if any. </Typography>
              </Box>

              <TextField
                 value={termsconditionscontracts}
                 onChange={(e) => settermsconditionscontracts(e.target.value)}
                variant="standard"
                sx={{
                  '& .MuiInput-underline:after': {
                    borderBottomWidth: 1.5,
                    // borderBottomColor: '#44ad74',
                  }, m: 2
                }}
                focused
                size="small"
                margin="none"
                placeholder="state breaches if any"
                fullWidth
              />

            </Box>



            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2}>
              <Typography>
                (iii).Are these contracts properly sanctioned by the competent authority <br /> as per bye laws of the society?
              </Typography>

              <RadioGroup row
                 value={contractsproperlysanctioned}
                 onChange={(e) => setcontractsproperlysanctioned(e.target.value)}

                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={1}>
              <Typography>
                (iv).Have tenders of quotation been called after giving due advertisement <br /> in local news papers? If the works are giving to the contractors quoting the <br /> lowest figures, see whether reason for the same are recorded.
              </Typography>

              <RadioGroup row
                 value={tendersofquotation}
                 onChange={(e) => settendersofquotation(e.target.value)}

                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>


            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={1}>
              <Typography>
                (v).Are contractors paid after necessary work progress certificate are obtained <br /> from the architects? Are running & final bills obtained before payments are made <br /> to the contractors?
              </Typography>

              <RadioGroup row
                 value={workprogresscertificate}
                 onChange={(e) => setworkprogresscertificate(e.target.value)}

                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} >
              <Typography>
                (vi).See the terms on which the architects are employed. Are there any breaches?
              </Typography>

              <RadioGroup row
                 value={architectsemployed}
                 onChange={(e) => setarchitectsemployed(e.target.value)}

                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>


            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2}>
              <Typography>
                (vii).See whether completion certificate have been obtained from qualified engineers <br /> & architects, stating that the construction have been completed according to approved <br /> plans, specifications and other terms of contract.
              </Typography>

              <RadioGroup row
                 value={constructioncompletedtoplans}
                 onChange={(e) => setconstructioncompletedtoplans(e.target.value)}

                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2}>
              <Typography>
                (viii).Is a property register kept in proper form? 
Is it written up-to date?

              </Typography>

              <RadioGroup row
                 value={propertyregister}
                 onChange={(e) => setpropertyregister(e.target.value)}

                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box ml={2}>
              <Typography>
                (ix).When building is built departmentally, state whether the following books are kept and written up-to date?

              </Typography>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={3.5}>
                <Typography>
                  (a).Job registers and measurement book
                </Typography>

                <RadioGroup row
                   value={measurementbook}
                   onChange={(e) => setmeasurementbook(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>


              <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={3.5}>
                <Typography>
                  (b).Stock registers
                </Typography>

                <RadioGroup row
                   value={Stockregisters}
                   onChange={(e) => setStockregisters(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={3.5}>
                <Typography>
                  (c).Are valuation certificates from qualified engineers & /or architects obtained?
                </Typography>

                <RadioGroup row
                  value={valuationcertificates}
                  onChange={(e) => setvaluationcertificates(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

              
              <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={3.5}>
                <Typography>
                  (d).Is expenditure allocated properly between items of capital & revenue nature?
                </Typography>

                <RadioGroup row
                   value={expenditureallocated}
                   onChange={(e) => setexpenditureallocated(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>
            </Box>

            <Box  ml={2}>
              <Typography>  (x).State whether building has been constructed according to the original plans and estimates submitted with the loan applications and which are approved by the competent authority. Are there any deviations? If so, are they got approved from the competent authority?</Typography>
              
              <TextField
                     value={buildingaccordingplans}
                     onChange={(e) => setbuildingaccordingplans(e.target.value)}
                    variant="standard"
                    sx={{
                      '& .MuiInput-underline:after': {
                        borderBottomWidth: 1.5,
                        // borderBottomColor: '#44ad74',
                      }, mt: 1 
                    }}
                    focused
                    size="small"
                    margin="none"
                    placeholder="State whether building has been constructed according to the original plans and estimates submitted with the loan applications and which are approved by the competent authority. Are there any deviations? If so, are they got approved from the competent authority?"
                    fullWidth
                  />
            </Box>
    
              <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={1}>
                <Typography>
                  (xi).In case of flat owner’s society, see whether titles to the land have been transferred <br/> in the name of the society.
                </Typography>

                <RadioGroup row
                   value={flatownersociety}
                   onChange={(e) => setflatownersociety(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={1}>
                <Typography>
                  (xii).Are building and other construction got insured?
                </Typography>

                <RadioGroup row
                  value={constructioninsured}
                  onChange={(e) => setconstructioninsured(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={1}>
                <Typography>
                  (xiii).In case of flat owner’s society have the promoters fulfilled their obligation as per <br/> agreements entered with them by the members prior to the registration of the society?
                </Typography>

                <RadioGroup row
                  value={promotersobligation}
                  onChange={(e) => setpromotersobligation(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={1}>
              <Typography>
                (xiv).Examine the agreements entered into with the promoters & see whether they are <br/> in the interest of the society
              </Typography>

              <RadioGroup row
                value={Examineagreements}
                onChange={(e) => setExamineagreements(e.target.value)}

                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>


            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={1}>
              <Typography>
                (xv).Has the society executed lease deeds in favor of members for giving plots and/or <br/> buildings on lease to them?
              </Typography>

              <RadioGroup row
                value={favorofmembers}
                onChange={(e) => setfavorofmembers(e.target.value)}

                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

    <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={1}>
              <Typography>
                (xvi).Has the Society created sinking fund as per the provision of the bye-laws?
              </Typography>

              <RadioGroup row
                value={Societysinkingfund}
                onChange={(e) => setSocietysinkingfund(e.target.value)}

                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>


            <Box ml={2} mt={1}>
              <Typography>
                (xvii).Examine the basis on which monthly rents or contribution are fixed in case of tenants co-partnership society or flat owners Societies and see that following items are adequately covered.
              </Typography>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={3.5}>
                <Typography>
                  (a).Amounts required for the repayment loan installments.
                </Typography>
                <RadioGroup row
                  value={Amountsrepaymentloan}
                  onChange={(e) => setAmountsrepaymentloan(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

                <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={3.5}>
                <Typography>
                  (b).Municipal and other taxes.
                </Typography>
                <RadioGroup row
                  value={Municipaltaxes}
                  onChange={(e) => setMunicipaltaxes(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

                 <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={3.5}>
                <Typography>
                  (c).Lease rent.
                </Typography>
                <RadioGroup row
                  value={Leaserent}
                  onChange={(e) => setLeaserent(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={3.5}>
                <Typography>
                  (d).Service charges and common expenses
                </Typography>
                <RadioGroup row
                   value={Servicecharges}
                   onChange={(e) => setServicecharges(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

              
              <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={3.5}>
                <Typography>
                  (e).Contribution to sinking fund.
                </Typography>
                <RadioGroup row
                  value={Contributionsinkingfund}
                  onChange={(e) => setContributionsinkingfund(e.target.value)}

                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

            </Box>




          </Box>
          <Divider sx={{ mt: 1 }} />

          {/*LOANS TO MEMBERS*/}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>6. LOANS TO MEMBERS :</b></Typography>
            </Box>


            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2}>
              <Typography>
                (i). Are recoveries of loan punctual?
              </Typography>

              <RadioGroup row
                value={recoveriesofloan}
                onChange={(e) => setrecoveriesofloan(e.target.value)}

                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={2}>
              <Typography>
                (ii).State the amounts of over dues.
              </Typography>


              <TextField
                 value={amountsofoverdues}
                 onChange={(e) => setamountsofoverdues(e.target.value)}
                variant="standard"
                sx={{
                  '& .MuiInput-underline:after': {
                    borderBottomWidth: 1.5,
                    // borderBottomColor: '#44ad74',
                  }, mt: 1
                }}
                focused
                size="small"
                margin="none"
                placeholder="State the amounts of over dues. "

              />
            </Box>


            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2} mt={2}>
              <Typography>
                (iii).State What steps are being taken to recover over dues?
              </Typography>


              <TextField
                 value={recoveroverdues}
                 onChange={(e) => setrecoveroverdues(e.target.value)}
                variant="standard"
                sx={{
                  '& .MuiInput-underline:after': {
                    borderBottomWidth: 1.5,
                    // borderBottomColor: '#44ad74',
                  }, mt: 1
                }}
                focused
                size="small"
                margin="none"
                placeholder="State steps are being taken to recover over dues"
              />
            </Box>

          </Box>
          <Divider sx={{ mt: 1 }} />

          {/*EXPENDITURE */}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>7 .EXPENDITURE  :</b></Typography>
            </Box>


            <Box display="flex" alignItems="center" justifyContent={'space-between'} ml={2}>
              <Typography>
                Has the expenditure been approved by managing committee from time to time.
              </Typography>


              <RadioGroup row
                value={expenditureapproved}
                onChange={(e) => setexpenditureapproved(e.target.value)}

                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} m={2}>
            <Button
              variant='contained'
               onClick={createAuditorReport}
            >Save
            </Button>

          </Box>

        </Drawer>

        {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
        {/* Schedule */}
        
          <Drawer
          anchor="right"
          open={scheduleDrawerOpen}
          onClose={handleScheduleDrawerClose}
          PaperProps={{
            sx: {
              width: isSmallScreen ? "100%" : "60%",
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              zIndex: 1000,
            },
          }}
        >


          {/* Form Fields */}

          <Box textAlign={'center'} p={2}>
            
           
           
           <Typography ><b>{societyName.toUpperCase()} </b> </Typography>
           <Typography>Statutory audit for the year ended 31st March 2024.</Typography>
           <Typography mt={1}><b>SCHEDULES</b></Typography>
          </Box>
          <Divider />


          <Box>

          <Box ml={2}>
            <Box  mt={1}>
              <Typography variant='h6'><b>SCHEDULE –I</b></Typography>
            </Box>


          

            <Box display="flex" alignItems="center" justifyContent={'space-between'} >
              <Typography>Transaction involving infringement of the provisions of the Act, Rules and Bye- laws</Typography>
              <RadioGroup row
                value={ScheduleI} onChange={(e) => setScheduleI(e.target.value)}
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

          </Box>
        

            <Box ml={2}>
              <Box mt={1}>
                <Typography variant='h6'><b>SCHEDULE –II</b></Typography>
              </Box>




              <Box display="flex" alignItems="center" justifyContent={'space-between'} >
                <Typography>Particular of sums which ought to have been but have not been brought into accounts: -</Typography>
                <RadioGroup row
                  value={ScheduleII} onChange={(e) => setScheduleII(e.target.value)}
                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

            </Box>
            {/*  */}
            <Box ml={2}>
            <Box  mt={1}>
              <Typography variant='h6'><b>SCHEDULE –III</b></Typography>
            </Box>


          

            <Box display="flex" alignItems="center" justifyContent={'space-between'} >
              <Typography>Improper and Irregular vouchers</Typography>
              <RadioGroup row
                value={ScheduleIII} onChange={(e) => setScheduleIII(e.target.value)}
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

          </Box>
        

            <Box ml={2}>
              <Box mt={1}>
                <Typography variant='h6'><b>SCHEDULE –IIIA</b></Typography>
              </Box>




              <Box display="flex" alignItems="center" justifyContent={'space-between'} >
                <Typography>Irregularities in the realization moneys:-</Typography>
                <RadioGroup row
                  value={ScheduleIIIA} onChange={(e) => setScheduleIIIA(e.target.value)}
                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

            </Box>

            <Box ml={2}>
            <Box  mt={1}>
              <Typography variant='h6'><b>SCHEDULE –IV</b></Typography>
            </Box>


          

            <Box display="flex" alignItems="center" justifyContent={'space-between'} >
              <Typography>Transaction involving infringement of the provisions of the Act, Rules and Bye- laws</Typography>
              <RadioGroup row
                value={ScheduleIV} onChange={(e) => setScheduleIV(e.target.value)}
                defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

          </Box>
        

            <Box ml={2}>
              <Box mt={1}>
                <Typography variant='h6'><b>SCHEDULE –V</b></Typography>
              </Box>

              <Box display="flex" alignItems="center" justifyContent={'space-between'} >
                <Typography>Particular of sums which ought to have been but have not been brought into accounts: -</Typography>
                <RadioGroup row
                  value={ScheduleV} onChange={(e) => setScheduleV(e.target.value)}
                  defaultValue="no">
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

            </Box>


          </Box>


        


   

   

      

          <Box display={'flex'} alignItems={'center'} m={2}>
            <Button
              variant='contained'
               onClick={createAuditorReport}
            >Save
            </Button>

          </Box>

        </Drawer>

        <Box display="flex" alignItems="center" gap={2}>
          {/* <Button onClick={createAuditorReport} type="submit" variant="contained" color="primary">
    Submit
  </Button> */}

          <Button onClick={addReportBlock} variant="outlined" color="secondary" sx={{ mb: 0 }}>
            <AddIcon />Template
          </Button>
          <Button onClick={generatePDF} variant="outlined" color="secondary">
            <DownloadIcon /> PDF
          </Button>
        </Box>

      </Box>
    </Container>
  );
};

export default AuditorForm;












// 
// import { useState, useEffect } from 'react';
// import {
  // TableContainer,
  // Table,
  // TableHead,
  // TableBody,
  // TableRow,
  // TableCell,
//   Typography,
//   Paper,
//   Grid,
//   Box,
//   Collapse,
//   IconButton
// } from '@mui/material';
// import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import "jspdf-autotable";
// import jsPDF from "jspdf";

// function BalanceSheet() {
  // const [vouchers, setVouchers] = useState({});
  // const [boardofMembers, setboardofMembers] = useState([]);
  // const [groupedAssets, setGroupedAssets] = useState({});
  // const [groupedLiabilities, setGroupedLiabilities] = useState({});
  // const [expandedGroups, setExpandedGroups] = useState({});

//   // Function to group accounts by groupId
//   // const groupAccounts = (accounts) => {
//   //   return accounts.reduce((groups, account) => {
//   //     const groupId = account.groupId || 'ungrouped';
//   //     if (!groups[groupId]) {
//   //       groups[groupId] = {
//   //         groupName: account.groupName || 'Other Assets', 
//   //         accounts: []
//   //       };
//   //     }
//   //     groups[groupId].accounts.push(account);
//   //     return groups;
//   //   }, {});
//   // };

// const groupAccounts = (accounts) => {
//   return accounts.reduce((groups, account) => {
//     const groupId = account.groupId?._id || 'ungrouped';
//     const groupName = account.groupId?.groupName || 'Other Assets';
    
//     if (!groups[groupId]) {
//       groups[groupId] = {
//         groupName: groupName, 
//         accounts: []
//       };
//     }
//     groups[groupId].accounts.push(account);
//     return groups;
//   }, {});
// };
  // useEffect(() => {
  //   const fetchBalanceSheet = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8001/Account/api/accounts/balance-sheet", {
  //         method: "GET",
  //         redirect: "follow"
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch balance sheet data");
  //       }

  //       const result = await response.json();
  //       // setAssets(result.assets);
  //       // setLiabilities(result.liabilities);
  //       setboardofMembers(result.boardofMembers);

  //       // Group assets and liabilities
  //       setGroupedAssets(groupAccounts(result.assets));
  //       setGroupedLiabilities(groupAccounts(result.liabilities));

  //       // fetchAllVouchers(result.assets);
  //       // fetchliablitiesVouchers(result.liabilities);
  //     } catch (error) {
  //       console.error("Error fetching balance sheet:", error);
  //     }
  //   };

  //   // ... rest of your useEffect code remains the same ...
  //   fetchBalanceSheet();
  // }, []);

//   const toggleGroup = (groupId) => {
//     setExpandedGroups(prev => ({
//       ...prev,
//       [groupId]: !prev[groupId]
//     }));
//   };

  // Calculate total for a group
  // const calculateGroupTotal = (groupAccounts) => {
  //   return groupAccounts.reduce((sum, item) => {
  //     const ledgerVouchers = vouchers[item._id] || [];
  //     const totalDebit = ledgerVouchers.reduce((sum, v) => sum + (v.DrAmount || 0), 0);
  //     const totalCredit = ledgerVouchers.reduce((sum, v) => sum + (v.CrAmount || 0), 0);
  //     return sum + (totalDebit - totalCredit + parseFloat(item.opening || 0));
  //   }, 0);
  // };

  // // Render grouped accounts table
  // const renderGroupedAccounts = (groupedData, type) => {
  //   return Object.entries(groupedData).map(([groupId, group]) => {
  //     const isExpanded = expandedGroups[groupId] !== false; // Default to expanded
  //     const groupTotal = calculateGroupTotal(group.accounts);

  //     return (
  //       <Box key={groupId} sx={{ mb: 2 }}>
  //         <TableRow sx={{ backgroundColor: '#e0e0e0', cursor: 'pointer' }}>
  //           <TableCell colSpan={5}>
  //             <Box display="flex" alignItems="center">
  //               <IconButton
  //                 size="small"
        
  //                 // onClick={() => toggleGroup(groupId)}
  //               >
  //                 {/* {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
  //                 } */}
  //               </IconButton>
  //               <Typography variant="subtitle1" fontWeight="bold">
  //                 {group.groupName}
  //               </Typography>
  //             </Box>
  //           </TableCell>
  //         </TableRow>
          
  //         <Collapse in={isExpanded} timeout="auto" unmountOnExit>
  //           <TableBody>
  //             {group.accounts.map((item) => {
  //               const ledgerVouchers = vouchers[item._id] || [];
  //               const totalDebit = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.DrAmount || 0), 0);
  //               const totalCredit = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.CrAmount || 0), 0);
  //               const amount = totalDebit - totalCredit + parseFloat(item.opening || 0);

  //               return (
  //                 <TableRow key={item._id}>
  //                   <TableCell sx={{ pl: 6 }}>{item.accountName}</TableCell>
  //                   <TableCell align="right">{parseFloat(item.opening || 0).toFixed(2)}</TableCell>
  //                   <TableCell align="right">{totalDebit.toFixed(2)}</TableCell>
  //                   <TableCell align="right">{totalCredit.toFixed(2)}</TableCell>
  //                   <TableCell align="right">{amount.toFixed(2)}</TableCell>
  //                 </TableRow>
  //               );
  //             })}
              
  //             <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
  //               <TableCell sx={{ pl: 6 }} colSpan={4} align="right">
  //                 <b>{group.groupName} Total:</b>
  //               </TableCell>
  //               <TableCell align="right">
  //                 <b>{groupTotal.toFixed(2)}</b>
  //               </TableCell>
  //             </TableRow>
  //           </TableBody>
  //         </Collapse>
  //       </Box>
  //     );
  //   });
  // };

//   // Modify your PDF generation to also group by groupId
//   const generateBalanceSheetPDF = (groupedAssets, groupedLiabilities, vouchers, ) => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text('Balance Sheet', 14, 15);

//     const buildGroupedTableData = (groupedData) => {
//       let allRows = [];
      
//       Object.entries(groupedData).forEach(([groupId, group]) => {
//         // Add group header row
//         allRows.push([
//           { content: group.groupName, colSpan: 5, styles: { fontStyle: 'bold', fillColor: [224, 224, 224] } }
//         ]);
        
//         // Add accounts for this group
//         group.accounts.forEach(item => {
//           const ledgerVouchers = vouchers[item._id] || [];
//           const totalDebit = ledgerVouchers.reduce((sum, v) => sum + (v.DrAmount || 0), 0);
//           const totalCredit = ledgerVouchers.reduce((sum, v) => sum + (v.CrAmount || 0), 0);
//           const amount = totalDebit - totalCredit + parseFloat(item.opening || 0);
          
//           allRows.push([
//             item.accountName,
//             parseFloat(item.opening || 0).toFixed(2),
//             totalDebit.toFixed(2),
//             totalCredit.toFixed(2),
//             amount.toFixed(2)
//           ]);
//         });
        
//         // Add group total row
//         const groupTotal = group.accounts.reduce((sum, item) => {
//           const ledgerVouchers = vouchers[item._id] || [];
//           const totalDebit = ledgerVouchers.reduce((sum, v) => sum + (v.DrAmount || 0), 0);
//           const totalCredit = ledgerVouchers.reduce((sum, v) => sum + (v.CrAmount || 0), 0);
//           return sum + (totalDebit - totalCredit + parseFloat(item.opening || 0));
//         }, 0);
        
//         allRows.push([
//           { content: `${group.groupName} Total`, colSpan: 4, styles: { fontStyle: 'bold', halign: 'right' } },
//           { content: groupTotal.toFixed(2), styles: { fontStyle: 'bold' } }
//         ]);
//       });
      
//       return allRows;
//     };

//     let startY = 25;

//     // ASSETS TABLE
//     doc.setFontSize(12);
//     doc.text('Assets', 14, startY);
//     startY += 5;
    
//     const assetsTableData = buildGroupedTableData(groupedAssets);
    
//     doc.autoTable({
//       head: [['Account Name', 'Opening', 'Debit', 'Credit', 'Amount']],
//       body: assetsTableData,
//       startY: startY,
//       styles: { fontSize: 9, cellPadding: 3 },
//       columnStyles: {
//         1: { halign: 'right' },
//         2: { halign: 'right' },
//         3: { halign: 'right' },
//         4: { halign: 'right' },
//       },
//       headStyles: {
//         fillColor: [41, 128, 185],
//         textColor: 255,
//         fontStyle: 'bold'
//       },
//       didParseCell: function (data) {
//         // Style group headers and totals
//         if (data.cell.raw && data.cell.raw.styles) {
//           Object.assign(data.cell.styles, data.cell.raw.styles);
//         }
//       }
//     });

//     startY = doc.lastAutoTable.finalY + 10;

//     // LIABILITIES TABLE
//     doc.text('Liabilities', 14, startY);
//     startY += 5;
//     const liabilitiesTableData = buildGroupedTableData(groupedLiabilities);

//     doc.autoTable({
//       head: [['Account Name', 'Opening', 'Debit', 'Credit', 'Amount']],
//       body: liabilitiesTableData,
//       startY: startY,
//       styles: { fontSize: 9, cellPadding: 3 },
//       columnStyles: {
//         1: { halign: 'right' },
//         2: { halign: 'right' },
//         3: { halign: 'right' },
//         4: { halign: 'right' },
//       },
//       headStyles: {
//         fillColor: [41, 128, 185],
//         textColor: 255,
//         fontStyle: 'bold'
//       },
//       didParseCell: function (data) {
//         if (data.cell.raw && data.cell.raw.styles) {
//           Object.assign(data.cell.styles, data.cell.raw.styles);
//         }
//       }
//     });

//     // ... rest of your PDF generation code ...
//   };

//   return (
//     <Box>
//       <Paper elevation={3} sx={{ padding: 3, margin: 3 }}>
//         <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
//           <Box>
//             <h2>Balance Sheet</h2>
//           </Box>
//           <Box sx={{ cursor: 'pointer', color: '#2c85de' }}>
//             <LocalPrintshopIcon 
//               onClick={() => generateBalanceSheetPDF(groupedAssets, groupedLiabilities, vouchers, boardofMembers)} 
//               sx={{ fontSize: 40 }} 
//             />
//           </Box>
//         </Box>

//         <Grid container spacing={2}>
//           {/* Assets Section - Left */}
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" sx={{ mb: 1 }}>Assets</Typography>
//             {Object.keys(groupedAssets).length > 0 ? (
//               <TableContainer component={Paper}>
//                 <Table>
//                   {/* <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                     <TableRow>
//                       <TableCell><b>Account Name</b></TableCell>
//                       <TableCell align="right"><b>Opening</b></TableCell>
//                       <TableCell align="right"><b>Debit</b></TableCell>
//                       <TableCell align="right"><b>Credit</b></TableCell>
//                       <TableCell align="right"><b>Amount</b></TableCell>
//                     </TableRow>
//                   </TableHead> */}
//                   {renderGroupedAccounts(groupedAssets, 'assets')}
//                   <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
//                     <TableCell colSpan={4} align="right"><b>Total Assets:</b></TableCell>
//                     <TableCell align="right">
//                       <b>
//                         {Object.values(groupedAssets).reduce((sum, group) => {
//                           return sum + calculateGroupTotal(group.accounts);
//                         }, 0).toFixed(2)}
//                       </b>
//                     </TableCell>
//                   </TableRow>
//                 </Table>
//               </TableContainer>
//             ) : (
//               <Typography>No asset records found</Typography>
//             )}
//           </Grid>

//           {/* Liabilities Section - Right */}
//           <Grid item xs={12} md={6}>
//             <Typography variant="h6" sx={{ mb: 1 }}>Liabilities</Typography>
//             {Object.keys(groupedLiabilities).length > 0 ? (
//               <TableContainer component={Paper}>
//                 <Table>
//                   {/* <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                     <TableRow>
//                       <TableCell><b>Account Name</b></TableCell>
//                       <TableCell align="right"><b>Opening</b></TableCell>
//                       <TableCell align="right"><b>Debit</b></TableCell>
//                       <TableCell align="right"><b>Credit</b></TableCell>
//                       <TableCell align="right"><b>Amount</b></TableCell>
//                     </TableRow>
//                   </TableHead> */}
//                   {renderGroupedAccounts(groupedLiabilities, 'liabilities')}
//                   <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
//                     <TableCell colSpan={4} align="right"><b>Total Liabilities:</b></TableCell>
//                     <TableCell align="right">
//                       <b>
//                         {Object.values(groupedLiabilities).reduce((sum, group) => {
//                           return sum + calculateGroupTotal(group.accounts);
//                         }, 0).toFixed(2)}
//                       </b>
//                     </TableCell>
//                   </TableRow>
//                 </Table>
//               </TableContainer>
//             ) : (
//               <Typography>No liabilities records found</Typography>
//             )}
//           </Grid>
//         </Grid>
//       </Paper>

     
//     </Box>
//   );
// }

// export default BalanceSheet;