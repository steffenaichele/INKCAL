import { useAuth } from "@/context";
import { Navigate } from "react-router";
import { Link } from "react-router";

const Home = () => {
	const { signedIn } = useAuth();

	// If user is signed in, redirect to dashboard
	if (signedIn) {
		return <Navigate to="/dashboard" replace />;
	}

	// Landing page for non-authenticated users
	return (
		<div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px", textAlign: "center" }}>
			<h1 style={{ fontSize: "48px", marginBottom: "20px" }}>Welcome to INKCAL</h1>
			<p style={{ fontSize: "20px", color: "#666", marginBottom: "40px" }}>
				Your personal appointment management system for tattoo artists
			</p>
			<div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
				<Link
					to="/login"
					style={{
						padding: "12px 24px",
						backgroundColor: "#2196f3",
						color: "white",
						textDecoration: "none",
						borderRadius: "4px",
						fontSize: "16px"
					}}
				>
					Login
				</Link>
				<Link
					to="/register"
					style={{
						padding: "12px 24px",
						backgroundColor: "#4caf50",
						color: "white",
						textDecoration: "none",
						borderRadius: "4px",
						fontSize: "16px"
					}}
				>
					Register
				</Link>
			</div>
		</div>
	);
};

export default Home;
