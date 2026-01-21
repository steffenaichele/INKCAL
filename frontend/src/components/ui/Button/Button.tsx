import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react';
import './Button.scss';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      type = 'button',
      onClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      fullWidth && 'base-button--full-width',
      loading && 'base-button--loading',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <BaseButton
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        type={type}
        onClick={onClick}
        {...props}
      >
        {children}
      </BaseButton>
    );
  }
);

Button.displayName = 'Button';
