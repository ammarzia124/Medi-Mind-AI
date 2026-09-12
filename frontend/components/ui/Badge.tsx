interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export default function Badge({ variant = 'neutral', size = 'sm', children }: BadgeProps) {
  const variants = {
    success: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
    danger: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
    info: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
