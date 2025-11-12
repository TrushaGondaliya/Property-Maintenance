import React, { useState } from 'react'
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Register = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", role: "" });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, password, role } = credentials;
        api.post("/register", {
            name: name, email: email, password:password, role_id: role
        }).then((res) => {
                if (res.data.success) {
                    localStorage.setItem('auth_token', res.data.auth_token);
                }
                props.showAlert('Register Successfully!', 'success');
                navigate('/');
            })
            .catch((err) => {
                props.showAlert(err.response.data.custom_error, 'danger');
                navigate('/register');
                console.error("API Error:", err);
            });
    }

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <>
            <div className='mt-3'>
                <h1 className='mt-2'>Please Register here</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" name='name' required maxLength={200} onChange={handleChange} className="form-control" id="name" aria-describedby="name" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" name='email' required onChange={handleChange} className="form-control" id="email" aria-describedby="email" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" name='password' required minLength={6} onChange={handleChange} className="form-control" id="password" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Select Role</label>
                        <select name='role' className="form-select" required aria-label="Default select example" id='role' onChange={handleChange}>
                            <option value="">Select user role</option>
                            <option value="1">Admin</option>
                            <option value="2">Technician</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" >Submit</button>
                </form>
            </div>
        </>
    )
}

export default Register
