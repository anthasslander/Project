import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Grommet,
  Table,
  TableBody,
  TableCell,
  TableRow
} from 'grommet';
import { useParams } from 'react-router-dom'; // for accessing route params
import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: '#000000'
    },
    font: {
      family: 'Lato',
    },
  },
};

const ViewOneHistory = () => {
  const { email } = useParams() // get name from route params
  console.log('Extracted email:', email);

  const [medHistState, setMedHistState] = useState([]);
  const [diagnosesState, setDiagnosesState] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyResponse = await fetch(`http://localhost:3001/OneHistory?patientEmail=${email}`);
        const historyData = await historyResponse.json();
        setMedHistState(historyData.data);

        const diagnosesResponse = await fetch(`http://localhost:3001/allDiagnoses?patientEmail=${email}`);
        const diagnosesData = await diagnosesResponse.json();
        setDiagnosesState(diagnosesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [email]);

  const Header = () => (
    <Box
      tag='header'
      background='brand'
      pad='small'
      elevation='small'
      justify='between'
      direction='row'
      align='center'
      flex={false}
    >
      <a style={{ color: 'inherit', textDecoration: 'inherit' }} href="/">
        <Heading level='3' margin='none'>HMS</Heading>
      </a>
    </Box>
  );

  const MedicalHistoryTable = ({ patient }) => (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell scope="row"><strong>Name</strong></TableCell>
          <TableCell>{patient.name}</TableCell>
          <TableCell></TableCell>
          <TableCell><strong>Email</strong></TableCell>
          <TableCell>{patient.email}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell scope="row"><strong>Gender</strong></TableCell>
          <TableCell>{patient.gender}</TableCell>
          <TableCell></TableCell>
          <TableCell><strong>Address</strong></TableCell>
          <TableCell>{patient.address}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell scope="row"><strong>Conditions</strong></TableCell>
          <TableCell>{patient.conditions}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell scope="row"><strong>Surgeries</strong></TableCell>
          <TableCell>{patient.surgeries}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell scope="row"><strong>Medications</strong></TableCell>
          <TableCell>{patient.medication}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  const DiagnosisTable = ({ diagnosis }) => (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell scope="row"><strong>Date</strong></TableCell>
          <TableCell>{diagnosis.date.split('T')[0]}</TableCell>
          <TableCell></TableCell>
          <TableCell><strong>Doctor</strong></TableCell>
          <TableCell>{diagnosis.doctor}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell scope="row"><strong>Concerns</strong></TableCell>
          <TableCell>{diagnosis.concerns}</TableCell>
          <TableCell></TableCell>
          <TableCell><strong>Symptoms</strong></TableCell>
          <TableCell>{diagnosis.symptoms}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell scope="row"><strong>Diagnosis</strong></TableCell>
          <TableCell>{diagnosis.diagnosis}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell scope="row"><strong>Prescription</strong></TableCell>
          <TableCell>{diagnosis.prescription}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  return (
    <Grommet full theme={theme}>
      <Box fill>
        <Header />
        <Box className="container">
          <Box className="panel panel-default p50 uth-panel">
            {medHistState.length > 0 && medHistState.map(patient => (
              <MedicalHistoryTable key={patient.email} patient={patient} />
            ))}
            <hr />
            {diagnosesState.length > 0 && diagnosesState.map(diagnosis => (
              <DiagnosisTable key={diagnosis.date} diagnosis={diagnosis} />
            ))}
          </Box>
        </Box>
      </Box>
    </Grommet>
  );
};

export default ViewOneHistory; 