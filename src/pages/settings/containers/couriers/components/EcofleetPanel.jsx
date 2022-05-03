import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Switch from 'react-switch';
import { offIcon, onIcon, PATHS, PROVIDERS } from '../../../../../constants';
import ecofleetLogo from '../../../../../assets/img/ecofleet-logo.png';
import { useSelector } from 'react-redux';

const EcofleetPanel = ({ wrapper, toggle }) => {
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);
	const history = useHistory();
	return (
		<div role='button' className={wrapper}>
			<div className='d-flex justify-content-end position-absolute p-3' style={{ zIndex: 100 }}>
				<Switch
					onColor={'#9FEA86'}
					checkedIcon={onIcon}
					uncheckedIcon={offIcon}
					onChange={() => toggle({ [PROVIDERS.ECOFLEET]: !activeFleetProviders[PROVIDERS.ECOFLEET] })}
					handleDiameter={19}
					checked={activeFleetProviders[PROVIDERS.ECOFLEET]}
					className='switch-text'
				/>
			</div>
			<div
				onClick={() => history.push(PATHS.ECOFLEET)}
				className='d-flex justify-content-center align-items-center bg-white border p-5 api-wrapper'
			>
				<img className='img-fluid' width={175} src={ecofleetLogo} alt='ecofleet logo' />
			</div>
		</div>
	);
};

EcofleetPanel.propTypes = {
	
};

export default EcofleetPanel;
