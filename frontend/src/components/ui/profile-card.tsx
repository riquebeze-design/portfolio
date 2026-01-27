"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Twitter, Youtube, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfileCardProps {
  name?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  className?: string;
}

export function ProfileCard(props: ProfileCardProps) {
  const {
    name = "Antônio Cavalcanti",
    title = "Designer Gráfico & Especialista em Branding",
    description = "Antônio Cavalcanti é um designer gráfico experiente com mais de 8 anos de atuação, especializado na criação de identidades visuais sólidas e estratégicas. Ele lidera projetos de branding que transformam marcas, gerando reconhecimento e conexão com o público.",
    imageUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cfd72fee?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Unsplash image
    githubUrl = "https://github.com/yourusername",
    twitterUrl = "https://twitter.com/yourusername",
    youtubeUrl = "https://youtube.com/yourusername",
    linkedinUrl = "https://linkedin.com/in/yourusername",
    className,
  } = props;

  const socialIcons = [
    { icon: Github, url: githubUrl, label: "GitHub" },
    { icon: Twitter, url: twitterUrl, label: "Twitter" },
    { icon: Youtube, url: youtubeUrl, label: "YouTube" },
    { icon: Linkedin, url: linkedinUrl, label: "LinkedIn" },
  ];

  return (
    <div className={cn("w-full max-w-5xl mx-auto px-4 py-20", className)}>
      {/* Desktop */}
      <div className='hidden md:flex relative items-center justify-center'>
        {/* Square Image */}
        <div className='w-[470px] h-[470px] rounded-3xl overflow-hidden bg-purple-200 dark:bg-purple-800 flex-shrink-0 flex items-center justify-center shadow-lg'>
          <img
            src={imageUrl}
            alt={name}
            width={470}
            height={470}
            className='w-full h-full object-cover'
            draggable={false}
          />
        </div>
        {/* Overlapping Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className='bg-white dark:bg-card rounded-3xl shadow-2xl p-8 ml-[-80px] z-10 max-w-xl flex-1 border-2 border-purple-100 dark:border-purple-700'
        >
          <div className='mb-6'>
            <h2 className='text-3xl font-bold text-purple-800 dark:text-white mb-2'>
              {name}
            </h2>

            <p className='text-base font-medium text-gray-700 dark:text-gray-400'>
              {title}
            </p>
          </div>

          <p className='text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-8'>
            {description}
          </p>

          <div className='flex space-x-4'>
            {socialIcons.map(({ icon: Icon, url, label }) => (
              <a
                key={label}
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                className='w-12 h-12 bg-purple-600 dark:bg-purple-400 rounded-full flex items-center justify-center transition-colors hover:bg-purple-700 dark:hover:bg-purple-300 hover:scale-105 shadow-md'
                aria-label={label}
              >
                <Icon className='w-5 h-5 text-white dark:text-gray-900' />
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className='md:hidden max-w-sm mx-auto text-center bg-transparent'
      >
        {/* Square Mobile Image */}
        <div className='w-full aspect-square bg-purple-200 dark:bg-purple-800 rounded-3xl overflow-hidden mb-6 flex items-center justify-center shadow-lg'>
          <img
            src={imageUrl}
            alt={name}
            width={400}
            height={400}
            className='w-full h-full object-cover'
            draggable={false}
          />
        </div>

        <div className='px-4'>
          <h2 className='text-2xl font-bold text-purple-800 dark:text-white mb-2'>
            {name}
          </h2>

          <p className='text-base font-medium text-gray-700 dark:text-gray-400 mb-4'>
            {title}
          </p>

          <p className='text-gray-800 dark:text-gray-200 text-base leading-relaxed mb-6'>
            {description}
          </p>

          <div className='flex justify-center space-x-4'>
            {socialIcons.map(({ icon: Icon, url, label }) => (
              <a
                key={label}
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                className='w-12 h-12 bg-purple-600 dark:bg-purple-400 rounded-full flex items-center justify-center transition-colors hover:bg-purple-700 dark:hover:bg-purple-300 shadow-md'
                aria-label={label}
              >
                <Icon className='w-5 h-5 text-white dark:text-gray-900' />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}