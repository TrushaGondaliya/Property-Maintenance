import React, { useEffect, useState } from "react";
import api from '../api';
import { useNavigate } from "react-router-dom";

function PropertyList(props) {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('auth_token')) {
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
      props.showAlert('Please login to the site for access property management', 'danger');
      navigate('/login');
    }
  }, []);

  return (
    <div className="container mt-2">
      <h2>Property List</h2>
      <ul>
        {properties.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default PropertyList;
