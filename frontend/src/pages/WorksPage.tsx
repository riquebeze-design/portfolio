import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Loader2, Search } from 'lucide-react';
import { WorkCategory, WorkType } from '@/types/work'; // Corrected import path

const API_URL = import.meta.env.VITE_API_URL;

interface Work {
  id: string;
  title: string;
  slug: string;
  category: WorkCategory;
  type: WorkType;
  year: number;
  coverImageUrl: string;
  tags: string[];
}

const WorksPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 9; // Number of works per page

  const { data, isLoading, isError, error } = useQuery<{ data: Work[]; totalPages: number }>({
    queryKey: ['works', search, category, type, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        status: 'PUBLISHED',
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (type) params.append('type', type);

      const response = await axios.get(`${API_URL}/works?${params.toString()}`);
      return response.data;
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value === 'all' ? undefined : value);
    setPage(1);
  };

  const handleTypeChange = (value: string) => {
    setType(value === 'all' ? undefined : value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Carregando trabalhos...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-red-600 dark:text-red-400">
        Erro ao carregar trabalhos: {error?.message}
      </div>
    );
  }

  const works = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-extrabold text-purple-800 dark:text-purple-300 mb-12 text-center">Meus Trabalhos</h1>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        <div className="relative col-span-full md:col-span-1 lg:col-span-2">
          <Input
            type="text"
            placeholder="Buscar por título ou tags..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm dark:bg-input dark:border-border dark:text-foreground dark:placeholder:text-muted-foreground"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <Select onValueChange={handleCategoryChange} value={category || 'all'}>
          <SelectTrigger className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm dark:bg-input dark:border-border dark:text-foreground">
            <SelectValue placeholder="Filtrar por Categoria" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-lg dark:bg-card dark:border-border">
            <SelectItem value="all">Todas as Categorias</SelectItem>
            {Object.values(WorkCategory).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleTypeChange} value={type || 'all'}>
          <SelectTrigger className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm dark:bg-input dark:border-border dark:text-foreground">
            <SelectValue placeholder="Filtrar por Tipo" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-lg dark:bg-card dark:border-border">
            <SelectItem value="all">Todos os Tipos</SelectItem>
            {Object.values(WorkType).map((t) => (
              <SelectItem key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Works Grid */}
      {works.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 text-xl py-10">
          Nenhum trabalho encontrado com os filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work) => (
            <Card key={work.id} className="rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl border-2 border-purple-100 dark:bg-card dark:border-purple-900">
              <img
                src={work.coverImageUrl}
                alt={work.title}
                className="w-full h-56 object-cover"
              />
              <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-300">{work.title}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {work.category.charAt(0).toUpperCase() + work.category.slice(1).toLowerCase()} | {work.year}
                </p>
              </CardHeader>
              <CardContent className="px-6 pb-4">
                <div className="flex flex-wrap gap-2">
                  {work.tags.map((tag, index) => (
                    <span key={index} className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full dark:bg-purple-900 dark:text-purple-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-3 text-base shadow-md">
                  <Link to={`/trabalhos/${work.slug}`}>Ver Detalhes</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 dark:text-purple-300 dark:border-purple-700"
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setPage(i + 1)}
                  isActive={page === i + 1}
                  className={`rounded-full ${page === i + 1 ? 'bg-purple-600 text-white' : 'hover:bg-purple-100 dark:hover:bg-purple-900 dark:text-purple-300'}`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="rounded-full hover:bg-purple-100 dark:hover:bg-purple-900 dark:text-purple-300 dark:border-purple-700"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default WorksPage;