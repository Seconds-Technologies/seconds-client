import React from 'react';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';

const ErrorField = ({ name, classNames }) => {
	const { errors, touched, isSubmitting } = useFormikContext();

	if (!errors[name] && !touched[name]) {
		return null;
	}
	return <div className={classNames ? `${classNames} text-danger`: "text-danger"}>{errors[name]}</div>;
};

ErrorField.propTypes = {
	name: PropTypes.string.isRequired,
	classNames: PropTypes.string
}

export default ErrorField;
