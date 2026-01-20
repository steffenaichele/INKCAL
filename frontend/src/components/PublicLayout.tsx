import { Outlet, useLocation } from 'react-router';
import './PublicLayout.scss';

const PublicLayout = () => {
	const location = useLocation();
	const showAuthForm = location.pathname === '/login' || location.pathname === '/register';

	return (
		<div className="public-layout">
			{/* Main promotional area - always visible */}
			<div className="public-layout__hero">
				<div className="public-layout__hero-content">
					<h1 className="public-layout__title">Welcome to INKCAL</h1>
					<p className="public-layout__description">
						Your all-in-one scheduling solution for tattoo artists.
						Manage appointments, track your workdays, and grow your business.
					</p>
					<div className="public-layout__features">
						<div className="public-layout__feature">
							<span className="public-layout__feature-icon">📅</span>
							<h3>Smart Scheduling</h3>
							<p>Automated appointment management with calendar integration</p>
						</div>
						<div className="public-layout__feature">
							<span className="public-layout__feature-icon">⏰</span>
							<h3>Workday Management</h3>
							<p>Set your working hours and let clients book accordingly</p>
						</div>
						<div className="public-layout__feature">
							<span className="public-layout__feature-icon">💼</span>
							<h3>Business Insights</h3>
							<p>Track your time, manage clients, and optimize your workflow</p>
						</div>
					</div>

					{/* Render outlet content within hero on non-auth pages */}
					{!showAuthForm && <Outlet />}
				</div>
			</div>

			{/* Auth form sidebar (appears when on /login or /register) */}
			{showAuthForm && (
				<aside className="public-layout__sidebar">
					<Outlet />
				</aside>
			)}
		</div>
	);
};

export default PublicLayout;
