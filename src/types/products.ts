export type Product = {
  id?: string | null;
  name: string;
  imgUrl?: string | null;
  description?: string | null;
  price: number;
  stock: number;
  createdAt: string;
  categorieId?: string | null;
};

export type ProductBodyParams = Omit<Product, "id" | "imgUrl" | "createdAt">;
