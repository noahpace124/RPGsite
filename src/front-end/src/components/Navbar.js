import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, username }) => {
    return (
        <div className="navbar">
            <div id="col-m"><h1>RPGsite</h1></div>
            <div id="col-r">
                {isLoggedIn ? (
                    <div>{username}</div>
                ) : (
                    <Link to="/login" className="button">Login</Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;