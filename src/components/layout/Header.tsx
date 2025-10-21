import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, User, Lightbulb, Mail, MessageSquare } from "lucide-react";
import { Icons } from "../Icons";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { useLanguage } from "../../lib/language-context";

export default function Header() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isCurrentPage = (path: string) => location.pathname === path;

  // Handle hash-based scrolling after navigation
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Small delay to ensure page is loaded
    }
  }, [location]);

  const handleSectionNavigation = (sectionId: string) => {
    closeMenu();
    
    if (location.pathname === '/') {
      // Already on home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to home page with hash
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Site Name */}
          <div className="shrink-0">
            <Link to="/" className="block" onClick={closeMenu}>
              <Icons.logo
                className="h-8 w-auto text-slate-50 hover:text-teal-400 transition-colors duration-200"
                aria-label="Improtango - Return to homepage"
              />
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Hamburger Menu */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="h-9 w-9 p-0 text-slate-300 hover:text-slate-50 hover:bg-slate-800/50 transition-all duration-200 border border-transparent hover:border-teal-500/30 rounded-md flex items-center justify-center"
                aria-label="Navigation menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl py-2">
                  <Link
                    to="/"
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                      isCurrentPage("/")
                        ? "text-slate-500 cursor-default"
                        : "text-slate-300 hover:text-slate-50 hover:bg-slate-700/50"
                    }`}
                    {...(isCurrentPage("/") && { "aria-current": "page" })}
                  >
                    <Home className="w-4 h-4" />
                    {t("nav.home")}
                  </Link>
                  <Link
                    to="/about"
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                      isCurrentPage("/about")
                        ? "text-slate-500 cursor-default"
                        : "text-slate-300 hover:text-slate-50 hover:bg-slate-700/50"
                    }`}
                    {...(isCurrentPage("/about") && { "aria-current": "page" })}
                  >
                    <User className="w-4 h-4" />
                    {t("nav.about")}
                  </Link>
                  <Link
                    to="/concepts"
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                      isCurrentPage("/concepts")
                        ? "text-slate-500 cursor-default"
                        : "text-slate-300 hover:text-slate-50 hover:bg-slate-700/50"
                    }`}
                    {...(isCurrentPage("/concepts") && { "aria-current": "page" })}
                  >
                    <Lightbulb className="w-4 h-4" />
                    {t("nav.concepts")}
                  </Link>
                  <button
                    onClick={() => handleSectionNavigation('newsletter')}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-slate-300 hover:text-slate-50 hover:bg-slate-700/50 transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4" />
                    {t("nav.newsletter")}
                  </button>
                  <button
                    onClick={() => handleSectionNavigation('contact')}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-slate-300 hover:text-slate-50 hover:bg-slate-700/50 transition-colors duration-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {t("nav.contact")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
