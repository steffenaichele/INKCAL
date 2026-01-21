import { createContext, use } from "react";
import AuthProvider from "./AuthProvider";
import CalendarConfigProvider from "./CalendarConfigProvider";
import type { AuthContextType } from "@/types/api";

const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = (): AuthContextType => {
	const context = use(AuthContext);
	if (!context)
		throw new Error("useAuth must be used within an AuthProvider");
	return context;
};

export { AuthContext, useAuth, AuthProvider, CalendarConfigProvider };
export { useCalendarConfig } from "./useCalendarConfig";
export type { CalendarConfig, CalendarConfigContextType } from "./CalendarConfigContext";
