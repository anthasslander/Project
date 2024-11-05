import React, { useEffect, useState } from 'react';
import { Box, Text, Grommet, Heading } from 'grommet';

const theme = {
  global: {
    colors: {
      brand: '#000000', // Updated to match the Home component
      focus: '#000000', // Updated to match the Home component
    },
    font: {
      family: 'Lato',
      size: '18px', // Increased default font size
    },
  },
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
    style={{ borderBottom: '1px solid grey' }}
  >
    <a style={{ color: 'inherit', textDecoration: 'inherit' }} href=" ">
      <Heading level="3" margin="none">
        HMS
      </Heading>
    </a>
  </Box>
);

const ViewBill = () => {
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUserEmail(userData.email);
    }
  }, []);

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        console.log('Fetching bill data for email:', userEmail);
        const response = await fetch(`http://localhost:3001/viewBill?email=${encodeURIComponent(userEmail)}`);
        console.log('Response received:', response);

        if (response.ok) {
          const data = await response.json();
          console.log('Data received from backend:', data);

          if (data && data.data && data.data.length > 0) {
            setBillData(data.data);
          } else {
            setError('No billing information found.');
          }
        } else {
          setError(`Error fetching billing data: ${response.statusText}`);
        }
      } catch (err) {
        setError(`Error fetching data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchBillData();
    }
  }, [userEmail]);

  return (
    <Grommet theme={theme} full>
      <Box fill>
        <Header />
        <Box fill align="center" justify="start" pad={{ top: 'large' }}>
          <Box width="xlarge" align="center">
            <Text size="large" margin={{ bottom: 'medium', vertical: 'small' }} textAlign="center">
              Billing Information
            </Text>

            {loading ? (
              <Text size="large">Loading...</Text>
            ) : error ? (
              <Text size="large" color="status-critical">{error}</Text>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                {billData && billData.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', fontSize: '18px' }}>Bill ID</th>
                        <th style={{ border: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', fontSize: '18px' }}>Appointment ID</th>
                        <th style={{ border: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', fontSize: '18px' }}>Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billData.map((bill, index) => (
                        <tr key={index}>
                          <td style={{ border: '2px solid #ccc', padding: '12px', fontSize: '18px' }}>{bill.id}</td>
                          <td style={{ border: '2px solid #ccc', padding: '12px', fontSize: '18px' }}>{bill.appointment_id}</td>
                          <td style={{ border: '2px solid #ccc', padding: '12px', fontSize: '18px' }}>₹{bill.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <Text size="large">No billing information available.</Text>
                )}
              </div>
            )}
          </Box>
        </Box>
      </Box>
    </Grommet>
  );
};

export default ViewBill;
