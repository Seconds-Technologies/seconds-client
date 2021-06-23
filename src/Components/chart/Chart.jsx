import "./Chart.css";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Chart({ title, data, dataKey, grid }) {
	return (
		<div className='chart'>
			<div className="d-flex flex-row justify-content-between">
				<h3 className='chartTitle'>{title}</h3>
                <button className="coming-soon" disabled><span>Coming soon</span></button>
			</div>
			<ResponsiveContainer width='100%' aspect={4 / 1}>
				<LineChart data={data}>
					<XAxis dataKey='name' stroke='#555' />
					<YAxis />
					<Line type='monotone' dataKey={dataKey} stroke='#9400D3' />
					<Tooltip />
					{grid && <CartesianGrid />}
					<Legend />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
