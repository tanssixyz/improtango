import { Component, type ReactNode } from "react";
import { useLanguage } from "@/lib/language-context";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  t?: (key: string) => string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {this.props.t?.("common.error_boundary.title") || "Something went wrong"}
            </h1>
            <p className="text-gray-600 mb-4">
              {this.props.t?.("common.error_boundary.message") || "We're sorry, but something unexpected happened. Please try refreshing the page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              {this.props.t?.("common.error_boundary.refresh") || "Refresh Page"}
            </button>
            {import.meta.env.DEV && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500">
                  {this.props.t?.("common.error_boundary.details") || "Error Details"}
                </summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper to inject language context into class component
function ErrorBoundaryWithTranslation({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  return (
    <ErrorBoundaryClass t={t}>
      {children}
    </ErrorBoundaryClass>
  );
}

export const ErrorBoundary = ErrorBoundaryWithTranslation;