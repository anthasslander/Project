import React, { useState } from "react";
import { Box, Button, Heading, Grommet, Text, Grid } from "grommet";
import { useNavigate } from "react-router-dom"; // Use for navigation
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

const SidebarButton = ({ label, onClick, dropdownItems }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <Box>
      <Button
        plain
        onClick={(event) => {
          event.preventDefault(); // Prevent default behavior
          onClick(label); // Call the onClick function passed as a prop
        }}
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        {({ hover }) => (
          <Box
            background={hover ? "#DADADA" : undefined}
            pad={{ horizontal: "large", vertical: "medium" }}
          >
            <Text size="large">{label}</Text>
          </Box>
        )}
      </Button>
      {dropdownItems && showDropdown && (
        <Box
          background="light-2"
          pad={{ vertical: "small" }}
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          {dropdownItems.map((item, index) => (
            <Button
              key={index}
              plain
              onClick={(event) => {
                event.preventDefault(); // Prevent default behavior
                onClick(item); // Call the onClick function for dropdown items
              }}
            >
              {({ hover }) => (
                <Box
                  background={hover ? "#E0E0E0" : undefined}
                  pad={{ horizontal: "large", vertical: "medium" }}
                >
                  <Text size="medium">{item}</Text>
                </Box>
              )}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

const SidebarButtons = ({ setUser }) => {
  const [active, setActive] = useState("");
  const navigate = useNavigate();

  const handleClick = async (label) => {
    setActive(label);

    switch (label) {
      case "Schedule Appointment":
        navigate("/scheduleAppt", { replace: true });
        break;
      case "Sign Out":
        try {
          localStorage.removeItem("user");
          await fetch("http://localhost:3001/endSession");
        } catch (error) {
          console.error("Error during sign out:", error);
        } finally {
          setUser(null); // Update user state on sign out
          navigate("/", { replace: true }); // Navigate to login page
        }
        break;
      case "View Appointments":
        navigate("/PatientsViewAppt", { replace: true });
        break;
      case "View Medical History":
        try {
          const response = await fetch("http://localhost:3001/userInSession");
          const data = await response.json();
          const email_in_use = data.email;
          navigate(`/ViewOneHistory/${encodeURIComponent(email_in_use)}`, { replace: true });
        } catch (error) {
          console.error("Error fetching user session:", error);
        }
        break;
      case "Settings":
        navigate("/Settings", { replace: true });
        break;
      case "View Lab Test Results":
        navigate("/Viewlabresult", { replace: true });
        break;
      case "Add Insurance":
        navigate("/addInsurance", { replace: true });
        break;
      case "View Insurance":
        navigate("/ViewInsurance", { replace: true });
        break;
      case "View Bill": // New case for View Bill button
        navigate("/ViewBill", { replace: true });
        break;
      default:
        break;
    }
  };

  return (
    <Grommet full theme={theme}>
      <Box fill direction="row">
        <Box background="brand">
          {[
            "View Medical History",
            "View Appointments",
            "Schedule Appointment",
            "Settings",
            "View Bill", // Add View Bill button to the sidebar
          ].map((label) => (
            <SidebarButton
              key={label}
              label={label}
              active={label === active}
              onClick={() => handleClick(label)}
            />
          ))}
          <SidebarButton
            label="Insurance"
            dropdownItems={[
              "Add Insurance",
              "View Insurance",
            ]}
            onClick={handleClick} // Pass handleClick to manage dropdown selection
          />
          <SidebarButton
            label="Lab Test"
            dropdownItems={["View Lab Test Results"]}
            onClick={handleClick}
          />
          <SidebarButton
            label="Sign Out"
            onClick={() => handleClick("Sign Out")}
          />
        </Box>
      </Box>
    </Grommet>
  );
};

const Home = ({ setUser }) => {
  const Header = () => (
    <Box
      tag="header"
      background="brand"
      pad="small"
      elevation="small"
      justify="between"
      direction="row"
      align="center"
      flex={false}
      style={{ borderBottom: "1px solid grey" }}
    >
      <a style={{ color: "inherit", textDecoration: "inherit" }} href=" ">
        <Heading level="3" margin="none">
          HMS
        </Heading>
      </a>
    </Box>
  );

  return (
    <Grommet full theme={theme}>
      <Box fill>
        <Header />
        <Grid
          fill
          rows={["auto", "flex"]}
          columns={["auto", "flex"]}
          areas={[
            { name: "sidebar", start: [0, 1], end: [0, 1] },
            { name: "main", start: [1, 1], end: [1, 1] },
          ]}
        >
          <Box
            gridArea="sidebar"
            width="small"
            animation={[
              { type: "fadeIn", duration: 300 },
              { type: "slideRight", size: "xlarge", duration: 150 },
            ]}
          >
            <SidebarButtons setUser={setUser} />
          </Box>
          <Box gridArea="main" justify="top" align="center">
            <Box align="center" pad="large">
              <Heading color="#000000">Welcome Patient</Heading>
            </Box>
          </Box>
        </Grid>
      </Box>
    </Grommet>
  );
};

export default Home;
