import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { showSuccess, showError } from '@/utils/toast';
import { Mail, Phone, User } from 'lucide-react';
import { Card } from '@/components/ui/card'; // Importar Card

const API_URL = import.meta.env.VITE_API_URL;

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'Mensagem deve ter pelo menos 10 caracteres.' }),
});

const ContactPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`${API_URL}/leads`, values);
      showSuccess('Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.');
      form.reset();
    } catch (error: any) {
      console.error('Erro ao enviar contato:', error);
      showError(error.response?.data?.message || 'Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-extrabold text-purple-800 mb-12 text-center">Fale Comigo</h1>
      <p className="text-xl text-gray-700 text-center mb-10 max-w-2xl mx-auto">
        Tem um projeto em mente ou apenas quer dizer olá? Preencha o formulário abaixo e entrarei em contato o mais breve possível.
      </p>

      <Card className="max-w-3xl mx-auto p-8 rounded-2xl shadow-xl bg-purple-50 border-2 border-purple-100 dark:border-purple-900 dark:bg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-800">Nome Completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Seu nome"
                        {...field}
                        className="pl-10 pr-4 py-2 rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-gray-800">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="seu.email@exemplo.com"
                          {...field}
                          className="pl-10 pr-4 py-2 rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-800">Telefone (Opcional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="(XX) XXXXX-XXXX"
                        {...field}
                        className="pl-10 pr-4 py-2 rounded-full border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg text-gray-800">Mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva seu projeto ou sua dúvida..."
                      rows={5}
                      {...field}
                      className="rounded-xl border-2 border-purple-200 focus:border-purple-500 transition-all shadow-sm p-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-3 text-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ContactPage;