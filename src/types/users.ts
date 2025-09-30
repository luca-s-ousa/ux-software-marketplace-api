export type User = {
  id?: string;
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
  password: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
};

export type UserRequest = Pick<User, "id" | "email" | "name" | "isAdmin"> & {
  userId: string;
};
