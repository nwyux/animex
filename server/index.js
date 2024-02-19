import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the Animex Backend!' });
});

app.get('/', (req, res) => {
    res.json({ message: 'The API part is on /api!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});