import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from './components/Navbar';
import PropertyList from './components/PropertyList';
import WorkOrder from "./components/WorkOrder";
import Login from "./components/Login";
import Register from "./components/Register";
import Alert from "./components/Alert";

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  return (
    <>
      <Router>
        <Navbar />
        <Alert alert={alert} />
        <div className="container">
          <Routes>
            <Route path="/" element={<PropertyList showAlert={showAlert} />} />
            <Route path="/work_order" element={<WorkOrder showAlert={showAlert} />} />
            <Route path="/login" element={<Login showAlert={showAlert}/>} />
            <Route path="/register" element={<Register showAlert={showAlert}/>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
