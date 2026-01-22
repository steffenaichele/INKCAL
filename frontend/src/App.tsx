import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";

// Lazy load all pages for optimal bundle splitting
const Home = lazy(() => import("./pages/Home"));
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
				{/* Public auth route (no layout) */}
				<Route index element={<Home />} />

				{/* Authenticated routes with Layout */}
				<Route element={<Layout />}>
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
			</Routes>
		</Suspense>
	);
}

export default App;
