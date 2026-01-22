import { useState, useEffect } from "react";
import "./Clock.scss";

interface ClockProps {
	className?: string;
}

const Clock = ({ className }: ClockProps) => {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		// Cleanup interval on unmount
		return () => clearInterval(timer);
	}, []);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("de-DE", {
			weekday: "long",
			year: "2-digit",
			month: "2-digit",
			day: "numeric",
		});
	};

	return (
		<div className={`clock ${className || ""}`}>
			<span className="clock__date-value">{formatDate(currentTime)}</span>
			<span className="clock__time-value">{formatTime(currentTime)}</span>
		</div>
	);
};

export default Clock;
