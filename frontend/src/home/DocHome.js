import React, { useState } from 'react';
import {
    Box,
    Button,
    Heading,
    Grommet,
    Grid,
    Text,
} from 'grommet';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
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
                    background="light-1"
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

const SidebarButtons = ({ setUser }) => {
    const [active, setActive] = useState();
    const navigate = useNavigate(); // Initialize navigate for routing

    const handleSidebarClick = async (label) => {
        setActive(label);
        switch (label) {
            case "Appointments":
                navigate("/ApptList");
                break;
            case "Settings":
                navigate("/DocSettings");
                break;
            case "View Patients":
                navigate("/MedHistView");
                break;
            case "Sign Out":
                try {
                    await fetch("http://localhost:3001/endSession", { method: "POST" });
                    setUser(null); // Clear user state
                    navigate("/"); // Redirect to the login page
                } catch (error) {
                    console.error("Error during sign out:", error);
                }
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
                    <LabTestButton onGenerate={() => navigate("/Generatetestresult1")} />
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

const DocHome = ({ setUser }) => {
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
        <Grommet full theme={theme}>
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
                        <SidebarButtons setUser={setUser} />
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
