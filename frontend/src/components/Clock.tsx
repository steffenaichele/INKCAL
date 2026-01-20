import { useState, useEffect } from 'react';
import Icon from './Icon';
import './Clock.scss';

const Clock = () => {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		// Cleanup interval on unmount
		return () => clearInterval(timer);
	}, []);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		});
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<div className="clock">
			<div className="clock__time">
				<Icon name="Clock" size={24} className="clock__icon" />
				<span className="clock__time-value">{formatTime(currentTime)}</span>
			</div>
			<div className="clock__date">
				<Icon name="Calendar" size={20} className="clock__icon" />
				<span className="clock__date-value">{formatDate(currentTime)}</span>
			</div>
		</div>
	);
};

export default Clock;
