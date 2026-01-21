import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { Form } from "@base-ui/react/form";
import { Field } from "@base-ui/react/field";

import Icon from "./Icon";
import Logo from "./ui/Logo/Logo";
import Avatar from "./ui/Avatar/Avatar";
import { Button } from "./ui/Button/Button";
import { useTheme, useAuth } from "@/context";
import "./Sidebar.scss";

const Sidebar = React.memo(() => {
	const { theme, toggleTheme } = useTheme();
	const { user } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formErrors, setFormErrors] = useState<{
		title?: string;
		date?: string;
		startTime?: string;
		endTime?: string;
		type?: string;
	}>({});

	const appointmentTypes = [
		{
			value: "Consultation",
			label: "Consultation",
			hint: "Prep and planning",
		},
		{
			value: "NewTattoo",
			label: "New Tattoo",
			hint: "Full new tattoo session",
		},
		{
			value: "TouchUp",
			label: "Touch Up",
			hint: "Follow-up for existing work",
		},
		{
			value: "Blocker",
			label: "Blocker",
			hint: "Reserve time (no client)",
		},
	];

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isModalOpen) closeModal();
		};
		if (isModalOpen) document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [isModalOpen]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormErrors({});

		const formData = new FormData(e.currentTarget);
		const appointmentData = {
			title: formData.get("title") as string,
			date: formData.get("date") as string,
			startTime: formData.get("startTime") as string,
			endTime: formData.get("endTime") as string,
			type: formData.get("type") as string,
		};

		console.log("Creating appointment:", appointmentData);
		// TODO: wire to appointments API

		closeModal();
	};

	return (
		<nav className="sidebar">
			<Logo />
			<div className="sidebar__list">
				<div className="sidebar__item">
					<Link to="/dashboard" className="sidebar__link">
						<Icon name="Grid" size={20} />
						<span>Dashboard</span>
					</Link>
				</div>
				<div className="sidebar__item">
					<Link to="/dashboard" className="sidebar__link">
						<Icon name="Grid" size={20} />
						<span>Feed</span>
					</Link>
				</div>
				<div className="sidebar__item">
					<Link to="/dashboard" className="sidebar__link">
						<Icon name="Check" size={20} />
						<span>To Do</span>
					</Link>
				</div>
			</div>

			<Button
				className="sidebar__action"
				onClick={openModal}
				variant="ghost"
				type="button">
				<Icon name="Plus" size={20} />
			</Button>

			<div className="sidebar__list">
				<div className="sidebar__item">
					<Button
						onClick={toggleTheme}
						className="sidebar__link"
						variant="ghost"
						type="button"
						aria-label="Toggle theme">
						<Icon
							name={theme === "light" ? "Moon" : "Sun"}
							size={20}
						/>
						<span>{theme === "light" ? "Dark" : "Light"} Mode</span>
					</Button>
				</div>
			</div>

			<div className="sidebar__user">
				{user && (
					<Link to="/profile" className="sidebar__link">
						<Avatar name={user.name} size="md" />
						<div className="sidebar__user-info">
							<span className="sidebar__user-name">
								{user.name}
							</span>
							<span className="sidebar__user-email">
								{user.email}
							</span>
						</div>
					</Link>
				)}
			</div>

			{isModalOpen &&
				createPortal(
					<div
						className="sidebar__modal-overlay"
						onClick={closeModal}>
						<div
							className="sidebar__modal"
							onClick={(e) => e.stopPropagation()}>
							<div className="sidebar__modal-header">
								<h3>New appointment</h3>
							</div>
							<Form
								className="sidebar__form"
								onSubmit={handleSubmit}
								errors={formErrors}>
								<Field.Root
									name="title"
									className="sidebar__field">
									<Field.Label className="sidebar__field-label">
										Title
									</Field.Label>
									<Field.Control
										required
										placeholder="Appointment title"
										className="sidebar__field-input"
									/>
									<Field.Error className="sidebar__field-error" />
								</Field.Root>

								<Field.Root
									name="date"
									className="sidebar__field">
									<Field.Label className="sidebar__field-label">
										Date
									</Field.Label>
									<Field.Control
										type="date"
										required
										className="sidebar__field-input"
									/>
									<Field.Error className="sidebar__field-error" />
								</Field.Root>

								<Field.Root
									name="startTime"
									className="sidebar__field">
									<Field.Label className="sidebar__field-label">
										Start time
									</Field.Label>
									<Field.Control
										type="time"
										required
										className="sidebar__field-input"
									/>
									<Field.Error className="sidebar__field-error" />
								</Field.Root>

								<Field.Root
									name="endTime"
									className="sidebar__field">
									<Field.Label className="sidebar__field-label">
										End time
									</Field.Label>
									<Field.Control
										type="time"
										required
										className="sidebar__field-input"
									/>
									<Field.Error className="sidebar__field-error" />
								</Field.Root>

								<fieldset className="sidebar__radio-group">
									<legend className="sidebar__field-label">
										Type
									</legend>
									{appointmentTypes.map((option, index) => (
										<label
											key={option.value}
											className="sidebar__radio-option">
											<input
												type="radio"
												name="type"
												value={option.value}
												defaultChecked={index === 0}
												required
											/>
											<span className="sidebar__radio-label">
												{option.label}
											</span>
											<span className="sidebar__radio-hint">
												{option.hint}
											</span>
										</label>
									))}
								</fieldset>

								<div className="sidebar__form-actions">
									<Button
										variant="ghost"
										type="button"
										onClick={closeModal}>
										Cancel
									</Button>
									<Button variant="primary" type="submit">
										Save
									</Button>
								</div>
							</Form>
						</div>
					</div>,
					document.body,
				)}
		</nav>
	);
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
