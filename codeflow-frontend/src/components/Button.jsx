
import * as React from "react";
import { clsx } from "clsx";

// DaisyUI Button component with ShadCN-like API and forwardRef
const variantClasses = {
  default: "btn-primary",
  destructive: "btn-error",
  outline: "btn-outline",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  link: "btn-link",
};

const sizeClasses = {
  default: "btn-md",
  sm: "btn-sm",
  lg: "btn-lg",
  icon: "btn-square btn-md",
};

export const Button = React.forwardRef(function Button(
  { className, variant = "default", size = "default", asChild = false, children, style, ...props },
  ref
) {
  const Comp = asChild ? "span" : "button";
  const buttonClasses = clsx(
    "btn",
    "border-0",
    "outline-none",
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.default,
    className
  );

  if (asChild) {
    return (
      <span className={buttonClasses} style={style} ref={ref}>
        {children}
      </span>
    );
  }

  return (
    <button
      className={buttonClasses}
      style={style}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

export const buttonVariants = { variantClasses, sizeClasses };
