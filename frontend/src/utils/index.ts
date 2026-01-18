const AUTH_URL: string | undefined = import.meta.env
	.VITE_APP_AUTH_SERVER_URL as string | undefined;

export const authServiceURL: string = AUTH_URL || "http://localhost:3000/api/auth";
