import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: ""});
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, password } = credentials;
        api.post("/login", {
            email: email, password:password
        }).then((res) => {
                if (res.data.success) {
                    localStorage.setItem('auth_token', res.data.auth_token);
                    props.showAlert('Login Successfully!', 'success');
                    navigate('/');
                }
            })
            .catch((err) => {
                props.showAlert(err.response.data.custom_error, 'danger');
                navigate('/login');
                console.error("API Error:", err);
            });
    }

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <>
        <div className='mt-3'>
            <h1 className='mt-2'>Please login here</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" required name='email' className="form-control" id="email" aria-describedby="email"  onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" required minLength={6} name='password' className="form-control" id="password"  onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
        </>
    )
}

export default Login
