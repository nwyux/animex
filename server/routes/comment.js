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

router.get("/all", (req, res) => {
    prisma.comment
      .findMany()
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json({ error: error.message });
      });
  });

router.get("/:id", verifyToken, (req, res) => {
    const id = req.params.id;
    prisma.comment
      .findUnique({
        where: {
          id: id,
        },
      })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json({ error: error.message });
      });
  });

router.post("/", verifyToken, (req, res) => {
    const { userId, username, animeId, title, content } = req.body;
    prisma.comment
      .create({
        data: {
          userId: userId,
          username: username,
          animeId: animeId,
          title: title,
          content: content,
        },
      })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json({ error: error.message });
      });
  });

export { router as commentRouter };