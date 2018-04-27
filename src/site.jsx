import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import JobList from './joblist.jsx'

const Site = () => (
	<Router>
		<div>
			<Route exact path="/" component={JobList}/>
			<Route exact path="/jobs/:jobid" component={JobList}/>
		</div>
	</Router>
	)

export default Site