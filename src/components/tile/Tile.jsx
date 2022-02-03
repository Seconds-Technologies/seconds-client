import React from 'react';
import PropTypes from 'prop-types';
import { useHistory} from 'react-router-dom';

const Tile = ({ index, id, address, name, colour }) => {
	const history = useHistory()
	return (
		<div
			key={index}
			className='my-4'
			role='button'
			onClick={() => history.push(`/view-orders/${id}`)}
		>
			<div style={{ height: 4, backgroundColor: colour }} />
			<div className="tile-wrapper w-100 p-2">
				<table className="table table-borderless">
					<tbody>
					<tr><span className="fw-bold">{id}</span></tr>
					<tr><span className="fw-bold">{address}</span></tr>
					<tr><span className="fw-bold fs-3">{name}</span></tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

Tile.propTypes = {
	id: PropTypes.string.isRequired,
	address: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
};

export default Tile;
