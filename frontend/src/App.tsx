import { Routes, Route } from "react-router";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import About from "./pages/About";

import "./App.css";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="/about" element={<About />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
