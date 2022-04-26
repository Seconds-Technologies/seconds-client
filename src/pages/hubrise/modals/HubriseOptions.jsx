import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Formik } from 'formik';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { BsInfoCircle } from 'react-icons/bs';
import Switch from 'react-switch';

const onIcon = <div className='switch-icon'>On</div>;
const offIcon = <div className='switch-icon'>Off</div>;

const HubriseOptions = ({ show, centered, onHide, onSubmit }) => {
	return (
		<Modal show={show} onHide={onHide} centered={centered} size='lg'>
			<Modal.Header closeButton>
				<Modal.Title>Hubrise Workflow</Modal.Title>
			</Modal.Header>
			<Modal.Body className='d-flex justify-content-center align-items-center border-0'>
				<Formik
					initialValues={{
						triggers: {
							enabled: false
						}
					}}
					onSubmit={onSubmit}
				>
					{({ values, errors, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
						<form onSubmit={handleSubmit} className='container w-100'>
							<div>
								<h1 className='workflow-header fs-5'>Enable Triggers</h1>
								<p className='text-muted'>Set which order statuses / service types should trigger deliveries to be created</p>
								<div className='d-flex flex-grow-1 align-items-center'>
									<Switch
										onColor={'#9FEA86'}
										checkedIcon={onIcon}
										uncheckedIcon={offIcon}
										onChange={() => setFieldValue('triggers.enabled', !values.triggers.enabled)}
										handleDiameter={19}
										checked={values.triggers.enabled}
										className='switch-text'
									/>
								</div>
							</div>
							<div className='d-flex align-items-center'>
								<header className='my-3'>
									<span className='me-2 workflow-header fs-6'>Customize triggers</span>
								</header>
								<Tooltip
									title='Set which order statuses / service types should trigger deliveries to be created'
									placement='right-start'
								>
									<IconButton size='small'>
										<BsInfoCircle />
									</IconButton>
								</Tooltip>
							</div>
							<div className='row mb-3'>
								<label htmlFor='' className='col-sm-4 col-form-label'>
									Service Type Ref
								</label>
								<div className='col-sm-8'>
									<input type='text' className='form-control' />
								</div>
							</div>
							<div className='row mb-3'>
								<label htmlFor='' className='col-sm-4 col-form-label'>
									Order statuses
								</label>
								<div className='col-sm-8'>
									<input type='text' className='form-control' />
								</div>
							</div>
						</form>
					)}
				</Formik>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='secondary' onClick={onHide}>
					Cancel
				</Button>
				<Button type='submit'>Confirm</Button>
			</Modal.Footer>
		</Modal>
	);
};

HubriseOptions.propTypes = {
	show: PropTypes.bool.isRequired,
	onHide: PropTypes.func.isRequired,
	centered: PropTypes.bool
};

export default HubriseOptions;
