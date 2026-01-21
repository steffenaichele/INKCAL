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
				const data = await me();

				setUser(data);
				setSignedIn(() => true);
			} catch {
				// User not authenticated - this is fine
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
