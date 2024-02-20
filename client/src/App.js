import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Animes from "./components/getAnime";
import SoloAnime from "./components/soloAnime";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/animes" element={<Animes />} />
        <Route path="/anime/:id" element={<SoloAnime />} />
      </Routes>

      {/* Footer */}
    </>
  );
}

export default App;
