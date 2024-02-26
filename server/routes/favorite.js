import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken, verifyUser } from "./user.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello from favorite routes!" });
});

router.get("/all", (req, res) => {
  prisma.favorite
    .findMany()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

router.post("/", verifyToken, async (req, res) => {
  const { userId, animeId } = req.body;

  try {
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_animeId: {
          userId: userId,
          animeId: animeId,
        },
      },
    });

    if (existingFavorite) {
      return res.json({ message: "This anime is already in your Favorites list!" });
    }

    const newFavorite = await prisma.favorite.create({
      data: {
        userId: userId,
        animeId: animeId,
      },
    });

    return res.json(newFavorite);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
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

router.get("/user/:id", (req, res) => {
  const id = req.params.id;
  prisma.favorite
    .findMany({
      where: {
        userId: id,
      }
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json({ error: error.message });
    });
});

export { router as favoriteRouter };