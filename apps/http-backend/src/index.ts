import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { middleware } from "./middleware.js";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SignInSchema,
} from "@repo/common/types";


import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from '@repo/database/client';

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body)
  const pareseddata = CreateUserSchema.safeParse(req.body);
  console.log(pareseddata)
  if (!pareseddata.success) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }

  try {
    const password = pareseddata.data.password;
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: {
        email: pareseddata.data?.username,
        password: hashedpassword,
        name: pareseddata.data?.name,
      },
    });

    res.json({
      userId: user.id,
    });
  } catch (error) {
    res.status(411).json({
      message: "User Already exists with this username",
    });
  }
});

app.post("/signin", async (req, res) => {
  const pareseddata = SignInSchema.safeParse(req.body);
  if (!pareseddata) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }
  try {
    const password = pareseddata.data?.password;
    const user = await prismaClient.user.findFirst({
      where: {
        email: pareseddata.data?.username,
      },
    });
    if (!user) {
      res.status(403).json({
        message: "Not authorized",
      });
      return;
    }
    const decodedPassword = await bcrypt.compare(
      password as string,
      user?.password
    );

    if (!decodedPassword) {
      res.status(401).json({
        message: "Password Incorrect",
      });
      return;
    }

    const token = jwt.sign({ userId: user?.id }, JWT_SECRET);
    res.json({
      token,
    });
  } catch (error) {
    res.status(401).json({ message: error });
  }
});

app.post("/room", middleware, async (req, res) => {
  const parseddata = CreateRoomSchema.safeParse(req.body);
  if (!parseddata) {
    res.json({
      message: "Incorrect Inputs",
    });
    return;
  }

  try {
    // @ts-ignore
    const userId = req.userId;

    const roomId = await prismaClient.room.create({
      data: {
        slug: parseddata.data?.name as string,
        adminId: userId,
      },
    });

    res.json({
      roomId,
    });
  } catch (error) {}
});
app.listen(3001);
