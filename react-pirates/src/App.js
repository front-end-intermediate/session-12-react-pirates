import React, { Component } from 'react';
import Header from './components/Header';
import base from './base'
import Pirate from './components/Pirate';
import PirateForm from './components/PirateForm';
import piratesFile from './data/sample-pirates-object'
import './assets/css/App.css';

class App extends Component {

  constructor() {
    super();
    this.addPirate = this.addPirate.bind(this);
    this.loadSamples = this.loadSamples.bind(this)
    this.removePirate = this.removePirate.bind(this)
    this.state = {
      pirates: {}
    }
  }


componentWillMount(){
  this.ref = base.syncState(`daniel-deverell-pirates/pirates`, {
    context: this,
    state: 'pirates'
  })
}

componentWillUmount(){
  base.removeBinding(this.ref)
}

  loadSamples(){
    this.setState({
      pirates: piratesFile
    })
  }

  // removePirate(key){
  //   const pirates = {...this.state.pirates}
  //   delete pirates[key]
  //   this.setState({pirates})
  // }

  removePirate(key){
  const pirates = {...this.state.pirates}
  pirates[key] = null
  this.setState({pirates})
}

  addPirate(pirate){
    //update state
    const pirates = {...this.state.pirates}
    //add new pirate
    const timestamp = Date.now()
    pirates[`pirate-${timestamp}`] = pirate
    //set state
    this.setState({ pirates: pirates })
  }

  render() {
    return (
      <div className="App">
      <Header />
      <ul>
      {
        Object.keys(this.state.pirates)
        .map( key => <Pirate key={key} index={key} details={this.state.pirates[key]} removePirate = {this.removePirate} /> )
      }
      </ul>
      <PirateForm addPirate={this.addPirate} loadSamples={this.loadSamples} removePirate={this.removePirate} />
      </div>
      );
  }

}

export default App;
