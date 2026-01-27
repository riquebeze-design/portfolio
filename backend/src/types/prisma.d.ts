import { PrismaClient, Work as PrismaWork, WorkImage as PrismaWorkImage, Lead as PrismaLead, User as PrismaUser } from '@prisma/client';

// Extendendo os tipos gerados pelo Prisma para incluir tags como array de strings
// Isso é necessário porque armazenamos tags como JSON string no banco de dados
export interface Work extends Omit<PrismaWork, 'tags'> {
  tags: string[];
  images?: WorkImage[]; // Opcional para inclusão
}

export interface WorkImage extends PrismaWorkImage {}
export interface Lead extends PrismaLead {}
export interface User extends PrismaUser {}

// Adicione outros modelos conforme necessário