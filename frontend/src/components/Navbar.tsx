import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/context';
import './Navbar.scss';

const Navbar = React.memo(() => {
	const { signedIn, user } = useAuth();
	const userName = user?.name; // Extract only what you need

	return (
		<nav className="navbar">
			<ul className="navbar__list">
				{!signedIn && (
					<li className="navbar__item">
						<Link to="/" className="navbar__link">
							Home
						</Link>
					</li>
				)}
				{signedIn && (
					<li className="navbar__item">
						<Link to="/dashboard" className="navbar__link">
							Dashboard
						</Link>
					</li>
				)}
				<li className="navbar__item">
					<Link to="/about" className="navbar__link">
						About
					</Link>
				</li>
			</ul>
			<ul className="navbar__list">
				{signedIn && userName ? (
					<>
						<li className="navbar__user-greeting">Hello, {userName}!</li>
						<li className="navbar__item">
							<Link to="/profile" className="navbar__link">
								Profile
							</Link>
						</li>
					</>
				) : (
					<>
						<li className="navbar__item">
							<Link to="/login" className="navbar__link">
								Login
							</Link>
						</li>
						<li className="navbar__item">
							<Link to="/register" className="navbar__link">
								Register
							</Link>
						</li>
					</>
				)}
			</ul>
		</nav>
	);
});

Navbar.displayName = 'Navbar';

export default Navbar;
