import React from 'react';
import { PortfolioPage, PortfolioPageProps } from "@/components/ui/starfall-portfolio-landing";
import { useNavigate } from 'react-router-dom';
import { Case } from '@/components/ui/cases-with-infinite-scroll';
import ContactForm from '@/components/ContactForm'; // Importando o NOVO componente ContactForm
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import axios from 'axios'; // Import axios
import { WorkCategory, WorkType } from '@/types/work'; // Import enums

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

  // Lidar com estados de carregamento e erro para os trabalhos em destaque
  if (isErrorFeaturedWorks) {
    console.error("Erro ao buscar trabalhos em destaque:", error); // Agora loga o objeto de erro completo
    // Opcionalmente, exibir uma mensagem de erro na página
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