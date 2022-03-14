import React from 'react';
import trackIcon from '../../../assets/img/track1.svg';
import serviceIcon from '../../../assets/img/service.svg';
import vehicleIcon from '../../../assets/img/vehicle.svg';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import { useSelector } from 'react-redux';

const onIcon = <div className='switch-icon'>On</div>;
const offIcon = <div className='switch-icon'>Off</div>;

const CourierPanel = ({ id, img, name, link, linkText, description, locations, services, vehicles, toggle }) => {
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);
	return (
		<div className='d-flex flex-column h-100 border p-3 courier-tile'>
			<div className='d-flex flex-column intro-content'>
				<img src={img} alt='' width={75} height={75} />
				<span className='fs-2 mb-1'>{name}</span>
				<span>{description}</span>
				<small className='text-muted'>
					<a href={link} target='_blank'>
						{linkText}
					</a>
				</small>
			</div>
			<div className='table-responsive py-3 table-sm'>
				<table className='table table-borderless'>
					<tr className='d-flex align-items-center text-wrap my-3'>
						<td colSpan={1}>
							<img src={trackIcon} alt='' width={40} height={40} />
						</td>
						<td colSpan={2}>
							<p className='courier-text my-0 py-0'>{locations}</p>
						</td>
					</tr>
					<tr className='d-flex align-items-center text-wrap my-3'>
						<td colSpan={1}>
							<img src={serviceIcon} alt='' width={40} height={40} />
						</td>
						<td colSpan={2}>
							<p className='courier-text my-0 py-0'>{services}</p>
						</td>
					</tr>
					<tr className='d-flex align-items-center text-wrap my-3'>
						<td colSpan={1}>
							<img src={vehicleIcon} alt='' width={40} height={40} />
						</td>
						<td colSpan={2}>
							<p className='courier-text my-0 py-0'>{vehicles}</p>
						</td>
					</tr>
				</table>
			</div>
			<div className='d-flex flex-column flex-grow-1 justify-content-end'>
				<Switch
					onColor={'#9FEA86'}
					checkedIcon={onIcon}
					uncheckedIcon={offIcon}
					onChange={() => toggle({ [id]: !activeFleetProviders[id] })}
					handleDiameter={19}
					checked={activeFleetProviders[id]}
					className='switch-text'
				/>
			</div>
		</div>
	);
};

CourierPanel.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
	linkText: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	locations: PropTypes.string.isRequired,
	services: PropTypes.string.isRequired,
	vehicles: PropTypes.string.isRequired,
	toggle: PropTypes.func.isRequired
};

export default CourierPanel;
