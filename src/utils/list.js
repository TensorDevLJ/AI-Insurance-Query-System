// ✅ Fixed version of your portfolio constants file with corrected `PROJECT_LIST`

import {
  Globe,
  Mail,
  Database,
  Brain,
  Code,
  Server,
  MousePointerClick,
  LayoutPanelLeft,
  Cpu,
  GitBranch,
  ActivitySquare,
  Workflow,
  Bot,
  ContactRound,
  Component,
  Briefcase,
  GraduationCap,
  Code2Icon,
  FolderCode,
  ActivitySquareIcon,
  Award,
  Folder,
  User,
  MessageCircle,
  Home,
  BookOpen,
  Users,
} from "lucide-react";
import {
  FaGithub,
  FaHackerrank,
  FaLinkedin,
  FaReact as ReactIcon,
  FaAws,
} from "react-icons/fa";
import { GoHomeFill, GoProjectRoadmap } from "react-icons/go";
import { IoIosDocument } from "react-icons/io";
import { FiAward } from "react-icons/fi";
import {
  FaWrench as Wrench,
  FaChrome as Chrome,
  FaGithub as Github,
  FaFlask as Flask,
} from "react-icons/fa";

import {
  SiMongodb,
  SiTailwindcss,
  SiFirebase,
  SiRedux,
  SiJest,
  SiNginx,
  SiExpress,
  SiNodedotjs as Node,
  SiJsonwebtokens,
  SiVite,
  SiGooglegemini,
} from "react-icons/si";

export const SECTION_LIST = [
  { id: 1, displayText: "HOME", sectionID: "home", icon: Home },
  { id: 2, displayText: "SKILLS", sectionID: "skills", icon: Award },
  { id: 3, displayText: "PROJECTS", sectionID: "projects", icon: Folder },
  { id: 4, displayText: "BLOG", sectionID: "blog", icon: BookOpen },
  { id: 5, displayText: "COLLABORATIONS", sectionID: "collaborations", icon: Users },
  { id: 6, displayText: "ABOUT", sectionID: "about", icon: User },
  { id: 7, displayText: "CONTACT", sectionID: "contact", icon: MessageCircle },
];

const TECH_ICONS = {
  React: { component: ReactIcon, name: "React" },
  "Tailwind CSS": { component: SiTailwindcss, name: "Tailwind CSS" },
  "Node.js": { component: Node, name: "Node.js" },
  Express: { component: SiExpress, name: "Express" },
  MongoDB: { component: SiMongodb, name: "MongoDB" },
  JWT: { component: SiJsonwebtokens, name: "JWT" },
  "AWS EC2": { component: FaAws, name: "AWS EC2" },
  Nginx: { component: SiNginx, name: "Nginx" },
  PM2: { component: Server, name: "PM2" },
  Redux: { component: SiRedux, name: "Redux" },
  "React Router v6": { component: ReactIcon, name: "React Router v6" },
  Parcel: { component: Server, name: "Parcel" },
  Jest: { component: SiJest, name: "Jest" },
  Firebase: { component: SiFirebase, name: "Firebase" },
  "OpenAI API": { component: Brain, name: "OpenAI API" },
  Vite: { component: SiVite, name: "Vite" },
  "Google Generative AI": {
    component: SiGooglegemini,
    name: "Google Generative AI",
  },
  TSParticles: { component: ActivitySquareIcon, name: "TSParticles" },
  Python: { component: Cpu, name: "Python" },
};

export const TECH_STACK = [
  { name: "React", color: "#61DAFB", icon: Component },
  { name: "Node.js", color: "#68A063", icon: Server },
  { name: "MongoDB", color: "#47A248", icon: Database },
  { name: "Python", color: "#3776AB", icon: Cpu },
  { name: "AWS", color: "#FF9900", icon: Globe },
  { name: "Express", color: "#000000", icon: Code },
];
export const PROJECTS = [
  {
    title: "Wanderlust",
    description:
      "A travel-friendly stay-booking platform built using the MERN stack. Includes authentication, accessible UI, and dynamic room listings.",
    tech: [
      TECH_ICONS.React,
      TECH_ICONS["Tailwind CSS"],
      TECH_ICONS["Node.js"],
      TECH_ICONS.Express,
      TECH_ICONS.MongoDB,
    ],
    status: "Live",
    featured: true,
    liveLink: "https://wanderlust-airbnb-6gli.onrender.com/",
    sourceLink: "https://github.com/Likhithaj123/wanderlust_airbnb.git",
  },
  {
    title: "Movie Recommender System",
    description:
      "Content-based recommendation system built using Python, Streamlit, and TMDB API. Provides trailer embedding, genre filters, and user login.",
    tech: [
      TECH_ICONS["OpenAI API"],
      TECH_ICONS.Firebase,
      TECH_ICONS["Tailwind CSS"],
    ],
    status: "Live",
    featured: true,
    liveLink: "https://movie-recommendation-app-demo.vercel.app/",
    sourceLink: "https://github.com/Likhithaj123/Movie_recom_system.git",
  },
  {
    title: "Real-Time Traffic Management System (YOLOv8)",
    description:
      "YOLOv8-powered smart signal system from a national-level hackathon. Reduced traffic waiting time using real-time object detection.",
    tech: [
      TECH_ICONS["OpenAI API"],
      TECH_ICONS.Python,
    ],
    status: "Prototype",
    featured: true,
    liveLink:
      "https://unstop.com/hackathons/i-solve-nitte-meenakshi-institute-of-technology-bangalore-karnataka-1060100/case-submissions/405868",
    sourceLink: "#",
  },
  {
    title: "Sales Forecasting - Cisco League",
    description:
      "Built statistical models like Auto ARIMA and Holt-Winters to forecast sales data with 89% accuracy using Python and Statsmodels.",
    tech: [
      TECH_ICONS.Python,
    ],
    status: "Completed",
    featured: false,
    liveLink:
      "https://cisco.sharepoint.com/:u:/r/sites/CiscoForecastLeagueCompetition/SitePages/Phase-1-results---BIT.aspx?csf=1&web=1&e=YGp5WQ",
    sourceLink: "#",
  },
  {
    title: "Namaste Notebook",
    description:
      "An open-source learning companion for the NamasteDev series, organizing course notes into a clean, readable web UI.",
    tech: [
      TECH_ICONS.React,
      TECH_ICONS["Tailwind CSS"],
      TECH_ICONS["React Router v6"],
      TECH_ICONS.Vite,
    ],
    status: "Live",
    featured: true,
    liveLink: "https://namastenotebook.vercel.app/",
    sourceLink: "https://github.com/Likhithaj123/namaste-notebook",
  },
  {
    title: "TasteBytes - Swiggy Clone",
    description:
      "A Swiggy and Instamart clone using live data from real-time APIs, featuring filters, a cart, and shimmer UI effects.",
    tech: [
      TECH_ICONS.React,
      TECH_ICONS["Tailwind CSS"],
      TECH_ICONS.Parcel,
      TECH_ICONS.Jest,
    ],
    status: "Live",
    featured: true,
    liveLink: "https://sanlik-soulspice.netlify.app/",
    sourceLink: "https://github.com/Likhithaj123/Namaste_React.git",
  },
  {
    title: "Netflix-GPT",
    description:
      "An AI-powered movie suggestion app using the OpenAI API to deliver personalized recommendations in a Netflix-style interface.",
    tech: [
      TECH_ICONS.React,
      TECH_ICONS.Firebase,
      TECH_ICONS["Tailwind CSS"],
      TECH_ICONS["OpenAI API"],
    ],
    status: "Paused",
    featured: true,
    liveLink: "https://netflix-gpt.example.com/",
    sourceLink: "https://github.com/Likhithaj123/netflix-gpt.git",
  },
];

export const BLOG_POSTS = [
  {
    id: 1,
    title: "Building Scalable React Applications with Modern Architecture",
    excerpt: "Learn how to structure React applications for scalability using modern patterns and best practices.",
    content: "In this comprehensive guide, we'll explore the essential patterns and practices for building scalable React applications...",
    date: "2024-01-15",
    readTime: "8 min read",
    tags: ["React", "Architecture", "Best Practices"],
    featured: true,
    image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 2,
    title: "The Future of Web Development: AI Integration",
    excerpt: "Exploring how AI is transforming the web development landscape and what developers need to know.",
    content: "Artificial Intelligence is revolutionizing how we build web applications. From automated code generation to intelligent user interfaces...",
    date: "2024-01-10",
    readTime: "6 min read",
    tags: ["AI", "Web Development", "Future Tech"],
    featured: true,
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 3,
    title: "Optimizing Performance in Node.js Applications",
    excerpt: "Practical tips and techniques for improving the performance of your Node.js backend services.",
    content: "Performance optimization is crucial for Node.js applications. In this article, we'll cover caching strategies, database optimization...",
    date: "2024-01-05",
    readTime: "10 min read",
    tags: ["Node.js", "Performance", "Backend"],
    featured: false,
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

export const COLLABORATIONS = [
  {
    id: 1,
    title: "Open Source Contribution - React Router",
    description: "Contributed to React Router v6 documentation and bug fixes, helping improve the developer experience for thousands of users.",
    type: "Open Source",
    status: "Merged",
    date: "2024-01-20",
    technologies: ["React", "TypeScript", "Documentation"],
    link: "https://github.com/remix-run/react-router",
    collaborators: ["React Router Team"],
    impact: "Improved documentation clarity for 50K+ weekly users"
  },
  {
    id: 2,
    title: "Hackathon Winner - Smart City Solutions",
    description: "Led a team of 4 developers to create an AI-powered traffic management system that won first place at the National Smart City Hackathon.",
    type: "Hackathon",
    status: "Winner",
    date: "2023-12-15",
    technologies: ["Python", "YOLOv8", "IoT", "Machine Learning"],
    link: "https://github.com/your-username/smart-traffic-system",
    collaborators: ["Team Alpha", "City Planning Department"],
    impact: "Potential to reduce traffic congestion by 30%"
  },
  {
    id: 3,
    title: "Mentorship Program - Code for Good",
    description: "Mentoring junior developers in full-stack development through a 3-month intensive program focused on building real-world applications.",
    type: "Mentorship",
    status: "Ongoing",
    date: "2024-01-01",
    technologies: ["MERN Stack", "Best Practices", "Career Guidance"],
    link: "#",
    collaborators: ["10 Junior Developers", "Code for Good NGO"],
    impact: "Helped 8 developers land their first tech jobs"
  },
  {
    id: 4,
    title: "Community Project - Developer Tools",
    description: "Co-created a VS Code extension that helps developers write better commit messages, now used by 5K+ developers worldwide.",
    type: "Community",
    status: "Published",
    date: "2023-11-10",
    technologies: ["TypeScript", "VS Code API", "Git"],
    link: "https://marketplace.visualstudio.com/items?itemName=your-extension",
    collaborators: ["Developer Community", "VS Code Team"],
    impact: "5,000+ active installations"
  }
];