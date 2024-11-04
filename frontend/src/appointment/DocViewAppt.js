import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Grommet } from 'grommet';
import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: '#000000',
    },
    font: {
      family: 'Lato',
    },
  },
};

const Header = () => (
  <Box
    tag='header'
    background='brand'
    pad='small'
    elevation='small'
    justify='between'
    direction='row'
    align='center'
    flex={false}
  >
    <a style={{ color: 'inherit', textDecoration: 'inherit' }} href="/">
      <Heading level='3' margin='none'>HMS</Heading>
    </a>
  </Box>
);

const Body = ({ apptlist, onCancel }) => (
  <Box
    pad="medium"
    align="center"
    justify="start"
    overflow="auto"
    flex={false}
    height={{ min: '100vh' }}
  >
    <Box
      pad="medium"
      width="large"
    >
      <table className="table table-hover" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>Concerns</th>
            <th>Symptoms</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apptlist.map(appt => (
            <tr key={appt.id}>
              <td className="cell-padding">{appt.id}</td>
              <td className="cell-padding">{appt.name}</td>
              <td className="cell-padding">{new Date(appt.date).toLocaleDateString()}</td>
              <td className="cell-padding">{appt.starttime}</td>
              <td className="cell-padding">{appt.concerns}</td>
              <td className="cell-padding">{appt.symptoms}</td>
              <td className="cell-padding">{appt.status}</td>
              <td className="cell-padding">
                <Box direction="row" gap="small">
                  <Button label="Diagnose" href={`/Diagnose/${appt.id}`} />
                  <Button
                    label="Cancel"
                    onClick={() => onCancel(appt.id)}
                    disabled={appt.status?.trim() !== "NotDone"}
                  />
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  </Box>
);

const DocViewAppt = () => {
  const [apptlist, setApptlist] = useState([]);

  useEffect(() => {
    const getNames = async () => {
      try {
        const response = await fetch('http://localhost:3001/doctorViewAppt');
        const data = await response.json();
        setApptlist(data.data);
      } catch (error) {
        console.error('Error fetching appointment list:', error);
      }
    };

    getNames();
  }, []);

  const handleCancel = async (id) => {
    try {
      await fetch(`http://localhost:3001/deleteAppt?uid=${encodeURIComponent(id)}`);
      setApptlist(prevList => prevList.filter(appt => appt.id !== id));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  return (
    <Grommet theme={theme} full>
      <Header />
      <Box fill>
        <Body apptlist={apptlist} onCancel={handleCancel} />
      </Box>
    </Grommet>
  );
};

export default DocViewAppt;
