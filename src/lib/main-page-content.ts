// Main page content loader
export interface MainPageSection {
  title?: string;
  content: string;
}

// Convert markdown to HTML with proper styling
function processMarkdown(markdown: string): string {
  let processed = markdown
    // Remove title from content if it exists (we'll use it separately)
    .replace(/^# (.+)$/m, '');

  // Process inline formatting first (before line processing)
  processed = processed
    // Strong text (bold) - **text** or __text__
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/__(.*?)__/g, '<strong class="text-foreground font-semibold">$1</strong>')
    // Italic text - *text* or _text_ (but not if already part of strong)
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="text-teal-600 italic">$1</em>')
    .replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em class="text-teal-600 italic">$1</em>')
    // Inline code - `code`
    .replace(/`([^`]+)`/g, '<code class="bg-teal-50 text-teal-700 px-2 py-1 rounded text-sm font-mono">$1</code>')
    // Links - [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-teal-600 hover:text-teal-700 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');

  // Process block elements
  processed = processed
    // Headers (h2, h3, h4)
    .replace(/### (.*)/g, '<h4 class="text-xl md:text-2xl font-bold text-foreground mt-10 mb-4">$1</h4>')
    .replace(/## (.*)/g, '<h3 class="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-6">$1</h3>')
    // Quote blocks - > text
    .replace(/^> (.+)/gm, '<blockquote class="border-l-4 border-teal-500 pl-4 my-6 italic text-muted-foreground bg-teal-50/30 py-3">$1</blockquote>')
    // Lists (unordered)
    .replace(/^- (.+)/gm, '<li class="flex items-start"><span class="shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-3 mr-4"></span><span class="text-muted-foreground leading-relaxed">$1</span></li>')
    // Lists (ordered) - 1. text
    .replace(/^\d+\. (.+)/gm, '<li class="flex items-start"><span class="shrink-0 w-6 h-6 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center mt-1 mr-4 font-medium">•</span><span class="text-muted-foreground leading-relaxed">$1</span></li>');

  // Wrap consecutive list items in ul tags
  processed = processed.replace(/(<li.*?<\/li>\s*)+/gs, '<ul class="space-y-4 my-8 not-prose">$&</ul>');

  // Process paragraphs (split by double newlines)
  const paragraphs = processed
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => {
      const trimmed = p.trim();
      // Don't wrap if already contains HTML tags (headers, lists, blockquotes, etc.)
      if (trimmed.includes('<h') || trimmed.includes('<ul') || trimmed.includes('<blockquote') || trimmed.includes('<li')) {
        return trimmed;
      }
      // Handle line breaks within paragraphs
      const withBreaks = trimmed.replace(/\n/g, '<br class="my-2">');
      return `<p class="text-muted-foreground leading-relaxed mb-4">${withBreaks}</p>`;
    })
    .join('');

  // Clean up any empty paragraphs and fix spacing
  return paragraphs
    .replace(/<p[^>]*>\s*<\/p>/g, '')
    .replace(/<br[^>]*>\s*<\/p>/g, '</p>')
    .replace(/<p[^>]*>\s*<br[^>]*>/g, '<p class="text-muted-foreground leading-relaxed mb-4">');
}

// Load and process a main page section
export async function loadMainPageSection(filename: string, language: string = 'fi'): Promise<MainPageSection> {
  try {
    const response = await fetch(`/content/${language}/main-page/${filename}`);
    if (!response.ok) {
      // Fallback to Finnish if English content is missing
      if (language !== 'fi') {
        console.warn(`English content for ${filename} not found, falling back to Finnish`);
        return loadMainPageSection(filename, 'fi');
      }
      throw new Error(`Failed to load ${filename}: ${response.statusText}`);
    }
    
    const text = await response.text();
    
    // Extract title from the first line if it starts with #
    const titleMatch = text.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : undefined;
    
    // Process the content
    const content = processMarkdown(text);
    
    return {
      title,
      content
    };
  } catch (error) {
    console.error(`Error loading main page section ${filename}:`, error);
    return {
      content: `<p class="text-red-400">Error loading content from ${filename}</p>`
    };
  }
}

// Load all main page sections
export async function loadAllMainPageSections(language: string = 'fi') {
  const sections = await Promise.all([
    loadMainPageSection('intro.md', language),
    loadMainPageSection('philosophy.md', language),
    loadMainPageSection('journey.md', language),
    loadMainPageSection('communication.md', language),
    loadMainPageSection('who-for.md', language)
  ]);
  
  return {
    intro: sections[0],
    philosophy: sections[1],
    journey: sections[2],
    communication: sections[3],
    whoFor: sections[4]
  };
}