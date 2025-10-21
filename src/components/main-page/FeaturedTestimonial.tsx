interface FeaturedTestimonialProps {
  title: string;
  quote: string;
}

export function FeaturedTestimonial({ title, quote }: FeaturedTestimonialProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="border border-border rounded-xl p-8 md:p-12 bg-card/50 backdrop-blur-sm">
        <div className="text-center">
          {/* Quote */}
          <blockquote className="text-xl md:text-2xl leading-relaxed text-muted-foreground mb-6 font-medium">
            <span className="text-4xl text-teal-500 leading-none">"</span>
            {quote}
            <span className="text-4xl text-teal-500 leading-none">"</span>
          </blockquote>
          
          {/* Title */}
          <cite className="text-lg md:text-xl font-bold text-teal-500 not-italic">
            {title}
          </cite>
        </div>
      </div>
    </div>
  );
}