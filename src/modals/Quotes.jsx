import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import stuart from '../assets/img/stuart.svg';
import gophr from '../assets/img/gophr.svg';
import streetStream from '../assets/img/street-stream.svg';
import ecofleet from '../assets/img/ecofleet.svg';
import moment from 'moment';

const Quotes = ({quotes, show, toggleShow, selectFleetProvider, showConfirmDialog}) => {
	return (
		<Modal show={show} onHide={() => toggleShow(false)} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Fleet Provider Quotes</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>
					<table className='table'>
						<thead>
						<tr>
							<th scope='col'>Fleet Provider</th>
							<th scope='col'>
								Price
							</th>
							<th scope='col'>ETA</th>
							<th scope='col'>Vehicle</th>
							<th scope='col' />
						</tr>
						</thead>
						<tbody>
						{quotes.map(({ providerId, priceExVAT, dropoffEta, transport, createdAt }, index) => (
							<tr key={index}>
								<td className='col text-capitalize'>
									<img
										src={
											providerId === 'stuart'
												? stuart
												: providerId === 'gophr'
													? gophr
													: providerId === 'street_stream'
														? streetStream
														: ecofleet
										}
										alt=''
										className='me-3'
										width={25}
										height={25}
									/>
									<span className='text-capitalize'>{providerId.replace(/_/g, ' ')}</span>
								</td>
								<td className='col'>
									{priceExVAT ? `£${priceExVAT.toFixed(2)}` : 'N/A'}
								</td>
								<td className='col'>{dropoffEta ? `${moment(dropoffEta).diff(moment(createdAt), 'minutes')} minutes` : 'N/A'}</td>
								<td className='col text-capitalize'>{transport}</td>
								<td className='col'>
									<button
										className='d-flex justify-content-center align-items-center OrdersListEdit'
										onClick={() => {
											toggleShow(false);
											selectFleetProvider(providerId);
											showConfirmDialog(true);
										}}
									>
										<span className='text-decoration-none'>Select</span>
									</button>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</Modal.Body>
		</Modal>
	);
};

Quotes.propTypes = {
	quotes: PropTypes.array.isRequired,
	show: PropTypes.bool.isRequired,
	toggleShow: PropTypes.func.isRequired,
	selectFleetProvider: PropTypes.func.isRequired,
	showConfirmDialog: PropTypes.func.isRequired
};

export default Quotes;
