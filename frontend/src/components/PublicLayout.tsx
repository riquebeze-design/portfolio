import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MadeWithDyad } from './made-with-dyad';
import { Separator } from './ui/separator';
import { Github, Linkedin, Mail, LogIn } from 'lucide-react';
import PublicNavbar from './PublicNavbar'; // Importando o novo componente
import { Button } from './ui/button';

const PublicLayout = () => {
  const navigate = useNavigate();
  const publicNavLinks = [
    { label: 'Home', to: '/' },
    { label: 'Trabalhos', to: '/trabalhos' },
    { label: 'Contato', to: '/contato' },
  ];

  const handleResumeDownload = () => {
    alert('Baixando Currículo...'); // Placeholder for resume download
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground dark:bg-black"> {/* Adicionado dark:bg-black aqui */}
      <PublicNavbar
        logoInitials="AC"
        logoName="Antônio Cavalcanti"
        navLinks={publicNavLinks}
        resumeLabel="Ver Currículo"
        onResumeClick={handleResumeDownload}
      />

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-black text-white py-8 mt-12 rounded-none shadow-lg dark:bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Meu Portfólio</h3>
              <p className="text-sm text-gray-300 dark:text-gray-400">Criando experiências digitais incríveis.</p>
            </div>
            <div className="flex space-x-6">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors dark:text-gray-400 dark:hover:text-white">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors dark:text-gray-400 dark:hover:text-white">
                <Linkedin size={24} />
              </a>
              <a href="mailto:your.email@example.com" className="text-gray-300 hover:text-white transition-colors dark:text-gray-400 dark:hover:text-white">
                <Mail size={24} />
              </a>
            </div>
          </div>
          <Separator className="bg-purple-700 my-6 dark:bg-gray-700" />
          <Button onClick={() => navigate('/admin/login')} className="glass-button px-4 py-2 rounded-full text-foreground text-sm font-medium mb-4">
            <LogIn className="mr-2 h-4 w-4" /> Admin Login
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-500">&copy; {new Date().getFullYear()} Meu Portfólio. Todos os direitos reservados.</p>
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;