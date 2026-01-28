"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const slugify_1 = __importDefault(require("slugify"));
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs")); // Import bcryptjs
const shared_1 = require("../src/types/shared"); // Import enums do backend
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const prisma = new client_1.PrismaClient();

async function seedAdminUser() {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set in .env. Skipping admin user seeding.');
        return;
    }
    try {
        const existingAdmin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
        if (!existingAdmin) {
            const hashedPassword = await bcryptjs_1.default.hash(ADMIN_PASSWORD, 10);
            await prisma.user.create({
                data: {
                    email: ADMIN_EMAIL,
                    password: hashedPassword,
                },
            });
            console.log(`Admin user "${ADMIN_EMAIL}" created.`);
        }
        else {
            console.log(`Admin user "${ADMIN_EMAIL}" already exists.`);
        }
    }
    catch (error) {
        console.error('Error seeding admin user:', error);
    }
}

async function main() {
    await seedAdminUser(); // Ensure admin user is seeded first

    // Generic placeholder images from picsum.photos
    const placeholderImage1 = 'https://picsum.photos/seed/dyad-work-1/800/600';
    const placeholderImage2 = 'https://picsum.photos/seed/dyad-work-2/800/600';
    const placeholderImage3 = 'https://picsum.photos/seed/dyad-work-3/800/600';
    const placeholderImage4 = 'https://picsum.photos/seed/dyad-work-4/800/600';
    const placeholderImage5 = 'https://picsum.photos/seed/dyad-work-5/800/600';
    const placeholderImage6 = 'https://picsum.photos/seed/dyad-work-6/800/600';

    // Seed example works
    const work1Slug = (0, slugify_1.default)('Website Redesign for Tech Startup', { lower: true, strict: true });
    const work2Slug = (0, slugify_1.default)('Branding for Coffee Shop', { lower: true, strict: true });
    const work3Slug = (0, slugify_1.default)('Mobile App UI/UX Design', { lower: true, strict: true });

    const work1 = await prisma.work.upsert({
        where: { slug: work1Slug },
        update: {},
        create: {
            title: 'Website Redesign for Tech Startup',
            slug: work1Slug,
            category: shared_1.WorkCategory.WEBSITE,
            type: shared_1.WorkType.DEVELOPMENT,
            year: 2023,
            client: 'Innovate Solutions',
            description: 'A complete overhaul of a tech startup\'s website, focusing on modern UI/UX and improved performance. Implemented with React and Tailwind CSS.',
            tags: JSON.stringify(['React', 'Tailwind CSS', 'UI/UX', 'Web Development']),
            featured: true,
            status: shared_1.WorkStatus.PUBLISHED,
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
            category: shared_1.WorkCategory.BRANDING,
            type: shared_1.WorkType.DESIGN,
            year: 2022,
            client: 'The Daily Grind',
            description: 'Developed a fresh and inviting brand identity for a local coffee shop, including logo, color palette, and marketing materials.',
            tags: JSON.stringify(['Branding', 'Logo Design', 'Graphic Design', 'Marketing']),
            featured: true,
            status: shared_1.WorkStatus.PUBLISHED,
            coverImageUrl: placeholderImage2,
            externalUrl: null,
            images: {
                create: [
                    { url: placeholderImage4, order: 0 },
                    { url: placeholderImage5, order: 1 },
                ],
            },
        },
        include: { images: true },
    });
    console.log(`Created/Updated work: ${work2.title}`);

    const work3 = await prisma.work.upsert({
        where: { slug: work3Slug },
        update: {},
        create: {
            title: 'Mobile App UI/UX Design',
            slug: work3Slug,
            category: shared_1.WorkCategory.SYSTEM,
            type: shared_1.WorkType.DESIGN,
            year: 2024,
            client: 'Global Innovations',
            description: 'Designed an intuitive and modern user interface for a new mobile application, focusing on user experience and accessibility.',
            tags: JSON.stringify(['Mobile App', 'UI/UX', 'Figma', 'Product Design']),
            featured: true,
            status: shared_1.WorkStatus.PUBLISHED,
            coverImageUrl: placeholderImage3,
            externalUrl: 'https://example.com/mobile-app',
            images: {
                create: [
                    { url: placeholderImage6, order: 0 },
                    { url: placeholderImage1, order: 1 },
                ],
            },
        },
        include: { images: true },
    });
    console.log(`Created/Updated work: ${work3.title}`);
}

main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    void prisma.$disconnect();
});