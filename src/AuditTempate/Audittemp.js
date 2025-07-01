import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';


const SimpleForm = () => {
    const REACT_APP_URL =process.env.REACT_APP_URL

    const [tempname, SetTempName] = useState("")
    const [subject, SetSubject] = useState("")
    const [content, SetContent] = useState("")

    const handleTempNameChange = (e) => {
        SetTempName(e.target.value);
    };

    const handleSubjectChange = (e) => {
        SetSubject(e.target.value);
    };

    const handleContentChange = (e) => {
        SetContent(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createAuditTemp();
    };
    const createAuditTemp = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            tempName: tempname,
            subject: subject,
            tempBody: content
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        console.log(raw)
        fetch(`${REACT_APP_URL}/Auditemp/`, requestOptions)
            .then((response) => response.json())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }



    return (
        <Box
            component="form"
            //   onSubmit={handleSubmit}
            sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}
        >
            <Typography variant="h5" gutterBottom>
                Audit Template
            </Typography>



            <TextField
                size='small'
                label="Temp Name"
                name="tempName"
                value={tempname}
                onChange={handleTempNameChange}
                fullWidth
                margin="normal"
                required
            />

            <TextField
                size='small'
                label="Subject"
                name="subject"
                value={subject}
                onChange={handleSubjectChange}
                fullWidth
                margin="normal"
                required
            />

            <TextField
                size='small'
                label="Content"
                name="content"
                value={content}
                onChange={handleContentChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
                required
            />


            <Button onClick={handleSubmit} type="submit" variant="contained" sx={{ mt: 2 }}>
                Submit
            </Button>
        </Box>
    );
};

export default SimpleForm;

// using HTML
// import React from 'react';
// export default function AuditReport() {
//     const tableStyle = {
//         width: '100%',
//         borderCollapse: 'collapse',
//         fontSize: '14px',
//         marginTop: '20px'
//     };

//     const thTdStyle = {
//         border: '1px solid black',
//         padding: '6px',
//         verticalAlign: 'top'
//     };

//     const sectionHeader = {
//         fontWeight: 'bold',
//         backgroundColor: '#f0f0f0',
//         textAlign: 'left',
//         padding: '4px',
//         border: '1px solid black'
//     };

//     const bold = { fontWeight: 'bold' };

//     return (
//         <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
//             <h3 style={{ textAlign: 'center', textDecoration: 'underline' }}>FORM NO. 1</h3>
//             <p><span style={bold}>NAME OF THE SOCIETY:</span> WHITE ROSE CO-OP. HSG SOCIETY LTD.</p>
//             <p><span style={bold}>FULL REGISTERED ADDRESS:</span> 4, Perry Road, Bandra (W), Mumbai – 400 050.</p>
//             <p><span style={bold}>Audit Classification for the year:</span> B,B,B</p>
//             <p><span style={bold}>Audit Classification Given:</span> B</p>
//             <p><span style={bold}>DATE OF REGISTRATION:</span> BOM / HSG - 714 of 1964</p>
//             <p><span style={bold}>AREA OF OPERATION:</span> 4, Perry Road, Bandra (W), Mumbai– 400 050.</p>
//             <p><span style={bold}>NO. OF BRANCHES, DEPOSITS OF SHOPS:</span> "NIL"</p>

//             <table style={tableStyle}>
//                 <tbody>
//                     <tr>
//                         <td style={sectionHeader} colSpan={3}>1. AUDIT INFORMATION:</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>1) Full name of the Auditor</td>
//                         <td style={thTdStyle} colSpan={2}>
//                             SARIKA SURESH CHAVAN<br />
//                             Govt. Certified Auditor
//                         </td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>2) Period covered during the present Audit</td>
//                         <td style={thTdStyle} colSpan={2}>01.04.2023 to 31.03.2024</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>3) Date on which<br />
//                             (1) Audit was commenced and completed<br />
//                             (2) Audit was submitted
//                         </td>
//                         <td style={thTdStyle}>20.08.2024 to 22.08.2024</td>
//                         <td style={thTdStyle}>23.08.2024</td>
//                     </tr>

//                     <tr>
//                         <td style={sectionHeader} colSpan={3}>2. MEMBERSHIP:</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>1) No. of members</td>
//                         <td style={thTdStyle} colSpan={2}>
//                             (a) Individuals<br />
//                             (i) Ordinary – 26<br />
//                             (ii) Normal – ---<br />
//                             (iii) Sympathizer – --<br />
//                             (b) Societies – --<br />
//                             (c) Others (Non Members) – 02<br />
//                             <b>Total – 28</b>
//                         </td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>2) Have new members been duly admitted? Have they paid entrance fee?</td>
//                         <td style={thTdStyle} colSpan={2}>11. Entrance Fees paid</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>3) Are written applications in order?</td>
//                         <td style={thTdStyle} colSpan={2}>YES</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>4) Is the members register in Form "I" maintained?</td>
//                         <td style={thTdStyle} colSpan={2}>YES</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>5) Is the list of members in Form "J" maintained?</td>
//                         <td style={thTdStyle} colSpan={2}>YES</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>6) Due remarks against deceased/dismissed?</td>
//                         <td style={thTdStyle} colSpan={2}>NA</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>7) Resignations duly accepted?</td>
//                         <td style={thTdStyle} colSpan={2}>YES</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>8) Nominations under Rule 25 & 26 recorded?</td>
//                         <td style={thTdStyle} colSpan={2}>YES</td>
//                     </tr>




//                     {/*  */}



//                     <tr>
//                         <td style={sectionHeader} colSpan={3}>3. SHARES ::</td>
//                     </tr>


//                     <tr>
//                         <td style={thTdStyle}>i) Is application for shares in order? </td>
//                         <td style={thTdStyle} colSpan={2}>YES</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>ii)Is share register written up-to date? </td>
//                         <td style={thTdStyle} colSpan={2}>YES</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>iii) Do the entries in the share register tally with the entries in the cash book?</td>
//                         <td style={thTdStyle} colSpan={2}>YES</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>iv) Is the ledger written up-to-date? </td>
//                         <td style={thTdStyle} colSpan={2}>NA</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>v) Does the total of share ledger balance tally with the figure of share capital in the balance sheet? </td>
//                         <td style={thTdStyle} colSpan={2}>YES</td>
//                     </tr>
//                     <tr>
//                         <td style={thTdStyle}>vi)Have share certificates been issued to the share holder for all share subscribed? </td>
//                         <td style={thTdStyle} colSpan={2}>YES</td>
//                     </tr>

//                     <tr>
//                         <td style={thTdStyle}>vii)Are shares transfers and refunds in accordance with the provision of the bye-laws, Act & Rules?</td>
//                         <td style={thTdStyle} colSpan={2}>YES</td>
//                     </tr>


//                 </tbody>
//             </table>

//             <p style={{ marginTop: '30px' }}><b>Date:</b> 23/08/2024</p>
//             <p><b>Place:</b> Mumbai</p>
//             <p><b>Sarika Suresh Chavan</b><br />Govt. Certified Auditor<br />(Co-Op. Societies)<br />(Panel No. 1013672)</p>

//             {/*  */}

//         </div>
//     );
// }

