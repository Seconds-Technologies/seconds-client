import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Switch from 'react-switch';
import { offIcon, onIcon, PATHS, PROVIDERS } from '../../../../../constants';
import streetStreamLogo from '../../../../../assets/img/streetstream-logo.svg';
import { useSelector } from 'react-redux';

const StreetStreamPanel = ({ wrapper, toggle }) => {
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);
	const history = useHistory();
	return (
		<div role='button' className={wrapper}>
			<div className='d-flex justify-content-end position-absolute p-3' style={{ zIndex: 100 }}>
				<Switch
					onColor={'#9FEA86'}
					checkedIcon={onIcon}
					uncheckedIcon={offIcon}
					onChange={() => toggle({ [PROVIDERS.STREET_STREAM]: !activeFleetProviders[PROVIDERS.STREET_STREAM] })}
					handleDiameter={19}
					checked={activeFleetProviders[PROVIDERS.STREET_STREAM]}
					className='switch-text'
				/>
			</div>
			<div
				onClick={() => history.push(PATHS.STREET_STREAM)}
				className='d-flex justify-content-center align-items-center bg-white border p-5 api-wrapper'
			>
				<img className='img-fluid' src={streetStreamLogo} alt='street stream logo' />
			</div>
		</div>
	);
};

StreetStreamPanel.propTypes = {
	
};

export default StreetStreamPanel;
