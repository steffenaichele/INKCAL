import React, { useState } from "react";
import { Link } from "react-router";
import Icon from "./Icon";
import Logo from "./ui/Logo/Logo";
import Avatar from "./ui/Avatar/Avatar";
import { Button } from "./ui/Button/Button";
import CreateAppointmentDialog from "./CreateAppointmentDialog";
import { useAuth } from "@/context";
import "./Sidebar.scss";

const Sidebar = React.memo(() => {
	const { user } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);

	return (
		<nav className="sidebar">
			<Logo />
			<div className="sidebar__list">
				<div className="sidebar__item">
					<Link to="/dashboard" className="sidebar__link">
						<Icon name="Grid" size={20} />
						<span>Dashboard</span>
					</Link>
				</div>
				<div className="sidebar__item">
					<Link to="/dashboard" className="sidebar__link">
						<Icon name="Grid" size={20} />
						<span>Feed</span>
					</Link>
				</div>
				<div className="sidebar__item">
					<Link to="/dashboard" className="sidebar__link">
						<Icon name="Check" size={20} />
						<span>To Do</span>
					</Link>
				</div>
			</div>

			<Button
				className="sidebar__action"
				onClick={openModal}
				variant="ghost"
				type="button">
				<Icon name="Plus" size={20} />
			</Button>

			<div className="sidebar__user">
				{user && (
					<Link to="/profile" className="sidebar__link">
						<Avatar name={user.name} size="md" />
						<div className="sidebar__user-info">
							<span className="sidebar__user-name">
								{user.name}
							</span>
							<span className="sidebar__user-email">
								{user.email}
							</span>
						</div>
					</Link>
				)}
			</div>

			<CreateAppointmentDialog
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</nav>
	);
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
