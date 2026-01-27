import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Loader2, Trash2, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/utils/toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const API_URL = import.meta.env.VITE_API_URL;

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

const AdminLeadsPage = () => {
  const { authenticatedAxios } = useAuth();
  const queryClient = useQueryClient();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery<{ data: Lead[]; totalPages: number }>({
    queryKey: ['adminLeads', startDate, endDate, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await authenticatedAxios.get(`${API_URL}/admin/leads?${params.toString()}`);
      return response.data;
    },
    enabled: true,
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      await authenticatedAxios.delete(`${API_URL}/admin/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminLeads'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      showSuccess('Lead excluído com sucesso!');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao excluir lead.');
    },
  });

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await authenticatedAxios.get(`${API_URL}/admin/leads?${params.toString()}&limit=9999`);
      const leadsToExport: Lead[] = response.data.data;

      if (leadsToExport.length === 0) {
        showError('Nenhum lead para exportar.');
        return;
      }

      const headers = ['ID', 'Nome', 'Email', 'Telefone', 'Mensagem', 'Criado Em'];
      const csvRows = [
        headers.join(','),
        ...leadsToExport.map(lead =>
          [
            lead.id,
            `"${lead.name.replace(/"/g, '""')}"`,
            lead.email,
            lead.phone || '',
            `"${lead.message.replace(/"/g, '""')}"`,
            new Date(lead.createdAt).toLocaleString(),
          ].join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccess('Leads exportados com sucesso para CSV!');
      }
    } catch (error: any) {
      console.error('Erro ao exportar leads:', error);
      showError(error.response?.data?.message || 'Erro ao exportar leads para CSV.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Carregando leads...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 text-center">
        Erro ao carregar leads: {error?.message}
      </div>
    );
  }

  const leads = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Gerenciar Leads</h1>
        <Button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3">
          <Download className="mr-2 h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      {/* Date Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label htmlFor="startDate" className="text-lg text-gray-800 dark:text-gray-200">Data Inicial</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm mt-2 dark:bg-input dark:border-border dark:text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="endDate" className="text-lg text-gray-800 dark:text-gray-200">Data Final</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm mt-2 dark:bg-input dark:border-border dark:text-foreground"
          />
        </div>
      </div>

      {/* Leads Table */}
      {leads.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 text-xl py-10">
          Nenhum lead encontrado.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-purple-100 dark:bg-card dark:border-purple-900">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-50 dark:bg-gray-900">
                <TableHead className="text-purple-800 font-semibold dark:text-purple-300">Nome</TableHead>
                <TableHead className="text-purple-800 font-semibold dark:text-purple-300">Email</TableHead>
                <TableHead className="text-purple-800 font-semibold dark:text-purple-300">Telefone</TableHead>
                <TableHead className="text-purple-800 font-semibold dark:text-purple-300">Mensagem</TableHead>
                <TableHead className="text-purple-800 font-semibold dark:text-purple-300">Recebido Em</TableHead>
                <TableHead className="text-right text-purple-800 font-semibold dark:text-purple-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-purple-50 transition-colors dark:hover:bg-gray-800">
                  <TableCell className="font-medium text-gray-800 dark:text-gray-200">{lead.name}</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{lead.email}</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{lead.phone || '-'}</TableCell>
                  <TableCell className="text-gray-700 max-w-xs truncate dark:text-gray-300">{lead.message}</TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="rounded-full">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-xl shadow-lg dark:bg-card dark:border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-bold text-red-700 dark:text-red-400">Tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-700 dark:text-gray-300">
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o lead de "{lead.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full px-6 py-3 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteLeadMutation.mutate(lead.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-3"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default AdminLeadsPage;