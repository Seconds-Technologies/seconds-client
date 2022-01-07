import 'antd/dist/antd.css';
import React from 'react';
import logo from '../../assets/img/secondsapp.svg';
import { Link, useHistory } from 'react-router-dom';
import { PATHS } from '../../constants';
import logoutIcon from '../../assets/img/logout.svg';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Topbar.css';
import { logout } from '../../store/actions/auth';

export default function Topbar() {
	const { firstname, lastname, profileImageData } = useSelector(state => state['currentUser'].user);
	const history = useHistory();
	const dispatch = useDispatch();

	return (
		<nav className='navbar navbar-expand-md navbar-light sticky-top bg-white topbar ps-3'>
			<Link to='/' className='navbar-brand' href=''>
				<span className='logo'>
					<img src={logo} alt='' width={150} />
				</span>
			</Link>
			<div className='d-flex flex-grow-1 justify-content-end' id='profile'>
				<div className='navbar-text me-5 dropdown'>
					<div className='d-flex align-items-center' role='button' id='main-dropdown' data-bs-toggle='dropdown'>
						{profileImageData ? (
							<img
								className='border rounded-circle me-3'
								src={`data:image/jpeg;base64,${profileImageData}`}
								alt=''
								width={50}
								height={50}
							/>
						) : (
							<Avatar className='me-3' size='large' icon={<UserOutlined />} />
						)}
						<span className='fs-6 text-dark'>{firstname}&nbsp;</span>
						<span className='fs-6 text-dark'>{lastname}</span>
					</div>
					<ul className='dropdown-menu' aria-labelledby='main-dropdown'>
						<li>
							<div
								role="button"
								className='dropdown-item'
								onClick={() => history.push(PATHS.PROFILE)}
							>
								Profile
							</div>
						</li>
						<li>
							<div
								role="button"
								className='dropdown-item'
								onClick={() => {
									dispatch(logout());
									history.push(PATHS.LOGIN);
								}}
							>
								Logout
							</div>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
