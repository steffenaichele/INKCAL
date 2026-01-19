import { useAuth } from "@/context";
import { Navigate, useNavigate } from "react-router";
import Icon from "@/components/Icon";
import "./Profile.scss";

const Profile = () => {
	const { signedIn, user, handleSignOut } = useAuth();
	const navigate = useNavigate();

	if (!signedIn || !user) {
		return <Navigate to="/login" replace />;
	}

	const onLogout = async () => {
		try {
			await handleSignOut();
			navigate("/");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<div className="profile">
			<div className="profile__header">
				<Icon name="User" size={48} className="profile__avatar" />
				<h1>Profile</h1>
			</div>

			<div className="profile__info">
				<div className="profile__info-item">
					<Icon name="User" size={20} />
					<div className="profile__info-content">
						<span className="profile__info-label">Name</span>
						<span className="profile__info-value">{user.name}</span>
					</div>
				</div>

				<div className="profile__info-item">
					<Icon name="Mail" size={20} />
					<div className="profile__info-content">
						<span className="profile__info-label">Email</span>
						<span className="profile__info-value">{user.email}</span>
					</div>
				</div>

				<div className="profile__info-item">
					<Icon name="Calendar" size={20} />
					<div className="profile__info-content">
						<span className="profile__info-label">Member since</span>
						<span className="profile__info-value">
							{new Date(user.createdAt).toLocaleDateString()}
						</span>
					</div>
				</div>
			</div>

			<button onClick={onLogout} className="profile__logout-btn">
				<Icon name="LogOut" size={20} />
				<span>Logout</span>
			</button>
		</div>
	);
};

export default Profile;
