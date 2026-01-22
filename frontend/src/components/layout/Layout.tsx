import { useState, createContext, useContext, lazy, Suspense } from "react";
import { Outlet } from "react-router";
import Settings from "@/pages/Settings";
import "./Layout.scss";

interface LayoutContextType {
	isSettingsOpen: boolean;
	openSettings: () => void;
	closeSettings: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
	const context = useContext(LayoutContext);
	if (!context) {
		throw new Error("useLayout must be used within Layout");
	}
	return context;
};

const Layout = () => {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const openSettings = () => setIsSettingsOpen(true);
	const closeSettings = () => setIsSettingsOpen(false);

	return (
		<LayoutContext.Provider
			value={{ isSettingsOpen, openSettings, closeSettings }}>
			<div className="layout">
				<Outlet />
				{isSettingsOpen && (
					<>
						<div
							className="layout__overlay"
							onClick={closeSettings}
						/>
						<div className="layout__settings-panel">
							<Suspense
								fallback={
									<div className="layout__settings-content">
										Loading settings...
									</div>
								}>
								<Settings onClose={closeSettings} />
							</Suspense>
						</div>
					</>
				)}
			</div>
		</LayoutContext.Provider>
	);
};

export default Layout;
