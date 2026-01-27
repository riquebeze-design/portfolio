import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLeadsAdmin = async (req: Request, res: Response) => {
  const { startDate, endDate, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const take = parseInt(limit as string);

  const where: any = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate as string);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate as string);
    }
  }

  try {
    const leads = await prisma.lead.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    const totalLeads = await prisma.lead.count({ where });

    res.status(200).json({
      data: leads,
      total: totalLeads,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(totalLeads / take),
    });
  } catch (error) {
    console.error('Error fetching admin leads:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.lead.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};