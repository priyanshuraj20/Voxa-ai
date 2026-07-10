import React from "react";
import { Link as RouterLink } from "react-router-dom";

export default function Link({
  href,
  children,
  ...props
}: {
  href: any;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const url = typeof href === "string" ? href : href?.pathname || "";

  if (url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return (
      <a href={url} {...props}>
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={url} {...props}>
      {children}
    </RouterLink>
  );
}
