import orderIcon from '../../img/orders1.svg';
import integrateIcon from '../../img/integrate.svg';
import settingsIcon from '../../img/settings.svg';
import dashboardIcon from '../../img/dashboard.svg';
import createIcon from '../../img/create1.svg';
import trackIcon from '../../img/track1.svg';
import logoutIcon from '../../img/logout.svg';
import codeIcon from '../../img/developer.svg';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { logout } from '../../store/actions/auth';
import { useDispatch } from 'react-redux';
import { PATHS } from '../../constants';
import './Sidebar.css';

export default function Sidebar() {
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
	console.log('Location', location);
	return (
		<div className='sidebar'>
			<div className='mb-1 d-flex flex-column flex-shrink-0 ps-3 pe-2'>
				<ul className='nav nav-pills flex-column mb-auto'>
					<Link to={PATHS.HOME} className='link text-black mt-3'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.HOME && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.HOME && 'currentIcon'
								}`}
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
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.ORDERS && 'currentIcon'
								}`}
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
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.CREATE && 'currentIcon'
								}`}
								src={createIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Create</div>
						</li>
					</Link>
					<Link to={PATHS.TRACK} className='link text-black'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.TRACK && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.TRACK && 'currentIcon'
								}`}
								src={trackIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Track</div>
						</li>
					</Link>
					<Link to={PATHS.INTEGRATE} className='link text-black mt-4'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.INTEGRATE && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.INTEGRATE && 'currentIcon'
								}`}
								src={integrateIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Integration</div>
						</li>
					</Link>
					<a
						href='https://seconds.stoplight.io/docs/seconds-api/ZG9jOjMyNzk0NA-introduction'
						target='_blank'
						className='link text-black'
					>
						<li className='sidebarListItem'>
							<img className={`sidebarIcon item-hover`} src={codeIcon} width={25} height={25} alt={''} />
							<div className='item-hover'>Developers</div>
						</li>
					</a>
					<Link to={PATHS.SETTINGS} className='link text-black mt-4'>
						<li className={`sidebarListItem ${location['pathname'] === PATHS.SETTINGS && 'currentLink'}`}>
							<img
								className={`sidebarIcon item-hover ${
									location['pathname'] === PATHS.SETTINGS && 'currentIcon'
								}`}
								src={settingsIcon}
								alt={''}
								width={25}
								height={25}
							/>
							<div className='item-hover'>Settings</div>
						</li>
					</Link>
					<a
						onClick={() => {
							dispatch(logout());
							history.push('/login');
						}}
						className='link pe-2'
					>
						<div className='sidebarListItem'>
							<img className='sidebarIcon item-hover' src={logoutIcon} alt='' />
							<div className='item-hover'>Log Out</div>
						</div>
					</a>
				</ul>
			</div>
		</div>
	);
}
