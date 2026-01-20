import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "#db";
import { userRouter, workdaysRouter, appointmentRouter, authRouter } from "#routers";
import { errorHandler, authenticate, authorize } from "#middleware";

const port = process.env.PORT;
const app = express();

// CORS configuration
const allowedOrigins = [
	"http://localhost:5173",
	"http://localhost:5174",
	"https://inkcal.vercel.app",
	process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
	origin: (origin, callback) => {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);

		// Check if origin is in allowed list
		if (allowedOrigins.includes(origin)) {
			return callback(null, true);
		}

		// Allow all Vercel preview deployments
		if (origin && origin.endsWith('.vercel.app')) {
			return callback(null, true);
		}

		callback(new Error('Not allowed by CORS'));
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json(), cookieParser());

app.get("/", (req: any, res: any) => {
	res.send("Moingiorno World!");
});

// API Routes with /api prefix
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/workdays", workdaysRouter);
app.use("/api/appointments", appointmentRouter);

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
