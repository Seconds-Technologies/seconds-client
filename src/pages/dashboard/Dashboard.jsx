import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import React, { useState } from "react";
import Map from '../../components/Map/Map';
import { useSelector } from 'react-redux';
import "./Dashboard.css";

export default function Dashboard() {
	const [options, setOptions] = useState(["Last 24 hrs", "Last Month", "Last Year"]);
	const { firstname } = useSelector(state => state["currentUser"].user)

	return (
		<div className='dashboard bg-light'>
			<div className='d-flex flex-column justify-content-center px-4 pt-3'>
				<span className="dashboard-header mb-3">Dashboard</span>
				<span className='fs-5'><span className="bold-text">{`Hey ${firstname},`}</span>&nbsp;here is your delivery overview today</span>
			</div>
			<FeaturedInfo />
			<Map />
		</div>
	);
}
