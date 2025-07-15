// import React, { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   MessageCircle, 
//   Send, 
//   X, 
//   Bot, 
//   User, 
//   Minimize2, 
//   Maximize2,
//   Sparkles
// } from "lucide-react";

// const SAMPLE_RESPONSES = [
//   "Hi! I'm Likhitha's AI assistant. I can help you learn more about her skills, projects, and experience. What would you like to know?",
//   "Likhitha is a Full Stack Developer with expertise in MERN stack, Python, and cloud technologies. She has worked on various projects including travel booking platforms and AI-powered applications.",
//   "Some of her notable projects include Wanderlust (a travel booking platform), Movie Recommender System, and a Real-Time Traffic Management System using YOLOv8.",
//   "She has experience with React, Node.js, MongoDB, Python, AWS, and many other modern technologies. Would you like to know more about any specific technology?",
//   "Likhitha has participated in several hackathons and won prizes for innovative solutions. She's also contributed to open source projects and mentored junior developers.",
//   "You can reach out to Likhitha through the contact section or connect with her on LinkedIn and GitHub. She's always open to discussing new opportunities and collaborations!"
// ];

// export const AIChatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hi! I'm Likhitha's AI assistant. How can I help you today?",
//       sender: "bot",
//       timestamp: new Date()
//     }
//   ]);
//   const [inputValue, setInputValue] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputValue.trim()) return;

//     const userMessage = {
//       id: Date.now(),
//       text: inputValue,
//       sender: "user",
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue("");
//     setIsTyping(true);

//     // Simulate AI response delay
//     setTimeout(() => {
//       const randomResponse = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
//       const botMessage = {
//         id: Date.now() + 1,
//         text: randomResponse,
//         sender: "bot",
//         timestamp: new Date()
//       };
      
//       setMessages(prev => [...prev, botMessage]);
//       setIsTyping(false);
//     }, 1000 + Math.random() * 2000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const ChatMessage = ({ message }) => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`flex gap-3 mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
//     >
//       {message.sender === "bot" && (
//         <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
//           <Bot size={16} className="text-white" />
//         </div>
//       )}
      
//       <div
//         className={`max-w-[80%] p-3 rounded-lg ${
//           message.sender === "user"
//             ? "bg-blue-500 text-white"
//             : "bg-gray-700 text-gray-100"
//         }`}
//       >
//         <p className="text-sm">{message.text}</p>
//         <span className="text-xs opacity-70 mt-1 block">
//           {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </span>
//       </div>

//       {message.sender === "user" && (
//         <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
//           <User size={16} className="text-white" />
//         </div>
//       )}
//     </motion.div>
//   );

//   const TypingIndicator = () => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="flex gap-3 mb-4"
//     >
//       <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//         <Bot size={16} className="text-white" />
//       </div>
//       <div className="bg-gray-700 p-3 rounded-lg">
//         <div className="flex gap-1">
//           {[0, 1, 2].map((i) => (
//             <motion.div
//               key={i}
//               className="w-2 h-2 bg-gray-400 rounded-full"
//               animate={{ opacity: [0.4, 1, 0.4] }}
//               transition={{
//                 duration: 1.5,
//                 repeat: Infinity,
//                 delay: i * 0.2
//               }}
//             />
//           ))}
//         </div>
//       </div>
//     </motion.div>
//   );

//   return (
//     <>
//       {/* Chat Toggle Button */}
//       <motion.button
//         onClick={() => setIsOpen(true)}
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg z-40 ${
//           isOpen ? "hidden" : "block"
//         }`}
//       >
//         <MessageCircle size={24} />
//         <motion.div
//           className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
//           animate={{ scale: [1, 1.2, 1] }}
//           transition={{ duration: 2, repeat: Infinity }}
//         />
//       </motion.button>

//       {/* Chat Window */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8, y: 20 }}
//             animate={{ 
//               opacity: 1, 
//               scale: 1, 
//               y: 0,
//               height: isMinimized ? "60px" : "500px"
//             }}
//             exit={{ opacity: 0, scale: 0.8, y: 20 }}
//             className="fixed bottom-6 right-6 w-80 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50 overflow-hidden"
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
//                   <Sparkles size={16} className="text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
//                   <p className="text-white/80 text-xs">Ask me about Likhitha</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setIsMinimized(!isMinimized)}
//                   className="text-white/80 hover:text-white"
//                 >
//                   {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
//                 </button>
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="text-white/80 hover:text-white"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             </div>

//             {!isMinimized && (
//               <>
//                 {/* Messages */}
//                 <div className="h-80 overflow-y-auto p-4 bg-gray-900">
//                   {messages.map((message) => (
//                     <ChatMessage key={message.id} message={message} />
//                   ))}
//                   {isTyping && <TypingIndicator />}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 {/* Input */}
//                 <div className="p-4 border-t border-gray-700 bg-gray-800">
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={inputValue}
//                       onChange={(e) => setInputValue(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Ask me anything about Likhitha..."
//                       className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none"
//                     />
//                     <motion.button
//                       onClick={handleSendMessage}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       disabled={!inputValue.trim() || isTyping}
//                       className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <Send size={16} />
//                     </motion.button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

import React, { useState } from "react";
import { sendQuery } from "../services/api";

export const AIChatbot = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await sendQuery(query);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white text-black rounded-lg shadow-lg max-w-md w-full z-50">
      <h2 className="text-lg font-semibold mb-2">🧠 Insurance AI Chatbot</h2>
      <input
        type="text"
        className="w-full p-2 border rounded mb-2"
        placeholder="Try: 46M, knee surgery, Pune, 3-month policy"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Ask AI"}
      </button>

      {result && (
        <div className="mt-4 text-sm">
          {result.error ? (
            <p className="text-red-500">❌ {result.error}</p>
          ) : (
            <div>
              <p><strong>Decision:</strong> {result.result?.decision}</p>
              <p><strong>Justification:</strong></p>
              <ul className="list-disc ml-4">
                {result.result?.justification?.map((j, i) => (
                  <li key={i}>
                    <strong>{j.clause_id}:</strong> {j.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
