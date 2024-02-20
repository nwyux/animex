import { Routes, Route } from "react-router-dom";
import AnimeList from "./composents/AnimeList";
import Navbar from "./composents/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime" element={<AnimeList />} />
      </Routes>
    </>
  );
}

export default App;
