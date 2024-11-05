import React, { useState, useEffect } from "react";
import { Box, Heading, Grommet, Button } from "grommet";
import "./App.css";

const theme = {
  global: {
    colors: {
      brand: "#000000",
      focus: "#000000",
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

const PatientsViewAppointments = () => {
  const [appointmentsState, setAppointmentsState] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userResponse = await fetch("http://localhost:3001/userInSession");
        const userData = await userResponse.json();
        const email_in_use = userData.email;

        const appointmentsResponse = await fetch(
          `http://localhost:3001/patientViewAppt?email=${email_in_use}`,
        );
        const appointmentsData = await appointmentsResponse.json();

        setAppointmentsState(appointmentsData.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelOrDelete = async (id, isCancel) => {
    try {
      await fetch(`http://localhost:3001/deleteAppt?uid=${id}`);
      // Fetch appointments again after canceling/deleting
      const userResponse = await fetch("http://localhost:3001/userInSession");
      const userData = await userResponse.json();
      const email_in_use = userData.email;

      const appointmentsResponse = await fetch(
        `http://localhost:3001/patientViewAppt?email=${email_in_use}`,
      );
      const appointmentsData = await appointmentsResponse.json();

      setAppointmentsState(appointmentsData.data);
    } catch (error) {
      console.error("Error canceling/deleting appointment:", error);
    }
  };

  return (
    <Grommet theme={theme} full>
      <Box fill>
        <AppBar>
          <a style={{ color: "inherit", textDecoration: "inherit" }} href=" ">
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
          <table className="table table-hover" style={{ width: "100%", textAlign: "center", borderCollapse: "separate", borderSpacing: "0 10px" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px" }}>Date of Appointment</th>
                <th style={{ padding: "10px" }}>Start Time</th>
                <th style={{ padding: "10px" }}>End Time</th>
                <th style={{ padding: "10px" }}>Concerns</th>
                <th style={{ padding: "10px" }}>Symptoms</th>
                <th style={{ padding: "10px" }}>Status</th>
                <th style={{ padding: "10px", textAlign: "left", paddingLeft: "40px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointmentsState.map((patient) => (
                <tr key={patient.ID} style={{ backgroundColor: "#f9f9f9", padding: "10px" }}>
                  <td style={{ padding: "10px" }}>{new Date(patient.theDate).toLocaleDateString().substring(0, 10)}</td>
                  <td style={{ padding: "10px" }}>{patient.theStart.substring(0, 5)}</td>
                  <td style={{ padding: "10px" }}>{patient.theEnd.substring(0, 5)}</td>
                  <td style={{ padding: "10px" }}>{patient.theConcerns}</td>
                  <td style={{ padding: "10px" }}>{patient.theSymptoms}</td>
                  <td style={{ padding: "10px" }}>{patient.status}</td>
                  <td style={{ padding: "10px", textAlign: "left", paddingLeft: "40px" }}>
                    <Box direction="row" gap="small" justify="start">
                      <Button
                        label="See Diagnosis"
                        href={`/showDiagnoses/${patient.ID}`}
                        margin="xsmall"
                      />
                      {patient.status === "NotDone" ? (
                        <Button
                          label="Cancel"
                          onClick={() => handleCancelOrDelete(patient.ID, true)}
                          margin="xsmall"
                        />
                      ) : (
                        <Button
                          label="Delete"
                          onClick={() => handleCancelOrDelete(patient.ID, false)}
                          margin="xsmall"
                        />
                      )}
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Grommet>
  );
};

export default PatientsViewAppointments;
