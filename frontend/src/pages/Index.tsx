import React from 'react';
import { PortfolioPage, PortfolioPageProps } from "@/components/ui/starfall-portfolio-landing";
import { useNavigate } from 'react-router-dom';
import { Case } from '@/components/ui/cases-with-infinite-scroll';
import ContactForm from '@/components/ContactForm'; // Importando o NOVO componente ContactForm
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import axios from 'axios'; // Import axios
import { WorkCategory, WorkType } from '@/types/work'; // Import enums
import { Loader2 } from 'lucide-react'; // Importação adicionada para Loader2

const API_URL = import.meta.env.VITE_API_URL;

// Re-using and extending the Work interface from WorksPage for consistency
interface Work {
  id: string;
  title: string;
  slug: string;
  category: WorkCategory;
  type: WorkType;
  year: number;
  coverImageUrl: string;
  tags: string[];
  description: string; // Adicionado description
  featured: boolean; // Adicionado featured
  status: string; // Adicionado status
  externalUrl?: string;
  images?: { url: string; order: number }[];
}

const Index = () => {
  const navigate = useNavigate();

  // Buscar trabalhos em destaque
  const { data: featuredWorksData, isLoading: isLoadingFeaturedWorks, isError: isErrorFeaturedWorks, error } = useQuery<Work[]>({
    queryKey: ['featuredWorks'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/works?status=PUBLISHED&featured=true&limit=3`);
      return response.data.data; // Assumindo que a API retorna { data: [], totalPages: N }
    },
  });

  // Mapear trabalhos buscados para o formato esperado pelo PortfolioPage
  const featuredProjects: PortfolioPageProps['projects'] = featuredWorksData?.map(work => ({
    title: work.title,
    description: work.description,
    tags: work.tags,
    imageContent: (
      <img
        src={work.coverImageUrl}
        alt={work.title}
        className="w-full h-full object-cover rounded-lg"
      />
    ),
  })) || [];

  const customPortfolioData: PortfolioPageProps = {
    logo: {
      initials: 'AC',
      name: 'Antônio Cavalcanti',
    },
    navLinks: [
      { label: 'Eu', href: '#about' },
      { label: 'Projetos', href: '#projects' },
      { label: 'Skills', href: '#skills' },
    ],
    resume: {
      label: 'Ver Currículo',
      onClick: () => alert('Baixando Currículo...'), // Placeholder for resume download
    },
    hero: {
      titleLine1: 'Design Gráfico &',
      titleLine2Gradient: 'Branding',
      subtitle: 'Atuo com design gráfico e branding, desenvolvendo identidades visuais sólidas, modernas e pensadas para gerar reconhecimento e conexão.',
    },
    ctaButtons: {
      primary: {
        label: 'Ver Trabalhos',
        onClick: () => { navigate('/trabalhos'); },
      },
      secondary: {
        label: 'Fale Comigo',
        onClick: () => { navigate('/contato'); },
      },
    },
    // Usar os projetos buscados dinamicamente aqui
    projects: isLoadingFeaturedWorks ? [] : featuredProjects, // Mostrar array vazio enquanto carrega
    stats: [
      { value: '50+', label: 'Projetos Concluídos' },
      { value: '5+', label: 'Anos de Experiência' },
      { value: '15+', label: 'Clientes Satisfeitos' },
    ],
    showAnimatedBackground: true,
    hideNavbar: true, // Esconde a navbar interna do PortfolioPage
  };

  if (isLoadingFeaturedWorks) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Carregando trabalhos em destaque...</span>
      </div>
    );
  }

  if (isErrorFeaturedWorks) {
    console.error("Erro ao buscar trabalhos em destaque:", error);
    const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || "Verifique se o backend está rodando e acessível.";
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-red-600 dark:text-red-400 p-4">
        <p className="text-xl mb-4">Erro ao carregar trabalhos em destaque: {errorMessage}</p>
        <p className="text-md text-gray-600 dark:text-gray-400">Por favor, verifique o console do backend para mais detalhes.</p>
      </div>
    );
  }

  return (
    <div className="dark:bg-black"> {/* Adicionado dark:bg-black para garantir o fundo preto */}
      <PortfolioPage {...customPortfolioData} />
      <Case />
      <ContactForm /> {/* O novo componente ContactForm é colocado aqui */}
    </div>
  );
};

export default Index;