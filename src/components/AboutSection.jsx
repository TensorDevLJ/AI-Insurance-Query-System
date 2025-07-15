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

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const AboutSection = () => (
  <motion.section
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="py-20 px-4"
  >
    <div className="max-w-4xl mx-auto">
      <motion.h2
        variants={itemVariants}
        className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        About Me
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div variants={itemVariants} className="space-y-6">
          <p className="text-gray-300 text-lg leading-relaxed">
            I'm a passionate Full Stack Developer with expertise in modern web
            technologies. I love creating innovative solutions that make a real
            impact.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            With experience in MERN stack, Python, and cloud technologies, I
            enjoy tackling complex problems and building scalable applications.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { label: "Projects", value: "15+" },
              { label: "Experience", value: "2+ Years" },
              { label: "Technologies", value: "20+" },
              { label: "Hackathons", value: "5+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-800/50 rounded-lg"
              >
                <div className="text-2xl font-bold text-blue-400">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          animate={floatingAnimation}
          className="relative"
        >
          <div className="w-80 h-80 mx-auto bg-gradient-to-br from-blue-400 to-purple-400 rounded-full p-1">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-8xl">
              👨‍💻
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </motion.section>
);
