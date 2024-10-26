import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Home";
import LogIn from "./logIn";
import CreateAccount from "./CreateAccount";
import SchedulingAppt from "./schedulingAppt";
import ViewMedHist from "./ViewMedHist";
import DocHome from "./DocHome";
import ViewOneHistory from "./ViewOneHistory";
import Settings from "./Settings";
import DocSettings from "./DocSettings";
import PatientsViewAppt from "./PatientsViewAppt";
import NoMedHistFound from "./NoMedHistFound";
import DocViewAppt from "./DocViewAppt";
import MakeDoc from "./MakeDoc";
import Diagnose from "./Diagnose";
import ShowDiagnoses from "./ShowDiagnoses";
import OrderLabTest from "./OrderLabTest";
import Generatetestresult1 from "./Generatetestresult1";
import Viewlabresult from "./Viewlabresult";
import LabResultDetail from "./LabResultDetail";
import AddInsurance from "./addInsurance";
import ViewInsurance from "./ViewInsurance";
import ViewBill from "./ViewBill";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/userInSession")
      .then((res) => res.json())
      .then((res) => {
        const { email, who } = res;
        if (email) {
          setUser({ email, who });
        } else {
          setUser(null);
        }
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? user.who === "pat" ? <Home /> : <DocHome /> : <LogIn />
          }
        />
        <Route path="/NoMedHistFound" element={<NoMedHistFound />} />
        <Route path="/MakeDoc" element={<MakeDoc />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/MedHistView" element={<ViewMedHist />} />
        <Route path="/scheduleAppt" element={<SchedulingAppt />} />
        <Route path="/showDiagnoses/:id" element={<ShowDiagnoses />} />
        <Route path="/Diagnose/:id" element={<Diagnose />} />
        <Route path="/ViewOneHistory/:email" element={<ViewOneHistory />} />
        <Route path="/createAcc" element={<CreateAccount />} />
        <Route path="/PatientsViewAppt" element={<PatientsViewAppt />} />
        <Route path="/DocSettings" element={<DocSettings />} />
        <Route path="/ApptList" element={<DocViewAppt />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route
          path="/order-lab-test/:appointmentId"
          element={<OrderLabTest />}
        />
        <Route path="/Generatetestresult1" element={<Generatetestresult1 />} />
        <Route path="/Viewlabresult" element={<Viewlabresult />} />
        <Route path="/LabResultDetail/:testId" element={<LabResultDetail />} />
        <Route path="/addInsurance" element={<AddInsurance />} />
        <Route path="/ViewInsurance" element={<ViewInsurance />} />
        <Route path="/ViewBill" element={<ViewBill />} />
      </Routes>
    </Router>
  );
}
