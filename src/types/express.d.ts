declare global {
  namespace Express {
    interface Request {
      user?: { id: string; personId: string | null; email: string };
    }
  }
}
export {};
