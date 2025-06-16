import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { middleware } from "./middleware.js";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SignInSchema,
} from "@repo/common/types";

import { prismaClient } from "@repo/database/client";
import { JWT_SECRET } from "@repo/backendcommon/config";
import { JWT_NEW_SECRET } from "./config.js";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }
});

app.post("/signin", (req, res) => {
  const data = SignInSchema.safeParse(req.body);
  if (!data) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_NEW_SECRET);
  res.json({
    token,
  });
});

app.post("/room", middleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }
  res.json({
    roomId: 123,
  });
});
app.listen(3001);
