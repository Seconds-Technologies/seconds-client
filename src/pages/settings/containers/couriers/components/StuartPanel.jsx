import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Switch from 'react-switch';
import { INTEGRATIONS, PATHS, PROVIDERS } from '../../../../../constants';
import stuartLogo from '../../../../../assets/img/stuart-logo.png';
import { useSelector } from 'react-redux';
import { offIcon, onIcon } from '../../../../../constants/elements';

const StuartPanel = ({ wrapper, toggle }) => {
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);
	const history = useHistory();
	return (
		<div role='button' className={wrapper}>
			<div className='d-flex justify-content-end position-absolute p-3' style={{ zIndex: 100 }}>
				<Switch
					onColor={'#9FEA86'}
					checkedIcon={onIcon}
					uncheckedIcon={offIcon}
					onChange={() => toggle({ [PROVIDERS.STUART]: !activeFleetProviders[PROVIDERS.STUART] })}
					handleDiameter={19}
					checked={activeFleetProviders[PROVIDERS.STUART]}
					className='switch-text'
				/>
			</div>
			<div
				onClick={() => history.push(PATHS.STUART)}
				className='d-flex justify-content-center align-items-center bg-white border p-5 api-wrapper'
			>
				<img className='img-fluid' src={stuartLogo} alt='square logo' />
			</div>
		</div>
	);
};

StuartPanel.propTypes = {
	
};

export default StuartPanel;
