import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalWorks = await prisma.work.count();
    const publishedWorks = await prisma.work.count({ where: { status: "PUBLISHED" } }); // Use string literal
    const draftWorks = await prisma.work.count({ where: { status: "DRAFT" } }); // Use string literal
    const totalLeads = await prisma.lead.count();

    res.status(200).json({
      totalWorks,
      publishedWorks,
      draftWorks,
      totalLeads,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};