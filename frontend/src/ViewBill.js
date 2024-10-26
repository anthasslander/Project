import React, { useEffect, useState } from 'react';
import { Box, Text, Grommet } from 'grommet';

const theme = {
  global: {
    colors: {
      brand: '#1a73e8',
      focus: '#1a73e8',
    },
    font: {
      family: 'Lato',
    },
  },
};

const ViewBill = () => {
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [userEmail, setUserEmail] = useState(''); // State for the user's email

  useEffect(() => {
    // Get user email from local storage (or session)
    const storedUserData = localStorage.getItem('user'); // Replace with your actual storage logic
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUserEmail(userData.email); // Assuming userData contains an email property
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
          
          // Ensure you are accessing the correct property
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
    <Grommet theme={theme}>
      <Box align="center" pad="large" fill>
        {/* Outer Box for layout */}
        <Box
          width="medium"
          align="center"
          background="light-1"
          elevation="small"
          margin={{ top: 'large' }}
          pad="medium" // You can keep padding for better spacing
        >
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text color="status-critical">{error}</Text>
          ) : (
            <>
              {successMessage && <Text color="status-ok">{successMessage}</Text>} {/* Display success message */}
              {billData && billData.length > 0 ? (
                <>
                  <Text weight="bold" size="large" margin={{ bottom: 'small' }}>
                    Billing Information
                  </Text>
                  <Box margin={{ top: 'medium' }} gap="small">
                    {billData.map((bill, index) => (
                      <Box key={index} pad="small" background="light-1"> {/* Match the background color */}
                        <Text>
                          <strong>Bill ID:</strong> {bill.id} {/* Add Bill ID */}
                        </Text>
                        <Text>
                          <strong>Appointment ID:</strong> {bill.appointment_id}
                        </Text>
                        <Text>
                          <strong>Amount to be Paid:</strong> ${bill.amount}
                        </Text>
                        {/* Add more bill info here as needed */}
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Text>No billing information available.</Text>
              )}
            </>
          )}
        </Box>
      </Box>
    </Grommet>
  );
};

export default ViewBill;
