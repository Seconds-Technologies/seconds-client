import React from 'react';
import { CDBSidebar, CDBSidebarContent, CDBSidebarFooter, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
import { Link, NavLink } from 'react-router-dom';
import { PATHS } from '../../constants';
import logo from '../../assets/img/secondsapp.svg';
import openIcon from '../../assets/img/open-sidebar.svg'

const Sidebar2 = () => {
	return (
		<div className='d-flex min-vh-100 bg-light top-0 position-sticky text-dark' style={{ overflow: 'scroll initial' }}>
			<CDBSidebar textColor='#000' backgroundColor='#F4F4F5'>
				<CDBSidebarHeader prefix={<img src={openIcon} width={20} height={20} alt='' />}>
					<Link to={PATHS.HOME} className='navbar-brand mt-2 ' href='src/layout/sidebar/Sidebar'>
						<span className='logo'>
							<img src={logo} alt='' width={120} />
						</span>
					</Link>
				</CDBSidebarHeader>
				<CDBSidebarContent className='sidebar-content'>
					<CDBSidebarMenu>
						<NavLink exact to='/' activeClassName='activeClicked'>
							<CDBSidebarMenuItem icon='columns'>Dashboard</CDBSidebarMenuItem>
						</NavLink>
						<NavLink exact to='/tables' activeClassName='activeClicked'>
							<CDBSidebarMenuItem icon='table'>Tables</CDBSidebarMenuItem>
						</NavLink>
						<NavLink exact to='/profile' activeClassName='activeClicked'>
							<CDBSidebarMenuItem icon='user'>Profile page</CDBSidebarMenuItem>
						</NavLink>
						<NavLink exact to='/analytics' activeClassName='activeClicked'>
							<CDBSidebarMenuItem icon='chart-line'>Analytics</CDBSidebarMenuItem>
						</NavLink>

						<NavLink exact to='/hero404' target='_blank' activeClassName='activeClicked'>
							<CDBSidebarMenuItem icon='exclamation-circle'>404 page</CDBSidebarMenuItem>
						</NavLink>
					</CDBSidebarMenu>
				</CDBSidebarContent>

				<CDBSidebarFooter style={{ textAlign: 'center' }}>
					<div
						style={{
							padding: '20px 5px'
						}}
					>
						Sidebar Footer
					</div>
				</CDBSidebarFooter>
			</CDBSidebar>
		</div>
	);
};

export default Sidebar2;
