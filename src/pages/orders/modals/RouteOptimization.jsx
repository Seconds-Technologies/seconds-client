import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useSelector } from 'react-redux';

const RouteOptimization = ({ show, onHide, orders }) => {
	const [driverName, setDriver] = useState([]);
	const [breaks, addBreak] = useState([]);
	const drivers = useSelector(state => state['driversStore']);
	const [breakParams, setBreakParams] = useState({
		start: '',
		end: '',
		duration: ''
	});

	const handleDelete = id => alert('lool');
	const handleChange = event => {
		const {
			target: { value }
		} = event;
		setDriver(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value
		);
	};

	return (
		<Modal show={show} onHide={onHide} centered size='lg'>
			<div className='container-fluid p-4'>
				<div className='d-flex justify-content-between mb-3'>
					<h1>{`You have selected to optimize ${orders.length} routes`}</h1>
					<button type='button' className='btn-close shadow-none' aria-label='Close' onClick={onHide} />
				</div>
				<div className='row gy-4'>
					<div className='col-6'>
						<label htmlFor=''>Start from</label>
						<input
							disabled={false}
							defaultValue={moment().format('HH:mm')}
							name='startTime'
							id='start-time'
							type='time'
							className='form-control form-border rounded-3'
							aria-label='start-time'
							min={'07:30'}
							max={'21:00'}
						/>
					</div>
					<div className='col-6'>
						<label htmlFor=''>End at</label>
						<input
							disabled={false}
							defaultValue={moment().format('HH:mm')}
							name='endTime'
							id='end-time'
							type='time'
							className='form-control form-border rounded-3'
							aria-label='end-time'
							min={'07:30'}
							max={'21:00'}
						/>
					</div>
					<div className='col-6'>
						<h2 className='fs-6'>Specify break periods</h2>
						<p>These are the allocated time slots that drivers can take breaks during their job</p>
						<div className='w-100'>
							<TextField
								helperText="Enter a useful name for the break period e.g. 'lunch time'"
								id='standard-basic'
								label='Name'
								variant='standard'
								onChange={e => setBreakParams(prevState => ({ ...prevState, name: e.target.value }))}
							/>
							<div className='d-flex justify-content-center flex-row mb-2'>
								<div className='d-flex flex-column flex-grow-1 me-2'>
									<label htmlFor=''>Start</label>
									<input
										name='breakStartTime'
										className='form-control form-control-sm rounded-3'
										type='time'
										aria-label='default input example'
										onChange={e => setBreakParams(prevState => ({ ...prevState, start: e.target.value }))}
									/>
								</div>
								<div className='d-flex flex-column flex-grow-1 ms-2'>
									<label htmlFor=''>End</label>
									<input
										name='breakEndTime'
										className='form-control form-control-sm rounded-3'
										type='time'
										aria-label='default input example'
										onChange={e => setBreakParams(prevState => ({ ...prevState, end: e.target.value }))}
									/>
								</div>
							</div>
						</div>
						<div className='d-flex justify-content-between align-items-center'>
							<div>
								<label htmlFor=''>Duration (mins)</label>
								<input
									className='form-control form-control-sm rounded-3 w-50'
									min={0}
									max={60}
									type='number'
									onChange={e => setBreakParams(prevState => ({ ...prevState, duration: e.target.value }))}
									aria-label='default input example'
								/>
							</div>
							<button className='btn btn-sm btn-outline-primary' onClick={() => addBreak(prevState => [...prevState, breakParams])}>
								<span>Add</span>
							</button>
						</div>
					</div>
					<div className='col-6'>
						<h2 className='fs-6'>Select driver and vehicle</h2>
						<p>You will be able to assign the optimised orders to drivers with your desired vehicle type</p>
						<FormControl sx={{ m: 1, width: 300 }}>
							<InputLabel id='multiple-checkbox-label'>Select</InputLabel>
							<Select
								labelId='multiple-checkbox-label'
								id='multiple-checkbox'
								multiple
								value={driverName}
								onChange={handleChange}
								input={<OutlinedInput label='Select' />}
								renderValue={selected => selected.join(', ')}
							>
								{drivers.map(({ id, firstname, lastname }) => {
									const name = `${firstname} ${lastname}`;
									return (
										<MenuItem key={id} value={name}>
											<Checkbox checked={driverName.indexOf(name) > -1} />
											<ListItemText primary={name} />
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
						<div className='my-3'>
							<h2 className='fs-6'>Optimisation objective</h2>
							<div>
								<div className='form-check'>
									<input
										defaultChecked={true}
										className='form-check-input'
										type='checkbox'
										name='courierSelectionCriteria'
										id='criteria-radio-1'
									/>
									<label className='form-check-label' htmlFor='exampleRadios1'>
										Minimise drive time
									</label>
								</div>
								<div className='form-check'>
									<input
										defaultChecked={false}
										className='form-check-input'
										type='checkbox'
										name='courierSelectionCriteria'
										id='criteria-radio-2'
									/>
									<label className='form-check-label' htmlFor='exampleRadios2'>
										Arrive on time
									</label>
								</div>
								<div className='form-check'>
									<input
										defaultChecked={false}
										className='form-check-input'
										type='checkbox'
										name='courierSelectionCriteria'
										id='criteria-radio-3'
									/>
									<label className='form-check-label' htmlFor='exampleRadios3'>
										Minimise cost
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='d-flex align-items-end justify-content-between'>
					<div className='d-flex flex-row mt-3 flex-wrap'>
						{breaks.map(item => (
							<Chip label={`${item.start} - ${item.end} (${item.duration} mins)`} onDelete={handleDelete} className='me-2 mb-2' />
						))}
					</div>
					<button className='btn btn-lg btn-primary' style={{ width: 130 }}>
						<span>Proceed</span>
					</button>
				</div>
			</div>
		</Modal>
	);
};

RouteOptimization.propTypes = {};

export default RouteOptimization;
