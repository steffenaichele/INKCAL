import React from 'react';
import * as Icons from 'react-feather';
import './Icon.scss';

export type IconName = keyof typeof Icons;

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
	const IconComponent = Icons[name] as React.ComponentType<any>;

	if (!IconComponent) {
		console.warn(`Icon "${name}" not found in react-feather`);
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
