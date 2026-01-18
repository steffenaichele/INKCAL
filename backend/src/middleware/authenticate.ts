import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const authenticate: RequestHandler = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        throw new Error("Authentication token missing", { cause: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {_id: string; role: "admin" | "user"};
        // console.log("Decoded JWT:", decoded);
        req.user = {
            _id: decoded._id,
            role: decoded.role
        }
    } catch {
        throw new Error("Invalid authentication token", { cause: 401 });
    }


    next()
};

export default authenticate;