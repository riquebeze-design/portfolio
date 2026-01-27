import { PrismaClient, Work as PrismaWork, WorkImage as PrismaWorkImage, Lead as PrismaLead, WorkCategory as PrismaWorkCategory, WorkType as PrismaWorkType, WorkStatus as PrismaWorkStatus } from '@prisma/client';

// Extendendo os tipos gerados pelo Prisma para incluir tags como array de strings
// Isso é necessário porque armazenamos tags como JSON string no banco de dados
export interface Work extends Omit<PrismaWork, 'tags' | 'category' | 'type' | 'status'> {
  tags: string[];
  category: PrismaWorkCategory;
  type: PrismaWorkType;
  status: PrismaWorkStatus;
  images?: WorkImage[]; // Opcional para inclusão
}

export interface WorkImage extends PrismaWorkImage {}
export interface Lead extends PrismaLead {}
// O modelo User será removido, então não precisamos mais da interface User aqui.

// Adicione outros modelos conforme necessário