# Session Twelve

## Homework

For you final project you can convert your midterm to Angular 4 using the files we have worked on.

Be sure to add a navigation and routing as outline in session 10 notes.

You may also create a version of the recipes list and details in React.

* Spend some quality time with the exercises on [Built with React](http://buildwithreact.com) (do the Tutorial).

## Reading

## React Project

```bash
$ cd react-pirates
```

```bash
npm run start
```

## Stateless Components

Not every component needs to be involved with data. When you only need to render some material use a Stateless Functional Component.

* Header

```
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
```

To:

```
import React, { Component } from 'react';
import '../assets/css/Header.css'
import logo from '../assets/img/anchor.svg';

const Header = (props) => {
  return (
    <div className="header">
    <img src={logo} className="App-logo" alt="logo" />
    <h1>{props.headerTitle}</h1>
    </div>)
}

export default Header;
```

* App

```
<Header headerTitle = "Pirates List" />
```

Note - no 'this' required in the props.


### Persisting the Data

Demo using db on Firebase. Firebase is like one big object.

1. Create an account at https://firebase.com/
1. Create a new project called `<firstname>-<lastname>-pirates`
1. Go to the empty database (left hand menu)

Click on Rules at the top.

* Default

```
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

Change defaults to:

```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

and click Publish.

Examine App.js state. Any change to pirates needs to be made to firebase.

in src create `base.js`

```
import Rebase from 're-base'

const base = Rebase.createClass({
  
})
```

[Rebase](https://www.npmjs.com/package/rebase) is a simple utility that we are going to need to massage strings.

`$ npm install re-base@2.2.0 --save`

Or add `"re-base": "2.2.0"` to your package.json dependencies.

Add domain, database URL, API key.

In Firebase click on Project Overview > Add Firebase to your web app.

Extract the following information:

```
apiKey: "AIzaSyAHnKw63CUBAqSuCREgils_waYJ0qwpGiU",
authDomain: "daniel-deverell-pirates.firebaseapp.com",
databaseURL: "https://daniel-deverell-pirates.firebaseio.com",
```

* base.js:

```
import Rebase from 're-base'

const base = Rebase.createClass({
  apiKey: "AIzaSyAHnKw63CUBAqSuCREgils_waYJ0qwpGiU",
  authDomain: "daniel-deverell-pirates.firebaseapp.com",
  databaseURL: "https://daniel-deverell-pirates.firebaseio.com",
})

export default base;
```

* App.js

`import base from './base'`

## React Component Lifecycle

[Documentation](https://reactjs.org/docs/react-component.html).

* component will mount - hooks into component before it is displayed.

* App

```
componentWillMount(){
  this.ref = base.syncState(`daniel-deverell-pirates/pirates`, {
    context: this,
    state: 'pirates'
  })
}
```

Note the path and the object.

```
componentWillUmount(){
  base.removeBinding(this.ref)
}
```

Load pirates and examine the Firebase HTML5 websockets.

To delete a pirate we need to accomodate Firebase:

```
removePirate(key){
  const pirates = {...this.state.pirates}
  pirates[key] = null
  this.setState({pirates})
}
```


## Bi-Directional Data

React's version of $scope

Make the pirates available

* App

```
<PirateForm 
pirates={this.state.pirates} 
addPirate={this.addPirate} 
loadSamples={this.loadSamples} 
removePirate={this.removePirate} />
</div>
```

* PirateForm

Call renderPirates with a .map:

```
render(){
  return (
    <div>
    {Object.keys(this.props.pirates).map(this.renderPirates)}
```

Add the function

```
  renderPirates(key){
    return (
    <p>{key}</p>
    )
  }
```

```
  renderPirates(key){
    const pirate = this.props.pirates[key]
    return (
    <div key={key}>
      <p>{key}</p>
      <input value={pirate.name} type="text" name="name" placeholder="Pirate name" />
      <input value={pirate.weapon} type="text" name="weapon" placeholder="Pirate weapon" />
      <input value={pirate.vessel} type="text" name="vessel" placeholder="Pirate vessel" />
      
    </div>
    )
  }
```

```
  constructor() {
    super();
    this.renderPirates = this.renderPirates.bind(this);
  }
```

Note error. React only allows you to put state into a field if you have the intention of editing it.

Listen for a change on one input.

```
<input value={pirate.name} onChange={(e) => this.handleChange(e, key)} type="text" name="name" placeholder="Pirate name" />
```

Create the method:

```
  handleChange(e, key){
    const pirate = this.props.pirates[key]
  }
```

Remember to bind it in the constructor:

```
  constructor() {
    super();
    this.renderPirates = this.renderPirates.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
```

Test by sending the pirate to the console:

```
  handleChange(e, key){
    const pirate = this.props.pirates[key]
    console.log(pirate)
    console.log(e.target)
    console.log(e.target.value)
  }
```

Values need to be put into state

```
  handleChange(e, key){
    const pirate = this.props.pirates[key]
    const updatedPirate = {
      ...pirate, 
      [e.target.name]: e.target.value
    }
    console.log(updatedPirate)
  }
```

Pass the updated pirate to the App component for updating.

* App

```
  updatePirate(key, updatedPirate){
    const pirates = {...this.state.pirates};
    pirates[key] = updatedPirate;
    this.setState({ pirates })
  }
```

Pass the method to the component.

```
<PirateForm 
      updatePirate={this.updatePirate}
      pirates={this.state.pirates} 
      addPirate={this.addPirate} 
      loadSamples={this.loadSamples} 
      removePirate={this.removePirate} />
```

Bind it.

```
constructor() {
  super();
  this.addPirate = this.addPirate.bind(this);
  this.loadSamples = this.loadSamples.bind(this)
  this.removePirate = this.removePirate.bind(this)
  this.updatePirate = this.updatePirate.bind(this)
  this.state = {
    pirates: {}
  }
}
```

* PirateForm

```
  handleChange(e, key){
    const pirate = this.props.pirates[key]
    const updatedPirate = {
      ...pirate, 
      [e.target.name]: e.target.value
    }
    this.props.updatePirate(key, updatedPirate);
  }
```

Add the onChange handler to the other fields.

```
renderPirates(key){
  const pirate = this.props.pirates[key]
  return (
  <div key={key}>
    <p>{key}</p>
    <input value={pirate.name} onChange={(e) => this.handleChange(e, key)} type="text" name="name" placeholder="Pirate name" />
    <input value={pirate.weapon} onChange={(e) => this.handleChange(e, key)} type="text" name="weapon" placeholder="Pirate weapon" />
    <input value={pirate.vessel} onChange={(e) => this.handleChange(e, key)} type="text" name="vessel" placeholder="Pirate vessel" />
  </div>
  )
}
```

Test and check out Firebase.


### Routing

[See](https://reacttraining.com/react-router/web/guides/quick-start)

`> npm install react-router-dom --save`

* index.js

```
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

class Main extends React.Component {
  render() {
    return (
    <Router>
    <div>
      <Route exact path="/" component={App}/>
    </div>
  </Router>
      )
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
  );
```

### Pirate Detail

* PirateDetail.js

```
import React, { Component } from 'react'

class PirateDetail extends Component {
  render() {
    return (
      <div className="pirate-detail">
        <h2>Pirate detail</h2>
      </div>
      )
  }
}

export default PirateDetail;
```

* index

`<Route path="/pirate/:pid" component={PirateDetail} />`:

```
import PirateDetail from './PirateDetail';

class Main extends React.Component {
  render() {
    return (
    <Router>
    <div>
      <Route exact path="/" component={App}/>
      <Route path="/pirate/:pid" component={PirateDetail} />
    </div>
  </Router>
      )
  }
}
```

Test with `http://localhost:3000/pirate/pirate01`





### Notes



































