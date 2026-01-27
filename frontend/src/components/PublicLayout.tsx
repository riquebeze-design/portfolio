import React from 'react';
import { Outlet } from 'react-router-dom';
import { MadeWithDyad } from './made-with-dyad';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Github, Linkedin, Mail } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 text-gray-800">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center rounded-b-lg">
          <Link to="/" className="text-2xl font-bold text-purple-700 hover:text-purple-900 transition-colors">
            Meu Portfólio
          </Link>
          <div className="space-x-4">
            <Button asChild variant="ghost" className="text-purple-700 hover:bg-purple-100 rounded-full px-6 py-3">
              <Link to="/">Home</Link>
            </Button>
            <Button asChild variant="ghost" className="text-purple-700 hover:bg-purple-100 rounded-full px-6 py-3">
              <Link to="/trabalhos">Trabalhos</Link>
            </Button>
            <Button asChild variant="ghost" className="text-purple-700 hover:bg-purple-100 rounded-full px-6 py-3">
              <Link to="/contato">Contato</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-purple-800 text-white py-8 mt-12 rounded-t-lg shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">Meu Portfólio</h3>
              <p className="text-sm text-purple-200">Criando experiências digitais incríveis.</p>
            </div>
            <div className="flex space-x-6">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-white transition-colors">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-purple-200 hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="mailto:your.email@example.com" className="text-purple-200 hover:text-white transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>
          <Separator className="bg-purple-700 my-6" />
          <p className="text-sm text-purple-300">&copy; {new Date().getFullYear()} Meu Portfólio. Todos os direitos reservados.</p>
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;