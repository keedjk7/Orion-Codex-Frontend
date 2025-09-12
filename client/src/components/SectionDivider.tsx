interface SectionDividerProps {
  variant?: 'default' | 'gradient' | 'dots';
  className?: string;
}

export default function SectionDivider({ variant = 'default', className = '' }: SectionDividerProps) {
  if (variant === 'gradient') {
    return (
      <div className={`relative py-12 ${className}`}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-background px-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-chart-3 rounded-full animate-pulse [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex justify-center py-8 ${className}`}>
        <div className="flex items-center gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === 2 ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative py-8 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-border"></div>
      </div>
    </div>
  );
}