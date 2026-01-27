import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import slugify from 'slugify';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

export async function seedAdminUser() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env. Skipping admin user seeding.');
    return;
  }

  try {
    const existingAdmin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await prisma.user.create({
        data: {
          email: ADMIN_EMAIL,
          password: hashedPassword,
        },
      });
      console.log(`Admin user "${ADMIN_EMAIL}" created.`);
    } else {
      console.log(`Admin user "${ADMIN_EMAIL}" already exists.`);
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

async function main() {
  await seedAdminUser(); // Ensure admin user is seeded first

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Placeholder images (you might want to copy actual images here)
  const placeholderImage1 = '/uploads/placeholder-work1.jpg';
  const placeholderImage2 = '/uploads/placeholder-work2.jpg';
  const placeholderImage3 = '/uploads/placeholder-work3.jpg';

  // Create dummy placeholder image files if they don't exist
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


  // Seed example works
  const work1Slug = slugify('Website Redesign for Tech Startup', { lower: true, strict: true });
  const work2Slug = slugify('Branding for Coffee Shop', { lower: true, strict: true });

  const work1 = await prisma.work.upsert({
    where: { slug: work1Slug },
    update: {},
    create: {
      title: 'Website Redesign for Tech Startup',
      slug: work1Slug,
      category: 'WEBSITE',
      type: 'DEVELOPMENT',
      year: 2023,
      client: 'Innovate Solutions',
      description: 'A complete overhaul of a tech startup\'s website, focusing on modern UI/UX and improved performance. Implemented with React and Tailwind CSS.',
      tags: ['React', 'Tailwind CSS', 'UI/UX', 'Web Development'],
      featured: true,
      status: 'PUBLISHED',
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
      category: 'BRANDING',
      type: 'DESIGN',
      year: 2022,
      client: 'The Daily Grind',
      description: 'Developed a fresh and inviting brand identity for a local coffee shop, including logo, color palette, and marketing materials.',
      tags: ['Branding', 'Logo Design', 'Graphic Design', 'Marketing'],
      featured: false,
      status: 'PUBLISHED',
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