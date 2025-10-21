import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useLanguage } from "../../lib/language-context";
import { Icons } from "../Icons";

export default function Footer() {
  const { language, toggleLanguage, t } = useLanguage();
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-6 lg:flex-row lg:justify-between lg:space-y-0">
          {/* About Section */}
          <div className="text-center lg:text-left max-w-sm">
            <Link
              to="/about"
              className="text-teal-400 hover:text-teal-300 text-sm underline transition-colors duration-200"
            >
              {t("footer.about")}
            </Link>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-teal-500 transition-colors duration-200"
              aria-label="Instagram"
            >
              <Icons.instagram
                className="h-8 w-auto text-slate-400 hover:text-slate-200 transition-colors duration-200"
                aria-label="Improtango - Return to homepage"
              />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-teal-500 transition-colors duration-200"
              aria-label="Facebook"
            >
              <Icons.facebook
                className="h-8 w-auto text-slate-400 hover:text-slate-200 transition-colors duration-200"
                aria-label="Improtango - Return to homepage"
              />
            </a>
          </div>

          {/* Theme and Language Toggles */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="h-8 px-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all duration-200"
            >
              <span className="text-xs font-medium">
                {language.toUpperCase()}
              </span>
            </Button>

            {/* Theme Toggle */}
            {/*  <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all duration-200"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
