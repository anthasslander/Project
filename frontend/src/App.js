import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./home/Home"; 
import LogIn from "./registration/logIn"; 
import CreateAccount from "./registration/CreateAccount";
import SchedulingAppt from "./appointment/schedulingAppt"; 
import ViewMedHist from "./medicalhistory/ViewMedHist"; 
import DocHome from "./home/DocHome"; 
import ViewOneHistory from "./medicalhistory/ViewOneHistory"; 
import NoMedHistFound from "./medicalhistory/NoMedHistFound"; 
import Settings from "./home/Settings"; 
import DocSettings from "./home/DocSettings"; 
import PatientsViewAppt from "./appointment/PatientsViewAppt"; 
import DocViewAppt from "./appointment/DocViewAppt"; 
import MakeDoc from "./registration/MakeDoc"; 
import Diagnose from "./appointment/Diagnose"; 
import ShowDiagnoses from "./appointment/ShowDiagnoses"; 
import OrderLabTest from "./lab/OrderLabTest"; 
import Generatetestresult1 from "./lab/Generatetestresult1"; 
import Viewlabresult from "./lab/Viewlabresult"; 
import LabResultDetail from "./lab/LabResultDetail"; 
import AddInsurance from "./insurance/addInsurance";
import ViewInsurance from "./insurance/ViewInsurance"; 
import ViewBill from "./billing/ViewBill"; 

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
            user ? (user.who === "pat" ? <Home setUser={setUser} /> : <DocHome setUser={setUser} />) : <LogIn />
          }
        />
        <Route path="/NoMedHistFound" element={<NoMedHistFound />} />
        <Route path="/MakeDoc" element={<MakeDoc />} />
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
        <Route path="/order-lab-test/:appointmentId" element={<OrderLabTest />} />
        <Route path="/Generatetestresult1" element={<Generatetestresult1 />} />
        <Route path="/Viewlabresult" element={<Viewlabresult />} />
        <Route path="/LabResultDetail/:testId" element={<LabResultDetail />} />
        <Route path="/addInsurance" element={<AddInsurance />} />
        <Route path="/ViewInsurance" element={<ViewInsurance />} />
        <Route path="/ViewBill" element={<ViewBill />} />
        <Route path="/Settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
