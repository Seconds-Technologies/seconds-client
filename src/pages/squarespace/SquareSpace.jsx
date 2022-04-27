import React, { useEffect } from 'react';
import squarespaceLogo from '../../assets/img/squarespace-logo.png';
import { Formik } from 'formik';
import { PATHS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { connectSquarespace } from '../../store/actions/squarespace';
import { addError } from '../../store/actions/errors';

const SquareSpace = props => {
	const dispatch = useDispatch();
	const error = useSelector(state => state['errors']);
	const { isIntegrated, credentials } = useSelector(state => state['squarespaceStore']);
	const { email } = useSelector(state => state['currentUser'].user);

	useEffect(() => {
		const query = new URLSearchParams(props.location.search);
		console.log(query);
		if (query.get('code') && query.get('state')) {
			let code = query.get('code');
			let state = query.get('state');
			dispatch(connectSquarespace({ email, code, state }))
				.then(shop => console.log(shop))
				.catch(err => alert(err));
		} else if (query.get('error')) {
			dispatch(addError(query.get('error')));
		}
	}, [props.location]);

	return (
		<div className='page-container container-fluid d-flex pb-2'>
			<div className='m-auto'>
				{!isIntegrated ? (
					<h2 className='shopifyConnect'>Connect your Squarespace Store</h2>
				) : (
					<h2 className='shopifyConnect'>Your Squarespace store is now connected!</h2>
				)}
				<div className='d-flex flex-column align-items-center'>
					<img className='img-fluid d-block my-3' src={squarespaceLogo} alt='' width={250} />
					{error.message && (
						<div className='alert alert-danger alert-dismissible fade show' role='alert'>
							<span className='text-center'>{error.message}</span>
							<button type='button' className='btn btn-close' data-bs-dismiss='alert' aria-label='Close' />
						</div>
					)}
				</div>
				<div>
					{!isIntegrated ? (
						<Formik
							initialValues={{
								privateKey: ''
							}}
							onSubmit={values => console.log(values)}
						>
							{({
								values,
								errors,
								touched,
								handleChange,
								handleBlur,
								handleSubmit,
								isSubmitting
								/* and other goodies */
							}) => (
								<form
									method='POST'
									action={`${String(process.env.REACT_APP_SERVER_HOST)}/server/squarespace/authorize`}
								>
									<div className='mb-3'>
										<input type='hidden' name='email' value={email} />
										<label htmlFor='store-url' className='form-label'>
											Private Key
										</label>
										<input
											type='text'
											className='form-control rounded-3'
											id='private-key'
											name='privateKey'
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										<div id='shopHelp' className='form-text'>
											Follow the steps&nbsp;
											<a href='https://developers.squarespace.com/commerce-apis/authentication-and-permissions' target='_blank'>
												here
											</a>
											&nbsp;under the "Custom Applications" section to generate your key.
										</div>
									</div>
									<div className='text-center d-flex justify-content-around pt-3'>
										<button type='button' className='btn btn-secondary btn-lg shopifyButton' onClick={props.history.goBack}>
											Go Back
										</button>
										<button
											type='submit'
											className='btn btn-primary btn-lg d-flex justify-content-center align-items-center shopifyButton'
										>
											<span className='me-3'>Connect</span>
										</button>
									</div>
								</form>
							)}
						</Formik>
					) : (
						<div className='text-center pt-4'>
							<p className='lead'>Shop Name: {credentials.storeName}</p>
							<p className='lead'>Shop Domain: {credentials.domain}</p>
							<p className='lead'>Access Token: {credentials.accessToken}</p>
							<button className='mt-5 btn btn-lg btn-secondary shopifyButton' onClick={() => props.history.push(PATHS.INTEGRATE)}>
								Go Back
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SquareSpace;
