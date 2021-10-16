import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

const PasswordField = ({ label, onBlur, onChange }) => {
	const [type, setType] = useState('password');

	const handleClick = () => setType(type === 'text' ? 'password' : 'text');

	return (
		<div className='pass-wrapper'>
			<input
				autoComplete='new-password”'
				type={type}
				name='password'
				className='form-control rounded-3'
				onBlur={onBlur}
				onChange={onChange}
			/>
			<i role='button' className='eye-icon me-3' onClick={handleClick}>
				{type === 'text' ? eye : eyeSlash}
			</i>
		</div>
	);
};

PasswordField.propTypes = {
	label: PropTypes.string.isRequired,
	onBlur: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default PasswordField;
