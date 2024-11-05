import React, { useState, useEffect } from 'react';
import { Box, Button, Text, Grommet, Heading } from 'grommet';
import { useParams, useNavigate } from 'react-router-dom';

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

const ViewLabResults = () => {
  const { appointmentId } = useParams();
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setEmail(user.email);
    } else {
      console.error('User is not logged in');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchLabTests = async () => {
      if (email) {
        try {
          console.log('Fetching lab tests for email:', email);
          const response = await fetch(`http://localhost:3001/view-lab-results?email=${email}`);
          if (response.ok) {
            const resultData = await response.json();
            setLabTests(resultData.data);
          } else {
            setError('Error fetching lab tests: ' + response.statusText);
          }
        } catch (err) {
          setError('Error fetching data: ' + err.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchLabTests();
  }, [email]);

  const handleViewResult = (testId) => {
    navigate(`/LabResultDetail/${testId}`);
  };

  return (
    <Grommet full theme={theme}>
      {/* Header */}
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

      {/* Main Content */}
      <Box pad="large" align="center">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {error && <Text color="status-critical">{error}</Text>}

            {labTests.length > 0 ? (
              <Box width="large" pad="medium">
                {labTests.map((test) => (
                  <Box
                    key={test.id}
                    border={{ color: 'light-3', size: 'small' }}
                    pad="small"
                    margin={{ bottom: 'small' }}
                    round="small"
                    direction="row"
                    justify="between"
                    align="center"
                  >
                    <Box>
                      <Text weight="bold">Test Name: {test.name}</Text>
                      <Text>ID: {test.id}</Text>
                      <Text>Date: {new Date(test.date).toLocaleString()}</Text>
                    </Box>
                    <Button
                      label="View Result"
                      onClick={() => handleViewResult(test.id)}
                      primary
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box margin={{ top: 'medium' }}>
                <Text>No lab tests found for this patient.</Text>
              </Box>
            )}
          </>
        )}
      </Box>
    </Grommet>
  );
};

export default ViewLabResults;
