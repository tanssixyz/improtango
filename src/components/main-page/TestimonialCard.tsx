interface TestimonialCardProps {
  quote: string;
}

export function TestimonialCard({ quote }: TestimonialCardProps) {
  return (
    <div className="group">
      <div className="bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-900/10 dark:hover:shadow-slate-200/10">
        <div className="relative">
          {/* Quote mark */}
          <div className="absolute -top-2 -left-1 text-3xl text-teal-500/60 leading-none">
            "
          </div>
          
          {/* Quote text */}
          <blockquote className="text-base leading-relaxed text-muted-foreground pl-6">
            {quote}
          </blockquote>
          
          {/* Closing quote mark */}
          <div className="text-right">
            <span className="text-3xl text-teal-500/60 leading-none">"</span>
          </div>
        </div>
      </div>
    </div>
  );
}