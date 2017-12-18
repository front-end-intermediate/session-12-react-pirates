import React, { Component } from 'react';
import '../assets/css/Pirate.css';

class Pirate extends React.Component {


  render(){
    const {details, index} = this.props;
    return (
      <div className='pirate'>

      <ul>
      <li >{details.name}</li>
      <li>{details.weapon}</li>
      <li>{details.vessel}</li>
      <li><button onClick={() => this.props.removePirate(index)}>X</button></li>
      </ul>
      </div>
      )
  }
}

export default Pirate;