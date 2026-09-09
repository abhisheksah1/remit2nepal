import type { CorsOptions } from "cors";
import { corsOrigins, isProduction } from "./env.js";

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, !isProduction);
      return;
    }
    if (corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-Requested-With", "X-CSRF-Token"]
};
