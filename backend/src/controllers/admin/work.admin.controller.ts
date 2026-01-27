import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

export const getWorksAdmin = async (req: Request, res: Response) => {
  const { search, category, type, status, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const take = parseInt(limit as string);

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { tags: { has: search as string } },
    ];
  }

  if (category) {
    where.category = category as string;
  }

  if (type) {
    where.type = type as string;
  }

  if (status) {
    where.status = status as string;
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

    res.status(200).json({
      data: works,
      total: totalWorks,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      totalPages: Math.ceil(totalWorks / take),
    });
  } catch (error) {
    console.error('Error fetching admin works:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getWorkByIdAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const work = await prisma.work.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    });

    if (!work) {
      return res.status(404).json({ message: 'Work not found' });
    }

    res.status(200).json(work);
  } catch (error) {
    console.error('Error fetching work by ID for admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createWork = async (req: Request, res: Response) => {
  const { title, slug, category, type, year, client, description, tags, featured, status, coverImageUrl, externalUrl, images } = req.body;

  try {
    const generatedSlug = slug ? slugify(slug, { lower: true, strict: true }) : slugify(title, { lower: true, strict: true });

    const existingWork = await prisma.work.findUnique({ where: { slug: generatedSlug } });
    if (existingWork) {
      return res.status(400).json({ message: 'Slug already exists. Please choose a different title or slug.' });
    }

    const work = await prisma.work.create({
      data: {
        title,
        slug: generatedSlug,
        category,
        type,
        year,
        client,
        description,
        tags,
        featured,
        status,
        coverImageUrl,
        externalUrl,
        images: {
          create: images || [],
        },
      },
      include: { images: true },
    });
    res.status(201).json(work);
  } catch (error) {
    console.error('Error creating work:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateWork = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, slug, category, type, year, client, description, tags, featured, status, coverImageUrl, externalUrl, images } = req.body;

  try {
    const currentWork = await prisma.work.findUnique({ where: { id } });
    if (!currentWork) {
      return res.status(404).json({ message: 'Work not found' });
    }

    let updatedSlug = currentWork.slug;
    if (slug && slug !== currentWork.slug) {
      const newGeneratedSlug = slugify(slug, { lower: true, strict: true });
      const existingWorkWithNewSlug = await prisma.work.findUnique({ where: { slug: newGeneratedSlug } });
      if (existingWorkWithNewSlug && existingWorkWithNewSlug.id !== id) {
        return res.status(400).json({ message: 'Slug already exists. Please choose a different slug.' });
      }
      updatedSlug = newGeneratedSlug;
    } else if (title && title !== currentWork.title && !slug) {
      // If title changes and slug is not explicitly provided, regenerate slug from new title
      const newGeneratedSlug = slugify(title, { lower: true, strict: true });
      const existingWorkWithNewSlug = await prisma.work.findUnique({ where: { slug: newGeneratedSlug } });
      if (existingWorkWithNewSlug && existingWorkWithNewSlug.id !== id) {
        // If the new slug from the new title already exists for another work, append a unique identifier
        updatedSlug = `${newGeneratedSlug}-${Date.now()}`;
      } else {
        updatedSlug = newGeneratedSlug;
      }
    }


    // Delete existing images not present in the update
    const existingImageUrls = currentWork.images.map(img => img.url);
    const updatedImageUrls = images ? images.map((img: { url: string }) => img.url) : [];
    const imagesToDelete = existingImageUrls.filter(url => !updatedImageUrls.includes(url));

    await prisma.workImage.deleteMany({
      where: {
        workId: id,
        url: {
          in: imagesToDelete,
        },
      },
    });

    const work = await prisma.work.update({
      where: { id },
      data: {
        title,
        slug: updatedSlug,
        category,
        type,
        year,
        client,
        description,
        tags,
        featured,
        status,
        coverImageUrl,
        externalUrl,
        images: {
          // Update existing images and create new ones
          upsert: images?.map((image: { id?: string; url: string; order: number }) => ({
            where: { id: image.id || 'new-image-id' }, // Use a dummy ID for new images
            create: { url: image.url, order: image.order },
            update: { url: image.url, order: image.order },
          })) || [],
        },
      },
      include: { images: true },
    });
    res.status(200).json(work);
  } catch (error) {
    console.error('Error updating work:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteWork = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.work.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting work:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};