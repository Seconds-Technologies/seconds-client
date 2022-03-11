import './Sidebar.css';
import orderIcon from '../../assets/img/orders1.svg';
import settingsIcon from '../../assets/img/settings.svg';
import dashboardIcon from '../../assets/img/dashboard.svg';
import createIcon from '../../assets/img/create1.svg';
import driversIcon from '../../assets/img/driver.svg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PATHS } from '../../constants';
import logo from '../../assets/img/secondsapp.svg';
import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { logout } from '../../store/actions/auth';

export default function Sidebar() {
	const { profileImageData } = useSelector(state => state['currentUser'].user);
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();

	return (
		<div className='sidebar bg-light'>
			<div className='mb-1 d-flex flex-column ps-3 pe-2'>
				<ul className='nav nav-pills flex-column mb-auto me-0'>
					<Link to='/' className='navbar-brand' href=''>
						<span className='logo'>
							<img src={logo} alt='' width={120} />
						</span>
					</Link>
					<Link to={PATHS.HOME} className='link text-black mt-3'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.HOME && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${location['pathname'] === PATHS.HOME && 'currentIcon'}`}
								src={dashboardIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Dashboard</div>
						</li>
					</Link>
					<Link to={PATHS.ORDERS} className='link text-black'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.ORDERS && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${location['pathname'] === PATHS.ORDERS && 'currentIcon'}`}
								src={orderIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Orders</div>
						</li>
					</Link>
					<Link to={PATHS.CREATE} className='link text-black'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.CREATE && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${location['pathname'] === PATHS.CREATE && 'currentIcon'}`}
								src={createIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Create</div>
						</li>
					</Link>
					<Link to={PATHS.DRIVERS} className='link text-black'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.DRIVERS && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${location['pathname'] === PATHS.DRIVERS && 'currentIcon'}`}
								src={driversIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Drivers</div>
						</li>
					</Link>
					<Link to={PATHS.SETTINGS} className='link text-black mt-4'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.SETTINGS && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${location['pathname'] === PATHS.SETTINGS && 'currentIcon'}`}
								src={settingsIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Settings</div>
						</li>
					</Link>
					<div className='link dropdown'>
						<div className='sidebarProfileItem' role='button' id='main-dropdown' data-bs-toggle='dropdown'>
							{profileImageData ? (
								<img
									className={`border rounded-circle me-3`}
									src={`data:image/jpeg;base64,${profileImageData}`}
									alt=''
									width={29}
									height={29}
								/>
							) : (
								<Avatar className={`ms-1 item-hover me-1 ${location['pathname'] === PATHS.PROFILE && 'currentIcon'}`} size={32} icon={<UserOutlined />} />
							)}
							<span className={`item-hover ${location['pathname'] === PATHS.PROFILE && 'currentLink'}`}>Profile</span>
						</div>
						<ul className='dropdown-menu' aria-labelledby='main-dropdown'>
							<li>
								<div
									role="button"
									className='dropdown-item'
									onClick={() => history.push(PATHS.SETTINGS)}
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
				</ul>
			</div>
		</div>
	);
}
