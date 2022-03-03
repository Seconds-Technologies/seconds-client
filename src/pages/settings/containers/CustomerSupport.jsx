import React, { useEffect } from 'react';
import telephone from '../../../assets/img/telephone.svg';
import mail from '../../../assets/img/mail.svg';
import { Mixpanel } from '../../../config/mixpanel';

const CustomerSupport = props => {
	useEffect(() => {
		Mixpanel.people.increment('page_views');
	}, [props.location]);

	return (
		<div className='page-container bg-light py-lg-5 py-md-5 py-4'>
			<div className='container-fluid py-5'>
				<div className='row pb-3 text-center'>
					<div className='col'>
						<p className='display-4 fw-bold fw-bolder'>Need help with an order?</p>
					</div>
				</div>
				<div className='row pb-3 text-center'>
					<div className='col'>
						<p className='text-muted h3'>Chat with us via telephone or email</p>
					</div>
				</div>
				<hr className='my-5 mx-5' />
				<div className='d-flex justify-content-center align-items-center'>
					<div>
						<table className='table table-borderless align-middle'>
							<tbody className=''>
							<tr className='d-flex my-3'>
								<td>
									<div>
										<img src={telephone} alt='' />
									</div>
								</td>
								<td>
									<span className='h3 help-text'>+447895254476</span>
								</td>
							</tr>
							<tr className='d-flex my-3'>
								<td>
									<img src={mail} alt='' />
								</td>
								<td>
									<span className='h3 help-text'>secondsdelivery@gmail.com</span>
								</td>
							</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

CustomerSupport.propTypes = {};

export default CustomerSupport;
