import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

const Link = ({ id="", classNames="", ...props }) => <RouterLink id={id} className={classNames} {...props} />;

Link.propTypes = {};

export default Link;
