import React, { useEffect, useState } from "react";
import api from '../api';

function PropertyList() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    api.get("/property/list")
      .then((res) => {
        if (res.data.success) {
          setProperties(res.data.data);
        }
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
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
