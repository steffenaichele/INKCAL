import { useAuth } from "@/context";
import { useState } from "react";
import { Navigate } from "react-router";
import { Form } from "@base-ui/react/form";
import { Field } from "@base-ui/react/field";
import { Button } from "@/components/ui/Button/Button";
import Logo from "@/components/ui/Logo/Logo";
import styles from "@/styles/pages/Auth.module.scss";

type AuthMode = "login" | "register";

const Home = () => {
	const { signedIn, handleSignIn, handleRegister } = useAuth();
	const [mode, setMode] = useState<AuthMode>("login");
	const [errors, setErrors] = useState<{
		name?: string;
		email?: string;
		password?: string;
	}>({});
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

			if (mode === "login") {
				await handleSignIn({ email, password });
			} else {
				const name = formData.get("name") as string;
				await handleRegister({ name, email, password });
			}
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: mode === "login"
						? "Login failed"
						: "Registration failed";
			setErrors({ email: message });
		} finally {
			setLoading(false);
		}
	};

	const switchMode = (newMode: AuthMode) => {
		setMode(newMode);
		setErrors({});
	};

	return (
		<div className={styles.Container}>
			<div className={styles.Card}>
				<div className={styles.LogoContainer}>
					<Logo />
					<h1 className={styles.Title}>INKCAL</h1>
					<p className={styles.Subtitle}>
						Your tattoo appointment manager
					</p>
				</div>

				<div className={styles.Tabs}>
					<button
						type="button"
						className={`${styles.Tab} ${mode === "login" ? styles.TabActive : ""}`}
						onClick={() => switchMode("login")}>
						Login
					</button>
					<button
						type="button"
						className={`${styles.Tab} ${mode === "register" ? styles.TabActive : ""}`}
						onClick={() => switchMode("register")}>
						Register
					</button>
				</div>

				<Form
					className={styles.Form}
					onSubmit={handleSubmit}
					errors={errors}>
					{mode === "register" && (
						<Field.Root name="name" className={styles.Field}>
							<Field.Label className={styles.Label}>
								Name
							</Field.Label>
							<Field.Control
								type="text"
								required
								placeholder="Enter your full name"
								className={styles.Input}
								disabled={loading}
							/>
							<Field.Error className={styles.Error} />
						</Field.Root>
					)}

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
						<Field.Label className={styles.Label}>
							Password
						</Field.Label>
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
						{loading
							? mode === "login"
								? "Logging in..."
								: "Registering..."
							: mode === "login"
								? "Login"
								: "Register"}
					</Button>
				</Form>
			</div>
		</div>
	);
};

export default Home;
