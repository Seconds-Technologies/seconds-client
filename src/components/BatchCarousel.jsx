import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import moment from 'moment';

const BatchCarousel = ({ show, onHide, orders }) => {
	const [index, setIndex] = useState(0);

	const handleSelect = (selectedIndex, e) => {
		setIndex(selectedIndex);
	};

	useEffect(() => {
		console.log(orders);
	}, [orders]);

	return (
		<Modal show={show} onHide={onHide} size='lg' centered style={{backgroundColor: 'transparent'}}>
			<Modal.Header closeButton>
				<Modal.Title>Unassigned orders</Modal.Title>
			</Modal.Header>
			<Carousel activeIndex={index} onSelect={handleSelect} indicators={true} variant="dark">
				{orders.map((order, index) => {
					return (
						<Carousel.Item key={index}>
							<div className="px-5 pt-3 pb-5 mx-5">
								<ul className='list-group list-group-flush bg-transparent'>
									<li className='list-group-item'>
										<h5 className='mb-1 text-capitalize'>Customer Name</h5>
										<div className='text-capitalize'>
											{order.dropoffFirstName} {order.dropoffLastName}
										</div>
									</li>
									<li className='list-group-item'>
										<h5 className='mb-1 text-capitalize'>Delivery Address</h5>
										<div className='text-capitalize'>
											{order.dropoffAddressLine1} {order.dropoffAddressLine2} {order.dropoffCity} {order.dropoffPostcode}
										</div>
									</li>
									<li className='list-group-item'>
										<h5 className='mb-1 text-capitalize'>Pickup From</h5>
										<div className='text-capitalize'>{moment(order.packagePickupStartTime).format('DD-MM-YYYY HH:mm')}</div>
									</li>
									<li className='list-group-item'>
										<h5 className='mb-1 text-capitalize'>Dropoff Until</h5>
										<div className='text-capitalize'>{moment(order.packageDropoffEndTime).format('DD-MM-YYYY HH:mm')}</div>
									</li>
									<li className='list-group-item'>
										<h5 className='mb-1 text-capitalize'>Status</h5>
										<div className='text-capitalize'>Unassigned</div>
									</li>
								</ul>
							</div>
						</Carousel.Item>
					);
				})}
			</Carousel>
		</Modal>
	);
};

BatchCarousel.propTypes = {};

export default BatchCarousel;
