import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

const AddWorkOrder = (props) => {
   const [workOrder, setWorkOrder] = useState({title: "", description: "", property_id: "", status:"", technician_id: []})
  const navigate = useNavigate(null);
  const location = useLocation();
  const users = location.state?.users || props.users || [];
  const handleCancel = () => {
    navigate('/work_order');
  }
  if (!users.length) {
    navigate('/work_order');
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const {title, description, property_id, status, technician_id} = workOrder;
    api.post("/work_order/storeWorkOrder", {
        title: title, description: description, property_id: property_id, status: status, technician_id: technician_id
    }).then((res) => {
          props.showAlert('WorkOrder created successfully!', 'success');
          navigate('/work_order');
        })
        .catch((err) => {
            console.log(err);
            props.showAlert(err.response.data.custom_error, 'danger');
            console.error("API Error:", err);
        });
  }
  const handleChange = (e) => {
    setWorkOrder({...workOrder, [e.target.name]: e.target.value})
  }
  const handleTechnicianChange = (e) => {
  const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
  setWorkOrder({ ...workOrder, technician_id: selectedValues });
};
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" name='title' className="form-control" id="title" onChange={handleChange} aria-describedby="title" />  
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" name='description' className="form-control" onChange={handleChange} id="description" />
        </div>
        <div className="mb-3">
          <label htmlFor="property_id" className="form-label">Address</label>
          <select className="form-select"  onChange={handleChange} name='property_id' aria-label="Default select example">
            <option defaultValue={0}>Please select property</option>
            {
                props.properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.address}</option>
                ))
            }
        </select>
        </div>
        <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select className="form-select" onChange={handleChange} name='status' aria-label="Default select example">
                <option defaultValue={0}>Please select status</option>
                <option key="pending" value="pending">Pending</option>
                <option key="in_progress" value="in_progress">In Progress</option>
                <option key="completed" value="completed">Completed</option>
            </select>
        </div>
        <div className="mb-3">
            <label htmlFor="status" className="form-label">Technician users</label>
            <select className="form-select" onChange={handleTechnicianChange} name='technician_id' aria-label="Default select example" multiple>
                <option defaultValue={0}>Please select Technicians</option>
                {
                users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                ))
            }
            </select>
        </div>
        <button type="button" className="btn btn-danger mx-2" onClick={handleCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default AddWorkOrder
