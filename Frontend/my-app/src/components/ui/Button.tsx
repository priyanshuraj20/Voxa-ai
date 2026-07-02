import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all font-sans rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none select-none active:scale-98";

  const variants = {
    primary: "bg-[#6366f1] hover:bg-[#4f46e5] text-white",
    secondary: "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white",
    outline: "border border-zinc-800 hover:border-zinc-700 text-white bg-transparent",
    ghost: "text-zinc-400 hover:text-white bg-transparent",
    white: "bg-white text-black hover:bg-zinc-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-sm",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
