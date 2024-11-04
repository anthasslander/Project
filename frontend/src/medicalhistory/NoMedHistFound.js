import React from 'react';
import {
  Box,
  Heading,
  Grommet,
} from 'grommet';

import './App.css';

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

const NoMedHistFound = () => {
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
      <a style={{ color: 'inherit', textDecoration: 'inherit'}} href="/">
        <Heading level='3' margin='none'>HMS</Heading>
      </a>
    </Box>
  );

  const Body = () => (
    <div className="container">
      <div className="panel panel-default p50 uth-panel">
        <Heading alignSelf="center" textAlign="center" margin="large">
          Medical History Not Found
        </Heading>
      </div>
    </div>
  );

  return (
    <Grommet full theme={theme}>
      <Box fill>
        <Header />
        <Body />
      </Box>
    </Grommet>
  );
};

export default NoMedHistFound;
