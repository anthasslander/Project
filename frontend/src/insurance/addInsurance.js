import React, { useState } from "react";
import {
  Box,
  Button,
  Form,
  FormField,
  TextInput,
  Grommet,
  Heading,
  Text,
} from "grommet";

const theme = {
  global: {
    colors: {
      brand: "#000000",
    },
    font: {
      family: "Lato",
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

const AddInsurance = () => {
  const [formValues, setFormValues] = useState({
    Policy_number: "",
    provider: "",
    coverage_amount: "",
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (field) => (event) => {
    setFormValues({
      ...formValues,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let email_in_use;
    try {
      const res = await fetch("http://localhost:3001/userInSession");
      const data = await res.json();
      email_in_use = data.email;
    } catch (error) {
      console.error("Error fetching user session:", error);
      return;
    }

    const dataToSubmit = {
      ...formValues,
      patient_email: email_in_use,
    };

    try {
      const sentData = JSON.stringify(dataToSubmit, null, 2);
      console.log("Data sent to backend:", sentData);

      const response = await fetch("http://localhost:3001/addInsurance1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      const contentType = response.headers.get("content-type");
      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      console.log("Response from backend:", responseData);

      if (response.ok) {
        setSubmittedData(sentData);
        window.alert("Insurance details added successfully!");
        setFormValues({
          Policy_number: "",
          provider: "",
          coverage_amount: "",
        });
      } else {
        console.error("Failed to add insurance details:", responseData);
        setSuccessMessage(""); // Clear success message on failure
      }
    } catch (error) {
      console.error("Error adding insurance:", error);
      setSuccessMessage(""); // Clear success message on error
    }
  };

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
        <Box
          fill
          pad={{ vertical: "large", horizontal: "medium" }}
          align="center"
          justify="start"
        >
          <Box align="center" pad="medium">
            <Heading level="3">Add Insurance Details</Heading>
            <Form onSubmit={handleSubmit}>
              <FormField label="Policy No">
                <TextInput
                  value={formValues.Policy_number}
                  onChange={handleChange("Policy_number")}
                  placeholder="Enter Policy Number"
                />
              </FormField>
              <FormField label="Provider">
                <TextInput
                  value={formValues.provider}
                  onChange={handleChange("provider")}
                  placeholder="Enter Provider"
                />
              </FormField>
              <FormField label="Coverage Amount">
                <TextInput
                  type="number"
                  value={formValues.coverage_amount}
                  onChange={handleChange("coverage_amount")}
                  placeholder="Enter Coverage Amount"
                />
              </FormField>
              <Button type="submit" label="Submit" primary />
            </Form>
          </Box>
        </Box>
      </Box>
    </Grommet>
  );
};

export default AddInsurance;
