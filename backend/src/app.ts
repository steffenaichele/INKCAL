import express from "express";
import "#db";
import { userRouter } from "#routers";
import { errorHandler } from "#middleware";

const port = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/users", userRouter);


app.get("/", (req: any, res: any) => {
	res.send("Moingiorno World!");
});

app.use("*splat", (req, res) => {
	throw new Error(`Die Route ${req.originalUrl} gibt es hier nicht!`, { cause: 404 });
});

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server feuert ab auf Port http://localhost:${port} 🔥`);
});
