import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        navigate('/login');
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Property Management</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Property List</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/work_order">Work orders</Link>
                            </li>
                        </ul>
                        {!localStorage.getItem('auth_token') ? <form className="d-flex" role="search">
                            <Link to='/login' className="btn btn-primary mx-2">Login</Link>
                            <Link to='/register' className="btn btn-primary mx-2">Register</Link>      
                        </form> : <button className="btn btn-primary" type="submit" onClick={handleLogout}>Logout</button>}
                        
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
