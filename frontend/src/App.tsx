import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import PublicLayout from "./components/PublicLayout";

// Lazy load all pages for optimal bundle splitting
const Home = lazy(() => import("./pages/Home"));
// const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Loading fallback component
const PageLoader = () => (
	<div
		style={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			minHeight: "400px",
			color: "#6c757d",
		}}
	>
		Loading...
	</div>
);

function App() {
	return (
		<Suspense fallback={<PageLoader />}>
			<Routes>
				{/* Public routes with PublicLayout */}
				<Route element={<PublicLayout />}>
					<Route index element={<Home />} />
					{/* <Route path="/about" element={<About />} /> */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Route>

				{/* Authenticated routes with Layout (navbar) */}
				<Route element={<Layout />}>
					<Route path="/profile" element={<Profile />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;
