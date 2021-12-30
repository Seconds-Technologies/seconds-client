import { SET_WOOCOMMERCE } from './actionTypes';

export const setWoo = credentials => ({
	type: SET_WOOCOMMERCE,
	credentials,
});