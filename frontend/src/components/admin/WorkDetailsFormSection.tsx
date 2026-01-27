import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkFormValues } from '@/hooks/use-work-form';
import { WorkCategory, WorkType } from '@/types/work';
import slugify from 'slugify';

interface WorkDetailsFormSectionProps {
  form: UseFormReturn<WorkFormValues>;
  isEditing: boolean;
}

const WorkDetailsFormSection: React.FC<WorkDetailsFormSectionProps> = ({ form, isEditing }) => {
  return (
    <>
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
                  if (!isEditing || !form.formState.dirtyFields.slug) {
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
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-lg">
                    {Object.values(WorkCategory).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
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
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-lg">
                    {Object.values(WorkType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
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
    </>
  );
};

export default WorkDetailsFormSection;