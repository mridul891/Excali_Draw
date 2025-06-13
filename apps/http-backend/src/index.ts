import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
import { middleware } from "./middleware.js";
const app = express();

app.use(cors);

app.post("/signup", (req, res) => {
    res.json({
        userId :"123"
    })
});

app.post("/signin", (req, res) => {
  const userId = 1;
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json({
    token,
  });
});

app.post("/room", middleware,(req, res) => {});
app.listen(3001);
