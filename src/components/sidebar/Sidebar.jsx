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
			<div className='sidebarMenu d-flex flex-column flex-shrink-0 ps-3 pe-2'>
				<ul className='nav nav-pills flex-column mb-auto'>
					<Link to={PATHS.HOME} className='link text-black'>
						<li
							className={`sidebarListItem text-black ${
								location['pathname'] === PATHS.HOME && 'currentLink'
							}`}
						>
							<img className={`sidebarIcon`} src={dashboardIcon} alt={''} width={25} height={25} />
							<div className='sidebarText'>Dashboard</div>
						</li>
					</Link>
					<Link to={PATHS.ORDERS} className='link text-black'>
						<li
							className={`sidebarListItem text-black ${
								location['pathname'] === PATHS.ORDERS && 'currentLink'
							}`}
						>
							<img className={`sidebarIcon`} src={orderIcon} alt={''} width={25} height={25} />
							<div className='sidebarText'>Orders</div>
						</li>
					</Link>
					<Link to={PATHS.CREATE} className='link text-black'>
						<li
							className={`sidebarListItem text-black ${
								location['pathname'] === PATHS.CREATE && 'currentLink'
							}`}
						>
							<img className={`sidebarIcon`} src={createIcon} alt={''} width={25} height={25}/>
							<div className='sidebarText'>Create</div>
						</li>
					</Link>
					<Link to={PATHS.TRACK} className='link text-black'>
						<li
							className={`sidebarListItem text-black ${
								location['pathname'] === PATHS.TRACK && 'currentLink'
							}`}
						>
							<img className={`sidebarIcon`} src={trackIcon} alt={''} width={25} height={25} />
							<div className='sidebarText'>Track</div>
						</li>
					</Link>
					<Link to={PATHS.INTEGRATE} className='link text-black'>
						<li
							className={`sidebarListItem text-black ${
								location['pathname'] === PATHS.INTEGRATE && 'currentLink'
							}`}
						>
							<img className={`sidebarIcon`} src={integrateIcon} alt={''} width={25} height={25} />
							<div className='sidebarText'>Integration</div>
						</li>
					</Link>
					<a href="https://seconds.stoplight.io/docs/seconds-api/ZG9jOjMyNzk0NA-introduction" target="_blank" className='link text-black'>
						<li
							className={`sidebarListItem text-black ${
								location['pathname'] === PATHS.DOCUMENTATION && 'currentLink'
							}`}
						>
							<img className={`sidebarIcon`} src={codeIcon} width={20} height={20} alt={''} />
							<div className='sidebarText'>Developers</div>
						</li>
					</a>
					<Link to={PATHS.SETTINGS} className='link text-black'>
						<li
							className={`sidebarListItem text-black ${
								location['pathname'] === PATHS.SETTINGS && 'currentLink'
							}`}
						>
							<img className={`sidebarIcon`} src={settingsIcon} alt={''} width={25} height={25}/>
							<div className='sidebarText'>Settings</div>
						</li>
					</Link>
				</ul>
				<hr />
			</div>
			<div className='d-flex flex-grow-1 align-items-center'>
				<a
					onClick={() => {
						dispatch(logout());
						history.push('/login');
					}}
					className='link ps-3 pe-2'
				>
					<div className='sidebarListItem1'>
						<img className='sidebarIcon1' src={logoutIcon} alt='' />
						Log Out
					</div>
				</a>
			</div>
		</div>
	);
}
