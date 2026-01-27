import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Loader2, PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/utils/toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { WorkCategory, WorkType, WorkStatus } from '@/types/work'; // Corrected import path

const API_URL = import.meta.env.VITE_API_URL;

interface Work {
  id: string;
  title: string;
  category: WorkCategory;
  type: WorkType;
  year: number;
  status: WorkStatus;
  createdAt: string;
}

const AdminWorksPage = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery<{ data: Work[]; totalPages: number }>({
    queryKey: ['adminWorks', search, category, type, status, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (type) params.append('type', type);
      if (status) params.append('status', status);

      const response = await axios.get(`${API_URL}/admin/works?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!token,
  });

  const deleteWorkMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/admin/works/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWorks'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      showSuccess('Trabalho excluído com sucesso!');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao excluir trabalho.');
    },
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value === 'all' ? undefined : value);
    setPage(1);
  };

  const handleTypeChange = (value: string) => {
    setType(value === 'all' ? undefined : value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value === 'all' ? undefined : value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-3 text-lg text-gray-700">Carregando trabalhos...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 text-center">
        Erro ao carregar trabalhos: {error?.message}
      </div>
    );
  }

  const works = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Gerenciar Trabalhos</h1>
        <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-3">
          <Link to="/admin/works/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Trabalho
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="relative col-span-full md:col-span-1 lg:col-span-1">
          <Input
            type="text"
            placeholder="Buscar por título ou tags..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <Select onValueChange={handleCategoryChange} value={category || 'all'}>
          <SelectTrigger className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm">
            <SelectValue placeholder="Filtrar por Categoria" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-lg">
            <SelectItem value="all">Todas as Categorias</SelectItem>
            {Object.values(WorkCategory).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleTypeChange} value={type || 'all'}>
          <SelectTrigger className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm">
            <SelectValue placeholder="Filtrar por Tipo" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-lg">
            <SelectItem value="all">Todos os Tipos</SelectItem>
            {Object.values(WorkType).map((t) => (
              <SelectItem key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleStatusChange} value={status || 'all'}>
          <SelectTrigger className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-lg">
            <SelectItem value="all">Todos os Status</SelectItem>
            {Object.values(WorkStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Works Table */}
      {works.length === 0 ? (
        <div className="text-center text-gray-600 text-xl py-10">
          Nenhum trabalho encontrado.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-purple-100">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-50">
                <TableHead className="w-[200px] text-purple-800 font-semibold">Título</TableHead>
                <TableHead className="text-purple-800 font-semibold">Categoria</TableHead>
                <TableHead className="text-purple-800 font-semibold">Tipo</TableHead>
                <TableHead className="text-purple-800 font-semibold">Ano</TableHead>
                <TableHead className="text-purple-800 font-semibold">Status</TableHead>
                <TableHead className="text-purple-800 font-semibold">Criado Em</TableHead>
                <TableHead className="text-right text-purple-800 font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {works.map((work) => (
                <TableRow key={work.id} className="hover:bg-purple-50 transition-colors">
                  <TableCell className="font-medium text-gray-800">{work.title}</TableCell>
                  <TableCell className="text-gray-700">{work.category}</TableCell>
                  <TableCell className="text-gray-700">{work.type}</TableCell>
                  <TableCell className="text-gray-700">{work.year}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      work.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {work.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700">{new Date(work.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button asChild variant="outline" size="icon" className="rounded-full border-purple-300 text-purple-700 hover:bg-purple-50">
                        <Link to={`/admin/works/edit/${work.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="rounded-full">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-xl shadow-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-bold text-red-700">Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-700">
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente o trabalho "{work.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-full px-6 py-3">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteWorkMutation.mutate(work.id)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-3"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="rounded-full hover:bg-purple-100"
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setPage(i + 1)}
                  isActive={page === i + 1}
                  className={`rounded-full ${page === i + 1 ? 'bg-purple-600 text-white' : 'hover:bg-purple-100'}`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="rounded-full hover:bg-purple-100"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AdminWorksPage;