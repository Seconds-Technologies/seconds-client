import React from 'react';
import  { Button } from 'react-bootstrap';
import './NewOrder.css';
import '../../App.css';

const NewOrder = props => {
	return (
		<div className='newOrder container py-4'>
			<form className='row mx-3 align-items-center'>
				<div className='col-6 d-flex flex-column'>
					<h4>Pickup</h4>
					<div className='border border-2 rounded-3 p-4'>
						<input
							type='text'
							className='form-control my-3'
							placeholder='Business Name'
							aria-label='business-name'
						/>
						<input
							type='text'
							className='form-control my-3'
							placeholder='Business Address'
							aria-label='business-address'
						/>
						<div className='row'>
							<div className='col-6'>
								<input type='text' className='form-control my-2' placeholder='Date' aria-label='date' />
							</div>
							<div className='col-6'>
								<input
									type='text'
									className='form-control my-2'
									placeholder='Pickup at'
									aria-label='pickup-time'
								/>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<input
									type='text'
									className='form-control my-2'
									placeholder='Order Id'
									aria-label='order-id'
								/>
							</div>
							<div className='col-6'>
								<input
									type='text'
									className='form-control my-2'
									placeholder='Phone Number'
									aria-label='phone-number'
								/>
							</div>
						</div>
						<textarea
							className='form-control my-3'
							placeholder='Pickup Instructions'
							aria-label='pickup-instructions'
						/>
					</div>
				</div>
				<div className='col-6 d-flex flex-column'>
					<h4>Dropoff</h4>
					<div className='border border-2 rounded-3 p-4'>
						<input
							type='text'
							className='form-control my-3'
							placeholder='Customer Name'
							aria-label='customer-name'
						/>
						<input
							type='text'
							className='form-control my-3'
							placeholder='Customer Address'
							aria-label='customer-address'
						/>
						<div className='row'>
							<div className='col-6'>
								<input type='text' className='form-control my-2' placeholder='Date' aria-label='date' />
							</div>
							<div className='col-6'>
								<input
									type='text'
									className='form-control my-2'
									placeholder='Drop off at'
									aria-label='dropoff-time'
								/>
							</div>
						</div>
						<div className='row'>
							<div className='col-6'>
								<input
									type='text'
									className='form-control my-2'
									placeholder='Order Id'
									aria-label='order-id'
								/>
							</div>
							<div className='col-6'>
								<input
									type='text'
									className='form-control my-2'
									placeholder='Phone Number'
									aria-label='phone-number'
								/>
							</div>
						</div>
						<textarea
							className='form-control my-3'
							placeholder='Dropoff notes'
							aria-label='dropoff-instructions'
						/>
					</div>
				</div>
				<div className='d-flex pt-5 justify-content-end'>
					<style type='text/css'>
						{`
						.btn-submit {
                            background-color: #9400d3;
						}
						.btn-xl {
							padding: 1rem 1rem
						}
					`}
					</style>
					<Button variant='dark' size='lg' className="mx-3">
						Get Quote
					</Button>
					<Button className="text-light" variant='submit' type='submit' size='lg' onSubmit={() => console.log('Submitted!')}>
						Confirm
					</Button>
				</div>
			</form>
		</div>
	);
};

export default NewOrder;
