import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { InfinitySpin } from 'react-loader-spinner';

const Loading = React.forwardRef(({ show, onHide }, ref) => {
	return (
		<Modal centered show={show} container={ref} onHide={onHide} size='lg' aria-labelledby='example-custom-modal-styling-title' >
			<div className='container d-flex flex-column align-items-center justify-content-center py-5'>
				<InfinitySpin color='grey' width={200}/>
				<span>Optimizing</span>
			</div>
		</Modal>
	);
});

Loading.propTypes = {};

export default Loading;
