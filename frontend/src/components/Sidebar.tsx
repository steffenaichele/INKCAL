import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/context';
import Icon from './Icon';
import './Sidebar.scss';

const Sidebar = React.memo(() => {
	const { signedIn, user } = useAuth();
	const userName = user?.name; // Extract only what you need

	return (
		<nav className="sidebar">
			<ul className="sidebar__list">
				{!signedIn && (
					<li className="sidebar__item">
						<Link to="/" className="sidebar__link">
							<Icon name="Home" size={20} />
							<span>Home</span>
						</Link>
					</li>
				)}
				{signedIn && (
					<li className="sidebar__item">
						<Link to="/dashboard" className="sidebar__link">
							<Icon name="Grid" size={20} />
							<span>Dashboard</span>
						</Link>
					</li>
				)}
				<li className="sidebar__item">
					<Link to="/about" className="sidebar__link">
						<Icon name="Info" size={20} />
						<span>About</span>
					</Link>
				</li>
			</ul>
			<ul className="sidebar__list">
				{signedIn && userName ? (
					<>
						<li className="sidebar__user-greeting">
							<Icon name="User" size={18} />
							<span>Hello, {userName}!</span>
						</li>
						<li className="sidebar__item">
							<Link to="/profile" className="sidebar__link">
								<Icon name="Settings" size={20} />
								<span>Profile</span>
							</Link>
						</li>
					</>
				) : (
					<>
						<li className="sidebar__item">
							<Link to="/login" className="sidebar__link">
								<Icon name="LogIn" size={20} />
								<span>Login</span>
							</Link>
						</li>
						<li className="sidebar__item">
							<Link to="/register" className="sidebar__link">
								<Icon name="UserPlus" size={20} />
								<span>Register</span>
							</Link>
						</li>
					</>
				)}
			</ul>
		</nav>
	);
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
