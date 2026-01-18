import { authServiceURL } from "@/utils";
import type { User, RegisterFormState } from "@/types/api";

type LoginInput = { email: string; password: string };

type SuccessRes = { message: string };

const login = async (formData: LoginInput): Promise<SuccessRes> => {
	const res = await fetch(`${authServiceURL}/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(formData),
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = (await res.json()) as SuccessRes;
	// console.log(data);

	return data;
};

const me = async (): Promise<User> => {
	const res = await fetch(`${authServiceURL}/me`, {
		credentials: "include",
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const { user } = (await res.json()) as SuccessRes & { user: User };
	// console.log(data);

	return user;
};

const logout = async (): Promise<SuccessRes> => {
	const res = await fetch(`${authServiceURL}/logout`, {
		method: "DELETE",
		credentials: "include"
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = (await res.json()) as SuccessRes;
	// console.log(data);

	return data;
};

const register = async (formData: RegisterFormState): Promise<SuccessRes> => {
	const res = await fetch(`${authServiceURL}/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(formData),
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = (await res.json()) as SuccessRes;
	// console.log(data);

	return data;
};

export { login, me, logout, register };
