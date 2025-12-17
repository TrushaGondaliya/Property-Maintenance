import React, { useState } from 'react'
import api from '../api';
import { useNavigate } from 'react-router-dom'

const AddProperty = (props) => {
  const [property, setProperty] = useState({name: "", description: "", address: ""})
  const navigate = useNavigate(null);
  const handleCancle = () => {
    navigate('/');
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const {name, description, address} = property;
    api.post("/property/store", {
        name: name, description: description, address:address
    }).then((res) => {
          props.showAlert('Property created successfully!', 'success');
          navigate('/');
        })
        .catch((err) => {
          console.log(err);
            props.showAlert(err.response.data.custom_error, 'danger');
            navigate('/add_property');
            console.error("API Error:", err);
        });
  }
  const handleChange = (e) => {
    setProperty({...property, [e.target.name]: e.target.value})
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" name='name' className="form-control" id="name" onChange={handleChange} aria-describedby="name" />  
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" name='description' className="form-control" onChange={handleChange} id="description" />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" name='address' required className="form-control" onChange={handleChange} id="address" />
        </div>
        <button type="button" className="btn btn-danger mx-2" onClick={handleCancle}>Cancel</button>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default AddProperty
