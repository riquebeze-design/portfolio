import { Request, Response } from 'express';
import { PrismaClient, WorkCategory, WorkType, WorkStatus } from '@prisma/client'; // Importar enums do Prisma
import { Work } from '../types/prisma.d'; // Importar a interface Work

const prisma = new PrismaClient();

export const getWorks = async (req: Request, res: Response) => {
  const { search, category, type, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const take = parseInt(limit as string);

  const where: any = {
    status: WorkStatus.PUBLISHED, // Usando enum do Prisma
  };

  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { tags: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = category as WorkCategory; // Usando enum do Prisma
  }

  if (type) {
    where.type = type as WorkType; // Usando enum do Prisma
  }

  try {
    const works = await prisma.work.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { images: { orderBy: { order: 'asc' } } },
    });

    const totalWorks = await prisma.work.count({ where });

    // Mapeia os trabalhos para analisar as tags de string JSON para array
    const formattedWorks: Work[] = works.map((work: any) => ({
      ...work,
      tags: JSON.parse(work.tags), // Ainda precisamos analisar as tags de volta para array para o frontend
    }));

    res.status(200).json({
      data: formattedWorks,
      total: totalWorks,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(totalWorks / take),
    });
  } catch (error) {
    console.error('Error fetching works:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getWorkBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const work = await prisma.work.findUnique({
      where: { slug, status: WorkStatus.PUBLISHED }, // Usando enum do Prisma
      include: { images: { orderBy: { order: 'asc' } } },
    });

    if (!work) {
      return res.status(404).json({ message: 'Work not found or not published' });
    }

    // Analisa as tags de string JSON para array
    const formattedWork: Work = {
      ...work,
      tags: JSON.parse(work.tags),
    };

    res.status(200).json(formattedWork);
  } catch (error) {
    console.error('Error fetching work by slug:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};