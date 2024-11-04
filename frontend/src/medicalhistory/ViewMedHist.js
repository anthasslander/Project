import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Grommet,
  FormField,
  Form,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
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
  const navigate = useNavigate();

  const fetchMedHist = async (value) => {
    try {
      const response = await fetch(
        `http://localhost:3001/MedHistView?name=${value}`,
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
    fetchMedHist("");
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchMedHist(searchValue);
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

  const Body = () => (
    <Box width="100vw">
      <Box className="panel panel-default p50 uth-panel">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell scope="col" border="bottom">
                Name
              </TableCell>
              <TableCell scope="col" border="bottom">
                Profile
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medHistState.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>
                  <Button
                    label="Medical Profile"
                    onClick={() => navigate(`/ViewOneHistory/${patient.email}`)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );

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
        <Body />
      </Box>
    </Grommet>
  );
};

export default ViewMedHist;
