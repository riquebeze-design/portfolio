import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getWorks = async (req: Request, res: Response) => {
  const { search, category, type, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const take = parseInt(limit as string);

  const where: any = {
    status: "PUBLISHED", // Use string literal
  };

  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      // Para SQLite, a busca dentro de uma string JSON requer 'contains' na própria string
      { tags: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = category as string;
  }

  if (type) {
    where.type = type as string;
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
    const formattedWorks = works.map(work => ({
      ...work,
      tags: JSON.parse(work.tags), // Analisa as tags de volta para array
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
      where: { slug, status: "PUBLISHED" }, // Use string literal
      include: { images: { orderBy: { order: 'asc' } } },
    });

    if (!work) {
      return res.status(404).json({ message: 'Work not found or not published' });
    }

    // Analisa as tags de string JSON para array
    const formattedWork = {
      ...work,
      tags: JSON.parse(work.tags),
    };

    res.status(200).json(formattedWork);
  } catch (error) {
    console.error('Error fetching work by slug:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};