import { CartItem } from "./carts.ts";
import { Product } from "./products.ts";
import { UserRequest } from "./users.ts"; // ajuste o caminho para o seu User

declare global {
  namespace Express {
    export interface Request {
      user?: UserRequest;
      product?: Product;
      cart?: Cart;
      cartItem?: CartItem;
    }
  }
}
