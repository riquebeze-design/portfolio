import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import slugify from 'slugify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showSuccess, showError } from '@/utils/toast';
import { WorkCategory, WorkType, WorkStatus } from '@/types/work';
import { UseFormReturn, FieldArrayWithId } from 'react-hook-form';

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

export type WorkFormValues = z.infer<typeof workFormSchema>;

interface UseWorkFormProps {
  token: string | null;
}

export const useWorkForm = ({ token }: UseWorkFormProps) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
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
      tags: '', // Default to empty string for input field
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
          if (imageIndex !== undefined && fields[imageIndex + index]) {
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

  return {
    form,
    fields,
    append,
    remove,
    update,
    isEditing,
    isLoadingWork,
    createWorkMutation,
    updateWorkMutation,
    handleFileUpload,
    onSubmit,
    slugify,
    WorkCategory,
    WorkType,
    WorkStatus,
  };
};