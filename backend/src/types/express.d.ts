export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
}

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        id: string;
        userId: string;
        fullName: string;
        role: "SUPER_ADMIN" | "ADMIN";
        permissions: string[];
        mustChangePassword: boolean;
      };
    }
  }
}

export {};
