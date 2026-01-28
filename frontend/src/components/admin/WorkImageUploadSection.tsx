import React, { useRef } from 'react';
import { UseFormReturn, FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { WorkFormValues } from '@/hooks/use-work-form';
import { PlusCircle, XCircle, UploadCloud } from 'lucide-react';

interface WorkImageUploadSectionProps {
  form: UseFormReturn<WorkFormValues>;
  fields: FieldArrayWithId<WorkFormValues, 'images', 'id'>[];
  append: UseFieldArrayAppend<WorkFormValues, 'images'>;
  remove: UseFieldArrayRemove;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, isCover: boolean, imageIndex?: number) => Promise<void>;
}

const WorkImageUploadSection: React.FC<WorkImageUploadSectionProps> = ({
  form,
  fields,
  append,
  remove,
  handleFileUpload,
}) => {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <>
      {/* Cover Image Upload */}
      <FormItem>
        <FormLabel className="text-lg text-gray-800 dark:text-gray-200">Imagem de Capa</FormLabel>
        <FormDescription className="text-gray-600 dark:text-gray-400 mb-2">
          Insira a URL da imagem de capa ou faça upload de um arquivo.
        </FormDescription>
        <FormControl>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Input
              type="url"
              placeholder="URL da imagem de capa"
              {...form.register('coverImageUrl')}
              className="flex-grow rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm dark:bg-input dark:border-border dark:text-foreground dark:placeholder:text-muted-foreground"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto rounded-full px-6 py-3 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
              onClick={() => coverInputRef.current?.click()} // Trigger click on hidden input
            >
              <UploadCloud className="mr-2 h-4 w-4" /> Upload
            </Button>
            <input
              id="cover-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, true)}
              ref={coverInputRef} // Assign ref to hidden input
            />
          </div>
        </FormControl>
        {form.getValues('coverImageUrl') && (
          <div className="mt-4 relative w-48 h-32 rounded-lg overflow-hidden border-2 border-purple-200 shadow-sm dark:border-purple-900">
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
        <FormLabel className="text-lg text-gray-800 dark:text-gray-200">Galeria de Imagens</FormLabel>
        <FormDescription className="text-gray-600 dark:text-gray-400 mb-2">
          Adicione URLs de imagens para a galeria ou faça upload de arquivos.
        </FormDescription>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 border rounded-xl border-purple-200 shadow-sm dark:bg-card dark:border-purple-900">
              <Input
                type="url"
                placeholder="URL da imagem da galeria"
                {...form.register(`images.${index}.url`)}
                className="flex-grow rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm dark:bg-input dark:border-border dark:text-foreground dark:placeholder:text-muted-foreground"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto rounded-full px-6 py-3 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
                onClick={() => galleryInputRefs.current[index]?.click()} // Trigger click on hidden input
              >
                <UploadCloud className="mr-2 h-4 w-4" /> Upload
              </Button>
              <input
                id={`gallery-image-upload-${index}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, false, index)}
                ref={(el) => (galleryInputRefs.current[index] = el)} // Assign ref to hidden input
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="rounded-full flex-shrink-0"
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
            className="w-full rounded-full px-6 py-3 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Imagem
          </Button>
        </div>
        <FormMessage />
      </FormItem>
    </>
  );
};

export default WorkImageUploadSection;