import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionShellProps {
  id?: string;
  eyebrow?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  aside,
  children,
  className,
  style,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full border-b select-none relative z-10",
        className
      )}
      style={{
        backgroundColor: "var(--surface-base)",
        borderColor: "var(--border-subtle)",
        paddingTop: "var(--section-y-desktop)",
        paddingBottom: "var(--section-y-desktop)",
        contentVisibility: "auto",
        ...style,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {(eyebrow || title || description || aside) && (
          <div className="mb-12 md:mb-16">
            {eyebrow && (
              <span
                className="type-label uppercase block mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {eyebrow.replace(/^\/\/\s*/, "")}
              </span>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className={aside ? "lg:col-span-7 space-y-4" : "lg:col-span-12 space-y-4"}>
                {title && (
                  <h2
                    className="type-display-lg font-normal tracking-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    className="type-body-lg font-normal leading-relaxed max-w-[68ch]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {description}
                  </p>
                )}
              </div>
              {aside && (
                <div
                  className="lg:col-span-5 border-l pl-6 pt-1"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  {aside}
                </div>
              )}
            </div>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
