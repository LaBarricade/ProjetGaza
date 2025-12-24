import clsx from "clsx";

type TagVariant = "default" | "outline" | "soft";
type TagSize = "sm" | "md" | "lg";

const VARIANT_STYLES: Record<TagVariant, string> = {
  default: "bg-primary text-primary-foreground",
  outline: "border border-border text-foreground",
  soft: "bg-muted text-muted-foreground",
};

const SIZE_STYLES: Record<TagSize, string> = {
  sm: "text-xs px-1.5 py-0.5",
  md: "text-sm px-2 py-0.5",
  lg: "text-base px-3 py-1",
};

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  className?: string;
}

export function Tag({
  children,
  variant = "default",
  size = "md",
  className,
}: TagProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md font-medium whitespace-nowrap",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
    >
      {children}
    </span>
  );
}
