import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkForm } from '@/hooks/use-work-form';
import WorkDetailsFormSection from '@/components/admin/WorkDetailsFormSection';
import WorkStatusAndFeaturesSection from '@/components/admin/WorkStatusAndFeaturesSection';
import WorkImageUploadSection from '@/components/admin/WorkImageUploadSection';

const AdminWorkFormPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const {
    form,
    fields,
    append,
    remove,
    isEditing,
    isLoadingWork,
    createWorkMutation,
    updateWorkMutation,
    handleFileUpload,
    onSubmit,
  } = useWorkForm({ token });

  if (isLoadingWork) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Carregando trabalho...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{isEditing ? 'Editar Trabalho' : 'Novo Trabalho'}</h1>
        <Button onClick={() => navigate('/admin/works')} variant="outline" className="rounded-full px-6 py-3 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Trabalhos
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto p-8 rounded-2xl shadow-xl border-2 border-purple-100 dark:bg-card dark:border-purple-900">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <WorkDetailsFormSection form={form} isEditing={isEditing} />
            <WorkStatusAndFeaturesSection form={form} />
            <WorkImageUploadSection
              form={form}
              fields={fields}
              append={append}
              remove={remove}
              handleFileUpload={handleFileUpload}
            />

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-3 text-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              disabled={createWorkMutation.isPending || updateWorkMutation.isPending}
            >
              {isEditing ? (updateWorkMutation.isPending ? 'Salvando...' : 'Salvar Alterações') : (createWorkMutation.isPending ? 'Criando...' : 'Criar Trabalho')}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AdminWorkFormPage;