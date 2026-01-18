import { useAuth } from "@/context";
import { useState } from "react";
import { Link, Navigate } from "react-router";

const Login = () => {
	const { signedIn, handleSignIn } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	if (signedIn) {
		return <Navigate to="/" replace />;
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await handleSignIn({ email, password });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "15px" }}>
					<label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						style={{ width: "100%", padding: "8px" }}
						disabled={loading}
					/>
				</div>
				<div style={{ marginBottom: "15px" }}>
					<label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						style={{ width: "100%", padding: "8px" }}
						disabled={loading}
					/>
				</div>
				{error && (
					<div style={{ color: "red", marginBottom: "15px" }}>
						{error}
					</div>
				)}
				<button
					type="submit"
					disabled={loading}
					style={{ width: "100%", padding: "10px", cursor: loading ? "not-allowed" : "pointer" }}
				>
					{loading ? "Logging in..." : "Login"}
				</button>
			</form>
			<p style={{ marginTop: "20px", textAlign: "center" }}>
				Don't have an account? <Link to="/register">Register here</Link>
			</p>
		</div>
	);
};

export default Login;
