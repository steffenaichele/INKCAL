import express from "express";
import cookieParser from "cookie-parser";
import "#db";
import { userRouter, appointmentRouter, authRouter } from "#routers";
import { errorHandler, authenticate, authorize } from "#middleware";

const port = process.env.PORT;
const app = express();

app.use(express.json(), cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/appointments", appointmentRouter);

app.get("/", (req: any, res: any) => {
	res.send("Moingiorno World!");
});

app.post("/protected", authenticate, authorize(['admin', 'user']), (req, res) => {
	throw new Error("You shall not pass!", { cause: 403 });
});

app.post("/protected/id", authenticate, authorize(['admin', 'self']), (req, res) => {
	throw new Error("You shall not pass!", { cause: 403 });
});

app.use("*splat", (req, res) => {
	throw new Error(`Die Route ${req.originalUrl} gibt es hier nicht!`, { cause: 404 });
});

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server feuert ab auf Port http://localhost:${port} 🔥`);
});
