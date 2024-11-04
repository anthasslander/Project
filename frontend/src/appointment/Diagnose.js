import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Form,
  TextArea,
  Grommet
} from 'grommet';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: "#000000",
      active: "#000000",
    },
    font: {
      family: 'Lato',
    },
  },
};

const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    style={{ zIndex: '1' }}
    {...props} />
);

const DiagnosisTextArea = ({ value, onChange }) => (
  <Grommet theme={theme}>
    <h4>Diagnosis</h4>
    <TextArea
      placeholder="Enter Diagnosis"
      value={value}
      onChange={onChange}
      style={{ width: "50vw", height: "12vw" }}
      fill
      required
    />
  </Grommet>
);

const PrescriptionTextArea = ({ value, onChange }) => (
  <Grommet theme={theme}>
    <h4>Prescription</h4>
    <TextArea
      placeholder="Enter Prescription"
      value={value}
      onChange={onChange}
      style={{ width: "50vw", height: "12vw" }}
      fill
      required
    />
  </Grommet>
);

const Diagnose = () => {
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!diagnosis || !prescription) {
      window.alert("Please fill in both fields.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/Diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagnosis, prescription, id }),
      });

      if (response.ok) {
        window.alert("Diagnosis Submitted!");
      } else {
        console.error("Error submitting diagnosis:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting diagnosis:", error);
    }
  };

  const handleOrderLabTest = () => {
    navigate(`/order-lab-test/${id}`);
  };

  return (
    <Grommet theme={theme} full>
      <AppBar>
        <a style={{ color: 'inherit', textDecoration: 'inherit' }} href="/">
          <Heading level='3' margin='none'>HMS</Heading>
        </a>
      </AppBar>
      <Box align="center" gap="small">
        <Form onSubmit={handleSubmit}>
          <DiagnosisTextArea value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} />
          <PrescriptionTextArea value={prescription} onChange={(event) => setPrescription(event.target.value)} />
          <br />
          <Box align="center" gap="medium" direction="row">
            <Button
              label="Submit Diagnosis"
              type="submit"
              primary
            />
            <Button
              label="Order Lab Test"
              type="button"
              onClick={handleOrderLabTest}
              secondary
            />
          </Box>
        </Form>
      </Box>
    </Grommet>
  );
};

export default Diagnose;