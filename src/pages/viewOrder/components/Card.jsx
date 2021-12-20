import React from 'react';

const Card = ({ styles, children }) => {
	return <div className={`${styles} d-flex flex-column justify-content-center card-wrapper py-3 px-4`}>{children}</div>;
};

Card.propTypes = {};

export default Card;
