import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Animes from "./components/getAnime";
import SoloAnime from "./components/soloAnime";

function App() {
  return (
    <div className="overflow-hidden bg-noir min-h-[100vh]">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/animes" element={<Animes />} />
        <Route path="/anime/:id" element={<SoloAnime />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
