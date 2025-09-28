import { UserRequest } from "./users.ts"; // ajuste o caminho para o seu User

declare global {
  namespace Express {
    export interface Request {
      user?: UserRequest; // agora o TS sabe que existe req.user
    }
  }
}
