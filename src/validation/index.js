import * as Yup from 'yup';

const phoneRegExp2 =
	/^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/;

export const SignUpSchema = Yup.object().shape({
	firstname: Yup.string().max(20, 'Max. 20 characters').required('Required'),
	lastname: Yup.string().max(20, 'Max. 20 characters').required('Required'),
	company: Yup.string().max(25, 'Max. 25 characters').required('Required'),
	email: Yup.string().email('Invalid email address!').required('Required'),
	phone: Yup.string().matches(phoneRegExp2, 'Phone number is not valid').required('Required'),
	address: Yup.string().required('Required'),
	password: Yup.string().min(8, 'Min. 8 characters').required('Required'),
});

export const CreateOrderSchema = Yup.object().shape({
	pickupFirstName: Yup.string().max(20, 'Max. 20 characters').required('* Required'),
	pickupLastName: Yup.string().max(20, 'Max. 20 characters').required('* Required'),
	pickupEmailAddress: Yup.string().required('* Required').email('Invalid email address!'),
	pickupPhoneNumber: Yup.string().matches(phoneRegExp2, 'Phone number is not valid').required('* Required'),
	pickupBusinessName: Yup.string().required('* Required'),
	pickupAddress: Yup.string().required('* Required'),
	dropoffAddress: Yup.string().required('* Required'),
	dropoffFirstName: Yup.string().max(20, 'Max. 20 characters').required('* Required'),
	dropoffLastName: Yup.string().max(20, 'Max. 20 characters').required('* Required'),
	dropoffEmailAddress: Yup.string().required('* Required').email('Invalid email address!'),
	dropoffPhoneNumber: Yup.string().matches(phoneRegExp2, 'Phone number is not valid').required('* Required'),
	vehicleType: Yup.string().required('* Required')
});
