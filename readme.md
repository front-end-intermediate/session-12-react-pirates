# Session Twelve

## Homework

Continue to work on your final project - convert your midterm to Angular 4 using the files we have worked or create a version of the recipes list and details in React.

## React Project

```bash
cd react-pirates
npm i
npm run start
```

## Stateless Components

Not every component needs to be involved with data. When you only need to render some material use a Stateless Functional Component.

* `Header`:

```js
import React, { Component } from 'react';
import '../assets/css/Header.css';

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <h1>Header Component</h1>
      </div>
    );
  }
}

export default Header;
```

To:

```js
import React from 'react';
import '../assets/css/Header.css';

const Header = props => {
  return (
    <div className="header">
      <h1>{props.headerTitle}</h1>
    </div>
  );
};

export default Header;
```

* `App`:

```
<Header headerTitle="Pirates List" />
```

Note - no 'this' required in the props.

### Persisting the Data

Demo using db on Firebase. Firebase is like one big object.

1. Create an account at https://firebase.com/
1. Create a new project called `<firstname>-<lastname>-pirates`
1. Go to the empty database (left hand menu)

Click on Rules at the top.

* Default

```js
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

Change defaults to:

```js
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

```js
apiKey: "AIzaSyAHnKw63CUBAqSuCREgils_waYJ0qwpGiU",
authDomain: "daniel-deverell-pirates.firebaseapp.com",
databaseURL: "https://daniel-deverell-pirates.firebaseio.com",
```

* base.js:

```js
import Rebase from 're-base';

const base = Rebase.createClass({
  apiKey: 'AIzaSyAHnKw63CUBAqSuCREgils_waYJ0qwpGiU',
  authDomain: 'daniel-deverell-pirates.firebaseapp.com',
  databaseURL: 'https://daniel-deverell-pirates.firebaseio.com'
});

export default base;
```

* `App.js`:

`import base from './base'`

## React Component Lifecycle

[Documentation](https://reactjs.org/docs/react-component.html).

* component will mount - hooks into component before it is displayed.

* `App`:

```js
componentWillMount(){
  this.ref = base.syncState(`daniel-deverell-pirates/pirates`, {
    context: this,
    state: 'pirates'
  })
}
```

Note the path and the object.

```js
componentWillUmount(){
  base.removeBinding(this.ref)
}
```

To delete a pirate we need to accomodate Firebase:

```js
removePirate(key){
  const pirates = {...this.state.pirates}
  pirates[key] = null
  this.setState({pirates})
}
```

## Bi-Directional Data

* React's version of $scope

Make the pirates available

* `App`:

`pirates={this.state.pirates}`:

```js
<PirateForm
pirates={this.state.pirates}
addPirate={this.addPirate}
loadSamples={this.loadSamples}
removePirate={this.removePirate} />
</div>
```

* `PirateForm`:

Call `renderPirates` with a `.map`:

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

```js
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

```html
<input value={pirate.name} onChange={(e) => this.handleChange(e, key)} type="text" name="name" placeholder="Pirate name" />
```

Create the method:

```js
  handleChange(e, key){
    const pirate = this.props.pirates[key]
  }
```

Remember to bind it in the constructor:

```js
constructor() {
  super();
  this.renderPirates = this.renderPirates.bind(this);
  this.handleChange = this.handleChange.bind(this);
}
```

Test by sending the pirate to the console:

```js
  handleChange(e, key){
    const pirate = this.props.pirates[key]
    console.log(pirate)
    console.log(e.target)
    console.log(e.target.value)
    console.log(e.target.name, e.target.value)
  }
```

Values need to be put into state.

We need a copy of the object. This is the old method:

`const updatedPIrate = Object.assign([], pirate)`

but we will use spread operator and overlay the new properties on top of it. `e.target.name` gives us the property name so we will use what's know as a computed property - `[e.target.name]`.

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

* `App`:

```
  updatePirate(key, updatedPirate){
    const pirates = {...this.state.pirates};
    pirates[key] = updatedPirate;
    this.setState({ pirates })
  }
```

Pass the method to the component.

`updatePirate={this.updatePirate}`:

```js
<PirateForm
  updatePirate={this.updatePirate}
  pirates={this.state.pirates}
  addPirate={this.addPirate}
  loadSamples={this.loadSamples}
  removePirate={this.removePirate}
/>
```

Bind it.

* App

```js
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

* `PirateForm`:

```js
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

```js
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

## Authentication

* Firebase

Enable Github authentication under Authentication > Sign In Method

* Github

Navigate to Settings > Developer settings > OAuth Apps and register a new OAuth application.

Copy the URL from Firebase and enter the Client ID and Client Secret into Firebase.

* `PirateForm`:

```
  renderLogin(){
    return (
      <div>
      <p>Sign in</p>
      <button onClick={() => this.authenticate('github')} >Log in with Github</button>
      </div>
      )
  }
```

and bind it

```js
  constructor() {
    super();
    this.renderPirates = this.renderPirates.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
  }
```

Set an initial value for uid in state:

```js
  constructor() {
    super();
    this.renderPirates = this.renderPirates.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.state = {
      uid: null
    }
  }
```

Add an if statement that shows a button to log in:

```js
  render(){
    const logout = <button>Log Out</button>;
    if(!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    return (
      <div>
      {logout}
      {Object.keys(this.props.pirates).map(this.renderPirates)}
      <h3>Pirate Form Component</h3>
      <AddPirateForm addPirate={this.props.addPirate} />
      <button onClick={this.props.loadSamples}>Load Sample Pirates</button>`
      </div>
      )
  }
}
```

Create the authenticate method and bind it

```js
  constructor() {
    super();
    this.renderPirates = this.renderPirates.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.state = {
      uid: null
    }
  }

  authenticate(provider){
    console.log(`Trying to log in with ${provider}`)
  }
```

Import base:

```js
import base from '../base';
```

```js
  authenticate(provider){
    console.log(`Trying to log in with ${provider}`);
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    console.log(authData)
  }
```

Bind the authHandler:

`this.authHandler = this.authHandler.bind(this);`

If no error add uid to state.

```js
  authHandler(err, authData) {
    console.log(authData)
    if (err){
      console.log(err);
      return;
    }
    this.setState({
      uid: authData.user.uid
    })
  }
```

Refresh is a problem. Use a lifecycle hook.

```js
componentDidMount(){
  base.onAuth((user) => {
    if(user) {
      this.authHandler(null, {user});
    }
  })
}
```

Log Out

```js
logout(){
  base.unauth();
  this.setState({uid: null})
}
```

Bind it

`this.logout = this.logout.bind(this);`

Add a call to the method in the button

```
render(){
  const logout = <button onClick={() => this.logout()}>Log Out</button>;
```

### Notes

Create a repo.

Sub git a build

Set "homepage": "https://xxx.github.io/<repo-name>" in package.json
