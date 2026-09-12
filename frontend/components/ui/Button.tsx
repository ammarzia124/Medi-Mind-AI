import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, fullWidth, className = '', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-[#0D9488] text-white hover:bg-[#0F766E] focus:ring-[#0D9488] shadow-sm hover:shadow-md hover:scale-[1.02]',
      secondary: 'bg-[#F0FDFA] text-[#0D9488] border-2 border-[#CCFBF1] hover:bg-[#CCFBF1] focus:ring-[#0D9488]',
      outline: 'bg-transparent text-[#0D9488] border-2 border-[#0D9488] hover:bg-[#0D9488] hover:text-white focus:ring-[#0D9488]',
      ghost: 'bg-transparent text-text-secondary hover:bg-[#F0FDFA] hover:text-[#0D9488] focus:ring-[#0D9488]',
      danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-[#EF4444] shadow-sm hover:shadow-md',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
