import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";
import { AuthProvider, CalendarConfigProvider, ThemeProvider } from "@/context";
import "./styles/main.scss";
import App from "./App";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<CalendarConfigProvider>
						<App />
					</CalendarConfigProvider>
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	</BrowserRouter>
);
