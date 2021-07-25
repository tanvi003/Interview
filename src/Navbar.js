import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

class Navbar extends Component {
  render() {

    return (
      <nav className="">
        <div className="">
          <ul className="header">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/add">Schedule New</NavLink></li>
          </ul>
        </div>
      </nav >
    );
  }
}

export default Navbar;