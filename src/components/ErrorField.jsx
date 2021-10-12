import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';

const ErrorField = ({ name }) => {
	const { errors, touched, isSubmitting } = useFormikContext();
	useEffect(() =>{
		console.log(name)
	}, [])
	if (!errors[name] && !touched[name]) {
		return null;
	}
	return <div className="text-danger">{errors[name]}</div>;
};

export default ErrorField;
