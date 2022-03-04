import React, { useState } from 'react';
import './developers.css'
import ApiKey from './ApiKey';
import { useSelector } from 'react-redux';

const Developers = props => {
	const [show, setShowApiKey] = useState(false);
	const { apiKey } = useSelector(state => state['currentUser'].user)
	return (
		<div className='container-fluid p-3'>
			<ApiKey show={show} onHide={() => setShowApiKey(false)} apiKey={apiKey}/>
			<div className='row'>
				<div className='col'>
					<h1 className='fs-2 dev-header'>API Key</h1>
					<p className="text-muted">
						You can use this API key to authenticate your own services with Seconds and run a workflow. When you generate a new API key,
						it will revoke any AKI key you previously generated. You also will only be able to see the key once, so be sure to copy it
						immediately.
					</p>
					<button className="btn btn-primary" onClick={() => setShowApiKey(true)}>View API Key</button>
				</div>
				<div className='col'>
					<h1 className='fs-2 dev-header'>Documentation</h1>
					<p>Use the documentation to connect our API to your service.</p>
					<a href="https://docs.useseconds.com/" target="_blank" role="button" className="btn btn-primary">Go To Documentation</a>
				</div>
			</div>
		</div>
	);
};

Developers.propTypes = {};

export default Developers;
