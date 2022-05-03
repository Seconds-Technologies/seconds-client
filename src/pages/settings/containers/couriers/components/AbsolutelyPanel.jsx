import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Switch from 'react-switch';
import { offIcon, onIcon, PATHS, PROVIDERS } from '../../../../../constants';
import absolutelyLogo from '../../../../../assets/img/absolutely-brand.svg';
import { useSelector } from 'react-redux';

const AbsolutelyPanel = ({ wrapper, toggle }) => {
	const { activeFleetProviders } = useSelector(state => state['settingsStore']);
	const history = useHistory();
	return (
		<div role='button' className={wrapper}>
			<div className='d-flex justify-content-end position-absolute p-3' style={{ zIndex: 100 }}>
				<Switch
					onColor={'#9FEA86'}
					checkedIcon={onIcon}
					uncheckedIcon={offIcon}
					onChange={() => toggle({ [PROVIDERS.ABSOLUTELY]: !activeFleetProviders[PROVIDERS.ABSOLUTELY] })}
					handleDiameter={19}
					checked={activeFleetProviders[PROVIDERS.ABSOLUTELY]}
					className='switch-text'
					disabled
				/>
			</div>
			<div
				onClick={() => history.push(PATHS.ABSOLUTELY)}
				className='d-flex justify-content-center align-items-center bg-white border p-5 api-wrapper'
			>
				<img className='img-fluid' src={absolutelyLogo} alt='Absolutely courier logo' />
			</div>
		</div>
	);
};

AbsolutelyPanel.propTypes = {};

export default AbsolutelyPanel;
