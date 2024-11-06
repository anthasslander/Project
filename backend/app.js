var createError = require("http-errors");

var path = require("path");

//Logger that was used for debugging, commented later
// var logger = require('morgan');
var mysql = require("mysql2");
var cors = require("cors");
var port = 3001;
const express = require("express");
const bodyParser = require("body-parser");

const app1 = express();
app1.use(bodyParser.json()); // Middleware to parse JSON body

// Connection Info
var con = mysql.createConnection({
  host: "localhost",
  user: "rick",
  password: "123456",
  database: "hms",
  multipleStatements: true,
});

// Connecting To Database
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Variables to keep state info about who is logged in
var email_in_use = "";
var password_in_use = "";
var who = "";

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Signup, Login, Password Reset Related Queries

// Checks if patient exists in database
app.get("/checkIfPatientExists", (req, res) => {
  const email = req.query.email;
  const statement = `SELECT * FROM Patient WHERE email = ?`;

  console.log(`Executing query: ${statement} with parameters: ${email}`);

  con.query(statement, [email], function (error, results) {
    if (error) {
      console.error("Error checking patient existence:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json({ data: results });
  });
});

app.post("/makeAccount", (req, res) => {
  const { name, lastname, email, password, address, gender, conditions, medications, surgeries } = req.body;
  const fullName = `${name} ${lastname}`;
  const sql_statement = `INSERT INTO Patient (email, password, name, address, gender) VALUES (?, ?, ?, ?, ?)`;

  console.log(`Executing query: ${sql_statement} with parameters: ${email}, ${password}, ${fullName}, ${address}, ${gender}`);

  con.query(sql_statement, [email, password, fullName, address, gender], function (error, results) {
    if (error) {
      console.error("Error creating patient account:", error);
      return res.status(500).json({ error: "Error creating the account" });
    }

    const generatedIdQuery = "SELECT id FROM MedicalHistory ORDER BY id DESC LIMIT 1;";
    con.query(generatedIdQuery, function (error, results) {
      if (error) {
        console.error("Error fetching last medical history id:", error);
        return res.status(500).json({ error: "Error fetching medical history" });
      }

      const generated_id = results[0].id + 1;
      const medicalHistoryStatement = `INSERT INTO MedicalHistory (id, date, conditions, surgeries, medication) VALUES (?, curdate(), ?, ?, ?)`;

      con.query(medicalHistoryStatement, [generated_id, conditions || "none", surgeries || "none", medications || "none"], function (error) {
        if (error) {
          console.error("Error inserting into MedicalHistory:", error);
          return res.status(500).json({ error: "Error updating medical history" });
        }

        const linkHistoryStatement = `INSERT INTO PatientsFillHistory (patient, history) VALUES (?, ?)`;
        con.query(linkHistoryStatement, [email, generated_id], function (error) {
          if (error) {
            console.error("Error linking patient to history:", error);
            return res.status(500).json({ error: "Error linking patient to medical history" });
          }
          return res.status(201).json({ message: "Patient account successfully created" });
        });
      });
    });
  });
});

// Checks If Doctor Exists
// Check if Doctor exists
app.get("/checkIfDocExists", (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Doctor WHERE email = ?`;
  console.log(statement);
  con.query(statement, [email], function (error, results, fields) {
    if (error) {
      console.error("Error checking doctor existence:", error);
      return res.status(500).json({ error: "Database query failed" });
    } else {
      return res.json({
        data: results,
      });
    }
  });
});

// Create Doctor Account
app.post("/makeDocAccount", (req, res) => {
  let params = req.body;
  let name = params.name + " " + params.lastname;
  let email = params.email;
  let password = params.password;
  let gender = params.gender;
  let schedule = params.schedule;
  let feePerAppointment = 1000; // Default value for fee per appointment

  let sql_statement = `INSERT INTO Doctor (email, gender, password, name, feeperappointment) VALUES (?, ?, ?, ?, ?)`;
  console.log(sql_statement);
  con.query(sql_statement, [email, gender, password, name, feePerAppointment], function (error, results, fields) {
    if (error) {
      console.error("Error creating doctor account:", error);
      return res.status(500).json({ error: "Failed to create doctor account", details: error.message });
    } else {
      sql_statement = `INSERT INTO DocsHaveSchedules (sched, doctor) VALUES (?, ?)`;
      console.log(sql_statement);
      con.query(sql_statement, [schedule, email], function (error) {
        if (error) {
          console.error("Error linking schedule:", error);
          return res.status(500).json({ error: "Failed to link schedule", details: error.message });
        }
        return res.json({ data: results });
      });
    }
  });
});


// Check if user is logged in (for patients)
app.post("/checklogin", (req, res) => {
  const { email, password } = req.body; // Get email and password from request body

  const sql_statement = `SELECT * FROM Patient WHERE email = ? AND password = ?`;
  console.log(sql_statement);

  con.query(sql_statement, [email, password], function (error, results) {
    if (error) {
      console.error("Error occurred:", error);
      return res.status(500).json({ message: "Error occurred" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      // Store email and role (this should be handled securely, ideally using sessions or JWTs)
      email_in_use = email;
      password_in_use = password;
      who = "pat";
      return res.status(200).json({ data: results });
    }
  });
});

// Check if doctor is logged in
app.post("/checkDoclogin", (req, res) => {
  const { email, password } = req.body; // Get email and password from request body

  const sql_statement = `SELECT * FROM Doctor WHERE email = ? AND password = ?`;
  console.log(sql_statement);

  con.query(sql_statement, [email, password], (error, results) => {
    if (error) {
      console.error("Error occurred:", error);
      return res.status(500).json({ message: "Error occurred" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      // Store email and role (this should be handled securely, ideally using sessions or JWTs)
      email_in_use = results[0].email;
      password_in_use = results[0].password;
      who = "doc";
      console.log(email_in_use);
      console.log(password_in_use);
      return res.status(200).json({ data: results });
    }
  });
});

// Resets Patient Password
app.post("/resetPasswordPatient", (req, res) => {
  const something = req.query;
  const email = something.email;
  const oldPassword = something.oldPassword;
  const newPassword = something.newPassword;
  const statement = `UPDATE Patient SET password = "${newPassword}" WHERE email = "${email}" AND password = "${oldPassword}";`;
  console.log(statement);
  con.query(statement, (error, results) => {
    if (error) throw error;
    else {
      res.json({ data: results });
    }
  });
});

// Resets Doctor Password
app.post("/resetPasswordDoctor", (req, res) => {
  const something = req.query;
  const email = something.email;
  const oldPassword = something.oldPassword;
  const newPassword = something.newPassword;
  const statement = `UPDATE Doctor SET password = "${newPassword}" WHERE email = "${email}" AND password = "${oldPassword}";`;
  console.log(statement);
  con.query(statement, (error, results) => {
    if (error) throw error;
    else {
      res.json({ data: results });
    }
  });
});

// Returns Who is Logged in
app.get("/userInSession", (req, res) => {
  console.log("Current email in use:", email_in_use); // Check if this gets logged

  if (!email_in_use) {
    return res.status(404).json({ message: "No user in session" });
  }

  res.json({ email: `${email_in_use}`, who: `${who}` });
});
// Logs the person out
app.get("/endSession", (req, res) => {
  console.log("Ending session");
  email_in_use = "";
  password_in_use = "";
  res.sendStatus(200);
});

// Appointment Related

// Checks If a similar appointment exists to avoid a clash
app.get("/checkIfApptExists", (req, res) => {
  let cond1, cond2;
  const params = req.query;
  const email = params.email;
  const doc_email = params.docEmail;
  const startTime = params.startTime;
  const date = params.date;
  const ndate = new Date(date).toLocaleDateString().substring(0, 10);
  const sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`; // Correctly formatted SQL string
  const sql_start = `CONVERT('${startTime}', TIME)`; // Correctly formatted SQL string
  const sql_end = `CONVERT(ADDTIME('${startTime}', '01:00:00'), TIME)`; // Adding 1 hour to the start time

  // Log the date, start time, and end time for debugging
  console.log(`Date received: ${date}`);
  console.log(`Formatted SQL date: ${ndate}`);
  console.log(`Start time received: ${startTime}`);
  console.log(`SQL start time: ${sql_start}`);
  console.log(`SQL end time (1 hour later): ${sql_end}`);

  // Check if the patient already has an appointment at the same time
  let statement = `SELECT * FROM PatientsAttendAppointments, Appointment
                   WHERE patient = "${email}" AND
                   appt = id AND
                   date = ${sql_date} AND
                   starttime = ${sql_start}`;
  console.log(statement);
  con.query(statement, (error, results) => {
    if (error) throw error;
    else {
      cond1 = results;

      // Check if the doctor already has an appointment overlapping the start time
      statement = `SELECT * FROM Diagnose d INNER JOIN Appointment a
                   ON d.appt = a.id
                   WHERE doctor = "${doc_email}"
                   AND date = ${sql_date}
                   AND status = "NotDone"
                   AND (
                     (${sql_start} >= starttime AND ${sql_start} < endtime) OR
                     (${sql_end} > starttime AND ${sql_end} <= endtime)
                   )`;
      console.log(statement);
      con.query(statement, (error, results) => {
        if (error) throw error;
        else {
          cond2 = results;

          // Check if the appointment is within the doctor's working hours and avoids break time
          statement = `SELECT doctor, starttime, endtime, breaktime, day
                       FROM DocsHaveSchedules
                       INNER JOIN Schedule
                       ON DocsHaveSchedules.sched = Schedule.id
                       WHERE doctor = "${doc_email}"
                       AND day = DAYNAME(${sql_date})
                       AND ${sql_start} >= starttime
                       AND ${sql_end} <= endtime
                       AND (
                         (${sql_start} < breaktime OR ${sql_end} <= breaktime) OR 
                         (${sql_start} >= DATE_ADD(breaktime, INTERVAL 1 HOUR))
                       )`;
          console.log(statement);
          con.query(statement, (error, results) => {
            if (error) throw error;
            else {
              // Log the start time, end time, and day obtained from the schedule
              results.forEach(schedule => {
                console.log(`Doctor's schedule - Start time: ${schedule.starttime}, End time: ${schedule.endtime}, Day: ${schedule.day}, Break time: ${schedule.breaktime}`);
              });

              // If no results are found, the time is unavailable due to conflicts
              if (cond1.length > 0) {
                res.json({
                  data: cond1,
                  message: "Patient already has an appointment at this time.",
                });
              } else if (cond2.length > 0) {
                res.json({
                  data: cond2,
                  message: "Doctor has an overlapping appointment at this time.",
                });
              } else if (results.length === 0) {
                res.json({
                  data: [],
                  message: "Time is unavailable due to schedule conflicts or break time.",
                });
              } else {
                res.json({
                  data: [1],
                  message: "Appointment time is available.",
                });
              }
            }
          });
        }
      });
    }
  });
});


//Returns Date/Time of Appointment
app.get("/getDateTimeOfAppt", (req, res) => {
  const { id } = req.query;
  const statement = `SELECT starttime AS start,
                            endtime AS end,
                            date AS theDate
                     FROM Appointment
                     WHERE id = ?`;
  console.log(statement);
  con.query(statement, [id], (error, results) => {
    if (error) throw error;
    else {
      console.log(JSON.stringify(results));
      return res.json({ data: results });
    }
  });
});

//Patient Info Related

//to get all doctor names
app.get("/docInfo", (req, res) => {
  const statement = "SELECT * FROM Doctor";
  console.log(statement);
  con.query(statement, (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// Returns a particular patient's history
app.get("/OneHistory", (req, res) => {
  const { patientEmail: email } = req.query;
  const statement = `SELECT gender, name, email, address, conditions, surgeries, medication
                     FROM PatientsFillHistory, Patient, MedicalHistory
                     WHERE PatientsFillHistory.history = MedicalHistory.id
                     AND PatientsFillHistory.patient = Patient.email
                     AND Patient.email = ?`;
  console.log(statement);
  con.query(statement, [email], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// To show all patients whose medical history can be accessed
app.get("/MedHistView", (req, res) => {
  const { name, variable } = req.query; // 'variable' is not used in the query, if not needed, consider removing it
  const patientName = `%${name}%`;
  let statement = `SELECT name AS 'Name',
                   PatientsFillHistory.history AS 'ID',
                   email FROM Patient, PatientsFillHistory
                   WHERE Patient.email = PatientsFillHistory.patient
                   AND Patient.email IN (SELECT patient FROM PatientsAttendAppointments
                   NATURAL JOIN Diagnose WHERE doctor = ?)`;

  const params = [email_in_use];

  if (name) {
    statement += " AND Patient.name LIKE ?";
    params.push(patientName);
  }

  console.log(statement);
  con.query(statement, params, (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

//Returns Appointment Info To patient logged In
app.get("/patientViewAppt", (req, res) => {
  const { email } = req.query;
  const statement = `SELECT PatientsAttendAppointments.appt AS ID,
                            PatientsAttendAppointments.patient AS user,
                            PatientsAttendAppointments.concerns AS theConcerns,
                            PatientsAttendAppointments.symptoms AS theSymptoms,
                            Appointment.date AS theDate,
                            Appointment.starttime AS theStart,
                            Appointment.endtime AS theEnd,
                            Appointment.status AS status
                     FROM PatientsAttendAppointments, Appointment
                     WHERE PatientsAttendAppointments.patient = ?
                     AND PatientsAttendAppointments.appt = Appointment.id`;
  console.log(statement);
  con.query(statement, [email], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

//Returns Insurance Info To patient logged In
app.get("/patientViewInsurance", (req, res) => {
  const { email } = req.query;
  const statement = `SELECT insurance.Policy_number AS Policy_number,
                            insurance.provider AS provider,
                            insurance.coverage_amount AS coverage_amount
                     FROM insurance
                     WHERE insurance.patient_email = ?`;
  console.log(statement);
  con.query(statement, [email], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

//Checks if history exists
app.get("/checkIfHistory", (req, res) => {
  const { email } = req.query;
  const statement = "SELECT patient FROM PatientsFillHistory WHERE patient = ?";
  console.log(statement);
  con.query(statement, [email], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

//Adds to PatientsAttendAppointment Table
app.get("/addToPatientSeeAppt", (req, res) => {
  const { email, id: appt_id, concerns, symptoms } = req.query;
  const sql_try = `INSERT INTO PatientsAttendAppointments (patient, appt, concerns, symptoms)
                   VALUES (?, ?, ?, ?)`;
  console.log(sql_try);
  con.query(sql_try, [email, appt_id, concerns, symptoms], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// Schedules Appointment
app.get("/schedule", (req, res) => {
  const {
    time,
    date,
    id,
    endTime,
    concerns,
    symptoms,
    doc: doctor,
  } = req.query;
  const ndate = new Date(date).toLocaleDateString().substring(0, 10);
  const sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
  const sql_start = `CONVERT('${time}', TIME)`;
  const sql_end = `CONVERT('${endTime}', TIME)`;

  const sql_try = `INSERT INTO Appointment (id, date, starttime, endtime, status)
                   VALUES (?, ${sql_date}, ${sql_start}, ${sql_end}, 'NotDone')`;
  console.log(sql_try);

  con.query(sql_try, [id], (error, results) => {
    if (error) throw error;
    else {
      const sql_try = `INSERT INTO Diagnose (appt, doctor, diagnosis, prescription)
                       VALUES (?, ?, 'Not Yet Diagnosed', 'Not Yet Diagnosed')`;
      console.log(sql_try);
      con.query(sql_try, [id, doctor], (error, results) => {
        if (error) throw error;
        else {
          return res.json({ data: results });
        }
      });
    }
  });
});

// Generates ID for appointment,add +1 to the last appintment id to generate the app id for next appointment
app.get("/genApptUID", (req, res) => {
  const statement = "SELECT id FROM Appointment ORDER BY id DESC LIMIT 1";
  con.query(statement, (error, results) => {
    if (error) throw error;
    else {
      const generated_id = results[0].id + 1;
      return res.json({ id: `${generated_id}` });
    }
  });
});

app.post("/Diagnose", (req, res) => {
  const { id, diagnosis, prescription } = req.body;

  // Validate input
  if (!id || !diagnosis || !prescription) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Prepare the SQL statement to update the Diagnose table
  const updateDiagnoseStatement = `UPDATE Diagnose SET diagnosis=?, prescription=? WHERE appt=?`;
  console.log(updateDiagnoseStatement);

  // Execute the first SQL statement
  con.query(
    updateDiagnoseStatement,
    [diagnosis, prescription, id],
    (error, results) => {
      if (error) {
        console.error("Error updating Diagnose:", error);
        return res.status(500).json({ error: "Error updating diagnosis." });
      }

      // Prepare the second SQL statement to update the Appointment table
      const updateAppointmentStatement = `UPDATE Appointment SET status='Done' WHERE id=?`;
      console.log(updateAppointmentStatement);

      // Execute the second SQL statement
      con.query(updateAppointmentStatement, [id], (error, results) => {
        if (error) {
          console.error("Error updating Appointment:", error);
          return res
            .status(500)
            .json({ error: "Error updating appointment status." });
        }

        // Successfully updated both tables
        return res.status(200).json({
          message: "Diagnosis and appointment status updated successfully.",
        });
      });
    },
  );
});

// To show diagnoses
app.get("/showDiagnoses", (req, res) => {
  const { id } = req.query;
  const statement = `SELECT * FROM Diagnose WHERE appt=?`;
  console.log(statement);
  con.query(statement, [id], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// To show appointments to doctor
app.get("/doctorViewAppt", (req, res) => {
  const { email } = req.query;
  const statement = `SELECT a.id, a.date, a.starttime, a.status, p.name, psa.concerns, psa.symptoms
                     FROM Appointment a
                     JOIN PatientsAttendAppointments psa ON a.id = psa.appt
                     JOIN Patient p ON psa.patient = p.email
                     WHERE a.id IN (SELECT appt FROM Diagnose WHERE doctor=?)`;
  console.log(statement);
  con.query(statement, [email_in_use], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// To show diagnoses to patient
app.get("/showDiagnoses", (req, res) => {
  const { id } = req.query;
  const statement = `SELECT * FROM Diagnose WHERE appt=?`;
  console.log(statement);
  con.query(statement, [id], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// To show all diagnosed appointments till now
app.get("/allDiagnoses", (req, res) => {
  const { patientEmail: email } = req.query;
  const statement = `SELECT date, doctor, concerns, symptoms, diagnosis, prescription
                     FROM Appointment A
                     JOIN (SELECT * FROM PatientsAttendAppointments NATURAL JOIN Diagnose
                           WHERE patient=?) AS B ON A.id = B.appt`;
  console.log(statement);
  con.query(statement, [email], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// To delete appointment
app.get("/deleteAppt", (req, res) => {
  const { uid } = req.query;
  let statement = `SELECT status FROM Appointment WHERE id=?`;
  console.log(statement);
  con.query(statement, [uid], (error, results) => {
    if (error) throw error;
    else {
      const status = results[0].status;
      if (status === "NotDone") {
        statement = `DELETE FROM Appointment WHERE id=?`;
        console.log(statement);
        con.query(statement, [uid], (error, results) => {
          if (error) throw error;
        });
      } else {
        if (who === "pat") {
          statement = `DELETE FROM PatientsAttendAppointments WHERE appt=?`;
          console.log(statement);
          con.query(statement, [uid], (error, results) => {
            if (error) throw error;
          });
        }
      }
    }
  });
});

// To order a lab test
app.post("/order-lab-test", async (req, res) => {
  const { name, date, appointment_id } = req.body; // Use req.body for POST requests

  try {
    // Insert the data into the database
    const query =
      "INSERT INTO labtest (name, date, appointment_id) VALUES (?, ?, ?)";
    con.execute(query, [name, date, appointment_id]); // Ensure the variable names match

    res.status(200).send("Lab test ordered successfully"); // Response indicating success
  } catch (error) {
    console.error("Error adding lab test:", error);
    res.status(500).send("Error adding lab test: " + error.message); // More detailed error message
  }
});

app.post("/generate-test-result", async (req, res) => {
  const { id, result } = req.body; // Changed from test_id to id

  try {
    const query = "UPDATE labtest SET result = ? WHERE id = ?"; // Updated query to use id
    con.execute(query, [result, id]);

    res.status(200).send("Lab result generated successfully");
  } catch (error) {
    console.error("Error generating lab result:", error);
    res.status(500).send("Error generating lab result: " + error.message);
  }
});

app.get("/view-lab-results", (req, res) => {
  const { email } = req.query; // Get email from query parameters

  // Log the obtained email for debugging purposes
  console.log("Email obtained from query:", email);

  if (!email) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Please provide an email" });
  }

  const labResultQuery = `
    SELECT lt.id, lt.name, lt.date, lt.result, lt.appointment_id
    FROM labtest lt
    INNER JOIN patientsattendappointments pa ON lt.appointment_id = pa.appt
    WHERE pa.patient = ?;
  `;

  console.log("Lab result query:", labResultQuery); // Log the query for debugging

  con.query(labResultQuery, [email], (error, results) => {
    if (error) {
      console.error("Error fetching lab results:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    } else {
      if (results.length > 0) {
        return res.json({ data: results }); // Send the fetched lab results as JSON
      } else {
        return res
          .status(404)
          .json({ message: "No lab results found for this patient" });
      }
    }
  });
});

// Route to fetch details of a specific lab test by ID
app.get("/view-lab-result/:id", (req, res) => {
  const testId = req.params.id; // Get the test ID from the URL parameters

  // Query to select the specific lab test result by ID
  const labResultQuery = `
    SELECT lt.id, lt.name, lt.date, lt.result, lt.appointment_id
    FROM labtest lt
    WHERE lt.id = ?; -- Use prepared statement for security
  `;

  // Log the query for debugging
  console.log("Lab result query:", labResultQuery);

  con.query(labResultQuery, [testId], (error, results) => {
    if (error) {
      console.error("Error fetching lab result:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length > 0) {
      // Optional: Format the date before sending
      results[0].date = new Date(results[0].date).toLocaleString(); // Format as needed
      return res.json({ data: results[0] }); // Send the fetched lab result as JSON
    } else {
      return res.status(404).json({ message: "Lab result not found" });
    }
  });
});

// Route to add insurance details
app.post("/addInsurance1", (req, res) => {
  const { Policy_number, provider, coverage_amount, patient_email } = req.body;

  if (!Policy_number || !provider || !coverage_amount || !patient_email) {
    return res.status(400).send("All fields are required.");
  }

  const query = `
    INSERT INTO insurance (Policy_number, provider, coverage_amount, patient_email)
    VALUES (?, ?, ?, ?)
  `;

  con.query(
    query,
    [Policy_number, provider, coverage_amount, patient_email],
    (err, result) => {
      if (err) {
        console.error("Error inserting insurance data:", err);
        return res.status(500).send("Error inserting insurance data.");
      }

      res.status(200).send("Insurance details added successfully.");
    },
  );
});


// Add Bill Endpoint
app.post('/addBill', (req, res) => {
  const { apptId, email } = req.body;

  // Start transaction
  con.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ message: 'Transaction error' });
    }

    // Query to get appointment date and doctor email using apptId
    const getAppointmentAndDoctorQuery = `
      SELECT DATE(appointment.date) AS apptDate, diagnose.doctor AS docEmail
      FROM appointment
      JOIN diagnose ON appointment.id = diagnose.appt
      WHERE appointment.id = ?
    `;

    con.query(getAppointmentAndDoctorQuery, [apptId], (err, result) => {
      if (err) {
        return con.rollback(() => {
          console.error('Error retrieving appointment and doctor:', err);
          return res.status(500).json({ message: 'Error retrieving appointment and doctor information' });
        });
      }

      if (result.length === 0) {
        return con.rollback(() => {
          return res.status(404).json({ message: 'No appointment found for the given ID' });
        });
      }

      const { apptDate, docEmail } = result[0];

      // Log the appointment date for debugging
      console.log('Retrieved appointment date:', apptDate);

      // Query to get the fee per appointment from the doctor table
      const getDoctorFeeQuery = `SELECT feeperappointment FROM doctor WHERE email = ?`;

      con.query(getDoctorFeeQuery, [docEmail], (err, feeResult) => {
        if (err) {
          return con.rollback(() => {
            console.error('Error retrieving doctor fee:', err);
            return res.status(500).json({ message: 'Error retrieving doctor fee' });
          });
        }

        if (feeResult.length === 0) {
          return con.rollback(() => {
            return res.status(404).json({ message: 'No fee found for the doctor' });
          });
        }

        const feeAmount = feeResult[0].feeperappointment;

        // Insert the bill into the bill table
        const addBillQuery = `
          INSERT INTO bill (amount, date, status, patient_email, appointment_id)
          VALUES (?, ?, 'not done', ?, ?)
        `;

        con.query(addBillQuery, [feeAmount, apptDate, email, apptId], (err, insertResult) => {
          if (err) {
            return con.rollback(() => {
              console.error('Error adding bill:', err);
              return res.status(500).json({ message: 'Error adding bill' });
            });
          }

          // Commit transaction
          con.commit(err => {
            if (err) {
              return con.rollback(() => {
                console.error('Error committing transaction:', err);
                return res.status(500).json({ message: 'Error committing transaction' });
              });
            }
            return res.status(200).json({ message: 'Bill added successfully', billId: insertResult.insertId });
          });
        });
      });
    });
  });
});


// View Bill Endpoint
// View Bill Endpoint
app.get('/viewBill', (req, res) => {
  const { email } = req.query;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Query to retrieve all records from the bill table based on patient_email
  const viewBillQuery = `
    SELECT id, amount, appointment_id 
    FROM bill 
    WHERE patient_email = ?
  `;

  con.query(viewBillQuery, [email], (err, result) => {
    if (err) {
      console.error('Error retrieving bill:', err);
      return res.status(500).json({ message: 'Error retrieving bill information' });
    }

    // Log the data retrieved from the database
    console.log('Retrieved bills for email:', email, result);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No bills found for the provided email' });
    }

    return res.status(200).json({ data: result });
  });
});


app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;