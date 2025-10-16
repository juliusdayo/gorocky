"use client";

import { useState } from "react";
import Header from "../components/public/Header";
import Footer from "../components/public/Footer";
import Home from "../components/public/Home";
import About from "../components/public/About";
import Contact from "../components/public/Contact";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "about":
        return <About />;
      case "contact":
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}
