import React from "react";
import { Link } from "react-router";

import Icon from "./Icon";
import Logo from "./ui/Logo/Logo";
import "./Sidebar.scss";

const Sidebar = React.memo(() => {
	return (
		<nav className="sidebar">
			<div className="sidebar__logo-wrapper">
				<Link to="/dashboard" className="sidebar__logo-link">
					<Logo />
				</Link>
			</div>
			<ul className="sidebar__list">
				<li className="sidebar__item">
					<Link to="/dashboard" className="sidebar__link">
						<Icon name="Grid" size={20} />
						<span>Dashboard</span>
					</Link>
				</li>
			</ul>
			<ul className="sidebar__list">
				<li className="sidebar__item">
					<Link to="/profile" className="sidebar__link">
						<Icon name="Settings" size={20} />
						<span>Profile</span>
					</Link>
				</li>
			</ul>
		</nav>
	);
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
