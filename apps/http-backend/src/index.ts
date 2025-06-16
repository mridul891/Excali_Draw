import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { middleware } from "./middleware.js";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SignInSchema,
} from "@repo/common/types";

import { prismaClient } from "@repo/database/client";
import { JWT_SECRET } from "@repo/backend-common/config";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const pareseddata = CreateUserSchema.safeParse(req.body);
  if (!pareseddata.success) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: pareseddata.data?.username,
        password: pareseddata.data?.password,
        name: pareseddata.data?.name
      },
    });
    
    res.json({
      userId : user.id
    })
} catch (error) {
  res.status(411).json({
    message : "User Already exists with this username"
  })
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
  const token = jwt.sign({ userId }, JWT_SECRET);
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
