import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.get("/api/anime", async (req, res) => {
//   try {
//     const response = await axios.get("https://api.jikan.moe/v4/anime/");
//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/", (req, res) => {
  res.json({ message: "The API part is on /api!" });
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
