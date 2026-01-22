import React from 'react';
import {
	Activity,
	AlertCircle,
	Calendar,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Clock,
	Edit,
	Home,
	LogOut,
	Mail,
	Menu,
	Moon,
	Plus,
	Save,
	Settings,
	Sun,
	Trash2,
	User,
	X,
} from 'lucide-react';

// Map of icon names to components
const iconMap = {
	Activity,
	AlertCircle,
	Calendar,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	Clock,
	Edit,
	Home,
	LogOut,
	Mail,
	Menu,
	Moon,
	Plus,
	Save,
	Settings,
	Sun,
	Trash2,
	User,
	X,
} as const;

export type IconName = keyof typeof iconMap;

export interface IconProps {
	name: IconName;
	size?: number | string;
	color?: string;
	className?: string;
	strokeWidth?: number;
	onClick?: () => void;
}

const Icon = React.memo<IconProps>(({
	name,
	size = 24,
	color = 'currentColor',
	className = '',
	strokeWidth = 2,
	onClick,
}) => {
	const IconComponent = iconMap[name];

	if (!IconComponent) {
		console.warn(`Icon "${name}" not found`);
		return null;
	}

	return (
		<IconComponent
			className={`icon ${className}`}
			size={size}
			color={color}
			strokeWidth={strokeWidth}
			onClick={onClick}
		/>
	);
});

Icon.displayName = 'Icon';

export default Icon;
