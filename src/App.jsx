import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import History from "./pages/History";

export default function App() {
  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar />
      <main className="flex-1 overflow-hidden p-8 bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
}
