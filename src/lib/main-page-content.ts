// Main page content loader
export interface MainPageSection {
  title?: string;
  content: string;
}

// Convert markdown to HTML with proper styling
function processMarkdown(markdown: string): string {
  return markdown
    // Remove title from content if it exists (we'll use it separately)
    .replace(/^# (.+)$/m, '')
    // Headers
    .replace(/## (.*)/g, '<h3 class="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-6">$1</h3>')
    // Lists
    .replace(/^- (.+)/gm, '<li class="flex items-start"><span class="shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-3 mr-4"></span><span class="text-muted-foreground leading-relaxed">$1</span></li>')
    // Wrap lists
    .replace(/(<li.*<\/li>\s*)+/gs, '<ul class="space-y-4 my-8 not-prose">$&</ul>')
    // Strong text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    // Paragraphs (split by double newlines)
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => p.trim() ? `<p class="text-muted-foreground leading-relaxed mb-4">${p.trim()}</p>` : '')
    .join('')
    // Clean up any empty paragraphs
    .replace(/<p[^>]*>\s*<\/p>/g, '');
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