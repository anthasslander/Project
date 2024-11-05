import React, { useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Grommet,
  Heading,
  TextInput,
} from 'grommet';
import { useParams, useNavigate } from 'react-router-dom';

const theme = {
  global: {
    colors: {
      brand: '#000000',
    },
    font: {
      family: 'Lato',
    },
  },
};

const OrderLabTest = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [testName, setTestName] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!testName || !date) {
      window.alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/order-lab-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: testName, date, appointment_id: appointmentId }),
      });

      if (response.ok) {
        window.alert('Lab test ordered successfully!');
        navigate(`/order-lab-test/${appointmentId}`);
      } else {
        console.error('Error ordering lab test:', response.statusText);
      }
    } catch (error) {
      console.error('Error ordering lab test:', error);
    }
  };

  return (
    <Grommet theme={theme} full>
      {/* Header */}
      <Box
        tag="header"
        background="brand"
        pad="small"
        elevation="small"
        justify="between"
        direction="row"
        align="center"
        flex={false}
        style={{ borderBottom: '1px solid grey' }}
      >
        <a style={{ color: 'inherit', textDecoration: 'inherit' }} href=" ">
          <Heading level="3" margin="none">
            HMS
          </Heading>
        </a>
      </Box>

      {/* Main Content */}
      <Box align="center" pad="medium">
        <Heading level="3">Order Lab Test</Heading>
        <Form onSubmit={handleSubmit}>
          <FormField label="Test Name">
            <TextInput
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </FormField>
          <FormField label="Date">
            <TextInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>
          <Button type="submit" label="Submit" primary />
        </Form>
      </Box>
    </Grommet>
  );
};

export default OrderLabTest;
