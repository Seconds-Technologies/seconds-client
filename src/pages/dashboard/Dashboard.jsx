import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import React, { useState } from "react";
import Map from '../../components/Map/Map';
import { useSelector } from 'react-redux';
import "./Dashboard.css";

export default function Dashboard() {
	const [options, setOptions] = useState(["Last 24 hrs", "Last Month", "Last Year"]);
	const { firstname, profileImageData } = useSelector(state => state["currentUser"].user)
	return (
		<div className='dashboard'>
			<div className='d-flex flex-row align-items-center px-4 pt-3'>
				<span className="fs-3">☀️&nbsp;</span>
				<span className='fs-5 pageName'><span className="fw-bold">{`Hey ${firstname},`}</span>&nbsp;here is your delivery overview today</span>
				{/*<div className='dropdown'>
					<button
						className='btn bg-white dropdown-toggle'
						type='button'
						id='dropdownMenuButton1'
						data-bs-toggle='dropdown'
						aria-expanded='false'
					>
						Last Week
					</button>
					<ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
						{options.map((item, index) => (
							<li key={index}>
								 eslint-disable-next-line jsx-a11y/anchor-is-valid
								<a className='dropdown-item' href='#'>
									{item}
								</a>
							</li>
						))}
					</ul>
				</div>*/}
			</div>
			<FeaturedInfo />
			<Map />
		</div>
	);
}
