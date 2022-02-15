import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import stuart from '../../../assets/img/stuart.svg';
import gophr from '../../../assets/img/gophr.svg';
import streetStream from '../../../assets/img/street-stream.svg';
import ecofleet from '../../../assets/img/ecofleet.svg';
import { PROVIDERS } from '../../../constants';

const Item = ({ label, value, type, styles }) => {

	const courierLogo = useCallback(() => {
		switch (value) {
			case PROVIDERS.STUART:
				return stuart;
			case PROVIDERS.GOPHR:
				return gophr;
			case PROVIDERS.STREET_STREAM:
				return streetStream
			case PROVIDERS.ECOFLEET:
				return ecofleet;
			default:
				return null;
		}
	}, [type]);

	return (
		<div className={`${styles} d-flex flex-column`}>
			<span className='fs-6 fw-bold text-primary'>{label}</span>
			{type === 'image' ? (
				<img src={courierLogo()} alt={value} width={50} height={50} />
			) : (
				<span className='text-capitalize' style={{ fontSize: 18 }}>
					{value}
				</span>
			)}
		</div>
	);
};

Item.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	type: PropTypes.string
};

export default Item;
