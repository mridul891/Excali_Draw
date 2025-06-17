import { JWT_SECRET } from "@repo/backend-common/config";
import { Request, Response, NextFunction } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

// ✅ Extend the Request interface to include custom `userId`
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function middleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization ?? ""; // ✅ Use `.authorization`, not `.get()`
  try {
    const decodedToken = token.split(" ")[1] || "";
    const decoded = jwt.verify(decodedToken, JWT_SECRET) as JwtPayload;

    if (decoded && decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(401).json({ message: "unauthorized" });
    }
  } catch (err) {
    res.status(401).json({ message: "invalid token" });
  }
}
