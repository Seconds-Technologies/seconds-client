import React from 'react';
import PropTypes from 'prop-types';
import MagicBell, { FloatingNotificationInbox } from '@magicbell/magicbell-react';
import { useSelector } from 'react-redux';
import { useMagicBellContext } from '@magicbell/magicbell-react';
const { rootStore } = useMagicBellContext();

const Notifications = ({ isOpen, toggle }) => {
	const email = useSelector(state => state['currentUser'].user);
	return (
		<FloatingNotificationInbox isOpen={isOpen} toggle={toggle} isheight={500} {...props} />
	);
};

Notifications.propTypes = {};

export default Notifications;
