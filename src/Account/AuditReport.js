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
   Radio, RadioGroup, FormControlLabel

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
      const url = "http://localhost:8001/Auditemp/";
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
      const url = "http://localhost:8001/Organisation";
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




const createAuditorReport = () => {
  reports.forEach((report) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const formattedpresentAuditfromDate = moment(presentAuditfromDate).format("YYYY-MM-DD");
    const formattedpresentAuditToDate = moment(presentAuditToDate).format("YYYY-MM-DD");

    const formattedAuditcompletedfromDate = moment(AuditcompletedfromDate).format("YYYY-MM-DD");
    const formattedAuditcompletedToDate = moment(AuditcompletedToDate).format("YYYY-MM-DD");
    const formattedAuditsubmittedDate = moment(AuditsubmittedDate).format("YYYY-MM-DD");

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
      ordinary:ordinary,
      Normal:normal,
      Sympathizer:sympathizer,
      Societies:societies,
      others:others
    });

    fetch("http://localhost:8001/Audireport/", {
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


// const handleAutocompleteChange = async (event, newValue) => {
//     setSelectedTemplate(newValue);
//     if (newValue && newValue.value) {
//       const templateId = newValue.value;
//       try {
//         const response = await fetch(
//           `http://localhost:8001/Auditemp/${templateId}`
//         );
//         const data = await response.json();
//         const template = data;

//         console.log(data);
//         setTemplateContent(template.tempBody)
//         setTemplateSubject(template.subject)
       
//       } catch (error) {
//         console.error("Error fetching template data:", error);
//       }
//     }
//   };


///pdf


// const generatePDF = () => {
//   const doc = new jsPDF();

//   reports.forEach((report, index) => {
//     if (index > 0) doc.addPage(); // Add new page for each report after the first

//     const pageWidth = doc.internal.pageSize.getWidth();

//     // Auditor Name
//     doc.setFontSize(15);
//     const auditorText = auditorName.toUpperCase();
//     const textWidth = doc.getTextWidth(auditorText);
//     const centerX = (pageWidth - textWidth) / 2;
//     doc.text(auditorText, centerX, 10);

//     doc.setDrawColor(0);
//     doc.line(10, 12, 200, 12);

//     // Address
//     doc.setFontSize(10);
//     doc.text(`Address: ${address}`, 10, 20);
//     doc.line(10, 22, 200, 22);

//     // Mobile No
//     doc.text(`Mobile: ${mobileNo}`, 160, 27);

//     // Ref No and Date
//     doc.text(`Ref No: Hsg/2024`, 10, 38);
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, 38);

//     // To section
//     doc.text("To,", 10, 48);
//     doc.setFont("Helvetica", "bold");
//     doc.text(`${registeringAuthority}`, 10, 54);
//     doc.text(societyName || "Society Name", 10, 60);
//     doc.text(societyAddress || "Society Address", 10, 66);
//     doc.setFont("Helvetica", "normal");

//     // Subject
//     doc.setFont("Helvetica", "bold");
//     doc.text(`Sub: ${report.subject}`, 10, 76);
//     doc.setFont("Helvetica", "normal");

//     // Body
//     const bodyLines = doc.splitTextToSize(report.content, 180);
//     doc.text("Respected Sir,", 10, 86);
//     doc.text(bodyLines, 10, 92);

//     // Closing
//     const endY = 92 + bodyLines.length * 6;
//     doc.text("Thanking You,", 10, endY + 10);
//   });

//   // Save final PDF
//   doc.save("Audit_Memo_Multi.pdf");
// };
const generatePDF = () => {
  const doc = new jsPDF();

  // Add a new page for the form data
  doc.addPage();

  // Set font styles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('FORM NO. 1', 105, 15, { align: 'center' });
  doc.setFontSize(12);

  // Society Information
  doc.text(`NAME OF THE SOCIETY: ${societyName.toUpperCase()}`, 14, 25);
  doc.text(`FULL REGISTERED ADDRESS: ${societyRegisterAddress}`, 14, 32);
  doc.text(`REGISTRATION No: ${societyRegisterNo}`, 14, 39);
  doc.text(`DATE OF REGISTRATION: ${societyRegisterDate ? societyRegisterDate.slice(0, 10) : 'N/A'}`, 14, 46);

  // Draw a line
  doc.line(10, 50, 200, 50);

  // 1. AUDIT INFORMATION
  doc.setFontSize(14);
  doc.text('1. AUDIT INFORMATION:', 14, 60);
  doc.setFontSize(12);

  // Create a table for audit information
  const auditInfo = [
    ['a. Full name of the Auditor', auditorName],
    ['b. Period covered during the present Audit', 
      `${presentAuditfromDate ? new Date(presentAuditfromDate).toLocaleDateString() : ''} to ${presentAuditToDate ? new Date(presentAuditToDate).toLocaleDateString() : ''}`],
    ['c. Date on which Audit was commenced and completed', 
      `${AuditcompletedfromDate ? new Date(AuditcompletedfromDate).toLocaleDateString() : ''} to ${AuditcompletedToDate ? new Date(AuditcompletedToDate).toLocaleDateString() : ''}`],
    ['d. Date on which Audit was submitted', 
      AuditsubmittedDate ? new Date(AuditsubmittedDate).toLocaleDateString() : '']
  ];

  // Draw the audit information table
  doc.autoTable({
    startY: 65,
    head: [['Item', 'Details']],
    body: auditInfo,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });

  // 2. MEMBERSHIP
  doc.setFontSize(14);
  doc.text('2. MEMBERSHIP:', 14, doc.autoTable.previous.finalY + 15);
  doc.setFontSize(12);

  // Membership numbers table
  const membershipNumbers = [
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

  // Membership questions table
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
    head: [['Question', 'Answer']],
    body: membershipQuestions,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });

  // 3. SHARES
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
    head: [['Question', 'Answer']],
    body: sharesQuestions,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });

  // 4. OUTSIDE BORROWINGS
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
    head: [['Question', 'Answer']],
    body: borrowingsQuestions,
    theme: 'grid',
    headStyles: { fillColor: [200, 200, 200] },
    margin: { left: 14 }
  });

  // Save the PDF
  doc.save('Audit_Form_1.pdf');
};

//get all auditreport
const fetchAuditReports=async()=>{
 try {
      const url = "http://localhost:8001/Audireport/";
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
        const response = await fetch(`http://localhost:8001/Auditemp/${value.value}`);
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
    
        {/* <Autocomplete
                options={Options}
                getOptionLabel={(option) => option.label}
                value={selectedTemplate}
                onChange={handleAutocompleteChange}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                  >
                    {option.label}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{ backgroundColor: "#fff" }}
                    placeholder="Audit Template"
                    variant="outlined"
                    size="small"
                  />
                )}
                sx={{ width: "100%", marginTop: "15px" }}
                clearOnEscape // Enable clearable functionality
              />
        <TextField
         size="small"
          label="Subject"
          name="subject"
            value={templateSubject}
            onChange={(e) => setTemplateSubject(e.target.value)}
          fullWidth
          required
        />
        <TextField
         size="small"
          label="Content"
           value={templateContent}
           onChange={(e) => setTemplateContent(e.target.value)}
          name="content"
          fullWidth
          multiline
          minRows={4}
          required
        /> */}

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
<Box>
<Button onClick={() => setIsDrawerOpen(true)} variant="contained" color="primary"> 
Create Form 1
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
          <Divider/>

          <Box m={2}>
            <Box textAlign={'center'}>
             <Typography variant='h6'><b>NAME OF THE SOCIETY : {societyName.toUpperCase()} </b></Typography> 
             <Typography variant='h6'><b>FULL REGISTERED ADDRESS : {societyRegisterAddress} </b></Typography> 
             <Typography variant='h6'><b> REGISTRATION No : {societyRegisterNo} </b></Typography> 
              <Typography variant='h6'><b>DATE OF REGISTRATION : { societyRegisterDate ? societyRegisterDate.slice(0, 10) : 'N/A'} </b></Typography> 
            </Box>
            <Divider sx={{mt:2}}/>
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
                    onChange={(newValue) => { setpresentAuditfromDate(newValue);}}
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
                    onChange={(newValue) => { setpresentAuditToDate(newValue);}}
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

              <Box sx={{display:'flex',alignItems:"center" ,gap:2 , mt:1}}>
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


               <Box sx={{display:'flex',alignItems:"center" ,justifyContent:'space-between',mt:1}}>
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
         

            <Divider/>


            

      

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
              onChange={(e) => setOrdinary(e.target.value.replace(/\D/, ""))}
                  />
                </Box>

                <Box display="flex" gap={30} mt={1}>
                  <Typography>(ii) Normal</Typography>
                  <TextField
                    size="small"
                    placeholder="Enter number"
                  value={normal}
              onChange={(e) => setNormal(e.target.value.replace(/\D/, ""))}
                  />

                </Box>

                <Box display="flex" gap={25} mt={1}>
                  <Typography>(iii)Sympathizer</Typography>
                  <TextField
                    size="small"
                    placeholder="Enter number"
                  value={sympathizer}
              onChange={(e) => setSympathizer(e.target.value.replace(/\D/, ""))}
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
          onChange={(e) => setSocieties(e.target.value.replace(/\D/, ""))}
              />
            </Box>

              <Box display={'flex'} alignItems={'center'} gap={30} ml={21} mt={2} >
              <Typography>(c) Others(Non Members) </Typography>
              <TextField
                size="small"
                placeholder="Enter number"
              value={others}
          onChange={(e) => setOthers(e.target.value.replace(/\D/, ""))}
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
    and 65 <br/>(I) of the M.S.C. Rules 1961?
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
    6. Have due remarks been passed against names of the decreased, dismissed <br/> or register?
  </Typography>
  <RadioGroup row value={decreaseddismissedorregister}  onChange={(e) => setdecreaseddismissedorregister(e.target.value)}>
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
    8.Have nominations made under Rules 25 of them M.S.C. Rules 1961 been duly <br/> entered in the members register under Rules 26? 
  </Typography>
  <RadioGroup row value={membersnominations} onChange={(e) => setmembersnominations(e.target.value)}>
    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
    <FormControlLabel value="no" control={<Radio />} label="No" />
  </RadioGroup>

</Box>

          </Box>
          <Divider sx={{mt:1}}/>

          {/*SHARES*/}
          <Box>
            <Box ml={2} mt={1}>
              <Typography variant='h6'><b>3. SHARES :</b></Typography>
            </Box>


            <Box display="flex" alignItems="center" gap={52} ml={2}>
              <Typography>
                (i). Is application for shares in order?
              </Typography>


              <RadioGroup row  value={applicationforshares} onChange={(e) => setapplicationforshares(e.target.value)}  defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" gap={50} ml={2}>
              <Typography>
                (ii).Is share register written up-to date?
              </Typography>


              <RadioGroup row value={Isshareregisteruptodate}  onChange={(e) => setIsshareregisteruptodate(e.target.value)} defaultValue="no">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" gap={15} ml={2}>
              <Typography>
                (iii). Do the entries in the share register tally with the entries in the cash book?
              </Typography>
              <Box display="flex" alignItems="center">
                <RadioGroup row value={entriesincashbook}  onChange={(e) => setentriesincashbook(e.target.value)} defaultValue="no"> 
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
<RadioGroup  row value={writtenledger}  onChange={(e) => setwrittenledger(e.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

            </Box>

            <Box display="flex" alignItems="center" gap={16}  ml={2}>
              <Typography>
                (v).Does the total of share ledger balance tally with the figure of share
  
  capital <br/> in the balance sheet?

              </Typography>
             
                <RadioGroup  row value={totalofshareledger}  onChange={(e) => settotalofshareledger(e.target.value)}>

                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
            </Box>

            <Box display="flex" alignItems="center" gap={10} ml={2}>
              <Typography>
                (vi).Have share certificates been issued to the share holder for all share subscribed?
              </Typography>
              <Box display="flex" alignItems="center">
 <RadioGroup  row value={sharecertificatesissued}  onChange={(e) => setsharecertificatesissued(e.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>

            </Box>

            <Box display="flex" alignItems="center" gap={8} ml={2}>
              <Typography>
                (vii)Are shares transfers and refunds in accordance with the provision of the bye-laws,<br/> Act & Rules?
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
          <Divider sx={{mt:1}}/>

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


              <RadioGroup row value={hasitbeenexceeded} onChange={(e) => sethasitbeenexceeded(e.target.value)}  defaultValue="no">
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
          
<Divider sx={{mt:1}}/>

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
   <AddIcon  />Template
</Button>
        <Button onClick={generatePDF} variant="outlined" color="secondary">
 <DownloadIcon/> PDF
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
//   TableContainer,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
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
//   const [assets, setAssets] = useState([]);
//   const [liabilities, setLiabilities] = useState([]);
//   const [vouchers, setVouchers] = useState({});
//   const [boardofMembers, setboardofMembers] = useState([]);
//   const [groupedAssets, setGroupedAssets] = useState({});
//   const [groupedLiabilities, setGroupedLiabilities] = useState({});
//   const [expandedGroups, setExpandedGroups] = useState({});

//   // Function to group accounts by groupId
//   const groupAccounts = (accounts) => {
//     return accounts.reduce((groups, account) => {
//       const groupId = account.groupId || 'ungrouped';
//       if (!groups[groupId]) {
//         groups[groupId] = {
//           groupName: account.groupName || 'Other Assets', 
//           accounts: []
//         };
//       }
//       groups[groupId].accounts.push(account);
//       return groups;
//     }, {});
//   };

//   useEffect(() => {
//     const fetchBalanceSheet = async () => {
//       try {
//         const response = await fetch("http://localhost:8001/Account/api/accounts/balance-sheet", {
//           method: "GET",
//           redirect: "follow"
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch balance sheet data");
//         }

//         const result = await response.json();
//         setAssets(result.assets);
//         setLiabilities(result.liabilities);
//         setboardofMembers(result.boardofMembers);

//         // Group assets and liabilities
//         setGroupedAssets(groupAccounts(result.assets));
//         setGroupedLiabilities(groupAccounts(result.liabilities));

//         // fetchAllVouchers(result.assets);
//         // fetchliablitiesVouchers(result.liabilities);
//       } catch (error) {
//         console.error("Error fetching balance sheet:", error);
//       }
//     };

//     // ... rest of your useEffect code remains the same ...
//     fetchBalanceSheet();
//   }, []);

//   const toggleGroup = (groupId) => {
//     setExpandedGroups(prev => ({
//       ...prev,
//       [groupId]: !prev[groupId]
//     }));
//   };

//   // Calculate total for a group
//   const calculateGroupTotal = (groupAccounts) => {
//     return groupAccounts.reduce((sum, item) => {
//       const ledgerVouchers = vouchers[item._id] || [];
//       const totalDebit = ledgerVouchers.reduce((sum, v) => sum + (v.DrAmount || 0), 0);
//       const totalCredit = ledgerVouchers.reduce((sum, v) => sum + (v.CrAmount || 0), 0);
//       return sum + (totalDebit - totalCredit + parseFloat(item.opening || 0));
//     }, 0);
//   };

//   // Render grouped accounts table
//   const renderGroupedAccounts = (groupedData, type) => {
//     return Object.entries(groupedData).map(([groupId, group]) => {
//       const isExpanded = expandedGroups[groupId] !== false; // Default to expanded
//       const groupTotal = calculateGroupTotal(group.accounts);

//       return (
//         <Box key={groupId} sx={{ mb: 2 }}>
//           <TableRow sx={{ backgroundColor: '#e0e0e0', cursor: 'pointer' }}>
//             <TableCell colSpan={5}>
//               <Box display="flex" alignItems="center">
//                 <IconButton
//                   size="small"
//                   onClick={() => toggleGroup(groupId)}
//                 >
//                   {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//                 </IconButton>
//                 <Typography variant="subtitle1" fontWeight="bold">
//                   {group.groupName}
//                 </Typography>
//               </Box>
//             </TableCell>
//           </TableRow>
          
//           <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//             <TableBody>
//               {group.accounts.map((item) => {
//                 const ledgerVouchers = vouchers[item._id] || [];
//                 const totalDebit = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.DrAmount || 0), 0);
//                 const totalCredit = ledgerVouchers.reduce((sum, voucher) => sum + (voucher.CrAmount || 0), 0);
//                 const amount = totalDebit - totalCredit + parseFloat(item.opening || 0);

//                 return (
//                   <TableRow key={item._id}>
//                     <TableCell sx={{ pl: 6 }}>{item.accountName}</TableCell>
//                     <TableCell align="right">{parseFloat(item.opening || 0).toFixed(2)}</TableCell>
//                     <TableCell align="right">{totalDebit.toFixed(2)}</TableCell>
//                     <TableCell align="right">{totalCredit.toFixed(2)}</TableCell>
//                     <TableCell align="right">{amount.toFixed(2)}</TableCell>
//                   </TableRow>
//                 );
//               })}
              
//               <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                 <TableCell sx={{ pl: 6 }} colSpan={4} align="right">
//                   <b>{group.groupName} Total:</b>
//                 </TableCell>
//                 <TableCell align="right">
//                   <b>{groupTotal.toFixed(2)}</b>
//                 </TableCell>
//               </TableRow>
//             </TableBody>
//           </Collapse>
//         </Box>
//       );
//     });
//   };

//   // Modify your PDF generation to also group by groupId
//   const generateBalanceSheetPDF = (groupedAssets, groupedLiabilities, vouchers, boardOfMembers) => {
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
//                   <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                     <TableRow>
//                       <TableCell><b>Account Name</b></TableCell>
//                       <TableCell align="right"><b>Opening</b></TableCell>
//                       <TableCell align="right"><b>Debit</b></TableCell>
//                       <TableCell align="right"><b>Credit</b></TableCell>
//                       <TableCell align="right"><b>Amount</b></TableCell>
//                     </TableRow>
//                   </TableHead>
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
//                   <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                     <TableRow>
//                       <TableCell><b>Account Name</b></TableCell>
//                       <TableCell align="right"><b>Opening</b></TableCell>
//                       <TableCell align="right"><b>Debit</b></TableCell>
//                       <TableCell align="right"><b>Credit</b></TableCell>
//                       <TableCell align="right"><b>Amount</b></TableCell>
//                     </TableRow>
//                   </TableHead>
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