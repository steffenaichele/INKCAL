import { useAuth } from "@/context";
import { Navigate, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Icon from "@/components/Icon";
import { workdaysApi } from "@/services/api/workdays";
import type { DayOfWeek, WorkdaysInput } from "@/types/api";
import "@/styles/pages/Profile.scss";

const Profile = () => {
	const { signedIn, user, handleSignOut } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const dayOrder: Array<{ label: string; value: DayOfWeek }> = useMemo(
		() => [
			{ label: "Mon", value: "monday" },
			{ label: "Tue", value: "tuesday" },
			{ label: "Wed", value: "wednesday" },
			{ label: "Thu", value: "thursday" },
			{ label: "Fri", value: "friday" },
			{ label: "Sat", value: "saturday" },
			{ label: "Sun", value: "sunday" },
		],
		[],
	);

	const [workingDays, setWorkingDays] = useState(
		dayOrder.map(({ label, value }) => ({
			label,
			dayOfWeek: value,
			isWorkday: !["saturday", "sunday"].includes(value),
			startTime: "09:00",
			endTime: "17:00",
		})),
	);

	const { data: workdaysData, isLoading: workdaysLoading } = useQuery({
		queryKey: ["workdays", user?._id],
		queryFn: () => workdaysApi.getByUserId(user!._id),
		enabled: !!user,
	});

	useEffect(() => {
		if (!workdaysData) return;
		setWorkingDays(
			dayOrder.map(({ label, value }) => {
				const match = workdaysData.workdays.find(
					(w) => w.dayOfWeek === value,
				);
				return {
					label,
					dayOfWeek: value,
					isWorkday: match?.isWorkday ?? false,
					startTime: match?.startTime ?? "09:00",
					endTime: match?.endTime ?? "17:00",
				};
			}),
		);
	}, [dayOrder, workdaysData]);

	const saveWorkingDaysMutation = useMutation({
		mutationFn: (payload: WorkdaysInput) =>
			workdaysApi.update(user!._id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["workdays", user?._id],
			});
		},
	});

	if (!signedIn || !user) {
		return <Navigate to="/login" replace />;
	}

	const onLogout = async () => {
		try {
			await handleSignOut();
			navigate("/");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPasswordForm((prev) => ({ ...prev, [name]: value }));
	};

	const submitPassword = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// TODO: integrate with password update API
		setPasswordForm({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
	};

	const updateWorkingDay = (
		dayIndex: number,
		patch: Partial<{
			isWorkday: boolean;
			startTime: string;
			endTime: string;
		}>,
	) => {
		setWorkingDays((prev) =>
			prev.map((day, idx) =>
				idx === dayIndex ? { ...day, ...patch } : day,
			),
		);
	};

	const submitWorkingDays = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const payload: WorkdaysInput = {
			timezone: workdaysData?.timezone,
			workdays: workingDays.map(
				({ dayOfWeek, isWorkday, startTime, endTime }) => ({
					dayOfWeek,
					isWorkday,
					startTime,
					endTime,
				}),
			),
		};
		saveWorkingDaysMutation.mutate(payload);
	};

	return (
		<div className="profile">
			<div className="profile__header">
				<Icon name="User" size={48} className="profile__avatar" />
				<h1>Profile</h1>
			</div>

			<div className="profile__info">
				<div className="profile__info-item">
					<Icon name="User" size={20} />
					<div className="profile__info-content">
						<span className="profile__info-label">Name</span>
						<span className="profile__info-value">{user.name}</span>
					</div>
				</div>

				<div className="profile__info-item">
					<Icon name="Mail" size={20} />
					<div className="profile__info-content">
						<span className="profile__info-label">Email</span>
						<span className="profile__info-value">
							{user.email}
						</span>
					</div>
				</div>

				<div className="profile__info-item">
					<Icon name="Calendar" size={20} />
					<div className="profile__info-content">
						<span className="profile__info-label">
							Member since
						</span>
						<span className="profile__info-value">
							{new Date(user.createdAt).toLocaleDateString()}
						</span>
					</div>
				</div>
			</div>

			<div className="profile__section">
				<h2 className="profile__section-title">Change password</h2>
				<form className="profile__form" onSubmit={submitPassword}>
					<label>
						Current password
						<input
							type="password"
							name="currentPassword"
							value={passwordForm.currentPassword}
							onChange={handlePasswordChange}
							required
						/>
					</label>
					<label>
						New password
						<input
							type="password"
							name="newPassword"
							value={passwordForm.newPassword}
							onChange={handlePasswordChange}
							required
						/>
					</label>
					<label>
						Confirm new password
						<input
							type="password"
							name="confirmPassword"
							value={passwordForm.confirmPassword}
							onChange={handlePasswordChange}
							required
						/>
					</label>
					<div className="profile__form-actions">
						<button
							type="submit"
							className="profile__btn profile__btn--primary">
							Update password
						</button>
					</div>
				</form>
			</div>

			<div className="profile__section">
				<h2 className="profile__section-title">Working days</h2>
				<form className="profile__form" onSubmit={submitWorkingDays}>
					<div className="profile__working-days">
						{workingDays.map((day, idx) => (
							<div
								key={day.dayOfWeek}
								className="profile__working-day">
								<label className="profile__working-day-toggle">
									<input
										type="checkbox"
										checked={day.isWorkday}
										onChange={(e) =>
											updateWorkingDay(idx, {
												isWorkday: e.target.checked,
											})
										}
									/>
									<span>{day.label}</span>
								</label>
								<div className="profile__time-inputs">
									<label>
										Start
										<input
											type="time"
											value={day.startTime}
											onChange={(e) =>
												updateWorkingDay(idx, {
													startTime: e.target.value,
												})
											}
											disabled={!day.isWorkday}
											required={day.isWorkday}
										/>
									</label>
									<label>
										End
										<input
											type="time"
											value={day.endTime}
											onChange={(e) =>
												updateWorkingDay(idx, {
													endTime: e.target.value,
												})
											}
											disabled={!day.isWorkday}
											required={day.isWorkday}
										/>
									</label>
								</div>
							</div>
						))}
					</div>
					<div className="profile__form-actions">
						<button
							type="submit"
							className="profile__btn profile__btn--primary"
							disabled={saveWorkingDaysMutation.isPending}>
							Save working days
						</button>
					</div>
				</form>
			</div>

			<button onClick={onLogout} className="profile__logout-btn">
				<Icon name="LogOut" size={20} />
				<span>Logout</span>
			</button>
		</div>
	);
};

export default Profile;
