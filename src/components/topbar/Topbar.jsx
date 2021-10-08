import 'antd/dist/antd.css';
import React from 'react';
import logo from '../../img/secondsapp.svg';
import { Link, useHistory } from 'react-router-dom';
import { PATHS } from '../../constants';
import { useSelector } from 'react-redux';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Topbar.css';

export default function Topbar() {
	const { firstname, lastname, profileImageData } = useSelector(state => state['currentUser'].user);
	const history = useHistory();

	return (
		<nav className='navbar navbar-expand-md navbar-light sticky-top bg-white topbar'>
			<div className='container-fluid d-flex ms-3'>
				<Link to='/' className='navbar-brand' href=''>
					<span className='logo'>
						<img src={logo} alt='' />
					</span>
				</Link>
			</div>
			<div className='collapse navbar-collapse' id='profile'>
				<div className='navbar-text me-5' onClick={() => history.push(PATHS.PROFILE)}>
					<div className='d-flex align-items-center' role='button'>
						{profileImageData ? (
							<img
								className='border rounded-circle me-3'
								src={`data:image/jpeg;base64,${profileImageData}`}
								alt=''
								width={50}
								height={50}
							/>
						) : (
							<Avatar className="me-3" size="large" icon={<UserOutlined />} />
						)}
						<span className='profile-text fs-6 text-dark'>{firstname}&nbsp;</span>
						<span className='profile-text fs-6 text-dark'>{lastname}</span>
					</div>
				</div>
			</div>
		</nav>
	);
}
