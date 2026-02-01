import clsx from 'clsx';

type TagVariant = 'default' | 'outline' | 'soft' | 'solid';
type TagSize = 'sm' | 'md' | 'lg';

const VARIANT_STYLES: Record<TagVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  outline: 'border border-border text-foreground',
  soft: 'bg-muted text-muted-foreground',
  solid: 'bg-black text-white',
};

const SIZE_STYLES: Record<TagSize, string> = {
  sm: 'text-xs px-1.5 py-0.75',
  md: 'text-sm px-2 py-0.5',
  lg: 'text-base px-3 py-1',
};

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  className?: string;
  style?: React.CSSProperties;
}

export function Tag({ children, variant = 'default', size = 'md', className, style }: TagProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-lg font-medium whitespace-nowrap',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
