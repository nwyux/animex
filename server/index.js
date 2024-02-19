import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the Animex Backend!" });
});

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
