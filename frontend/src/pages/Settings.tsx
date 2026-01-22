import { useAuth } from "@/context";
import { Navigate, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form } from "@base-ui/react/form";
import { Field } from "@base-ui/react/field";
import { Button as BaseButton } from "@base-ui/react/button";
import Icon from "@/components/common/Icon";
import { Button } from "@/components/ui/Button";
import { workdaysApi } from "@/services/api/workdays";
import type { DayConfig, DayOfWeek, WorkdaysInput } from "@/types/api";
import "@/styles/pages/Settings.scss";

interface ProfileProps {
	onClose?: () => void;
}

const Profile = ({ onClose }: ProfileProps) => {
	const { signedIn, user, handleSignOut } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [passwordErrors, setPasswordErrors] = useState<{
		currentPassword?: string;
		newPassword?: string;
		confirmPassword?: string;
	}>({});
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

	const { data: workdaysData } = useQuery({
		queryKey: ["workdays", user?._id],
		queryFn: () => workdaysApi.getByUserId(user!._id),
		enabled: !!user,
	});

	const initialWorkingDays = useMemo(
		() =>
			dayOrder.map(({ label, value }) => {
				const match = workdaysData?.workdays.find(
					(workday: DayConfig) => workday.dayOfWeek === value,
				);
				return {
					label,
					dayOfWeek: value,
					isWorkday:
						match?.isWorkday ??
						!["saturday", "sunday"].includes(value),
					startTime: match?.startTime ?? "09:00",
					endTime: match?.endTime ?? "17:00",
				};
			}),
		[dayOrder, workdaysData],
	);

	const [workingDays, setWorkingDays] = useState(initialWorkingDays);

	useEffect(() => {
		setWorkingDays(initialWorkingDays);
	}, [initialWorkingDays]);

	const saveWorkingDaysMutation = useMutation({
		mutationFn: (payload: WorkdaysInput) =>
			workdaysApi.update(user!._id, payload),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["workdays", user?._id],
				refetchType: "active",
			});
			alert("Working days updated successfully!");
		},
		onError: (error: any) => {
			console.error("Failed to update working days:", error);
			alert("Failed to update working days. Please try again.");
		},
	});

	if (!signedIn || !user) {
		return <Navigate to="/" replace />;
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
		setPasswordErrors({});
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
				{onClose && (
					<BaseButton
						className="profile__close-btn"
						onClick={onClose}>
						<Icon name="X" size={24} />
					</BaseButton>
				)}
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
				<Form
					className="profile__form"
					onSubmit={submitPassword}
					errors={passwordErrors}>
					<Field.Root
						name="currentPassword"
						className="profile__field">
						<Field.Label className="profile__label">
							Current password
						</Field.Label>
						<Field.Control
							type="password"
							required
							className="profile__input"
							value={passwordForm.currentPassword}
							onChange={handlePasswordChange}
						/>
						<Field.Error className="profile__error" />
					</Field.Root>
					<Field.Root name="newPassword" className="profile__field">
						<Field.Label className="profile__label">
							New password
						</Field.Label>
						<Field.Control
							type="password"
							required
							className="profile__input"
							value={passwordForm.newPassword}
							onChange={handlePasswordChange}
						/>
						<Field.Error className="profile__error" />
					</Field.Root>
					<Field.Root
						name="confirmPassword"
						className="profile__field">
						<Field.Label className="profile__label">
							Confirm new password
						</Field.Label>
						<Field.Control
							type="password"
							required
							className="profile__input"
							value={passwordForm.confirmPassword}
							onChange={handlePasswordChange}
						/>
						<Field.Error className="profile__error" />
					</Field.Root>
					<div className="profile__form-actions">
						<Button type="submit" variant="primary">
							Update password
						</Button>
					</div>
				</Form>
			</div>

			<div className="profile__section">
				<h2 className="profile__section-title">Working days</h2>
				<Form className="profile__form" onSubmit={submitWorkingDays}>
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
									<Field.Root
										name={`${day.dayOfWeek}_start`}
										className="profile__time-field">
										<Field.Label className="profile__time-label">
											Start
										</Field.Label>
										<Field.Control
											type="time"
											className="profile__time-input"
											value={day.startTime}
											onChange={(e) =>
												updateWorkingDay(idx, {
													startTime: e.target.value,
												})
											}
											disabled={!day.isWorkday}
											required={day.isWorkday}
										/>
									</Field.Root>
									<Field.Root
										name={`${day.dayOfWeek}_end`}
										className="profile__time-field">
										<Field.Label className="profile__time-label">
											End
										</Field.Label>
										<Field.Control
											type="time"
											className="profile__time-input"
											value={day.endTime}
											onChange={(e) =>
												updateWorkingDay(idx, {
													endTime: e.target.value,
												})
											}
											disabled={!day.isWorkday}
											required={day.isWorkday}
										/>
									</Field.Root>
								</div>
							</div>
						))}
					</div>
					<div className="profile__form-actions">
						<Button
							type="submit"
							variant="primary"
							disabled={saveWorkingDaysMutation.isPending}>
							Save working days
						</Button>
					</div>
				</Form>
			</div>

			<Button
				onClick={onLogout}
				variant="danger"
				className="profile__logout-btn">
				<Icon name="LogOut" size={20} />
				<span>Logout</span>
			</Button>
		</div>
	);
};

export default Profile;
