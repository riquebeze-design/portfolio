import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center p-4">
      {/* Hero Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl font-extrabold text-purple-800 mb-6 leading-tight animate-fade-in-up">
          Meu Portfólio
        </h1>
        <p className="text-2xl text-gray-700 mb-10 animate-fade-in-up animation-delay-200">
          Transformando ideias em experiências digitais memoráveis.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up animation-delay-400">
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <Link to="/trabalhos">
              Ver trabalhos <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 rounded-full px-8 py-6 text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <Link to="/contato">
              Fale comigo <MessageCircle className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Destaques Section */}
      <section className="w-full py-16 px-4 bg-purple-50 rounded-lg shadow-inner mt-16">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-purple-800 mb-12">Destaques</h2>
          <p className="text-lg text-gray-700">
            (Em breve: Grid de trabalhos marcados como featured)
          </p>
          {/* Placeholder for featured works grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {/* Example Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <img src="/frontend/public/placeholder.svg" alt="Placeholder" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto Incrível 1</h3>
                <p className="text-gray-600 text-sm">Categoria | 2023</p>
                <Button asChild variant="link" className="text-purple-600 hover:text-purple-800 mt-4 p-0">
                  <Link to="/trabalhos/projeto-incrivel-1">Ver Detalhes</Link>
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <img src="/frontend/public/placeholder.svg" alt="Placeholder" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Projeto Incrível 2</h3>
                <p className="text-gray-600 text-sm">Categoria | 2022</p>
                <Button asChild variant="link" className="text-purple-600 hover:text-purple-800 mt-4 p-0">
                  <Link to="/trabalhos/projeto-incrivel-2">Ver Detalhes</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section className="w-full py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-purple-800 mb-12">Meus Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Desenvolvimento Web</h3>
              <p className="text-gray-700">Criação de sites e aplicações web responsivas e de alta performance usando as tecnologias mais recentes.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Design UI/UX</h3>
              <p className="text-gray-700">Elaboração de interfaces intuitivas e experiências de usuário agradáveis, focadas em conversão e engajamento.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Consultoria Técnica</h3>
              <p className="text-gray-700">Orientação e suporte especializado para otimização de projetos, arquitetura de software e escolha de tecnologias.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;