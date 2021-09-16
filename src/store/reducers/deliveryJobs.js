import {
	CLEAR_JOBS,
	REMOVE_COMPLETED_JOB,
	SET_ALL_JOBS,
	SET_COMPLETED_JOBS,
	UPDATE_COMPLETED_JOBS
} from '../actionTypes';

const DEFAULT_STATE = {
	allJobs: [],
	completedJobs: []
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_ALL_JOBS:
			return { ...state, allJobs: action.jobs }
		case SET_COMPLETED_JOBS:
			let newCompletedJobs = action.jobs.filter(item => item.status === "Completed").map(item => item.id)
			return { ...state, completedJobs: newCompletedJobs }
		case UPDATE_COMPLETED_JOBS:
			return { ...state, completedJobs: [...state.completedJobs, action.id] }
		case REMOVE_COMPLETED_JOB:
			return { ...state, completedJobs: state.completedJobs.filter(id => id !== action.id) }
		case CLEAR_JOBS:
			return DEFAULT_STATE
		default:
			return state;
	}
}