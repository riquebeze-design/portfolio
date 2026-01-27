import { PrismaClient, Work as PrismaWork, WorkImage as PrismaWorkImage, Lead as PrismaLead } from '@prisma/client';

// Extendendo os tipos gerados pelo Prisma para incluir tags como array de strings
// e usando string para category, type e status para compatibilidade com SQLite.
export interface Work extends Omit<PrismaWork, 'tags' | 'category' | 'type' | 'status'> {
  tags: string[];
  category: string; // Alterado para string
  type: string;     // Alterado para string
  status: string;   // Alterado para string
  images?: WorkImage[]; // Opcional para inclusão
}

export interface WorkImage extends PrismaWorkImage {}
export interface Lead extends PrismaLead {}