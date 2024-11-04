import React, { useState } from 'react';
import {
    Box,
    Button,
    Heading,
    Grommet,
    Grid,
    Text,
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

const SidebarButton = ({ label, ...rest }) => (
    <Button plain {...rest}>
        {({ hover }) => (
            <Box
                background={hover ? "#DADADA" : undefined}
                pad={{ horizontal: "large", vertical: "medium" }}
            >
                <Text size="large">{label}</Text>
            </Box>
        )}
    </Button>
);

const LabTestButton = ({ onGenerate }) => {
    const [open, setOpen] = useState(false);

    return (
        <Box>
            <SidebarButton
                label="Lab Tests"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            />
            {open && (
                <Box
                    margin={{ left: 'large' }}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                    background="light-1" // Change this to your desired background color
                    pad="small"
                    round="small"
                    elevation="small"
                >
                    <SidebarButton
                        label="Generate Lab Results"
                        onClick={onGenerate}
                    />
                </Box>
            )}
        </Box>
    );
};

const SidebarButtons = () => {
    const [active, setActive] = useState();

    const handleSidebarClick = (label) => {
        setActive(label);
        switch (label) {
            case "Appointments":
                window.location = "/ApptList";
                break;
            case "Settings":
                window.location = "/DocSettings";
                break;
            case "View Patients":
                window.location = "/MedHistView";
                break;
            case "Sign Out":
                fetch("http://localhost:3001/endSession")
                    .then(() => window.location = "/");
                break;
            default:
                break;
        }
    };

    return (
        <Grommet full theme={theme}>
            <Box fill direction="row">
                <Box background="brand">
                    {["Appointments", "View Patients", "Settings"].map(label => (
                        <SidebarButton
                            key={label}
                            label={label}
                            active={label === active}
                            onClick={() => handleSidebarClick(label)}
                        />
                    ))}
                    <LabTestButton onGenerate={() => window.location = "/Generatetestresult1"} />
                    <SidebarButton
                        label="Sign Out"
                        active={"Sign Out" === active}
                        onClick={() => handleSidebarClick("Sign Out")}
                    />
                </Box>
            </Box>
        </Grommet>
    );
};

const DocHome = () => {
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
            style={{ borderBottom: "1px solid grey" }}
        >
            <a style={{ color: 'inherit', textDecoration: 'inherit' }} href="/">
                <Heading level='3' margin='none'>HMS</Heading>
            </a>
        </Box>
    );

    return (
        <Grommet full={true} theme={theme}>
            <Box align="left">
                <Header />
                <Grid
                    fill
                    rows={['auto', 'flex']}
                    columns={['auto', 'flex']}
                    areas={[
                        { name: 'sidebar', start: [0, 1], end: [0, 1] },
                        { name: 'main', start: [1, 1], end: [1, 1] },
                    ]}
                >
                    <Box
                        gridArea="sidebar"
                        width="small"
                        animation={[ 
                            { type: 'fadeIn', duration: 300 }, 
                            { type: 'slideRight', size: 'xlarge', duration: 150 }, 
                        ]}
                    >
                        <SidebarButtons />
                    </Box>
                    <Box
                        gridArea="main"
                        justify="top"
                        align="center"
                    >
                        <Box align="center" pad="large">
                            <Heading color="#000000">Welcome Doctor</Heading>
                        </Box>
                    </Box>
                </Grid>
            </Box>
        </Grommet>
    );
};

export default DocHome;
