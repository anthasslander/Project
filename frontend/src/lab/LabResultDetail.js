import React, { useEffect, useState } from 'react';
import { Box, Text, Grommet, Heading } from 'grommet';
import { useParams } from 'react-router-dom';

const theme = {
  global: {
    colors: {
      brand: '#000000', // Updated color to match ViewBill's theme
      focus: '#000000',
      background: '#f8f9fa',
    },
    font: {
      family: 'Lato',
      size: '18px', // Increased default font size
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
              date: labResult.date ? new Date(labResult.date).toLocaleDateString() : 'N/A',
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

  return (
    <Grommet theme={theme} full>
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
      <Box fill align="center" justify="start" pad="large">
        <Box width="xlarge" align="center">
          <Text size="large" margin={{ bottom: 'medium', vertical: 'small' }} textAlign="center">
            Lab Test Result
          </Text>
          
          {loading ? (
            <Text size="large">Loading...</Text>
          ) : error ? (
            <Text size="large" color="status-critical">{error}</Text>
          ) : result ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', fontSize: '18px' }}>Test ID</th>
                    <th style={{ border: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', fontSize: '18px' }}>Test Name</th>
                    <th style={{ border: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', fontSize: '18px' }}>Test Date</th>
                    <th style={{ border: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', fontSize: '18px' }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '2px solid #ccc', padding: '12px', fontSize: '18px' }}>{result.id}</td>
                    <td style={{ border: '2px solid #ccc', padding: '12px', fontSize: '18px' }}>{result.name}</td>
                    <td style={{ border: '2px solid #ccc', padding: '12px', fontSize: '18px' }}>{result.date}</td>
                    <td style={{ border: '2px solid #ccc', padding: '12px', fontSize: '18px' }}>{result.result}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <Text>No results found.</Text>
          )}
        </Box>
      </Box>
    </Grommet>
  );
};

export default LabResultDetail;
