export type Cart = {
  id: string;
  userId: string;
  createdAt: string;
};

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
};
