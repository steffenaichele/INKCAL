import { useAuth } from "@/context";
import { useState } from "react";
import { Link, Navigate } from "react-router";
import { Form } from "@base-ui/react/form";
import { Field } from "@base-ui/react/field";
import { Button } from "@/components/ui/Button/Button";
import styles from "@/styles/pages/Auth.module.css";

const Login = () => {
	const { signedIn, handleSignIn } = useAuth();
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{},
	);
	const [loading, setLoading] = useState(false);

	if (signedIn) {
		return <Navigate to="/dashboard" replace />;
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		setLoading(true);

		try {
			const formData = new FormData(e.currentTarget);
			const email = formData.get("email") as string;
			const password = formData.get("password") as string;
			await handleSignIn({ email, password });
		} catch (err) {
			const message = err instanceof Error ? err.message : "Login failed";
			setErrors({ email: message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
			<h1>Login</h1>
			<Form
				className={styles.Form}
				onSubmit={handleSubmit}
				errors={errors}>
				<Field.Root name="email" className={styles.Field}>
					<Field.Label className={styles.Label}>Email</Field.Label>
					<Field.Control
						type="email"
						required
						placeholder="Enter your email"
						className={styles.Input}
						disabled={loading}
					/>
					<Field.Error className={styles.Error} />
				</Field.Root>

				<Field.Root name="password" className={styles.Field}>
					<Field.Label className={styles.Label}>Password</Field.Label>
					<Field.Control
						type="password"
						required
						placeholder="Enter your password"
						className={styles.Input}
						disabled={loading}
					/>
					<Field.Error className={styles.Error} />
				</Field.Root>

				<Button
					type="submit"
					disabled={loading}
					variant="primary"
					fullWidth
					loading={loading}>
					{loading ? "Logging in..." : "Login"}
				</Button>
			</Form>
			<p style={{ marginTop: "20px", textAlign: "center" }}>
				Don't have an account? <Link to="/register">Register here</Link>
			</p>
		</div>
	);
};

export default Login;
