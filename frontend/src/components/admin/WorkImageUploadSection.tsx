import React from 'react';
import { UseFormReturn, FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayUpdate } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
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
  return (
    <>
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
    </>
  );
};

export default WorkImageUploadSection;