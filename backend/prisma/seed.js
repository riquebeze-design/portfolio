"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdminUser = seedAdminUser;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const slugify_1 = __importDefault(require("slugify"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
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
    await seedAdminUser(); // Garante que o usuário admin seja semeado primeiro
    // Cria o diretório de uploads se não existir
    const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
    // Imagens de placeholder (você pode querer copiar imagens reais aqui)
    const placeholderImage1 = '/uploads/placeholder-work1.jpg';
    const placeholderImage2 = '/uploads/placeholder-work2.jpg';
    const placeholderImage3 = '/uploads/placeholder-work3.jpg';
    // Cria arquivos de imagem dummy de placeholder se não existirem
    const dummyImagePath1 = path_1.default.join(uploadsDir, 'placeholder-work1.jpg');
    const dummyImagePath2 = path_1.default.join(uploadsDir, 'placeholder-work2.jpg');
    const dummyImagePath3 = path_1.default.join(uploadsDir, 'placeholder-work3.jpg');
    if (!fs_1.default.existsSync(dummyImagePath1)) {
        fs_1.default.writeFileSync(dummyImagePath1, 'This is a dummy image file for work 1.');
    }
    if (!fs_1.default.existsSync(dummyImagePath2)) {
        fs_1.default.writeFileSync(dummyImagePath2, 'This is a dummy image file for work 2.');
    }
    if (!fs_1.default.existsSync(dummyImagePath3)) {
        fs_1.default.writeFileSync(dummyImagePath3, 'This is a dummy image file for work 3.');
    }
    // Semeia trabalhos de exemplo
    const work1Slug = (0, slugify_1.default)('Website Redesign for Tech Startup', { lower: true, strict: true });
    const work2Slug = (0, slugify_1.default)('Branding for Coffee Shop', { lower: true, strict: true });
    const work1 = await prisma.work.upsert({
        where: { slug: work1Slug },
        update: {},
        create: {
            title: 'Website Redesign for Tech Startup',
            slug: work1Slug,
            category: 'WEBSITE', // Use string literal
            type: 'DEVELOPMENT', // Use string literal
            year: 2023,
            client: 'Innovate Solutions',
            description: 'A complete overhaul of a tech startup\'s website, focusing on modern UI/UX and improved performance. Implemented with React and Tailwind CSS.',
            tags: JSON.stringify(['React', 'Tailwind CSS', 'UI/UX', 'Web Development']), // Stringify tags array
            featured: true,
            status: 'PUBLISHED', // Use string literal
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
            category: 'BRANDING', // Use string literal
            type: 'DESIGN', // Use string literal
            year: 2022,
            client: 'The Daily Grind',
            description: 'Developed a fresh and inviting brand identity for a local coffee shop, including logo, color palette, and marketing materials.',
            tags: JSON.stringify(['Branding', 'Logo Design', 'Graphic Design', 'Marketing']), // Stringify tags array
            featured: false,
            status: 'PUBLISHED', // Use string literal
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
