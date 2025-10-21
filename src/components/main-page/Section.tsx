import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/AnimatedSection";

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  variant?: "default" | "muted" | "card";
  className?: string;
}

const backgroundVariants = {
  default: "bg-background",
  muted: "bg-muted/30",
  card: "bg-card",
};

export function Section({ 
  title, 
  children, 
  variant = "default", 
  className 
}: SectionProps) {
  return (
    <section 
      className={cn(
        "py-20 md:py-32",
        backgroundVariants[variant],
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {title && (
            <AnimatedSection delay={0.2}>
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {title}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full opacity-80"></div>
              </div>
            </AnimatedSection>
          )}
          
          <AnimatedSection delay={0.4}>
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none
                            prose-headings:text-foreground 
                            prose-p:text-muted-foreground 
                            prose-p:leading-relaxed
                            prose-strong:text-foreground
                            prose-em:text-muted-foreground
                            prose-a:text-primary
                            prose-a:no-underline
                            hover:prose-a:text-primary/80
                            prose-blockquote:border-l-primary
                            prose-blockquote:text-muted-foreground">
              {children}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}