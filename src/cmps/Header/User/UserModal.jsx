import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { updateUserNotifications, updateUser } from "../../../store/user.action";

import { userService } from "../../../services/user.service";
import { useDispatch } from "react-redux";

export function UserModal({ handleUserModal }) {
	const [loggUser, setLoggUser] = useState(userService.getLoggedinUser());
	const isActive = useSelector((state) => state.headerModule.headerMode.isActive);
	const user = useSelector((state) => state.userModule.user);
	const notificationsAmount = user.notifications?.length;
	const dispatch = useDispatch();
	const history = useHistory();

	const resetUserNotifications = async () => {
		const currUser = await userService.getById(loggUser?._id);
		const updatedUser = { ...currUser, notifications: [] };
		const newUser = await userService.update(updatedUser);
		userService.setLoggedinUser(newUser);
		dispatch(updateUserNotifications([]));
	};

	function onLogOut() {
		userService.logout();
		userService.setLoggedinUser(null);
		dispatch(updateUser({}));
		history.push("/");
	}

	return (
		<nav className={`user-modal-container ${isActive && "active-modal"} "open"`} onClick={handleUserModal}>
			<ul>
				<li onClick={resetUserNotifications}>
					{loggUser ? (
						<Link to={"/host"}>
							<span className='user-modal-span'>{loggUser.isHost ? "Statistics & Dashboard" : "My trips & Wishlist"}</span>
							{notificationsAmount ? <div className='user-notifications-dot'>{notificationsAmount}</div> : <React.Fragment></React.Fragment>}
						</Link>
					) : (
						<Link to={"/user/signup"}>
							<span className='user-modal-span'>Sign up</span>
						</Link>
					)}
				</li>
				<li>
					{loggUser ? (
						<a href='#footer' className='user-modal-about-link'>
							<span className='user-modal-span'>About</span>
						</a>
					) : (
						<Link to={"/user/login"}>
							<span className='user-modal-span'>Log in</span>
						</Link>
					)}
				</li>
				<hr />
				<li>
					<Link to={"/host"}>
						<span className='user-modal-span'>Start hosting</span>
					</Link>
				</li>
				<li onClick={onLogOut}>
					{loggUser ? (
						<span className='user-modal-span'>Log out</span>
					) : (
						<a href='#footer' className='user-modal-about-link'>
							<span className='user-modal-span'>About</span>
						</a>
					)}
				</li>
				<li>
					<span className='user-modal-span'>Help</span>
				</li>
			</ul>
		</nav>
	);
}
