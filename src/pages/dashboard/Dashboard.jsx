import Chart from "../../Components/chart/Chart";
import FeaturedInfo from "../../Components/featuredInfo/FeaturedInfo";
import "./Dashboard.css";
import { userData } from "../../dummyData";
import { useState } from "react";

export default function Dashboard() {

    const [options, setOptions] = useState(["Last 24 hrs", "Last Month", "Last Year"])
	return (
		<div className='dashboard'>
			<div className="d-flex flex-row justify-content-between align-items-center px-4 pt-3">
				<h3 className='pageName'>Order History</h3>
                <div className="dropdown">
                    <button className="btn bg-white dropdown-toggle" type="button" id="dropdownMenuButton1"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        Last Week
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        {options.map(item => <li><a className="dropdown-item" href="#">{item}</a></li>)}
                    </ul>
                </div>
			</div>
			<FeaturedInfo />
			<Chart data={userData} title='Graph View' grid dataKey='Orders per day' />
		</div>
	);
}
