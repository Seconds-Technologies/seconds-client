import React from 'react';
import PropTypes from 'prop-types';

const Tile = ({ id, address, name }) => {
	return (
		<div className="tile-wrapper w-100 p-2">
			<table className="table table-borderless">
				<tbody>
				<tr>Order ID: <span className="fw-bold">{id}</span></tr>
				<tr>Customer: <span className="fw-bold">{name}</span></tr>
				<tr>Address: <span className="fw-bold">{address}</span></tr>
				</tbody>
			</table>
		</div>
	);
};

Tile.propTypes = {
	id: PropTypes.string.isRequired,
	address: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired
};

export default Tile;
