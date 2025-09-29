import { db } from "../src/config/db.ts";
import { productsTable, categoriesTable } from "./schema.ts";

async function seed() {
  console.log("🌱 Seeding 500 products...");

  // pega todas as categorias do banco
  const categories = await db.select().from(categoriesTable);

  if (categories.length === 0) {
    console.error("❌ Nenhuma categoria encontrada!");
    process.exit(1);
  }

  // base de nomes de produtos (cada um vai variar)
  const baseProducts = [
    {
      name: "Notebook Dell Inspiron",
      description: "Notebook com processador i7 e 16GB de RAM",
      price: 4500,
    },
    {
      name: "iPhone 14 Pro",
      description: "Smartphone Apple com 256GB",
      price: 7500,
    },
    {
      name: 'Smart TV Samsung 55"',
      description: "TV 4K UHD com HDR",
      price: 3200,
    },
    {
      name: "Fone de Ouvido Bluetooth",
      description: "Fone sem fio com cancelamento de ruído",
      price: 500,
    },
    {
      name: "Monitor LG Ultrawide",
      description: "Monitor 29 polegadas ultrawide Full HD",
      price: 1600,
    },
    {
      name: "HD Externo Seagate 2TB",
      description: "Armazenamento portátil USB 3.0",
      price: 550,
    },
    {
      name: "SSD Kingston NVMe 1TB",
      description: "Alta velocidade de leitura e gravação",
      price: 650,
    },
    {
      name: "Smartwatch Samsung Galaxy",
      description: "Relógio inteligente com monitor cardíaco",
      price: 1200,
    },
  ];

  // gerar 500 produtos
  const products = Array.from({ length: 500 }, (_, i) => {
    const base = baseProducts[i % baseProducts.length]; // pega um modelo base
    const randomCategory = categories[i % categories.length]; // distribui entre as categorias

    return {
      name: `${base.name} #${i + 1}`,
      imgUrl: `https://picsum.photos/300/200?random=${i + 1000}`, // imagens diferentes
      description: base.description,
      price: base.price + Math.floor(Math.random() * 500), // preço variado
      stock: Math.floor(Math.random() * 100) + 1, // estoque entre 1 e 100
      categorieId: randomCategory.id, // vincula à categoria
    };
  });

  await db.insert(productsTable).values(products);

  console.log(
    "✅ Seed concluído com 500 produtos distribuídos nas categorias!"
  );
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  });
