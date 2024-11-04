import React, { useState, useEffect } from "react";
import { Box, Heading, Grommet, Text } from "grommet";
import "./App.css";

const theme = {
  global: {
    colors: {
      brand: "#000000",
      focus: "#000000",
    },
    font: {
      family: "Lato",
      size: "18px", // Ensures consistent font size with ViewBill
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

const ViewInsurance = () => {
  const [insuranceState, setInsuranceState] = useState([]);
  const [patientEmail, setPatientEmail] = useState("");

  // Fetch insurance data and patient email
  const fetchInsurance = async () => {
    try {
      const userResponse = await fetch("http://localhost:3001/userInSession");
      const userData = await userResponse.json();
      const email_in_use = userData.email;
      setPatientEmail(email_in_use); // Set the current patient email

      const insuranceResponse = await fetch(
        `http://localhost:3001/patientViewInsurance?email=${email_in_use}`
      );
      const insuranceData = await insuranceResponse.json();
      console.log("Fetched insurance data:", insuranceData);

      if (insuranceData.data) {
        setInsuranceState(insuranceData.data);
      } else {
        console.error("No data found in insurance response");
        window.alert("No data found in insurance response");
      }
    } catch (error) {
      window.alert("Error fetching insurance data");
      console.error("Error fetching insurance data:", error);
    }
  };

  useEffect(() => {
    fetchInsurance(); // Call the fetchInsurance function when the component mounts
  }, []);

  return (
    <Grommet theme={theme} full>
      <Box fill>
        <AppBar>
          <a style={{ color: "inherit", textDecoration: "inherit" }} href="/">
            <Heading level="3" margin="none">
              HMS
            </Heading>
          </a>
        </AppBar>
        <Box fill pad={{ vertical: "large", horizontal: "medium" }} align="center" justify="start">
          <Text size="large" margin={{ bottom: 'medium', vertical: 'small' }} textAlign="center">
            Insurance Information
          </Text>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', fontSize: '18px' }}>Policy No</th>
                  <th style={{ border: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', fontSize: '18px' }}>Provider</th>
                  <th style={{ border: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', fontSize: '18px' }}>Coverage Amount</th>
                  <th style={{ border: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', fontSize: '18px' }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {insuranceState.map((insurance) => (
                  <tr key={insurance.ID}>
                    <td align="center" style={{ border: '2px solid #ccc', padding: '12px', fontSize: '18px' }}>{insurance.Policy_number || "N/A"}</td>
                    <td align="center" style={{ border: '2px solid #ccc', padding: '12px', fontSize: '18px' }}>{insurance.provider || "N/A"}</td>
                    <td align="center" style={{ border: '2px solid #ccc', padding: '12px', fontSize: '18px' }}>{insurance.coverage_amount || "N/A"}</td>
                    <td align="center" style={{ border: '2px solid #ccc', padding: '12px', fontSize: '18px' }}>{patientEmail || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>
      </Box>
    </Grommet>
  );
};

export default ViewInsurance;
