import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
} from 'grommet';
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

const Settings = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    fetch("http://localhost:3001/userInSession")
      .then(res => res.json())
      .then(res => {
        const email_in_use = res.email;
        fetch(`http://localhost:3001/resetPasswordPatient?email=${email_in_use}&oldPassword=${oldPassword}&newPassword=${newPassword}`, { method: 'POST' })
          .then(res => res.json())
          .then(res => {
            const didUpdate = res.data.affectedRows;
            if (didUpdate === 0) {
              window.alert("Entered your old password incorrectly");
            } else {
              window.alert("Password Reset Successful");
            }
          });
      });
  };

  return (
    <Grommet theme={theme} full>
      <Box>
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
              label="Old password"
              name="oldPassword"
              value={oldPassword}
              onChange={event => setOldPassword(event.target.value)}
              required
            />
            <br />
            <FormField
              type='password'
              label="New password"
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

export default Settings;
