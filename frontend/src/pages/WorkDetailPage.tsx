import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { WorkCategory, WorkType } from '@/types/work'; // Corrected import path

const API_URL = import.meta.env.VITE_API_URL;

interface WorkImage {
  id: string;
  url: string;
  order: number;
}

interface Work {
  id: string;
  title: string;
  slug: string;
  category: WorkCategory;
  type: WorkType;
  year: number;
  client?: string;
  description: string;
  tags: string[];
  coverImageUrl: string;
  externalUrl?: string;
  images: WorkImage[];
}

const WorkDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: work, isLoading, isError, error } = useQuery<Work>({
    queryKey: ['work', slug],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/works/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });

  // Fetch all published works to determine next/previous
  const { data: allWorksData } = useQuery<{ data: Work[] }>({
    queryKey: ['allPublishedWorks'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/works?status=PUBLISHED&limit=999`); // Fetch all for navigation
      return response.data;
    },
  });

  const allWorks = allWorksData?.data || [];
  const currentIndex = work ? allWorks.findIndex(w => w.id === work.id) : -1;
  const prevWork = currentIndex > 0 ? allWorks[currentIndex - 1] : null;
  const nextWork = currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Carregando detalhes do trabalho...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-red-600 dark:text-red-400 p-4">
        <p className="text-xl mb-4">Erro ao carregar trabalho: {error?.message}</p>
        <Button onClick={() => navigate('/trabalhos')} className="bg-purple-600 hover:bg-purple-700 rounded-full px-6 py-3">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Trabalhos
        </Button>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-gray-600 dark:text-gray-400 p-4">
        <p className="text-xl mb-4">Trabalho não encontrado.</p>
        <Button onClick={() => navigate('/trabalhos')} className="bg-purple-600 hover:bg-purple-700 rounded-full px-6 py-3">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Trabalhos
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <Button onClick={() => navigate('/trabalhos')} variant="outline" className="rounded-full px-6 py-3 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Trabalhos
        </Button>
        <h1 className="text-5xl font-extrabold text-purple-800 dark:text-purple-300 text-center flex-grow">{work.title}</h1>
        <div className="w-32"></div> {/* Spacer to balance the back button */}
      </div>

      {/* Image Gallery */}
      {work.images && work.images.length > 0 && (
        <Card className="mb-12 rounded-2xl shadow-xl border-2 border-purple-100 dark:bg-card dark:border-purple-900">
          <Carousel className="w-full max-w-4xl mx-auto p-6">
            <CarouselContent>
              {work.images.map((image, index) => (
                <CarouselItem key={image.id || index}>
                  <div className="p-1">
                    <img
                      src={image.url}
                      alt={`${work.title} image ${index + 1}`}
                      className="w-full h-[400px] md:h-[500px] object-cover rounded-xl shadow-md"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-purple-600 text-white hover:bg-purple-700 rounded-full" />
            <CarouselNext className="bg-purple-600 text-white hover:bg-purple-700 rounded-full" />
          </Carousel>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-purple-800 dark:text-purple-300 mb-4">Descrição</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{work.description}</p>
        </div>

        <div className="lg:col-span-1 bg-purple-50 p-8 rounded-2xl shadow-lg border-2 border-purple-100 dark:bg-card dark:border-purple-900">
          <h2 className="text-3xl font-bold text-purple-800 dark:text-purple-300 mb-6">Detalhes</h2>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
            {/* Alterado <p> para <div> */}
            <div><strong>Categoria:</strong> <Badge className="bg-purple-200 text-purple-800 rounded-full px-3 py-1 dark:bg-purple-900 dark:text-purple-300">{work.category}</Badge></div>
            {/* Alterado <p> para <div> */}
            <div><strong>Tipo:</strong> <Badge className="bg-purple-200 text-purple-800 rounded-full px-3 py-1 dark:bg-purple-900 dark:text-purple-300">{work.type}</Badge></div>
            <p><strong>Ano:</strong> {work.year}</p>
            {work.client && <p><strong>Cliente:</strong> {work.client}</p>}
            {work.externalUrl && (
              <p>
                <strong>Link Externo:</strong>{' '}
                <a href={work.externalUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline flex items-center dark:text-purple-400">
                  Ver Projeto <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </p>
            )}
            {work.tags && work.tags.length > 0 && (
              <div>
                <strong>Tags:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {work.tags.map((tag, index) => (
                    <Badge key={index} className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 dark:bg-purple-900 dark:text-purple-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-16 pt-8 border-t border-purple-200 dark:border-purple-900">
        {prevWork ? (
          <Button asChild variant="outline" className="rounded-full px-6 py-3 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900">
            <Link to={`/trabalhos/${prevWork.slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {nextWork ? (
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-3">
            <Link to={`/trabalhos/${nextWork.slug}`}>
              Próximo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default WorkDetailPage;