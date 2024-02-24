import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Animes from "./components/getAnime";
import SoloAnime from "./components/soloAnime";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import User from "./components/user/User";
import Favorites from "./components/user/Favorites";

function App() {
  return (
    <div className="overflow-hidden bg-noir min-h-[100vh]">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/animes" element={<Animes />} />
        <Route path="/anime/:id" element={<SoloAnime />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
