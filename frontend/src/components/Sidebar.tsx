import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";

import Icon from "./Icon";
import Logo from "./ui/Logo/Logo";
import "./Sidebar.scss";

const Sidebar = React.memo(() => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const modalId = "create-appointment";
	const [form, setForm] = useState({
		title: "",
		date: "",
		startTime: "",
		endTime: "",
		type: "Consultation",
	});

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

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// TODO: wire to appointments API
		closeModal();
	};

	return (
		<nav className="sidebar">
			<div className="sidebar__logo-wrapper">
				<Link to="/dashboard" className="sidebar__logo-link">
					<Logo />
				</Link>
			</div>
			<ul className="sidebar__list">
				<li className="sidebar__item">
					<Link to="/dashboard" className="sidebar__link">
						<Icon name="Grid" size={20} />
						<span>Dashboard</span>
					</Link>
				</li>
			</ul>
			<ul className="sidebar__list">
				<li className="sidebar__item">
					<Link to="/profile" className="sidebar__link">
						<Icon name="Settings" size={20} />
						<span>Profile</span>
					</Link>
				</li>
			</ul>

			<button
				className="sidebar__action"
				onClick={openModal}
				type="button">
				<Icon name="Plus" size={20} />
				<span>New appointment</span>
			</button>

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
								<button
									type="button"
									onClick={closeModal}
									aria-label="Close">
									<Icon name="X" size={20} />
								</button>
							</div>
							<form
								className="sidebar__form"
								onSubmit={handleSubmit}>
								<label>
									Title
									<input
										name="title"
										value={form.title}
										onChange={handleChange}
										required
									/>
								</label>
								<label>
									Date
									<input
										type="date"
										name="date"
										value={form.date}
										onChange={handleChange}
										required
									/>
								</label>
								<label>
									Start time
									<input
										type="time"
										name="startTime"
										value={form.startTime}
										onChange={handleChange}
										required
									/>
								</label>
								<label>
									End time
									<input
										type="time"
										name="endTime"
										value={form.endTime}
										onChange={handleChange}
										required
									/>
								</label>
								<fieldset className="sidebar__radio-group">
									<legend>Type</legend>
									{appointmentTypes.map((option) => (
										<label
											key={option.value}
											className="sidebar__radio-option">
											<input
												type="radio"
												name="type"
												value={option.value}
												checked={
													form.type === option.value
												}
												onChange={handleChange}
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
									<button
										type="button"
										onClick={closeModal}
										className="sidebar__btn sidebar__btn--ghost">
										Cancel
									</button>
									<button
										type="submit"
										className="sidebar__btn sidebar__btn--primary">
										Save
									</button>
								</div>
							</form>
						</div>
					</div>,
					document.body,
				)}
		</nav>
	);
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
