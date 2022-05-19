import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

const Link = ({ id="", className="", ...props }) => <RouterLink id={id} className={className} {...props} />;

Link.propTypes = {
	id: PropTypes.string,
	className: PropTypes.string
};

export default Link;
