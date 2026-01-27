import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Briefcase, FileText, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

interface AdminStats {
  totalWorks: number;
  publishedWorks: number;
  draftWorks: number;
  totalLeads: number;
}

const AdminDashboardPage = () => {
  const { authenticatedAxios } = useAuth(); // Usar authenticatedAxios

  const { data: stats, isLoading, isError, error } = useQuery<AdminStats>({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await authenticatedAxios.get(`${API_URL}/admin/stats`); // Usar authenticatedAxios
      return response.data;
    },
    enabled: true, // Não precisa mais de !!token, pois authenticatedAxios já gerencia isso
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-3 text-lg text-gray-700">Carregando dashboard...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 text-center">
        Erro ao carregar dados do dashboard: {error?.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-md border-2 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Total de Trabalhos</CardTitle>
            <Briefcase className="h-6 w-6 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-purple-800">{stats?.totalWorks}</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border-2 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Trabalhos Publicados</CardTitle>
            <FileText className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-green-800">{stats?.publishedWorks}</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border-2 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Rascunhos</CardTitle>
            <FileText className="h-6 w-6 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-yellow-800">{stats?.draftWorks}</div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-md border-2 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Total de Leads</CardTitle>
            <Users className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-blue-800">{stats?.totalLeads}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;