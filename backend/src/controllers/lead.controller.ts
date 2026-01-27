import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLead = async (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;

  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });
    res.status(201).json({ message: 'Lead created successfully', lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};