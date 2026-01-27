import React from 'react';
import { PortfolioPage, PortfolioPageProps } from "@/components/ui/starfall-portfolio-landing";
import { useNavigate } from 'react-router-dom';
import { Case } from '@/components/ui/cases-with-infinite-scroll';
import ProfileCard from '@/components/ProfileCard'; // Importando o NOVO componente ProfileCard

const Index = () => {
  const navigate = useNavigate();

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
    projects: [
      {
        title: 'Website Redesign',
        description: 'Um projeto de redesign completo para uma startup de tecnologia, focado em UI/UX moderno e performance.',
        tags: ['React', 'Tailwind CSS', 'UI/UX']
      },
      {
        title: 'Branding para Cafeteria',
        description: 'Desenvolvimento de identidade de marca fresca e convidativa para uma cafeteria local.',
        tags: ['Branding', 'Logo Design', 'Graphic Design']
      },
      {
        title: 'Plataforma de E-commerce',
        description: 'Uma loja online escalável construída com Next.js, TypeScript e Stripe.',
        tags: ['Next.js', 'Stripe', 'Vercel'],
        imageContent: <div className="text-2xl text-white/50">🛒</div>
      },
    ],
    stats: [
      { value: '50+', label: 'Projetos Concluídos' },
      { value: '5+', label: 'Anos de Experiência' },
      { value: '15+', label: 'Clientes Satisfeitos' },
    ],
    showAnimatedBackground: true,
    hideNavbar: true, // Esconde a navbar interna do PortfolioPage
  };

  return (
    <>
      <PortfolioPage {...customPortfolioData} />
      <Case />
      <ProfileCard /> {/* O novo componente ProfileCard é colocado aqui */}
    </>
  );
};

export default Index;