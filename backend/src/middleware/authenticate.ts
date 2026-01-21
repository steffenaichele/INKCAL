import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const authenticate: RequestHandler = (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		return res.status(401).json({ error: "Authentication token missing" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			_id: string;
			role: "admin" | "user";
		};
		req.user = {
			_id: decoded._id,
			role: decoded.role,
		};
		next();
	} catch (err) {
		return res.status(401).json({ error: "Invalid authentication token" });
	}
};

export default authenticate;
