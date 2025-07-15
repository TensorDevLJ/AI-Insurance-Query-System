import React from "react";
import {
  Play,
  Download,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const HeroSection = ({ setActiveSection }) => (
  <motion.section
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="min-h-screen flex items-center justify-center relative overflow-hidden"
  >
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />

    {/* Floating particles */}
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}

    <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
      <motion.div variants={itemVariants} className="mb-8">
        <motion.div
          animate={floatingAnimation}
          className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 p-1"
        >
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-4xl">
            👨‍💻
          </div>
        </motion.div>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-5xl md:text-7xl font-bold mb-6"
      >
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Full Stack Developer
        </span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
      >
        Building exceptional digital experiences with modern technologies and
        creative solutions
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveSection("projects")}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-semibold flex items-center justify-center gap-2"
        >
          <Play size={20} />
          View My Work
        </motion.button>

        <motion.a
          href="#"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(255, 255, 255, 0.1)",
          }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 border-2 border-gray-400 rounded-full text-gray-300 font-semibold hover:border-white hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <Download size={20} />
          Download Resume
        </motion.a>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-center gap-6 mt-12"
      >
        {[Github, Linkedin, Mail].map((Icon, index) => (
          <motion.a
            key={index}
            href="#"
            whileHover={{ scale: 1.2, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <Icon size={24} className="text-gray-300" />
          </motion.a>
        ))}
      </motion.div>
    </div>

    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    >
      <ChevronDown size={32} className="text-gray-400" />
    </motion.div>
  </motion.section>
);
