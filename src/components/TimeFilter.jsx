import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TimeFilter = ({
	current,
	onSelect,
	initialOptions = [
		{
			id: 'day',
			name: 'Last 24 hrs'
		},
		{
			id: 'week',
			name: 'Last Week'
		},
		{
			id: 'month',
			name: 'Last Month'
		},
		{
			id: 'year',
			name: 'Last Year'
		}
	]
}) => {
	const [options] = useState(initialOptions);
	return (
		<div className='dropdown'>
			<button
				className='btn bg-white dropdown-toggle border border-1 border-grey'
				type='button'
				id='dropdownMenuButton1'
				data-bs-toggle='dropdown'
				aria-expanded='false'
			>
				{current.name}
			</button>
			<ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
				{options.map(
					({ id, name }, index) =>
						id !== current.id && (
							<li key={index} role='button'>
								{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
								<div className='dropdown-item' onClick={() => onSelect({ id, name })}>
									{name}
								</div>
							</li>
						)
				)}
			</ul>
		</div>
	);
};

TimeFilter.propTypes = {
	current: PropTypes.object.isRequired,
	onSelect: PropTypes.func.isRequired
};

export default TimeFilter;
