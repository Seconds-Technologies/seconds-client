import React, { useContext, useMemo, useState } from 'react';
import './developers.css'
import ApiKey from './ApiKey';
import { useSelector } from 'react-redux';
import { KanaContext } from '../../../../context';
import useKana from '../../../../hooks/useKana';

const Developers = props => {
	const [show, setShowApiKey] = useState(false);
	const kana = useContext(KanaContext)
	const [features, error] = useKana(kana);
	const { apiKey } = useSelector(state => state['currentUser'].user)

	const isDisabled = useMemo(() => {
		return features ? Boolean(!features.apiIntegration) : true
	}, [features])

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
					<button className="btn btn-primary" onClick={() => setShowApiKey(true)} disabled={isDisabled}>View API Key</button>
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
