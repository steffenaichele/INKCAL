import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";
import "index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</BrowserRouter>
);
