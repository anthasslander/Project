import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  Text,
} from 'grommet';
import { useNavigate } from 'react-router-dom';
import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: '#000000',
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
    {...props}
  />
);

const CreateAccount = () => {
  const [formValues, setFormValues] = useState({});
  const navigate = useNavigate();

  // Handle form value changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      // Check if patient already exists
      const response = await fetch(`http://localhost:3001/checkIfPatientExists?email=${formValues.email}`);
      const result = await response.json();

      if (result.data.length > 0) {
        window.alert("An account is already associated with that email.");
      } else {
        // Create a new account
        const createResponse = await fetch(`http://localhost:3001/makeAccount`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formValues.firstName,
            lastname: formValues.lastName,
            email: formValues.email,
            password: formValues.password,
            address: formValues.address,
            gender: formValues.gender,
            conditions: formValues.conditions,
            medications: formValues.medications,
            surgeries: formValues.surgeries,
          }),
        });

        if (!createResponse.ok) {
          const errorMessage = await createResponse.text();
          throw new Error(`Server responded with status ${createResponse.status}: ${errorMessage}`);
        }

        window.alert("Account created successfully!");
        navigate("/Home");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      window.alert("An error occurred while creating the account. Please try again.");
    }
  };

  return (
    <Grommet theme={theme} full>
      <AppBar>
        <a style={{ color: 'inherit', textDecoration: 'inherit' }} href="/">
          <Heading level='3' margin='none'>HMS</Heading>
        </a>
      </AppBar>
      <Box fill align="center" justify="top">
        <Box width="medium">
          <Text color="#AAAAAA">Patient's registration form:</Text>
          <Form onSubmit={handleSubmit}>
            <FormField
              label="First Name"
              name="firstName"
              placeholder="First name"
              required
              validate={{ regexp: /^[a-z]/i }}
              onChange={handleChange}
              value={formValues.firstName || ''}
            />
            <FormField
              label="Last Name"
              name="lastName"
              required
              placeholder="Last Name"
              validate={{ regexp: /^[a-z]/i }}
              onChange={handleChange}
              value={formValues.lastName || ''}
            />
            <FormField
              label="Gender"
              name="gender"
              placeholder="Female or Male"
              required
              onChange={handleChange}
              value={formValues.gender || ''}
            />
            <FormField
              label="Medical History - Conditions"
              name="conditions"
              placeholder="Conditions"
              onChange={handleChange}
              value={formValues.conditions || ''}
            />
            <FormField
              label="Medical History - Surgeries"
              name="surgeries"
              placeholder="Surgeries"
              onChange={handleChange}
              value={formValues.surgeries || ''}
            />
            <FormField
              label="Medical History - Medications"
              name="medications"
              placeholder="Medications"
              onChange={handleChange}
              value={formValues.medications || ''}
            />
            <FormField
              label="Address"
              name="address"
              placeholder="Address"
              required
              onChange={handleChange}
              value={formValues.address || ''}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={handleChange}
              value={formValues.email || ''}
            />
            <FormField
              label="Password"
              name="password"
              placeholder="Password"
              required
              validate={{ regexp: /^(?=.{8,})(?=.*[0-9]{2})/, message: "At least 8 characters containing 2 digits" }}
              onChange={handleChange}
              value={formValues.password || ''}
            />
            <Box direction="row" align="center" gap="small">
              <Button
                label="Cancel"
                fill="horizontal"
                href="/" 
              />
              <Button
                label="Sign Up"
                fill="horizontal"
                type="submit"
                primary 
              />
            </Box>
            <Box align="center" pad="small">
              <Text>Are you a doctor?</Text>
              <Button
                primary
                label="I'm a doctor"
                href="/MakeDoc" 
              />
            </Box>
          </Form>
        </Box>
      </Box>
    </Grommet>
  );
};

export default CreateAccount;
