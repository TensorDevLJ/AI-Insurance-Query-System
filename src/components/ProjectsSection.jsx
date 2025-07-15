import { PROJECTS } from "../utils/list";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import React from "react";
import { PREVIEW_IMAGE_GENRATE_URL } from "../utils/constants";

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


export const ProjectsSection = () => (
  <motion.section
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="py-20 px-4"
  >
    <div className="max-w-7xl mx-auto">
      <motion.h2
        variants={itemVariants}
        className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        Featured Projects
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.filter((p) => p.featured).map((project, index) => (
          <motion.div
            key={project.title}
            variants={itemVariants}
            whileHover={{ y: -10 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors group"
          >
            <div className="relative overflow-hidden">
              <img
                src={PREVIEW_IMAGE_GENRATE_URL+project.liveLink}
                alt={project.title}
                className="w-full h-48 object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === "Live"
                      ? "bg-green-500 text-white"
                      : project.status === "Prototype"
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                {project.title}
              </h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.slice(0, 3).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                  >
                    {tech.name}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">
                    +{project.tech.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                {project.liveLink !== "#" && (
                  <motion.a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </motion.a>
                )}
                {project.sourceLink !== "#" && (
                  <motion.a
                    href={project.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:border-gray-500 hover:text-white transition-colors"
                  >
                    <Github size={16} />
                    Code
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);
