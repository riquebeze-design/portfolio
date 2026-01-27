import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { WorkFormValues } from '@/hooks/use-work-form';
import { WorkStatus } from '@/types/work';

interface WorkStatusAndFeaturesSectionProps {
  form: UseFormReturn<WorkFormValues>;
}

const WorkStatusAndFeaturesSection: React.FC<WorkStatusAndFeaturesSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm border-purple-200 dark:bg-card dark:border-purple-900">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                className="rounded-md border-purple-400 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white dark:border-purple-700 dark:data-[state=checked]:bg-purple-500"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-lg text-gray-800 dark:text-gray-200">
                Destacar na Home
              </FormLabel>
              <FormDescription className="text-gray-600 dark:text-gray-400">
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
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm border-purple-200 dark:bg-card dark:border-purple-900">
            <FormControl>
              <Checkbox
                checked={field.value === WorkStatus.PUBLISHED}
                onCheckedChange={(checked) => field.onChange(checked ? WorkStatus.PUBLISHED : WorkStatus.DRAFT)}
                className="rounded-md border-purple-400 data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:border-purple-700 dark:data-[state=checked]:bg-green-500"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-lg text-gray-800 dark:text-gray-200">
                Publicar Trabalho
              </FormLabel>
              <FormDescription className="text-gray-600 dark:text-gray-400">
                Marque para tornar este trabalho visível no portfólio público.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default WorkStatusAndFeaturesSection;