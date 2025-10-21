import type { ReactNode } from 'react';

interface MarkdownContentProps {
  children?: ReactNode;
  content?: string;
  className?: string;
}

export function MarkdownContent({ children, content, className = "" }: MarkdownContentProps) {
  const baseClasses = "prose prose-lg prose-slate dark:prose-invert max-w-none";
  const combinedClasses = `${baseClasses} ${className}`;

  // Custom styles for images and other elements
  const customStyles = `
    .prose img {
      border-radius: 0.5rem;
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      max-width: 100%;
      height: auto;
      margin: 2rem auto;
      display: block;
    }
    
    .prose img[alt*="broken"],
    .prose img:not([src]),
    .prose img[src=""] {
      display: none;
    }
    
    .prose h2 {
      color: rgb(20 184 166);
      margin-top: 3rem;
      margin-bottom: 1.5rem;
    }
    
    .prose h3 {
      color: rgb(20 184 166);
      margin-top: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .prose h4 {
      color: rgb(20 184 166);
      margin-top: 2rem;
      margin-bottom: 0.75rem;
    }
    
    .prose p {
      margin-bottom: 1.5rem;
      line-height: 1.7;
      color: rgb(203 213 225);
    }
    
    .prose a {
      color: rgb(20 184 166);
      text-decoration: underline;
    }
    
    .prose a:hover {
      color: rgb(13 148 136);
    }
    
    .prose ul {
      margin: 1.5rem 0;
    }
    
    .prose li {
      margin: 0.5rem 0;
      color: rgb(203 213 225);
    }
    
    .prose {
      color: rgb(203 213 225);
    }
  `;

  if (content) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        <div 
          className={combinedClasses}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className={combinedClasses}>
        {children}
      </div>
    </>
  );
}