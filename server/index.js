import express from "express";
import cors from "cors";
import axios from "axios";
import { userRouter } from "./routes/user.js";
import { favoriteRouter } from "./routes/favorite.js";
import { commentRouter } from "./routes/comment.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

app.use("/api/auth", userRouter);

app.use("/api/favorites", favoriteRouter);

app.use("/api/comments", commentRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Animex Server! The API part is on /api!" });
});

app.get("/api/characters", (req, res) => {
  res.json([
    { id: 1, name: "Naruto" },
    { id: 2, name: "Sasuke" },
    { id: 3, name: "Sakura" },
  ]);
});

app.get("/api/characters/:id", (req, res) => {
  const id = req.params.id;
  const character = { id: id, name: "Character Name" };
  res.json(character);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

export {}