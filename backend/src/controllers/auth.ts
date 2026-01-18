import { User } from "#models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { CookieOptions, RequestHandler } from "express";

const TOKEN_TTL = Number(process.env.TOKEN_TTL) * 24 * 60 * 60;

const tokenCookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: "lax",
	maxAge: TOKEN_TTL * 1000, // 7 days
} satisfies CookieOptions;

export const register: RequestHandler = async (req, res) => {
	const { email, password } = req.body;

	//1.Ckeck if user already exists
	const emailInUse = await User.exists({ email });
	if (emailInUse) {
		return res.status(409).json({ error: "Email is already in use" }); // 409 - Conflict
	}

	//2.Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	//3.Create user in DB
	const user = await User.create({
		...req.body,
		password: hashedPassword,
	});
	if (!user) {
		return res.status(500).json({ error: "Error during registration :(" });
	}

	//4.Return success response

	res.json({ message: "User registered successfully" });
};

export const login: RequestHandler = async (req, res) => {
	//1. Find user by email
	const { email, password } = req.body;
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		throw new Error("Invalid email or password", { cause: 401 });
	}

	//2. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password", { cause: 401 });
    }

	//3. Create session / JWT

    const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: TOKEN_TTL});

	//4. Return success response
    res.cookie("token", token, tokenCookieOptions);

	res.json({ message: "logged in :)" });
};

export const logout: RequestHandler = (req, res) => {
	res.clearCookie("token", tokenCookieOptions);
	res.json({ message: "logged out :)" });
};

export const me: RequestHandler = async (req, res) => {
	const {_id} = req.user!;
	const user = await User.findById(_id);
	if (!user) {
		throw new Error("User not found", { cause: 404 });
	}
	res.json(user);
};
