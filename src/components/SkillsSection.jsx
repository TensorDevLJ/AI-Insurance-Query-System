import { TECH_STACK } from "../utils/list";
import { motion } from "framer-motion";
import React from "react";


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


export const SkillsSection = () => (
  <motion.section
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="py-20 px-4"
  >
    <div className="max-w-6xl mx-auto">
      <motion.h2
        variants={itemVariants}
        className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        Skills & Technologies
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {TECH_STACK.map((tech, index) => (
          <motion.div
            key={tech.name}
            variants={itemVariants}
            whileHover={{ scale: 1.1, y: -10 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div
              className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${tech.color}20`,
                border: `1px solid ${tech.color}40`,
              }}
            >
              <tech.icon size={24} style={{ color: tech.color }} />
            </div>
            <h3 className="text-white font-semibold">{tech.name}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);
