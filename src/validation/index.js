import * as Yup from 'yup';

const phoneRegExp2 =
	/^(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?|\(?0)(?:\d{5}\)?[\s-]?\d{4,5}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{2}\)?[\s-]?\d{4}[\s-]?\d{4})(?:[\s-]?(?:x|ext\.?|#)\d{3,4})?$/;

let dropsSchema = Yup.object().shape({
	dropoffAddressLine1: Yup.string().required('*Required'),
	dropoffCity: Yup.string().required('*Required'),
	dropoffPostcode: Yup.string().required('*Required'),
	dropoffFirstName: Yup.string().max(20, 'Max. 20 characters').required('*Required'),
	dropoffLastName: Yup.string().max(20, 'Max. 20 characters').required('*Required'),
	dropoffEmailAddress: Yup.string().email('Invalid email address!'),
	dropoffPhoneNumber: Yup.string().matches(phoneRegExp2, 'Phone number is not valid').required('* Required'),
});

export const SignUpSchema = Yup.object().shape({
	firstname: Yup.string().max(20, 'Max. 20 characters').required('*Required'),
	lastname: Yup.string().max(20, 'Max. 20 characters').required('*Required'),
	company: Yup.string().max(25, 'Max. 25 characters').required('*Required'),
	phone: Yup.string().matches(phoneRegExp2, 'Phone number is not valid').required('*Required'),
	address: Yup.object().shape({
		addressLine1: Yup.string().required('*Required'),
		city: Yup.string().required('*Required'),
		postcode: Yup.string().required('*Required'),
	}),
	email: Yup.string().email('Invalid email address!').required('Required'),
	password: Yup.string().min(8, 'Min. 8 characters').required('Required'),
	terms: Yup.boolean().oneOf([true], 'Must Accept Terms and Conditions'),
});

export const CreateOrderSchema = Yup.object().shape({
	packageDeliveryType: Yup.string().required('*Please select a delivery type'),
	pickupFirstName: Yup.string().max(20, 'Max. 20 characters').required('* Required'),
	pickupLastName: Yup.string().max(20, 'Max. 20 characters').required('* Required'),
	pickupEmailAddress: Yup.string().required('* Required').email('Invalid email address!'),
	pickupPhoneNumber: Yup.string().matches(phoneRegExp2, 'Phone number is not valid').required('* Required'),
	pickupBusinessName: Yup.string().required('* Required'),
	pickupAddressLine1: Yup.string().required('*Required'),
	pickupCity: Yup.string().required('*Required'),
	pickupPostcode: Yup.string().required('*Required'),
	vehicleType: Yup.string().required('* Required'),
	itemsCount: Yup.number().min(0).max(10),
});

export const ResetPasswordSchema = Yup.object().shape({
	password: Yup.string().required('Password is required'),
	confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});
