import { TOGGLE_TOUR_HINTS, UPDATE_DASHBOARD_TOUR, UPDATE_ORDERS_TOUR, UPDATE_PROFILE_TOUR } from '../actionTypes';

export const toggleTourHints = data => ({
	type: TOGGLE_TOUR_HINTS,
	data
})

export const updateDashboardTour = data => ({
	type: UPDATE_DASHBOARD_TOUR,
	data
})

export const updateOrdersTour = data => ({
	type: UPDATE_ORDERS_TOUR,
	data
})

export const updateProfileTour = data => ({
	type: UPDATE_PROFILE_TOUR,
	data
})