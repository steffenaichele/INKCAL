import React from "react";
import { useAuth } from "@/context";
import Logo from "./ui/Logo/Logo";
import Clock from "./Clock";
import "./Header.scss";

const Header = React.memo(() => {
	const { user } = useAuth();

	return (
		<header className="header">
			<Logo className="logo" />

			<div className="header__center">
				{user && (
					<p className="header__welcome">
						Welcome back,{" "}
						<span className="header__username">{user.name}</span>
					</p>
				)}
			</div>

			<Clock className="clock" />
		</header>
	);
});

Header.displayName = "Header";

export default Header;
