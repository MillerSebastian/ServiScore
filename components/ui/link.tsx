import React from "react";
import Link from "next/link";

export interface UiLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function UiLink({ href, children, className = "", ...props }: UiLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("//");

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} legacyBehavior>
      <a className={className} {...props}>{children}</a>
    </Link>
  );
}

export default UiLink;
