import React, { useState } from 'react';
import { Box, Button, Heading, TextInput, TextArea, Grommet } from 'grommet';
import { useNavigate } from 'react-router-dom';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: '#000000'
    },
    font: {
      family: 'Lato',
    },
  },
};

const Generatetestresult1 = () => {
  const [testId, setTestId] = useState('');
  const [result, setResult] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/generate-test-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: testId,  // Send 'id' instead of 'test_id'
        result: result,
      }),
    });

    if (response.ok) {
      alert('Lab result generated successfully!');
      navigate('/'); // Navigate to another page after success, adjust as needed
    } else {
      const errorMessage = await response.text();
      alert(`Error generating lab result: ${errorMessage}`);
    }
  };

  return (
    <Grommet full theme={theme}>
      <Box pad="large" align="center">
        <Heading level="2">Generate Lab Result</Heading>
        <Box
          width="medium"
          border={{ color: 'light-3', size: 'small' }}
          pad="medium"
        >
          <form onSubmit={handleSubmit}>
            <Box margin={{ bottom: 'medium' }}>
              <TextInput
                placeholder="Test ID"
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
              />
            </Box>
            <Box margin={{ bottom: 'medium' }}>
              <TextArea
                placeholder="Enter Lab Result"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                resize="vertical"
              />
            </Box>
            <Button type="submit" primary label="Submit" />
          </form>
        </Box>
      </Box>
    </Grommet>
  );
};

export default Generatetestresult1;
