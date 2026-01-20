import { Workdays, User } from "#models";
import type { WorkdaysDTO, WorkdaysInputDTO, WorkdaysParamsDTO } from "#schemas";
import type { RequestHandler } from "express";
import { Types } from "mongoose";

// GET /api/workdays/:userId - Get workdays for a specific user
const getWorkdaysByUserId: RequestHandler<
	WorkdaysParamsDTO,
	WorkdaysDTO | { message: string }
> = async (req, res) => {
	const { userId } = req.params;

	// Check if user exists
	const user = await User.findById(userId);
	if (!user) throw new Error("User not found", { cause: 404 });

	const workdays = await Workdays.findOne({ userId: new Types.ObjectId(userId) });

	if (!workdays) {
		// Return default workdays if none exist
		res.json({
			message: "No workdays configured. Using default settings.",
		} as any);
		return;
	}

	res.json(workdays);
};

// POST /api/workdays/:userId - Create workdays configuration for a user
const createWorkdays: RequestHandler<
	WorkdaysParamsDTO,
	WorkdaysDTO,
	WorkdaysInputDTO
> = async (req, res) => {
	const { userId } = req.params;
	const workdaysData = req.body;

	// Check if user exists
	const user = await User.findById(userId);
	if (!user) throw new Error("User not found", { cause: 404 });

	// Check if workdays already exist for this user
	const existingWorkdays = await Workdays.findOne({
		userId: new Types.ObjectId(userId),
	});
	if (existingWorkdays) {
		throw new Error("Workdays configuration already exists for this user. Use PUT to update.", {
			cause: 409,
		});
	}

	// Create new workdays
	const newWorkdays = await Workdays.create({
		userId: new Types.ObjectId(userId),
		...workdaysData,
	});

	res.status(201).json(newWorkdays);
};

// PUT /api/workdays/:userId - Update workdays configuration for a user
const updateWorkdays: RequestHandler<
	WorkdaysParamsDTO,
	WorkdaysDTO,
	WorkdaysInputDTO
> = async (req, res) => {
	const { userId } = req.params;
	const workdaysData = req.body;

	// Check if user exists
	const user = await User.findById(userId);
	if (!user) throw new Error("User not found", { cause: 404 });

	// Update or create workdays (upsert)
	const updatedWorkdays = await Workdays.findOneAndUpdate(
		{ userId: new Types.ObjectId(userId) },
		{ ...workdaysData },
		{ new: true, upsert: true, runValidators: true }
	);

	res.json(updatedWorkdays);
};

// DELETE /api/workdays/:userId - Delete workdays configuration for a user
const deleteWorkdays: RequestHandler<
	WorkdaysParamsDTO,
	{ message: string }
> = async (req, res) => {
	const { userId } = req.params;

	// Check if user exists
	const user = await User.findById(userId);
	if (!user) throw new Error("User not found", { cause: 404 });

	const deletedWorkdays = await Workdays.findOneAndDelete({
		userId: new Types.ObjectId(userId),
	});

	if (!deletedWorkdays) {
		throw new Error("No workdays configuration found for this user", { cause: 404 });
	}

	res.json({ message: "Workdays configuration deleted successfully" });
};

// GET /api/workdays - Get all workdays configurations (admin only)
const getAllWorkdays: RequestHandler<{}, WorkdaysDTO[]> = async (req, res) => {
	const workdays = await Workdays.find().populate("userId", "name email");
	res.json(workdays);
};

export {
	getWorkdaysByUserId,
	createWorkdays,
	updateWorkdays,
	deleteWorkdays,
	getAllWorkdays,
};
