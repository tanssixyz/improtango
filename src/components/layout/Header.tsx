import { Link } from "react-router-dom";
import { Icons } from "../Icons";
import { LanguageSwitcher } from "../LanguageSwitcher";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Site Name */}
          <div className="shrink-0">
            <Link to="/" className="block">
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

            {/* Theme Toggle */}
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0 text-slate-300 hover:text-slate-50 hover:bg-slate-800/50 transition-all duration-200 border border-transparent hover:border-teal-500/30"
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
    </header>
  );
}
