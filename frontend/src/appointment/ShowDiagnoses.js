import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Grommet,
  Table,
  TableBody,
  TableCell,
  TableRow,
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

const ShowDiagnoses = () => {
  const { id } = useParams(); // using react-router-dom to get the id from the route
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/showDiagnoses?id=${id}`)
      .then(res => res.json())
      .then(res => setDiagnoses(res.data));
  }, [id]); // re-fetch if id changes

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

  const Body = () => (
    <div className="container">
      <div className="panel panel-default p50 uth-panel">
        {diagnoses.length > 0 ? (
          diagnoses.map((diagnosis, index) => (
            <div key={index}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell scope="row">
                      <strong>Appointment Id</strong>
                    </TableCell>
                    <TableCell>{diagnosis.appt}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">
                      <strong>Doctor</strong>
                    </TableCell>
                    <TableCell>{diagnosis.doctor}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">
                      <strong>Diagnosis</strong>
                    </TableCell>
                    <TableCell>{diagnosis.diagnosis}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell scope="row">
                      <strong>Prescription</strong>
                    </TableCell>
                    <TableCell>{diagnosis.prescription}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ))
        ) : (
          <p>No diagnoses found.</p>
        )}
      </div>
      <hr />
    </div>
  );

  return (
    <Grommet full theme={theme}>
      <Box fill>
        <Header />
        <Body />
      </Box>
    </Grommet>
  );
};

export default ShowDiagnoses;
