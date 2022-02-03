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

	return (
		<nav className='navbar navbar-expand-md navbar-light sticky-top bg-white topbar ps-3'>
			<div className='d-flex flex-grow-1 justify-content-end' id='profile'>

			</div>
		</nav>
	);
}
