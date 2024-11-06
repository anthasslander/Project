import React, { useState, useEffect } from 'react';
import {
  Schedule,
} from 'grommet-icons';
import {
  Box,
  Button,
  Heading,
  Form,
  Text,
  TextArea,
  Grommet,
  Calendar,
  DropButton,
  MaskedInput,
  Keyboard,
  Select,
  Spinner
} from 'grommet';
import './App.css';

const theme = {
  global: {
    colors: {
      brand: '#000000',
      focus: '#000000',
      active: '#000000',
    },
    font: {
      family: 'Lato',
    },
  },
};

const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    style={{ zIndex: '1' }}
    {...props}
  />
);

const DropContent = ({ date: initialDate, time: initialTime, onClose }) => {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);

  const close = () => {
    let [hours, minutes] = time.split(":").map(Number);
    let startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0);
    let endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    let endHours = endTime.getHours().toString().padStart(2, '0');
    let endMinutes = endTime.getMinutes().toString().padStart(2, '0');
    let formattedEndTime = `${endHours}:${endMinutes}`;
    onClose(date || initialDate, time || initialTime, formattedEndTime);
  };

  return (
    <Box align="center">
      <Calendar
        animate={false}
        date={date}
        onSelect={setDate}
        showAdjacentDays={false}
        required
      />
      <Box flex={false} pad="medium" gap="small">
        <Keyboard
          required
          onEnter={event => {
            event.preventDefault();
            close();
          }}
        >
          <MaskedInput
            mask={[
              {
                length: [1, 2],
                options: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
                regexp: /^[0-9]{1,2}$/,
                placeholder: "hh"
              },
              { fixed: ":" },
              {
                length: 2,
                options: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
                regexp: /^[0-5][0-9]$/,
                placeholder: "mm"
              }
            ]}
            value={time}
            name="maskedInput"
            onChange={event => setTime(event.target.value)}
            required
          />
        </Keyboard>
        <Box flex={false}>
          <Button label="Done" onClick={close} color="#00739D" />
        </Box>
      </Box>
    </Box>
  );
};

const DateTimeDropButton = ({ onDateTimeChange }) => {
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [open, setOpen] = useState();

  const onClose = (nextDate, nextTime, endTime) => {
    setDate(nextDate);
    setTime(nextTime);
    setOpen(false);
    onDateTimeChange(nextDate, nextTime, endTime);
    setTimeout(() => setOpen(undefined), 1);
  };

  return (
    <Grommet theme={theme}>
      <Box align="center" pad="large">
        <DropButton
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          dropContent={
            <DropContent date={date} time={time} onClose={onClose} />
          }
        >
          <Box direction="row" gap="small" align="center" pad="small">
            <Text color={date ? undefined : "dark-5"}>
              {date
                ? `${new Date(date).toLocaleDateString()} ${time}`
                : "Select date & time"}
            </Text>
            <Schedule />
          </Box>
        </DropButton>
      </Box>
    </Grommet>
  );
};

const ConcernsTextArea = ({ setConcerns }) => {
  const [value, setValue] = useState("");

  const onChange = event => {
    setValue(event.target.value);
    setConcerns(event.target.value);
  };

  return (
    <Grommet theme={theme}>
      <Box width="medium" height="xsmall">
        <TextArea
          placeholder="Enter your concerns..."
          value={value}
          onChange={onChange}
          fill
          required
        />
      </Box>
    </Grommet>
  );
};

const SymptomsTextArea = ({ setSymptoms }) => {
  const [value, setValue] = useState("");

  const onChange = event => {
    setValue(event.target.value);
    setSymptoms(event.target.value);
  };

  return (
    <Grommet theme={theme}>
      <Box width="medium" height="xsmall">
        <TextArea
          placeholder="Enter your symptoms..."
          value={value}
          onChange={onChange}
          fill
          required
        />
      </Box>
    </Grommet>
  );
};

const DoctorsDropdown = ({ setDoctor }) => {
  const [value, setValue] = useState();
  const [doctorsList, setList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/docInfo")
      .then(res => res.json())
      .then(res => {
        const arr = res.data.map(i => `${i.name} (${i.email})`);
        setList(arr);
      });
  }, []);

  const onChange = event => {
    setValue(event.value);
    const doc = event.value.match(/\((.*)\)/)[1];
    setDoctor(doc);
  };

  return (
    <Select
      options={doctorsList}
      value={value}
      placeholder="Select Doctor"
      onChange={onChange}
      fill
      required
    />
  );
};

const SchedulingAppt = () => {
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [concerns, setConcerns] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [doctor, setDoctor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.alert("User is not logged in!");
      setLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);
    const currentUserEmail = user.email;

    if (!currentUserEmail) {
      window.alert("No email found in local storage!");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3001/checkIfApptExists?email=${currentUserEmail}&startTime=${time}&date=${date}&docEmail=${doctor}`)
      .then(res => res.json())
      .then(res => {
        if (res.data.length > 0) {
          window.alert(res.message || "Appointment Clash! Try another doctor or date/time");
          setLoading(false);
          return;
        }

        fetch("http://localhost:3001/genApptUID")
          .then(res => res.json())
          .then(res => {
            const gen_uid = res.id;

            fetch(`http://localhost:3001/schedule?time=${time}&endTime=${endTime}&date=${date}&concerns=${concerns}&symptoms=${symptoms}&id=${gen_uid}&doc=${doctor}`)
              .then(() => {
                fetch(`http://localhost:3001/addToPatientSeeAppt?email=${currentUserEmail}&id=${gen_uid}&concerns=${concerns}&symptoms=${symptoms}`)
                  .then(() => {
                    window.alert("Appointment successfully scheduled!");
                    setLoading(false);
                  });
              });
          })
          .catch(() => {
            window.alert("Error while scheduling appointment.");
            setLoading(false);
          });
      })
      .catch(() => {
        window.alert("Error checking for appointment conflicts.");
        setLoading(false);
      });
  };

  return (
    <Grommet theme={theme} full>
      <AppBar>
        <a style={{ color: 'inherit', textDecoration: 'inherit' }} href="/">
          <Heading level='3' margin='none'>HMS</Heading>
        </a>
      </AppBar>
      <Box align="center" pad="small" gap="small">
        <Form onSubmit={handleSubmit}>
          <Box align="center" gap="small">
            <DoctorsDropdown setDoctor={setDoctor} />
          </Box>
          <DateTimeDropButton onDateTimeChange={(nextDate, nextTime, nextEndTime) => {
            setDate(nextDate);
            setTime(nextTime);
            setEndTime(nextEndTime);
          }} />
          <ConcernsTextArea setConcerns={setConcerns} />
          <br />
          <SymptomsTextArea setSymptoms={setSymptoms} />
          <br />
          <Box align="center" pad="small" gap="small">
            <Button
              label={loading ? <Spinner /> : "Attempt To Schedule"}
              type="submit"
              primary
              disabled={loading}
            />
          </Box>
        </Form>
      </Box>
    </Grommet>
  );
};

export default SchedulingAppt;
