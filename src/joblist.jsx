import React, {Component} from "react";
import renderHTML from 'react-render-html';
import {saveReducer, loadState, saveState} from './jobStore.jsx';
import { createStore } from 'redux';

const url = "http://127.0.0.1:8080/https://jobs.github.com/positions.json?description=react&location=remote";


const persistedState = loadState();
let store = createStore(saveReducer, persistedState);

store.subscribe(() => {
	saveState(store.getState());
});

export default class JobList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobList: [],
	  reqIndex: props.match.params.jobid
    };
	store.subscribe(() => {
		console.log( store.getState() )
		this.forceUpdate();
	});
  }

  componentDidMount() {
    var _this = this;
	fetch(url).then(function(response) {
	  return response.json();
	}).then(function(data) {
		_this.setState({
			jobList : data
		});
	}).catch(function() {
		console.log("Booo");
	});
  }
  
  saveJob(jobId) {
	store.dispatch({type: 'SAVE-JOB', jobId: jobId});
  }
  
  checkSaved(jobId) {
	  return store.getState().includes(jobId);
  }
  
  render() {
	const reqIndex = this.state.reqIndex;
	const _this = this;
	const renderItems = this.state.jobList.map(function(job, i)	{
		const imageClick = () => {
			document.getElementById("overlay").style.display = "block";
        }
		const divClick = () => {
			document.getElementById("overlay").style.display = "none";
        }		
		if(reqIndex === undefined || reqIndex === i.toString())
		{
			return (
				<div key={job.id}>
					<div align="center" id="overlay" onClick={() => divClick()}>
						<img alt="" className="logo" src={job.company_logo} style={{"float": "middle"}}/>
						<img alt="" src={require(_this.checkSaved(job.id)?'./images/heart_red.png':'./images/heart.png')} onClick={() => _this.saveJob(job.id)}/>
					</div>
					<div>
						<a href={'/jobs/' + i}><h1>{job.title}</h1></a>
					</div>
					<div className="infobar" style={{"display":(reqIndex === undefined)? "inline-block":"none"}}>
						<div className="align-left">{job.location}</div>
						<div className="align-right"><a className="align-right" href={job.company_url}>{job.company_url.replace(/^https?:\/\//,"").replace(/\/.*/,"")}</a></div>
					</div>
					<div>
						<div className={(reqIndex === undefined)? "truncate":""} style={{"clear": "both"}}>{renderHTML(job.description)}</div>
					</div>
					<div style={{"display":(reqIndex === undefined)? "block":"none"}}>
						<img alt="" src={require(_this.checkSaved(job.id)?'./images/heart_red.png':'./images/heart.png')} style={{"float": "right"}} onClick={() => _this.saveJob(job.id)}/>
					</div>
					<div style={{"display":(reqIndex === undefined)? "none":"block"}}>
						<div style={{"minheight":"30px", "display":(reqIndex === undefined)? "none":"block"}}>
						
						<a href={job.company_url}><h3>{job.company_url.replace(/^https?:\/\//,"").replace(/\/.*/,"")}</h3></a>
						<div align="center">
						<img alt="" src={require(_this.checkSaved(job.id)?'./images/heart_red.png':'./images/heart.png')} style={{"float": "middle"}} onClick={() => _this.saveJob(job.id)}/>
						<img alt="" className="logo" src={job.company_logo} style={{"float": "middle"}} onClick={() => imageClick()}/>
						</div>
						</div>
					</div>
				</div>
			);
		}
		//return( <div></div> );
	}
	);
	
	if (this.state.reqIndex === undefined) {
		console.log(store.getState().length.toString());
		return (
		  <div className="mainFrame container"> Position
			<div>
				<h3 style={{"float": "right"}} id="saveCount">
				<img alt="" src={require('./images/heart_red.png')}/> {store.getState().length.toString() + " saved"}
				</h3>
			</div>
			<ul className="App" style={{"clear": "both"}}>
				{renderItems}
			</ul>
		  </div>
		);
	} else {
		return (
		  <div className="mainFrame container">
			<ul className="App" style={{"clear": "both"}}>
				{renderItems}
			</ul>
		  </div>
		)
	}
  }
}