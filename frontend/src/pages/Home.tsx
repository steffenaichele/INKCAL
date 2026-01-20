import { useAuth } from "@/context";
import { Navigate, Link } from "react-router";
import Icon from "@/components/Icon";
import "@/styles/pages/Home.scss";

const Home = () => {
	const { signedIn } = useAuth();

	// If user is signed in, redirect to dashboard
	if (signedIn) {
		return <Navigate to="/dashboard" replace />;
	}

	// Landing page for non-authenticated users - shown in PublicLayout hero area
	return (
		<div className="home">
			<div className="home__cta">
				<h2 className="home__cta-title">Get Started Today</h2>
				<p className="home__cta-text">
					Join hundreds of tattoo artists managing their schedules efficiently
				</p>
				<div className="home__cta-buttons">
					<Link to="/login" className="home__cta-button home__cta-button--primary">
						<Icon name="LogIn" size={20} />
						<span>Sign In</span>
					</Link>
					<Link to="/register" className="home__cta-button home__cta-button--secondary">
						<Icon name="UserPlus" size={20} />
						<span>Create Account</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;
