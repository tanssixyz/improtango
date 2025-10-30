import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Concepts from "./pages/Concepts";
import Unsubscribe from "./pages/Unsubscribe";
import NotFoundPage from "./pages/404";
import { Suspense } from "react";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/about"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="/concepts"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Concepts />
              </Suspense>
            }
          />
          <Route path="/unsubscribe" element={<Unsubscribe />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
