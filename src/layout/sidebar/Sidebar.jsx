import './Sidebar.css';
import orderIcon from '../../assets/img/orders.svg';
import settingsIcon from '../../assets/img/settings.svg';
import dashboardIcon from '../../assets/img/dashboard.svg';
import createIcon from '../../assets/img/create.svg';
import driversIcon from '../../assets/img/driver.svg';
import analyticsIcon from '../../assets/img/analytics.svg';
import defaultAvatar from '../../assets/img/profile-avatar.svg';
import bellIcon from '../../assets/img/bell.svg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PATHS } from '../../constants';
import logo from '../../assets/img/logo.svg';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { logout } from '../../store/actions/auth';
import { useNotifications } from '@magicbell/magicbell-react';
import { FloatingNotificationInbox } from '@magicbell/magicbell-react';
import Badge from '@mui/material/Badge';
import styled from '@mui/material/styles/styled';

export default function Sidebar() {
	const [isOpen, setAlerts] = useState(false);
	const { profileImageData } = useSelector(state => state['currentUser'].user);
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
	const launcherRef = useRef(null);
	const notificationStore = useNotifications();

	const StyledBadge = styled(Badge)(({ theme }) => ({
		'& .MuiBadge-badge': {
			right: 19,
			top: 2
		}
	}));

	const isSettings = useMemo(() => {
		return [PATHS.SETTINGS, PATHS.INTEGRATE, PATHS.SHOPIFY, PATHS.HUBRISE, PATHS.WOOCOMMERCE, PATHS.SQUARESPACE, PATHS.SQUARE].includes(
			location['pathname']
		);
	}, [location]);

	const isOrder = useMemo(() => {
		return [PATHS.ORDERS, PATHS.VIEW_ORDER].some(path => location['pathname'].includes(path));
	}, [location]);

	return (
		<div ref={launcherRef} className='sidebar-container bg-light'>
			<div className='mb-1 d-flex flex-column ps-3 pe-2'>
				<ul className='nav nav-pills flex-column mb-auto me-0'>
					<Link to={PATHS.HOME} className='navbar-brand mt-3
					 ' href='src/layout/sidebar/Sidebar'>
						<img src={logo} alt='' width={35} height={35} />
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
						</li>
					</Link>
					<Link to={PATHS.ORDERS} className='link text-black'>
						<li className={`sidebarListItem ${isOrder && 'currentLink'}`}>
							<img className={`sidebarIcon item-hover ${isOrder && 'currentIcon'}`} src={orderIcon} alt={''} width={25} height={25} />
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
						</li>
					</Link>
					<Link to={PATHS.ANALYTICS} className='link text-black'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.ANALYTICS && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${location['pathname'] === PATHS.ANALYTICS && 'currentIcon'}`}
								src={analyticsIcon}
								alt={''}
								width={25}
								height={25}
							/>
						</li>
					</Link>
					<div className='link text-black' onClick={() => setAlerts(true)}>
						<li className={`sidebarListItem`}>
							<FloatingNotificationInbox
								isOpen={isOpen}
								toggle={() => setAlerts(!isOpen)}
								width={350}
								height={500}
								isheight={500}
								launcherRef={launcherRef.current}
							/>
							<StyledBadge
								variant='dot'
								overlap='circular'
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right'
								}}
								showZero={false}
								badgeContent={notificationStore.unreadCount}
								color='secondary'
							>
								<img className={`sidebarIcon item-hover`} src={bellIcon} alt={''} width={25} height={25} />
							</StyledBadge>
						</li>
					</div>
					<Link to={PATHS.SETTINGS} className='link text-black'>
						<li className={`sidebarListItem ${isSettings && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${isSettings && 'currentIcon'}`}
								src={settingsIcon}
								alt={''}
								width={25}
								height={25}
							/>
						</li>
					</Link>
					<div className='link dropdown' style={{ zIndex: 10000000 }}>
						<div className='sidebarProfileItem' role='button' id='main-dropdown' data-bs-toggle='dropdown' style={{ zIndex: 10000000 }}>
							{profileImageData ? (
								<img
									className={`border rounded-circle sidebarIcon`}
									src={`data:image/jpeg;base64,${profileImageData}`}
									alt=''
									width={26}
									height={26}
								/>
							) : (
								<img className={`sidebarIcon`} src={defaultAvatar} alt='' width={26} height={26} style={{ zIndex: 10000000 }} />
							)}
						</div>
						<ul className='dropdown-menu' aria-labelledby='main-dropdown' style={{ zIndex: 10000000 }}>
							<li>
								<div role='button' className='dropdown-item' onClick={() => history.push(PATHS.SETTINGS)}>
									Profile
								</div>
							</li>
							<li>
								<div
									role='button'
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
