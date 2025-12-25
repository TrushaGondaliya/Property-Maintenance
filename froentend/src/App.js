import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import PropertyList from './components/PropertyList';
import WorkOrder from "./components/WorkOrder";
import Login from "./components/Login";
import Register from "./components/Register";
import Alert from "./components/Alert";
import AddProperty from "./components/AddProperty";
import AddWorkOrder from "./components/AddWorkOrder";
import api from "./api";

function App() {
  const [alert, setAlert] = useState(null);
  const [properties, setProperties] = useState([]);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
    useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      api.get("/property/list")
        .then((res) => {
          if (res.data.success) {
            setProperties(res.data.data);
          }
        })
        .catch((err) => {
          console.error("API Error:", err);
        });
    } else {
      showAlert('Please login to the site for access property management', 'danger');
    }
  }, []);

  return (
    <>
      <Router>
        <Navbar />
        <Alert alert={alert} />
        <div className="container">
          <Routes>
            <Route path="/" element={<PropertyList showAlert={showAlert} properties={properties} setProperties={setProperties} />} />
            <Route path="/work_order" element={<WorkOrder showAlert={showAlert} properties={properties}/>} />
            <Route path="/login" element={<Login showAlert={showAlert}/>} />
            <Route path="/register" element={<Register showAlert={showAlert}/>} />
            <Route path="/add_property" element={<AddProperty showAlert={showAlert}/>} />
            <Route path="/add_work_order" element={<AddWorkOrder showAlert={showAlert} properties={properties}/>} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
