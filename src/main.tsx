import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LanguageProvider } from "./lib/language-context";
import { Analytics } from "./components/Analytics";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <LanguageProvider>
          <ErrorBoundary>
            <Analytics />
            <App />
          </ErrorBoundary>
        </LanguageProvider>
      </BrowserRouter>
    </ConvexProvider>
  </React.StrictMode>
);
