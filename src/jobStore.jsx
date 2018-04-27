export function saveReducer(state = [], action) {
	switch (action.type)
	{
		case 'SAVE-JOB': //toggle type
			if ( !state.includes( action.jobId ))
			{
				state.push( action.jobId );
			} else {
				state.splice(state.indexOf(action.jobId),1);
			}
			return state;
		default:
			return state;
	}
}

export const loadState = () => {
	try {
		const serializedState = localStorage.getItem('state');
		if (serializedState === null) {
			return undefined;
		}
		return JSON.parse(serializedState);
	} catch (err) {
		console.log(err);
		return undefined;
	}
}

export const saveState = (state) => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('state',serializedState);
	} catch (err) {
		console.log(err);
	}
}