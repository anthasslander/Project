import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  CheckBox,
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
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    style={{ zIndex: "1" }}
    {...props}
  />
);

const LogIn = () => {
  const [isDoctor, setIsDoctor] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const isDoc = isDoctor;

    try {
      const endpoint = isDoc
        ? `http://localhost:3001/checkDoclogin`
        : `http://localhost:3001/checklogin`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.data) {
        window.alert("Invalid Log In");
      } else {
        localStorage.setItem('user', JSON.stringify({ email, who: isDoc ? 'doc' : 'pat' }));
        navigate(isDoc ? "/DocHome" : "/Home");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      window.alert("An error occurred while logging in.");
    }
  };

  return (
    <Grommet theme={theme} full>
      <AppBar>
        <a style={{ color: "inherit", textDecoration: "inherit" }} href="/">
          <Heading level="3" margin="none">
            HMS
          </Heading>
        </a>
      </AppBar>

      <div className="container">
        <div className="background-image"></div>
        <Box className="login-box" pad="medium">
          <Form onSubmit={handleSubmit}>
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="Please enter your email."
              required
            />
            <FormField
              type="password"
              label="Password"
              name="password"
              placeholder="Please enter your password."
              required
            />
            <FormField
              component={CheckBox}
              checked={isDoctor}
              margin="large"
              label="I'm a doctor"
              name="isDoc"
              onChange={(event) => setIsDoctor(event.target.checked)}
            />
            <Box direction="column" align="center" margin={{ top: 'medium' }}>
              <Button
                type="submit"
                label="Log In"
                fill="horizontal"
                primary
                style={{ margin: "1rem 0" }}
              />
              <Button
                label="Create Account"
                fill="horizontal"
                href="/createAcc"
                style={{
                  margin: "0.5rem 0",
                  textAlign: 'center', // Center text alignment
                  display: 'flex', // Use flexbox for centering
                  justifyContent: 'center', // Center horizontally
                  alignItems: 'center', // Center vertically
                }}
              />
            </Box>
          </Form>
        </Box>
      </div>
    </Grommet>
  );
};

export default LogIn;