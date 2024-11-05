import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
} from "grommet";
import { useNavigate } from "react-router-dom";
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

const ViewMedHist = () => {
  const [medHistState, setMedHistState] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearched, setIsSearched] = useState(false); // New state to track search status
  const navigate = useNavigate();

  const fetchMedHist = async (value) => {
    try {
      const response = await fetch(
        `http://localhost:3001/MedHistView?name=${value}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setMedHistState(data.data || []);
    } catch (error) {
      console.error("Error fetching medical history:", error);
      window.alert("An error occurred while fetching medical history.");
    }
  };

  useEffect(() => {
    fetchMedHist(""); // Optionally fetch initial data
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchMedHist(searchValue);
    setIsSearched(true); // Mark that a search has been performed
  };

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
    >
      <a style={{ color: "inherit", textDecoration: "inherit" }} href="/">
        <Heading level="3" margin="none">
          HMS
        </Heading>
      </a>
    </Box>
  );

  const handleProfileView = (email) => {
    navigate(`/ViewOneHistory/${email}`);
  };

  return (
    <Grommet full theme={theme}>
      <Header />
      <Box fill align="center" pad="medium">
        <Form onSubmit={handleSearch}>
          <Heading level="4" textAlign="center" margin={{ bottom: "small" }}>
            Search By Name
          </Heading>
          <FormField
            name="name"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Enter name"
          />
          <Box direction="row" justify="center" margin={{ top: "small" }}>
            <Button type="submit" primary label="Submit" />
          </Box>
        </Form>

        {/* Only show the button if there's a patient in medHistState after search */}
        {isSearched && medHistState.length === 1 && (
          <Box margin={{ top: "small" }} align="center">
            <Heading level="5">{medHistState[0].name}</Heading>
            <Button
              label="View Medical Profile"
              onClick={() => handleProfileView(medHistState[0].email)}
              primary
              fill="horizontal"
              style={{
                margin: "0.25rem 0",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white", // Change button background to white
                color: "black", // Set text color to black for contrast
              }}
            />
          </Box>
        )}
      </Box>
    </Grommet>
  );
};

export default ViewMedHist;
