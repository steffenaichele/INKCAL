import { useAuth } from "@/context";
import { useState } from "react";
import { Navigate } from "react-router";
import { Form } from "@base-ui/react/form";
import { Field } from "@base-ui/react/field";
import { Button } from "@/components/ui/Button/Button";
import Logo from "@/components/ui/Logo/Logo";
import "@/styles/pages/Home.scss";

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
		<div className="home">
			<div className="home__card">
				<div className="home__header">
					<Logo />
					<div className="home__logo-container">
						<h1>INKCAL</h1>
						<p className="home__subtitle">
							Your tattoo appointment manager
						</p>
					</div>
				</div>

				<div className="home__tabs">
					<button
						type="button"
						className={`home__tab ${mode === "login" ? "home__tab--active" : ""}`}
						onClick={() => switchMode("login")}>
						Login
					</button>
					<button
						type="button"
						className={`home__tab ${mode === "register" ? "home__tab--active" : ""}`}
						onClick={() => switchMode("register")}>
						Register
					</button>
				</div>

				<Form
					className="home__form"
					onSubmit={handleSubmit}
					errors={errors}>
					{mode === "register" && (
						<Field.Root name="name" className="home__field">
							<Field.Label className="home__label">
								Name
							</Field.Label>
							<Field.Control
								type="text"
								required
								placeholder="Enter your full name"
								className="home__input"
								disabled={loading}
							/>
							<Field.Error className="home__error" />
						</Field.Root>
					)}

					<Field.Root name="email" className="home__field">
						<Field.Label className="home__label">
							Email
						</Field.Label>
						<Field.Control
							type="email"
							required
							placeholder="Enter your email"
							className="home__input"
							disabled={loading}
						/>
						<Field.Error className="home__error" />
					</Field.Root>

					<Field.Root name="password" className="home__field">
						<Field.Label className="home__label">
							Password
						</Field.Label>
						<Field.Control
							type="password"
							required
							placeholder="Enter your password"
							className="home__input"
							disabled={loading}
						/>
						<Field.Error className="home__error" />
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
