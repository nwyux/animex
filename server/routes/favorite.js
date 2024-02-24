import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken, verifyAdmin, verifyUser } from "./user.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from favorite routes!" });
});

router.get("/all", verifyToken, (req, res) => {
  prisma.favorite
    .findMany()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

router.post("/", verifyToken, (req, res) => {
  const { userId, animeId } = req.body;
  prisma.favorite
    .create({
      data: {
        userId: userId,
        animeId: animeId,
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

router.delete("/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  prisma.favorite
    .delete({
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

router.get("/user/:id", verifyToken, verifyUser, (req, res) => {
  const id = req.params.id;
  prisma.favorite
    .findMany({
      where: {
        userId: id,
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

export { router as favoriteRouter };
