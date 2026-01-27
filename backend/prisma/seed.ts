import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import slugify from 'slugify';
import path from 'path';
import fs from 'fs';
import { WorkCategory, WorkType, WorkStatus } from '../../frontend/src/types/work'; // Importar enums do frontend

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  // Cria o diretório de uploads se não existir (ainda para placeholders, mas o upload real será no Supabase Storage)
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Imagens de placeholder (você pode querer copiar imagens reais aqui)
  const placeholderImage1 = '/uploads/placeholder-work1.jpg';
  const placeholderImage2 = '/uploads/placeholder-work2.jpg';
  const placeholderImage3 = '/uploads/placeholder-work3.jpg';

  // Cria arquivos de imagem dummy de placeholder se não existirem
  const dummyImagePath1 = path.join(uploadsDir, 'placeholder-work1.jpg');
  const dummyImagePath2 = path.join(uploadsDir, 'placeholder-work2.jpg');
  const dummyImagePath3 = path.join(uploadsDir, 'placeholder-work3.jpg');

  if (!fs.existsSync(dummyImagePath1)) {
    fs.writeFileSync(dummyImagePath1, 'This is a dummy image file for work 1.');
  }
  if (!fs.existsSync(dummyImagePath2)) {
    fs.writeFileSync(dummyImagePath2, 'This is a dummy image file for work 2.');
  }
  if (!fs.existsSync(dummyImagePath3)) {
    fs.writeFileSync(dummyImagePath3, 'This is a dummy image file for work 3.');
  }


  // Semeia trabalhos de exemplo
  const work1Slug = slugify('Website Redesign for Tech Startup', { lower: true, strict: true });
  const work2Slug = slugify('Branding for Coffee Shop', { lower: true, strict: true });

  const work1 = await prisma.work.upsert({
    where: { slug: work1Slug },
    update: {},
    create: {
      title: 'Website Redesign for Tech Startup',
      slug: work1Slug,
      category: WorkCategory.WEBSITE, // Usando enum do frontend
      type: WorkType.DEVELOPMENT,     // Usando enum do frontend
      year: 2023,
      client: 'Innovate Solutions',
      description: 'A complete overhaul of a tech startup\'s website, focusing on modern UI/UX and improved performance. Implemented with React and Tailwind CSS.',
      tags: JSON.stringify(['React', 'Tailwind CSS', 'UI/UX', 'Web Development']), // Stringify tags array
      featured: true,
      status: WorkStatus.PUBLISHED,   // Usando enum do frontend
      coverImageUrl: placeholderImage1,
      externalUrl: 'https://example.com/tech-startup',
      images: {
        create: [
          { url: placeholderImage1, order: 0 },
          { url: placeholderImage2, order: 1 },
          { url: placeholderImage3, order: 2 },
        ],
      },
    },
    include: { images: true },
  });
  console.log(`Created/Updated work: ${work1.title}`);

  const work2 = await prisma.work.upsert({
    where: { slug: work2Slug },
    update: {},
    create: {
      title: 'Branding for Coffee Shop',
      slug: work2Slug,
      category: WorkCategory.BRANDING, // Usando enum do frontend
      type: WorkType.DESIGN,          // Usando enum do frontend
      year: 2022,
      client: 'The Daily Grind',
      description: 'Developed a fresh and inviting brand identity for a local coffee shop, including logo, color palette, and marketing materials.',
      tags: JSON.stringify(['Branding', 'Logo Design', 'Graphic Design', 'Marketing']), // Stringify tags array
      featured: false,
      status: WorkStatus.PUBLISHED,   // Usando enum do frontend
      coverImageUrl: placeholderImage2,
      externalUrl: null,
      images: {
        create: [
          { url: placeholderImage2, order: 0 },
          { url: placeholderImage1, order: 1 },
        ],
      },
    },
    include: { images: true },
  });
  console.log(`Created/Updated work: ${work2.title}`);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });