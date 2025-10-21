import { MarkdownContent } from "@/components/MarkdownContent";
import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/lib/language-context";

export default function About() {
  const { language, t } = useLanguage();
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // Load the markdown content from the file based on language
    fetch(`/content/${language}/about.md`)
      .then((response) => response.text())
      .then((text) => {
        // Remove the frontmatter (everything between --- markers)
        const contentWithoutFrontmatter = text.replace(/^---[\s\S]*?---\n/, "");

        // Convert markdown to HTML (basic conversion)
        let html = contentWithoutFrontmatter
          // Clean up any stray # characters on their own lines
          .replace(/^\s*#\s*$/gm, "")
          // Headers (order matters - process #### before ###)
          .replace(
            /#### (.*)/g,
            '<h4 class="text-xl md:text-2xl font-bold text-teal-400 mt-12 mb-4">$1</h4>'
          )
          .replace(
            /### (.*)/g,
            '<h3 class="text-2xl md:text-3xl font-bold text-teal-500 mt-16 mb-6 first:mt-0">$1</h3>'
          )
          // Paragraphs
          .replace(
            /\n\n/g,
            '</p><p class="text-muted-foreground leading-relaxed mb-6">'
          )
          // Images (convert MDX Image components to regular img tags)
          .replace(
            /<Image src="([^"]*)" alt="([^"]*)" width={\d+} height={\d+} \/>/g,
            '<img src="/images$1" alt="$2" class="w-full rounded-lg shadow-lg my-8" />'
          )
          // Regular markdown images
          .replace(
            /!\[([^\]]*)\]\(([^)]*)\)/g,
            '<img src="/images$2" alt="$1" class="w-full rounded-lg shadow-lg my-8" />'
          )
          // Links
          .replace(
            /\[([^\]]*)\]\(([^)]*)\)/g,
            '<a href="$2" class="text-teal-400 hover:text-teal-300 underline" target="_blank" rel="noopener noreferrer">$1</a>'
          )
          // Bold text
          .replace(
            /\*\*(.*?)\*\*/g,
            '<strong class="text-foreground font-semibold">$1</strong>'
          )
          // Lists
          .replace(
            /<ul className="my-4">/g,
            '<ul class="list-disc list-inside space-y-2 my-6 text-muted-foreground">'
          )
          .replace(
            /<ul>/g,
            '<ul class="list-disc list-inside space-y-2 my-6 text-muted-foreground">'
          )
          .replace(/<li>/g, '<li class="leading-relaxed">')
          .replace(
            /<span className="font-bold">/g,
            '<span class="font-semibold text-foreground">'
          );

        // Wrap content in paragraph tags
        html =
          '<p class="text-muted-foreground leading-relaxed mb-6">' +
          html +
          "</p>";

        setContent(html);
      })
      .catch((error) => {
        console.error("Error loading about content:", error);
        // Try fallback to Finnish if English fails
        if (language !== "fi") {
          fetch("/content/fi/about.md")
            .then((response) => response.text())
            .then((text) => {
              const contentWithoutFrontmatter = text.replace(
                /^---[\s\S]*?---\n/,
                ""
              );
              let html = contentWithoutFrontmatter
                .replace(/^\s*#\s*$/gm, "")
                .replace(
                  /#### (.*)/g,
                  '<h4 class="text-xl md:text-2xl font-bold text-teal-400 mt-12 mb-4">$1</h4>'
                )
                .replace(
                  /### (.*)/g,
                  '<h3 class="text-2xl md:text-3xl font-bold text-teal-500 mt-16 mb-6 first:mt-0">$1</h3>'
                )
                .replace(
                  /\n\n/g,
                  '</p><p class="text-muted-foreground leading-relaxed mb-6">'
                )
                .replace(
                  /<Image src="([^"]*)" alt="([^"]*)" width={\d+} height={\d+} \/>/g,
                  '<img src="/images$1" alt="$2" class="w-full rounded-lg shadow-lg my-8" />'
                )
                .replace(
                  /!\[([^\]]*)\]\(([^)]*)\)/g,
                  '<img src="/images$2" alt="$1" class="w-full rounded-lg shadow-lg my-8" />'
                )
                .replace(
                  /\[([^\]]*)\]\(([^)]*)\)/g,
                  '<a href="$2" class="text-teal-400 hover:text-teal-300 underline" target="_blank" rel="noopener noreferrer">$1</a>'
                )
                .replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="text-foreground font-semibold">$1</strong>'
                )
                .replace(
                  /<ul className="my-4">/g,
                  '<ul class="list-disc list-inside space-y-2 my-6 text-muted-foreground">'
                )
                .replace(
                  /<ul>/g,
                  '<ul class="list-disc list-inside space-y-2 my-6 text-muted-foreground">'
                )
                .replace(/<li>/g, '<li class="leading-relaxed">')
                .replace(
                  /<span className="font-bold">/g,
                  '<span class="font-semibold text-foreground">'
                );
              html =
                '<p class="text-muted-foreground leading-relaxed mb-6">' +
                html +
                "</p>";
              setContent(html);
            })
            .catch(() => {
              setContent('<p class="text-red-400">Error loading content</p>');
            });
        } else {
          setContent('<p class="text-red-400">Error loading content</p>');
        }
      });
  }, [language]);

  useEffect(() => {
    // Ensure page scrolls to top when navigating to this route
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={t("about.seo.title")}
        description={t("about.seo.description")}
        url="https://improtango.fi/about"
        keywords={[
          "Minna Tuovinen",
          "Martin Heslop",
          "improtango opettajat",
          "tanssin opettajat",
          "paritanssin opettajat",
          "Helsinki",
        ]}
        type="profile"
      />

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/hero-5.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-8">
            Minna Tuovinen &<br />
            Martin Heslop
          </h1>

          <p className="text-xl md:text-2xl text-slate-200 leading-relaxed max-w-3xl mx-auto">
            {t("about.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {content ? (
            <MarkdownContent
              content={content}
              className="prose-headings:text-teal-500 prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:font-bold prose-h3:mt-16 prose-h3:mb-6 prose-h3:first:mt-0 prose-h4:text-xl prose-h4:md:text-2xl prose-h4:font-bold prose-h4:text-teal-400 prose-h4:mt-12 prose-h4:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-img:w-full prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-a:text-teal-400 prose-a:hover:text-teal-300 prose-strong:text-foreground prose-strong:font-semibold prose-ul:list-disc prose-ul:list-inside prose-ul:space-y-2 prose-ul:my-6 prose-ul:text-muted-foreground prose-li:leading-relaxed"
            />
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading content...</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
