import React from 'react';
import { cn } from '@/lib/utils'; // For conditional class names

type TypographyVariant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'subtitle1' | 'subtitle2'
  | 'body1' | 'body2'
  | 'button' | 'caption' | 'overline';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: keyof JSX.IntrinsicElements; // Allow overriding the HTML tag
  children: React.ReactNode;
  className?: string;
  // Add other common text props if needed, e.g., 'noWrap', 'gutterBottom'
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  as,
  children,
  className,
  ...props
}) => {
  console.log("Rendering Typography with variant:", variant);

  const getElement = (): keyof JSX.IntrinsicElements => {
    if (as) return as;
    switch (variant) {
      case 'h1': return 'h1';
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'h4': return 'h4';
      case 'h5': return 'h5';
      case 'h6': return 'h6';
      case 'subtitle1':
      case 'subtitle2':
        return 'h6'; // Often h6 or p with specific styles
      case 'body1':
      case 'body2':
        return 'p';
      case 'button':
        return 'span'; // Buttons usually handle their own typography or use this for text within
      case 'caption':
      case 'overline':
        return 'span';
      default:
        return 'p';
    }
  };

  const getVariantClasses = (): string => {
    switch (variant) {
      case 'h1': return 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl';
      case 'h2': return 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0';
      case 'h3': return 'scroll-m-20 text-2xl font-semibold tracking-tight';
      case 'h4': return 'scroll-m-20 text-xl font-semibold tracking-tight';
      case 'h5': return 'scroll-m-20 text-lg font-semibold tracking-tight';
      case 'h6': return 'scroll-m-20 text-base font-semibold tracking-tight';
      case 'subtitle1': return 'text-lg font-medium leading-relaxed';
      case 'subtitle2': return 'text-base font-medium leading-normal';
      case 'body1': return 'leading-7 [&:not(:first-child)]:mt-2'; // Adjusted for less aggressive margin
      case 'body2': return 'text-sm leading-relaxed';
      case 'button': return 'text-sm font-medium uppercase tracking-wider';
      case 'caption': return 'text-xs text-muted-foreground';
      case 'overline': return 'text-xs uppercase tracking-wider text-muted-foreground';
      default: return 'leading-7';
    }
  };

  const Element = getElement();

  return (
    <Element className={cn(getVariantClasses(), className)} {...props}>
      {children}
    </Element>
  );
};

export default Typography;