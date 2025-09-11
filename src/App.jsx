import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import History from "./pages/History";
import Favorites from "./pages/Favorites";
import MobileNav from "./components/MobileNav";
export default function App() {
  return (
    <div className="flex h-screen bg-background text-text-primary">
      {/* Sidebar only on md and up */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-hidden pb-20 md:pb-0 p-4 md:p-8 bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>

      {/* Bottom nav only on mobile */}
      <MobileNav />
    </div>
  );
}

