import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Menu, X } from "lucide-react";
import { SECTION_LIST } from "./utils/list";
import { HeroSection } from "./components/HeroSection";
import { SkillsSection } from "./components/SkillsSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { BlogSection } from "./components/BlogSection";
import { CollaborationsSection } from "./components/CollaborationsSection";
import { ContactSection } from "./components/ContactSection";
import { AboutSection } from "./components/AboutSection";
import { AIChatbot } from "./components/AIChatbot";

const App = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- 1. Implement ScrollSpy to update active section ---
  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTION_LIST.map((s) => document.getElementById(s.sectionID));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        if (section) {
          if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // --- 2. Create a function for smooth scrolling ---
  const handleNavClick = (sectionID) => {
    document.getElementById(sectionID)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false); // Close mobile menu on click
  };

  const NavigationBar = () => (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Likhitha J
          </motion.div>

          <div className="hidden md:flex space-x-8">
            {SECTION_LIST.map((section) => (
              <motion.button
                key={section.id}
                // Use the new scroll handler
                onClick={() => handleNavClick(section.sectionID)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === section.sectionID
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {section.displayText}
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-t border-gray-800"
          >
            {SECTION_LIST.map((section) => (
              <motion.button
                key={section.id}
                // Use the new scroll handler here as well
                onClick={() => handleNavClick(section.sectionID)}
                whileHover={{ x: 10 }}
                className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {section.displayText}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );


  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationBar />

      {/* --- 3. Render all sections directly with corresponding IDs --- */}
      <main>
        <section id="home">
          <HeroSection />
        </section>
        <section id="skills">
          <SkillsSection />
        </section>
        <section id="projects">
          <ProjectsSection />
        </section>
        <section id="blog">
          <BlogSection />
        </section>
        <section id="collaborations">
          <CollaborationsSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>

      {/* AI Chatbot */}
      <AIChatbot />

      {/* Background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      </div>
    </div>
  );
};

export default App;


// const App = () => {
//   return (
//     <div style={{ color: "white", fontSize: "2rem", padding: "2rem" }}>
//       ✅ React is rendering!
//     </div>
//   );
// };

// export default App;
