"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  name?: string;
  title?: string;
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name = "Antônio Cavalcanti",
  title = "Designer Gráfico & Desenvolvedor Frontend",
  avatarUrl = "https://picsum.photos/seed/dyad-avatar/128/128", // Updated to use a generic placeholder
  githubUrl = "https://github.com/yourusername",
  linkedinUrl = "https://linkedin.com/in/yourusername",
  email = "your.email@example.com",
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      className={cn(
        "bg-gradient-to-br from-purple-500 to-indigo-600 text-white",
        "rounded-3xl shadow-2xl p-8 max-w-sm mx-auto",
        "flex flex-col items-center text-center space-y-6",
        "border-4 border-purple-300 transform hover:scale-105 transition-all duration-300 ease-in-out",
        "dark:from-gray-900 dark:to-black dark:border-gray-700"
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.img
        src={avatarUrl}
        alt={name}
        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg dark:border-gray-800"
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 } }}
      />
      <div className="space-y-2">
        <h3 className="text-3xl font-bold tracking-tight dark:text-white">{name}</h3>
        <p className="text-lg text-purple-200 dark:text-gray-400">{title}</p>
      </div>
      <div className="flex space-x-5">
        <motion.a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-100 hover:text-white transition-colors dark:text-gray-500 dark:hover:text-white"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Github size={28} />
        </motion.a>
        <motion.a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-100 hover:text-white transition-colors dark:text-gray-500 dark:hover:text-white"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Linkedin size={28} />
        </motion.a>
        <motion.a
          href={`mailto:${email}`}
          className="text-purple-100 hover:text-white transition-colors dark:text-gray-500 dark:hover:text-white"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Mail size={28} />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default ProfileCard;