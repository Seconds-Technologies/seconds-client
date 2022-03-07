import {
	CLEAR_JOBS, NEW_DELIVERY_JOB,
	REMOVE_COMPLETED_JOB,
	SET_ALL_JOBS,
	UPDATE_DELIVERY_JOB,
	SET_COMPLETED_JOBS,
	UPDATE_COMPLETED_JOBS
} from '../actionTypes';
import { STATUS } from '../../constants';

const DEFAULT_STATE = {
	allJobs: [],
	completedJobs: []
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SET_ALL_JOBS:
			return { ...state, allJobs: action.jobs }
		case NEW_DELIVERY_JOB:
			return { ...state, allJobs: [...state.allJobs, action.job] }
		case UPDATE_DELIVERY_JOB:
			const updatedJobs = state.allJobs.map(job => job._id === action.job._id ? action.job : job)
			return {...state, allJobs: updatedJobs}
		case SET_COMPLETED_JOBS:
			let newCompletedJobs = action.jobs.filter(item => item.status === STATUS.COMPLETED)
			return { ...state, completedJobs: newCompletedJobs }
		case UPDATE_COMPLETED_JOBS:
			console.log(action.job)
			return { ...state, completedJobs: [...state.completedJobs, action.job] }
		case REMOVE_COMPLETED_JOB:
			return { ...state, completedJobs: state.completedJobs.filter(id => id !== action.id) }
		case CLEAR_JOBS:
			return DEFAULT_STATE
		default:
			return state;
	}
}