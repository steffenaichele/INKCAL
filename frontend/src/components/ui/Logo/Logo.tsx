import "./Logo.scss";

interface LogoProps {
	className?: string;
}

const Logo = ({ className }: LogoProps) => (
	<div className={`logo-wrapper ${className || ""}`} aria-label="INKCAL logo">
		<svg
			className="logo"
			width="40"
			height="40"
			viewBox="0 0 40 40"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<rect
				x="24"
				y="4"
				width="8"
				height="8"
				rx="4"
				transform="rotate(90 24 4)"
			/>
			<rect
				x="24"
				y="16"
				width="8"
				height="8"
				rx="4"
				transform="rotate(90 24 16)"
			/>
			<rect
				x="13"
				y="10"
				width="8"
				height="8"
				rx="4"
				transform="rotate(90 13 10)"
			/>
			<rect
				x="35"
				y="10"
				width="8"
				height="8"
				rx="4"
				transform="rotate(90 35 10)"
			/>
			<rect
				x="24"
				y="28"
				width="8"
				height="8"
				rx="4"
				transform="rotate(90 24 28)"
			/>
			<rect
				x="13"
				y="22"
				width="8"
				height="8"
				rx="4"
				transform="rotate(90 13 22)"
			/>
			<rect
				x="35"
				y="22"
				width="8"
				height="8"
				rx="4"
				transform="rotate(90 35 22)"
			/>
		</svg>
	</div>
);

export default Logo;
