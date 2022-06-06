import React from 'react';
import PropTypes from 'prop-types';
import { INTEGRATIONS, PATHS } from '../../../../../constants';
import Switch from 'react-switch';
import hubriseLogo from '../../../../../assets/img/hubrise-logo.png';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { offIcon, onIcon } from '../../../../../constants/elements';

const HubrisePanel = ({ wrapper, toggle }) => {
	const { isActive, isIntegrated } = useSelector(state => state['hubriseStore']);
	const history = useHistory();
	return (
		<div role='button' className={wrapper}>
			<div className='d-flex justify-content-end position-absolute p-3' style={{zIndex: 100}}>
				<Switch
					onColor={'#9FEA86'}
					checkedIcon={onIcon}
					uncheckedIcon={offIcon}
					onChange={(checked, e) => {
						e.stopPropagation();
						toggle({ platform: INTEGRATIONS.HUBRISE, status: !isActive })
					}}
					handleDiameter={19}
					checked={isActive}
					className='switch-text'
					disabled={!isIntegrated}
				/>
			</div>
			<div onClick={() => history.push(PATHS.HUBRISE)} className='d-flex justify-content-center align-items-center bg-white border p-5 api-wrapper'>
				<img className='img-fluid' width={300} src={hubriseLogo} alt='square logo' />
			</div>
		</div>
	);
};

HubrisePanel.propTypes = {
	wrapper: PropTypes.string.isRequired,
	toggle: PropTypes.func.isRequired
};

export default HubrisePanel;
