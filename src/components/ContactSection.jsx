import { motion } from "framer-motion";
import React from "react";
import { Mail, Github, Linkedin } from "lucide-react";



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


export const ContactSection = () => (
  <motion.section
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="py-20 px-4"
  >
    <div className="max-w-4xl mx-auto text-center">
      <motion.h2
        variants={itemVariants}
        className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        Let's Work Together
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
      >
        I'm always interested in new opportunities and exciting projects. Let's
        discuss how we can bring your ideas to life!
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
      >
        <motion.a
          href="mailto:your@email.com"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-semibold flex items-center gap-3 text-lg"
        >
          <Mail size={24} />
          Get In Touch
        </motion.a>

        <div className="flex gap-6">
          {[
            { icon: Github, href: "#", label: "GitHub" },
            { icon: Linkedin, href: "#", label: "LinkedIn" },
          ].map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              title={social.label}
            >
              <social.icon size={28} className="text-gray-300" />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  </motion.section>
);
