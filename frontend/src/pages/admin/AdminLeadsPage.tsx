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
  const { authenticatedAxios } = useAuth(); // Usar authenticatedAxios
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

      const response = await authenticatedAxios.get(`${API_URL}/admin/leads?${params.toString()}`); // Usar authenticatedAxios
      return response.data;
    },
    enabled: true, // Não precisa mais de !!token
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      await authenticatedAxios.delete(`${API_URL}/admin/leads/${id}`); // Usar authenticatedAxios
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

      const response = await authenticatedAxios.get(`${API_URL}/admin/leads?${params.toString()}&limit=9999`); // Usar authenticatedAxios
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
            `"${lead.name.replace(/"/g, '""')}"`, // Handle commas and quotes in name
            lead.email,
            lead.phone || '',
            `"${lead.message.replace(/"/g, '""')}"`, // Handle commas and quotes in message
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
        <span className="ml-3 text-lg text-gray-700">Carregando leads...</span>
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
        <h1 className="text-4xl font-bold text-gray-800">Gerenciar Leads</h1>
        <Button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3">
          <Download className="mr-2 h-4 w-4" /> Exportar CSV
        </Button>
      </div>

      {/* Date Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label htmlFor="startDate" className="text-lg text-gray-800">Data Inicial</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm mt-2"
          />
        </div>
        <div>
          <Label htmlFor="endDate" className="text-lg text-gray-800">Data Final</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm mt-2"
          />
        </div>
      </div>

      {/* Leads Table */}
      {leads.length === 0 ? (
        <div className="text-center text-gray-600 text-xl py-10">
          Nenhum lead encontrado.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-purple-100">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-50">
                <TableHead className="text-purple-800 font-semibold">Nome</TableHead>
                <TableHead className="text-purple-800 font-semibold">Email</TableHead>
                <TableHead className="text-purple-800 font-semibold">Telefone</TableHead>
                <TableHead className="text-purple-800 font-semibold">Mensagem</TableHead>
                <TableHead className="text-purple-800 font-semibold">Recebido Em</TableHead>
                <TableHead className="text-right text-purple-800 font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-purple-50 transition-colors">
                  <TableCell className="font-medium text-gray-800">{lead.name}</TableCell>
                  <TableCell className="text-gray-700">{lead.email}</TableCell>
                  <TableCell className="text-gray-700">{lead.phone || '-'}</TableCell>
                  <TableCell className="text-gray-700 max-w-xs truncate">{lead.message}</TableCell>
                  <TableCell className="text-gray-700">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
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
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente o lead de "{lead.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full px-6 py-3">Cancelar</AlertDialogCancel>
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

export default AdminLeadsPage;