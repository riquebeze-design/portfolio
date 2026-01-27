import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, showError } from '@/utils/toast';
import { Loader2, PlusCircle, XCircle, UploadCloud, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkCategory, WorkType, WorkStatus } from '@prisma/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

const workFormSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório.' }),
  slug: z.string().min(1, { message: 'Slug é obrigatório.' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug deve ser em kebab-case (ex: meu-novo-trabalho).'),
  category: z.nativeEnum(WorkCategory, { message: 'Categoria é obrigatória.' }),
  type: z.nativeEnum(WorkType, { message: 'Tipo é obrigatório.' }),
  year: z.coerce.number().int().min(1900, 'Ano deve ser após 1900').max(2100, 'Ano deve ser antes de 2100'),
  client: z.string().optional(),
  description: z.string().min(1, { message: 'Descrição é obrigatória.' }),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)),
  featured: z.boolean().default(false),
  status: z.nativeEnum(WorkStatus).default(WorkStatus.DRAFT),
  coverImageUrl: z.string().url({ message: 'URL da imagem de capa inválida.' }).min(1, { message: 'Imagem de capa é obrigatória.' }),
  externalUrl: z.string().url({ message: 'URL externa inválida.' }).optional().or(z.literal('')),
  images: z.array(z.object({
    id: z.string().optional(), // For existing images
    url: z.string().url({ message: 'URL da imagem inválida.' }).min(1, { message: 'URL da imagem é obrigatória.' }),
    order: z.coerce.number().int().min(0).optional().default(0),
  })).optional(),
});

type WorkFormValues = z.infer<typeof workFormSchema>;

const AdminWorkFormPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const form = useForm<WorkFormValues>({
    resolver: zodResolver(workFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      category: WorkCategory.OTHER,
      type: WorkType.OTHER,
      year: new Date().getFullYear(),
      client: '',
      description: '',
      tags: [],
      featured: false,
      status: WorkStatus.DRAFT,
      coverImageUrl: '',
      externalUrl: '',
      images: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'images',
  });

  const { data: workData, isLoading: isLoadingWork } = useQuery<WorkFormValues>({
    queryKey: ['adminWork', id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/admin/works/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      // Transform tags array to comma-separated string for the form field
      return {
        ...data,
        tags: data.tags ? data.tags.join(', ') : '',
      };
    },
    enabled: isEditing && !!token,
  });

  useEffect(() => {
    if (isEditing && workData) {
      form.reset(workData);
    }
  }, [isEditing, workData, form]);

  const createWorkMutation = useMutation({
    mutationFn: async (newWork: WorkFormValues) => {
      const response = await axios.post(`${API_URL}/admin/works`, newWork, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWorks'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      showSuccess('Trabalho criado com sucesso!');
      navigate('/admin/works');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao criar trabalho.');
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((error: any) => {
          form.setError(error.path[1], { message: error.message });
        });
      }
    },
  });

  const updateWorkMutation = useMutation({
    mutationFn: async (updatedWork: WorkFormValues) => {
      const response = await axios.put(`${API_URL}/admin/works/${id}`, updatedWork, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWorks'] });
      queryClient.invalidateQueries({ queryKey: ['adminWork', id] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      showSuccess('Trabalho atualizado com sucesso!');
      navigate('/admin/works');
    },
    onError: (err: any) => {
      showError(err.response?.data?.message || 'Erro ao atualizar trabalho.');
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((error: any) => {
          form.setError(error.path[1], { message: error.message });
        });
      }
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isCover: boolean = false, imageIndex?: number) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const response = await axios.post(`${API_URL}/admin/uploads`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const uploadedUrls: string[] = response.data.urls;

      if (isCover) {
        form.setValue('coverImageUrl', uploadedUrls[0], { shouldValidate: true });
        showSuccess('Imagem de capa enviada com sucesso!');
      } else {
        uploadedUrls.forEach((url, index) => {
          if (imageIndex !== undefined) {
            // Update existing image
            update(imageIndex + index, { ...fields[imageIndex + index], url: url });
          } else {
            // Add new image
            append({ url: url, order: fields.length + index });
          }
        });
        showSuccess('Imagens da galeria enviadas com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      showError(error.response?.data?.message || 'Erro ao fazer upload das imagens.');
    }
  };

  const onSubmit = (values: WorkFormValues) => {
    const payload = {
      ...values,
      tags: Array.isArray(values.tags) ? values.tags : values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      images: values.images?.map((img, index) => ({ ...img, order: index })) || [], // Ensure order is set
    };

    if (isEditing) {
      updateWorkMutation.mutate(payload);
    } else {
      createWorkMutation.mutate(payload);
    }
  };

  if (isLoadingWork) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-3 text-lg text-gray-700">Carregando trabalho...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{isEditing ? 'Editar Trabalho' : 'Novo Trabalho'}</h1>
        <Button onClick={() => navigate('/admin/works')} variant="outline" className="rounded-full px-6 py-3 border-purple-300 text-purple-700 hover:bg-purple-50">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Trabalhos
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto p-8 rounded-2xl shadow-xl border-2 border-purple-100">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-800">Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Título do trabalho"
                      {...field}
                      className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm"
                      onChange={(e) => {
                        field.onChange(e);
                        if (!isEditing || !form.formState.dirtyFields.slug) { // Only auto-generate if not editing or slug hasn't been manually changed
                          form.setValue('slug', slugify(e.target.value, { lower: true, strict: true }));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-800">Slug (URL amigável)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="slug-do-trabalho"
                      {...field}
                      className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-gray-800">Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl shadow-lg">
                        {Object.values(WorkCategory).map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-gray-800">Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm">
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl shadow-lg">
                        {Object.values(WorkType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-gray-800">Ano</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2023"
                        {...field}
                        className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-gray-800">Cliente (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do cliente"
                        {...field}
                        className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-800">Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o trabalho em detalhes..."
                      rows={8}
                      {...field}
                      className="rounded-xl border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm p-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-800">Tags (separadas por vírgula)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="React, Tailwind CSS, UI/UX"
                      {...field}
                      className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="externalUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-800">Link Externo (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://www.exemplo.com"
                      {...field}
                      className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm border-purple-200">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="rounded-md border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-lg text-gray-800">
                        Destacar na Home
                      </FormLabel>
                      <FormDescription className="text-gray-600">
                        Marque para exibir este trabalho na seção "Destaques" da página inicial.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm border-purple-200">
                    <FormControl>
                      <Checkbox
                        checked={field.value === WorkStatus.PUBLISHED}
                        onCheckedChange={(checked) => field.onChange(checked ? WorkStatus.PUBLISHED : WorkStatus.DRAFT)}
                        className="rounded-md border-purple-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-lg text-gray-800">
                        Publicar Trabalho
                      </FormLabel>
                      <FormDescription className="text-gray-600">
                        Marque para tornar este trabalho visível no portfólio público.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Cover Image Upload */}
            <FormItem>
              <FormLabel className="text-lg text-gray-800">Imagem de Capa</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-4">
                  <Input
                    type="url"
                    placeholder="URL da imagem de capa"
                    {...form.register('coverImageUrl')}
                    className="flex-grow rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm"
                  />
                  <label htmlFor="cover-image-upload" className="cursor-pointer">
                    <Button asChild variant="outline" className="rounded-full px-6 py-3 border-purple-300 text-purple-700 hover:bg-purple-50">
                      <span><UploadCloud className="mr-2 h-4 w-4" /> Upload</span>
                    </label>
                    <input
                      id="cover-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, true)}
                    />
                  </Button>
                </div>
              </FormControl>
              {form.getValues('coverImageUrl') && (
                <div className="mt-4 relative w-48 h-32 rounded-lg overflow-hidden border-2 border-purple-200 shadow-sm">
                  <img src={form.getValues('coverImageUrl')} alt="Capa" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() => form.setValue('coverImageUrl', '')}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <FormMessage />
            </FormItem>

            {/* Gallery Images Upload */}
            <FormItem>
              <FormLabel className="text-lg text-gray-800">Galeria de Imagens</FormLabel>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-4 p-3 border rounded-xl border-purple-200 shadow-sm">
                    <Input
                      type="url"
                      placeholder="URL da imagem da galeria"
                      {...form.register(`images.${index}.url`)}
                      className="flex-grow rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm"
                    />
                    <label htmlFor={`gallery-image-upload-${index}`} className="cursor-pointer">
                      <Button asChild variant="outline" className="rounded-full px-6 py-3 border-purple-300 text-purple-700 hover:bg-purple-50">
                        <span><UploadCloud className="mr-2 h-4 w-4" /> Upload</span>
                      </label>
                      <input
                        id={`gallery-image-upload-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, false, index)}
                      />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="rounded-full"
                      onClick={() => remove(index)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ url: '', order: fields.length })}
                  className="w-full rounded-full px-6 py-3 border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Imagem
                </Button>
              </div>
              <FormMessage />
            </FormItem>

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