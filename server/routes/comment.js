import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken, verifyAdmin, verifyUser } from "./user.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Hello from comment routes!" });
  });

router.get("/all", verifyToken, (req, res) => {
    prisma.comment
      .findMany()
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json({ error: error.message });
      });
  });

export { router as commentRouter };