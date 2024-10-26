import React, { useEffect, useState } from 'react';
import { Box, Text, Grommet, Heading } from 'grommet';
import { useParams } from 'react-router-dom';

const theme = {
  global: {
    colors: {
      brand: '#1a73e8', // Professional blue theme
      focus: '#00509e',
      background: '#f8f9fa', // Light gray background
    },
    font: {
      family: 'Lato',
    },
  },
};

const LabResultDetail = () => {
  const { testId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLabResult = async () => {
      try {
        const response = await fetch(`http://localhost:3001/view-lab-result/${testId}`);
        if (response.ok) {
          const resultData = await response.json();

          if (resultData && resultData.data && resultData.data.length > 0) {
            const labResult = resultData.data[0];
            const transformedData = {
              id: labResult.id || 'N/A',
              name: labResult.name || 'N/A',
              date: labResult.date
                ? new Date(labResult.date).toLocaleDateString()
                : 'N/A',
              result: labResult.result || 'Not yet available',
            };
            setResult(transformedData);
          } else {
            setError('No lab test results found.');
          }
        } else {
          setError('Error fetching lab result: ' + response.statusText);
        }
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLabResult();
  }, [testId]);

  // Helper function to render result details
  const renderDetail = (label, value) => (
    <Box direction="row" gap="small" pad={{ vertical: 'xsmall' }} border={{ color: 'light-4', side: 'bottom' }}>
      <Text weight="bold" color="dark-2">{label}:</Text>
      <Text color="dark-3">{value}</Text>
    </Box>
  );

  return (
    <Grommet theme={theme} full>
      <Box align="center" pad={{ top: 'large', horizontal: 'medium' }} background="background">
        <Box
          width="medium"
          pad="medium"
          background="white"
          round="small"
          elevation="medium"
          align="center"
          border={{ color: 'light-3', size: 'small' }}
          margin={{ top: 'small' }}
        >
          {loading ? (
            <Text color="status-unknown">Loading...</Text>
          ) : error ? (
            <Text color="status-critical">{error}</Text>
          ) : result ? (
            <>
              <Heading level={3} margin="none" color="brand">Lab Test Result</Heading>
              <Text color="dark-3" margin={{ top: 'small', bottom: 'medium' }}>
                Detailed results of your lab test are shown below.
              </Text>
              {renderDetail('Test ID', result.id)}
              {renderDetail('Test Name', result.name)}
              {renderDetail('Test Date', result.date)}
              {renderDetail('Result', result.result)}
            </>
          ) : (
            <Text>No results found.</Text>
          )}
        </Box>
      </Box>
    </Grommet>
  );
};

export default LabResultDetail;
