import { TOGGLE_TOUR_HINTS, UPDATE_DASHBOARD_TOUR, UPDATE_ORDERS_TOUR, UPDATE_PROFILE_TOUR } from '../actionTypes';

const DEFAULT_STATE = {
	hintsEnabled: false,
	hints: [],
	dashboard: {
		stepsEnabled: true,
		steps: [
			{
				intro: 'Welcome to the Seconds dashboard. Lets walk you through the basics'
			},
			{
				element: '.featured-container',
				intro: 'Here you can see your delivery overview with all the essential information'
			},
			{
				element: '#time-filter',
				intro: 'You can filter the stats based on time period here'
			},
			{
				element: '.map-container',
				intro: "Here we show an interactive map of your store's location. The map will populate with markers as new orders come in"
			},
			{
				intro: "Click the 'Orders' icon in the sidebar to continue the tour"
			}
		],
		hints: [
			{
				element: '#orders-link',
				hint: "Click here to go to the Order's page",
				hintPosition: 'middle-right'
			}
		],
	},
	orders: {
		stepsEnabled: true,
		steps: [],
		hints: [],
	},
	profile: {
		stepsEnabled: true,
		steps: [],
		hints: [],
	}
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case TOGGLE_TOUR_HINTS:
			return {
				...state,
				hintsEnabled: action.data.hintsEnabled,
				hints: action.data.hints
			}
		case UPDATE_DASHBOARD_TOUR:
			return {
				...state,
				dashboard: { ...state.dashboard, ...action.data }
			}
		case UPDATE_ORDERS_TOUR:
			return {
				...state, ...action.data
			}
		case UPDATE_PROFILE_TOUR:
			return {
				...state, ...action.data
			}
		default:
			return state
	}
}