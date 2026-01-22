import { useState, useEffect, useCallback, type ReactNode } from "react";
import { AuthContext } from ".";
import { login, me, logout, register } from "@/data";
import type {
	User,
	LoginData,
	RegisterFormState,
	AuthContextType,
} from "@/types/api";

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [signedIn, setSignedIn] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [checkSession, setCheckSession] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getUser = async () => {
			try {
				// Set a timeout to prevent hanging
				const timeoutPromise = new Promise((_, reject) =>
					setTimeout(() => reject(new Error('Session check timeout')), 5000)
				);

				const data = await Promise.race([me(), timeoutPromise]) as User;

				setUser(data);
				setSignedIn(() => true);
			} catch (error) {
				// User not authenticated or timeout - this is fine
				console.warn('Session check failed:', error);
				setSignedIn(() => false);
				setUser(() => null);
			} finally {
				setCheckSession(() => false);
				setIsLoading(() => false);
			}
		};

		if (checkSession) getUser();
	}, [checkSession]);

	const handleSignIn = useCallback(async ({ email, password }: LoginData) => {
		await login({ email, password });
		setSignedIn(() => true);
		setCheckSession(() => true);
	}, []);

	const handleRegister = useCallback(
		async (formState: RegisterFormState) => {
			await register(formState);
			setSignedIn(() => true);
			setCheckSession(() => true);
		},
		[]
	);

	const handleSignOut = useCallback(async () => {
		await logout();
		setSignedIn(() => false);
		setUser(() => null);
	}, []);

	const value: AuthContextType = {
		signedIn,
		user,
		handleSignIn,
		handleSignOut,
		handleRegister,
	};

	// Show loading while checking session
	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				Loading...
			</div>
		);
	}

	return <AuthContext value={value}>{children}</AuthContext>;
};

export default AuthProvider;
