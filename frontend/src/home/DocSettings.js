import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form
} from 'grommet';
import { useNavigate } from 'react-router-dom'; // Use for navigation
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

const DocSettings = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const sessionResponse = await fetch("http://localhost:3001/userInSession");
      if (!sessionResponse.ok) throw new Error('Failed to fetch session data');
      
      const sessionData = await sessionResponse.json();
      const email_in_use = sessionData.email;

      const response = await fetch(`http://localhost:3001/resetPasswordDoctor?email=${encodeURIComponent(email_in_use)}&oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to reset password');
      
      const result = await response.json();

      if (result.data.affectedRows === 0) {
        window.alert("Old Password is wrong");
      } else {
        window.alert("Password Reset Successful");
        navigate('/'); // Redirect or handle as needed
      }
    } catch (error) {
      console.error('Error:', error);
      window.alert("An error occurred while resetting the password");
    }
  };

  return (
    <Grommet theme={theme} full>
      <Box fill>
        <AppBar>
          <a style={{ color: 'inherit', textDecoration: 'inherit' }} href="/">
            <Heading level='3' margin='none'>HMS</Heading>
          </a>
        </AppBar>
        <Box pad="small">
          <Form onSubmit={handleSubmit}>
            <h3>Password Change</h3>
            <FormField
              type='password'
              label="Old Password"
              name="oldPassword"
              value={oldPassword}
              onChange={event => setOldPassword(event.target.value)}
              required
            />
            <br />
            <FormField
              type='password'
              label="New Password"
              name="newPassword"
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              required
            />
            <br />
            <Button
              type="submit"
              label="Change Password"
              primary
            />
          </Form>
        </Box>
      </Box>
    </Grommet>
  );
};

export default DocSettings;
