import express from "express";
import jwt from "jsonwebtoken";

import { middleware } from "./middleware.js";
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateRoomSchema, CreateUserSchema, SignInSchema } from "@repo/common/types";

const app = express();

app.use(cors);

app.post("/signup", (req, res) => {
  const data= CreateUserSchema.safeParse(req.body)
  if (!data){
     res.json({
      message : "Incorrect Inputs"
    })
    return;
  }
    res.json({
        userId :"123"
    })
});

app.post("/signin", (req, res) => {
  const data= SignInSchema.safeParse(req.body)
  if (!data){
     res.json({
      message : "Incorrect Inputs"
    })
    return;
  }
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({
    token,
  });
});

app.post("/room", middleware,(req, res) => {
  const data= CreateRoomSchema.safeParse(req.body)
  if (!data){
     res.json({
      message : "Incorrect Inputs"
    })
    return;
  }
  res,json({
    roomId : 123
  })
});
app.listen(3001);
