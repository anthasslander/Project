import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  Text,
} from 'grommet';

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

const MakeDoc = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    schedule: '',
    gender: '',
    password: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { email, firstName, lastName, password, gender, schedule } = formValues;

      // Check if the doctor already exists
      const checkResponse = await fetch(`http://localhost:3001/checkIfDocExists?email=${email}`);
      const checkResult = await checkResponse.json();

      if (checkResult.data.length > 0) {
        window.alert("A doctor is already associated with that email.");
      } else {
        // Create the new doctor account
        const createResponse = await fetch('http://localhost:3001/makeDocAccount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: firstName,
            lastname: lastName,
            email: email,
            password: password,
            gender: gender,
            schedule: schedule,
          }),
        });

        if (createResponse.ok) {
          window.alert("Doctor account created successfully!");
          navigate('/DocHome');
        } else {
          const error = await createResponse.json();
          window.alert(`Error: ${error.error}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      window.alert("An error occurred while creating the account");
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
          <Text color="#AAAAAA">Doctor's registration form:</Text>
          <Form onSubmit={handleSubmit}>
            <FormField
              label="First Name"
              name="firstName"
              required
              placeholder="Please enter your first name."
              value={formValues.firstName}
              onChange={handleChange}
              validate={{ regexp: /^[a-zA-Z\s]+$/, message: "First name must contain only letters" }}
            />
            <FormField
              label="Last Name"
              name="lastName"
              required
              placeholder="Please enter your last name."
              value={formValues.lastName}
              onChange={handleChange}
              validate={{ regexp: /^[a-zA-Z\s]+$/, message: "Last name must contain only letters" }}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="Please enter your email."
              required
              value={formValues.email}
              onChange={handleChange}
              validate={{ regexp: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, message: "Enter a valid email address" }}
            />
            <FormField
              label="Schedule No"
              name="schedule"
              placeholder="Please enter schedule number"
              required
              value={formValues.schedule}
              onChange={handleChange}
              validate={{ regexp: /^\d+$/, message: "Schedule number must be a number" }}
            />
            <FormField
              label="Gender"
              name="gender"
              placeholder="Female or Male"
              required
              value={formValues.gender}
              onChange={handleChange}
              validate={{ regexp: /^(Male|Female)$/, message: "Gender must be either 'Male' or 'Female'" }}
            />
            <FormField
              label="Password"
              name="password"
              required
              placeholder="Please enter your password."
              value={formValues.password}
              onChange={handleChange}
              validate={{ regexp: /^(?=.*[0-9].*[0-9])(?=.*[a-zA-Z]).{8,}$/, message: "At least 8 characters with 2 digits" }}
            />
            <Box direction="row" align="center" gap="small">
              <Button
                style={{ textAlign: 'center' }}
                label="Cancel"
                fill="horizontal"
                href="/" />
              <Button
                label="Sign Up"
                fill="horizontal"
                type="submit"
                primary />
            </Box>
          </Form>
        </Box>
      </Box>
    </Grommet>
  );
};

export default MakeDoc;
