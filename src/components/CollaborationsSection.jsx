import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  ExternalLink, 
  Award, 
  GitBranch, 
  Heart,
  TrendingUp,
  Filter
} from "lucide-react";
import { COLLABORATIONS } from "../utils/list";

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

const getStatusColor = (status) => {
  switch (status) {
    case "Merged":
    case "Winner":
    case "Published":
      return "bg-green-500";
    case "Ongoing":
      return "bg-blue-500";
    case "Pending":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case "Open Source":
      return GitBranch;
    case "Hackathon":
      return Award;
    case "Mentorship":
      return Heart;
    case "Community":
      return Users;
    default:
      return Users;
  }
};

export const CollaborationsSection = () => {
  const [selectedType, setSelectedType] = useState("All");
  
  const types = ["All", ...new Set(COLLABORATIONS.map(collab => collab.type))];
  
  const filteredCollaborations = COLLABORATIONS.filter(collab => 
    selectedType === "All" || collab.type === selectedType
  );

  const CollaborationCard = ({ collaboration }) => {
    const IconComponent = getTypeIcon(collaboration.type);
    
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -10 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <IconComponent size={24} className="text-blue-400" />
            </div>
            <div>
              <span className="text-sm text-gray-400">{collaboration.type}</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-2 h-2 rounded-full ${getStatusColor(collaboration.status)}`}
                />
                <span className="text-sm font-medium text-white">
                  {collaboration.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Calendar size={14} />
            {new Date(collaboration.date).toLocaleDateString()}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
          {collaboration.title}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {collaboration.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {collaboration.technologies.map((tech, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users size={14} />
            <span>Collaborators: {collaboration.collaborators.join(", ")}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-green-400">
            <TrendingUp size={14} />
            <span>{collaboration.impact}</span>
          </div>
        </div>

        {collaboration.link !== "#" && (
          <motion.a
            href={collaboration.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <ExternalLink size={16} />
            View Project
          </motion.a>
        )}
      </motion.div>
    );
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Collaborations & Contributions
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto"
        >
          Working together with amazing teams and communities to build impactful solutions
        </motion.p>

        {/* Filter */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <Filter size={20} className="text-gray-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </motion.div>

        {/* Collaborations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCollaborations.map((collaboration) => (
            <CollaborationCard key={collaboration.id} collaboration={collaboration} />
          ))}
        </div>

        {filteredCollaborations.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No collaborations found for the selected type.</p>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { label: "Total Collaborations", value: COLLABORATIONS.length },
            { label: "Open Source Contributions", value: COLLABORATIONS.filter(c => c.type === "Open Source").length },
            { label: "Hackathon Wins", value: COLLABORATIONS.filter(c => c.type === "Hackathon" && c.status === "Winner").length },
            { label: "Developers Mentored", value: "10+" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gray-800/30 rounded-lg border border-gray-700"
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};