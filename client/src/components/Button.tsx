import { Link } from "react-router-dom";

import type { LinkProps } from "react-router-dom";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

type RadiusSize = "none" | "sm" | "md" | "lg" | "xl" | "full";
type IconPosition = "left" | "right" | "both";

interface ButtonProps extends Partial<LinkProps> {
  label: string;
  to?: string;
  variant?: "filled" | "outlined" | "text" | "none";
  icon?: ReactNode;
  iconRight?: ReactNode;
  iconPosition?: IconPosition;
  iconHoverColor?: string;
  iconClassName?: string;
  radius?: RadiusSize;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  label,
  to = "#",
  variant = "filled",
  icon,
  iconRight,
  iconPosition = "left",
  iconHoverColor,
  iconClassName = "",
  onClick,
  radius = "md",
  className = "",
  loading = false,
  disabled = false,
  type,
  ...rest
}: ButtonProps) {
  const radiusClasses: Record<RadiusSize, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const variants = {
    filled: "bg-primary text-white hover:bg-primary-dark border-transparent",
    outlined:
      "border-2 border-primary text-primary hover:bg-primary/10 hover:border-primary-dark",
    text: "text-primary hover:text-primary-dark underline underline-offset-4",
    none: "", // No default styles
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      e.preventDefault();
      onClick(e as any);
    }
  };

  const isDisabled = disabled || loading;

  // Determine which icons to show based on position
  const showLeftIcon =
    (iconPosition === "left" || iconPosition === "both") && icon;
  const showRightIcon =
    (iconPosition === "right" || iconPosition === "both") &&
    (iconRight || icon);

  // Build icon hover class if custom color is provided
  const iconHoverStyle = iconHoverColor
    ? ({ "--icon-hover-color": iconHoverColor } as React.CSSProperties)
    : undefined;

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // If type is provided, render as button instead of Link
  if (type) {
    return (
      <button
        type={type}
        onClick={handleClick}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "group inline-flex items-center justify-center gap-2 px-4 py-2",
          "text-base font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          // Radius
          radiusClasses[radius],
          // Variant styles
          variants[variant],
          // Disabled state
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          // Custom className (highest priority)
          className
        )}
      >
        {loading && <LoadingSpinner />}
        {!loading && showLeftIcon && (
          <span
            className={cn(
              "[&>svg]:w-5 [&>svg]:h-5 [&>svg]:transition-colors [&>svg]:duration-200",
              iconHoverColor &&
                "group-hover:[&>svg]:[color:var(--icon-hover-color,currentColor)]",
              iconClassName
            )}
            style={iconHoverStyle}
          >
            {icon}
          </span>
        )}
        {label}
        {!loading && showRightIcon && (
          <span
            className={cn(
              "[&>svg]:w-5 [&>svg]:h-5 [&>svg]:transition-colors [&>svg]:duration-200",
              iconHoverColor &&
                "group-hover:[&>svg]:[color:var(--icon-hover-color,currentColor)]",
              iconClassName
            )}
            style={iconHoverStyle}
          >
            {iconPosition === "both" ? iconRight || icon : iconRight || icon}
          </span>
        )}
        {variant === "text" && !showRightIcon && !loading && (
          <span aria-hidden="true" className="ml-1.5 transition-transform">
            →
          </span>
        )}
      </button>
    );
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={cn(
        // Base styles
        "group inline-flex items-center justify-center gap-2 px-4 py-2",
        "text-base font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        // Radius
        radiusClasses[radius],
        // Variant styles (can be overridden by className)
        variants[variant],
        // Disabled state
        isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
        // Custom className (highest priority)
        className
      )}
      {...rest}
    >
      {loading && <LoadingSpinner />}
      {!loading && showLeftIcon && (
        <span
          className={cn(
            "[&>svg]:w-5 [&>svg]:h-5 [&>svg]:transition-colors [&>svg]:duration-200",
            iconHoverColor &&
              "group-hover:[&>svg]:[color:var(--icon-hover-color,currentColor)]",
            iconClassName
          )}
          style={iconHoverStyle}
        >
          {icon}
        </span>
      )}
      {label}
      {!loading && showRightIcon && (
        <span
          className={cn(
            "[&>svg]:w-5 [&>svg]:h-5 [&>svg]:transition-colors [&>svg]:duration-200",
            iconHoverColor &&
              "group-hover:[&>svg]:[color:var(--icon-hover-color,currentColor)]",
            iconClassName
          )}
          style={iconHoverStyle}
        >
          {iconPosition === "both" ? iconRight || icon : iconRight || icon}
        </span>
      )}
      {variant === "text" && !showRightIcon && !loading && (
        <span aria-hidden="true" className="ml-1.5 transition-transform">
          →
        </span>
      )}
    </Link>
  );
}
