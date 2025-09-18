import * as React from 'react';

import { clsx } from "clsx";

const variantClasses = {
	default: "input input-bordered w-full",
	error: "input input-error w-full",
	success: "input input-success w-full",
	ghost: "input input-ghost w-full",
};

const sizeClasses = {
	default: "input-md",
	sm: "input-sm",
	lg: "input-lg",
};

export const Input = React.forwardRef(function Input(
	{ className, type = "text", variant = "default", size = "default", ...props },
	ref
) {
	const inputClasses = clsx(
		variantClasses[variant] || variantClasses.default,
		sizeClasses[size] || sizeClasses.default,
		className
	);

	return (
		<input
			type={type}
			className={inputClasses}
			ref={ref}
			{...props}
		/>
	);
});
Input.displayName = "Input";

export const inputVariants = { variantClasses, sizeClasses };
