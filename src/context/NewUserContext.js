import React, { createContext } from 'react';

const NewUserContext = createContext({
	firstname: '',
	lastname: '',
	email: '',
	company: '',
	password: '',
	phone: '',
	fullAddress: '',
	address: {
		addressLine1: '',
		addressLine2: '',
		city: '',
		postcode: '',
		countryCode: 'GB',
	},
	terms: false,
})

export default NewUserContext;
