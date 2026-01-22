import type { RequestHandler } from "express";

const authorize =
	(allowedRoles: string[]): RequestHandler =>
	(req, res, next) => {
		const { role, _id } = req.user!;

		// Allow the user to act on their own resources when "self" is permitted
		if (allowedRoles.includes("self")) {
			const targetId =
				req.params.id ?? req.params.userId ?? req.params.user_id;
			if (targetId && targetId === _id) {
				return next();
			}
		}

		if (allowedRoles.includes(role)) {
			return next();
		}

		throw new Error(
			"Hell naw: You don't have enough street cred, lil homie",
			{ cause: 403 },
		);
	};

export default authorize;
