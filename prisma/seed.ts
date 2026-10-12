import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Seed Users (Admin & Customer)
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const customerPasswordHash = await bcrypt.hash("customer123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@thevanvasiproject.com.np" },
    update: {},
    create: {
      name: "Vanvasi Kitchen Lead",
      email: "admin@thevanvasiproject.com.np",
      role: "admin",
      passwordHash: adminPasswordHash,
      emailVerified: new Date(),
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "Aayush Shrestha",
      email: "customer@example.com",
      role: "customer",
      passwordHash: customerPasswordHash,
      emailVerified: new Date(),
    },
  });

  console.log(`👤 Users seeded: ${admin.email} (admin), ${customer.email} (customer)`);

  // 2. Seed Delivery Areas
  const deliveryAreas = [
    { id: "area_ktm_ring", name: "Inside Kathmandu Ring Road", deliveryFee: 100 },
    { id: "area_ktm_outer", name: "Outside Ring Road (up to 5 km)", deliveryFee: 150 },
    { id: "area_lalitpur", name: "Lalitpur (Patan, Pulchowk, Jhamsikhel)", deliveryFee: 100 },
    { id: "area_bhaktapur", name: "Bhaktapur Core", deliveryFee: 200 },
  ];

  for (const area of deliveryAreas) {
    await prisma.deliveryArea.upsert({
      where: { id: area.id },
      update: {},
      create: {
        id: area.id,
        name: area.name,
        deliveryFee: area.deliveryFee,
        isActive: true,
      },
    });
  }

  // 3. Seed Products & Variants
  const products = [
    {
      id: "prod_hhb",
      name: "Hot Honey Butter",
      slug: "hot-honey-butter",
      characterTitle: "The Fiery Artisan",
      tagline: "Whipped highland butter infused with raw honey & smoked bird's eye chili.",
      description: "Crafted in small batches using slow-churned butter from mountain dairies, blended with uncooked Himalayan honey and whole bird's eye chilies smoked over oak chips.",
      ingredients: JSON.stringify([
        "Cultured highland butter (pasteurized cow's milk, live cultures)",
        "Raw multifloral wild honey (unpasteurized, sourced from Makwanpur)",
        "Bird's eye chili flakes & smoked pods",
        "Hand-harvested Himalayan pink mineral salt",
      ]),
      isActive: true,
      images: [
        {
          id: "img_hhb_1",
          url: "/images/hot-honey-butter.svg",
          altText: "Hot Honey Butter Jar",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        { id: "var_hhb_100", size: "100 g", price: 450, sku: "TVP-HHB-100" },
        { id: "var_hhb_250", size: "250 g", price: 950, sku: "TVP-HHB-250" },
      ],
    },
    {
      id: "prod_gb",
      name: "Garlic Butter",
      slug: "garlic-butter",
      characterTitle: "The Roasted Classic",
      tagline: "Slow-roasted garlic confit folded into sea-salted alpine butter.",
      description: "Whole local garlic cloves poached at 85°C for four hours in cold-pressed mustard oil until spreadable like cream, then beaten into fresh butter.",
      ingredients: JSON.stringify([
        "Cultured highland butter (pasteurized cow's milk)",
        "Roasted local organic garlic confit",
        "Cold-pressed virgin mustard oil",
        "Fresh dried mountain thyme",
        "Flaky sea salt",
      ]),
      isActive: true,
      images: [
        {
          id: "img_gb_1",
          url: "/images/garlic-butter.svg",
          altText: "Garlic Butter Jar",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        { id: "var_gb_100", size: "100 g", price: 400, sku: "TVP-GB-100" },
        { id: "var_gb_250", size: "250 g", price: 850, sku: "TVP-GB-250" },
      ],
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      await prisma.product.create({
        data: {
          id: p.id,
          name: p.name,
          slug: p.slug,
          characterTitle: p.characterTitle,
          tagline: p.tagline,
          description: p.description,
          ingredients: p.ingredients,
          isActive: p.isActive,
          images: {
            create: p.images,
          },
          variants: {
            create: p.variants,
          },
        },
      });
    }
  }

  // 4. Seed Batches
  const batches = [
    {
      id: "bat_hhb_100_1",
      variantId: "var_hhb_100",
      batchCode: "HHB-100-26A",
      madeOn: "2026-09-10",
      bestBefore: "2026-11-10",
      quantityReceived: 40,
      quantityRemaining: 18,
    },
    {
      id: "bat_hhb_250_1",
      variantId: "var_hhb_250",
      batchCode: "HHB-250-26A",
      madeOn: "2026-09-12",
      bestBefore: "2026-11-12",
      quantityReceived: 30,
      quantityRemaining: 14,
    },
    {
      id: "bat_gb_100_1",
      variantId: "var_gb_100",
      batchCode: "GB-100-26A",
      madeOn: "2026-09-14",
      bestBefore: "2026-11-14",
      quantityReceived: 50,
      quantityRemaining: 22,
    },
    {
      id: "bat_gb_250_1",
      variantId: "var_gb_250",
      batchCode: "GB-250-26A",
      madeOn: "2026-09-14",
      bestBefore: "2026-11-14",
      quantityReceived: 25,
      quantityRemaining: 8,
    },
  ];

  for (const b of batches) {
    await prisma.batch.upsert({
      where: { batchCode: b.batchCode },
      update: {},
      create: b,
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
