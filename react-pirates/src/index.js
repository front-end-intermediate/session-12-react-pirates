import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';

import PirateDetail from './components/PirateDetail';


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

// ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
	<Main />,
	document.getElementById('root')
	);

registerServiceWorker();
