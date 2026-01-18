import type { RequestHandler } from "express";

const authorize =
	(allowedRoles: string[]): RequestHandler =>
	(req, res, next) => {
		const { role, _id } = req.user!;

        if (allowedRoles.includes('self') && req.params.id === _id) {
            next();
        }

		if (allowedRoles.includes(role)) {
			next();
		} else {
			throw new Error(
				"Hell naw: You don't have enough street cred, lil homie",
				{ cause: 403 }
			);
		}
	};

export default authorize;
