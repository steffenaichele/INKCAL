import { useAuth } from "@/context";
import { Navigate, useNavigate } from "react-router";

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
		<div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
			<h1>Profile</h1>
			<div style={{ marginTop: "30px" }}>
				<div style={{ marginBottom: "20px" }}>
					<strong>Name:</strong> {user.name}
				</div>
				<div style={{ marginBottom: "20px" }}>
					<strong>Email:</strong> {user.email}
				</div>
				<div style={{ marginBottom: "20px" }}>
					<strong>Member since:</strong>{" "}
					{new Date(user.createdAt).toLocaleDateString()}
				</div>
			</div>
			<button
				onClick={onLogout}
				style={{
					marginTop: "30px",
					padding: "10px 20px",
					backgroundColor: "#dc3545",
					color: "white",
					border: "none",
					cursor: "pointer",
					borderRadius: "4px"
				}}
			>
				Logout
			</button>
		</div>
	);
};

export default Profile;
