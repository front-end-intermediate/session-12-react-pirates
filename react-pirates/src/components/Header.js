import React, { Component } from 'react';
import '../assets/css/Header.css'
import logo from '../assets/img/anchor.svg';

class Header extends React.Component {
  render(){
    return (
      <div className="header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Header Component</h1>
      </div>)
    }
  }

export default Header;