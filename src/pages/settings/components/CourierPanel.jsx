import React from 'react';
import PropTypes from 'prop-types';
import stuart from '../../../assets/img/stuart.svg';
import trackIcon from '../../../assets/img/track1.svg';
import serviceIcon from '../../../assets/img/service.svg';
import vehicleIcon from '../../../assets/img/vehicle.svg';

const CourierPanel = ({ img, name, link, description, locations, services, vehicles }) => {
	return (
		<div className='d-flex flex-column h-100 border p-3 courier-tile'>
			<img src={img} alt='' width={120} height={120} />
			<span className='display-6 mb-1'>{name}</span>
			<span>{description}</span>
			<small className='text-muted'>{link}</small>
			<div className='table-responsive py-3 table-sm'>
				<table className='table table-borderless'>
					<tr className='d-flex text-wrap my-3'>
						<td>
							<img src={trackIcon} alt='' width={35} height={35} />
						</td>
						<td>
							<span className='courier-text'>{locations}</span>
						</td>
					</tr>
					<tr className='d-flex text-wrap my-3'>
						<td>
							<img src={serviceIcon} alt='' width={30} height={30} />
						</td>
						<td>
							<span className='courier-text'>{services}</span>
						</td>
					</tr>
					<tr className='d-flex text-wrap my-3'>
						<td>
							<img src={vehicleIcon} alt='' width={30} height={30} />
						</td>
						<td>
							<span className='courier-text'>{vehicles}</span>
						</td>
					</tr>
				</table>
			</div>
			<button className='btn btn-primary' style={{ width: 150 }}>
				Select
			</button>
		</div>
	);
};

CourierPanel.propTypes = {

};

export default CourierPanel;
