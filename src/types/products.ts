export type Product = {
  id?: string;
  name: string;
  imgUrl?: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: string;
  categorieId: string;
};

export type ProductBodyParams = Omit<Product, "id" | "imgUrl" | "createdAt">;
