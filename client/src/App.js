import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Animes from "./components/getAnime";
import SoloAnime from "./components/soloAnime";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import User from "./components/user/User";
import Favorites from "./components/user/Favorites";
import { AnimatePresence } from "framer-motion";
import UserProfile from "./components/user/UserProfile";
import Notfound from "./components/Notfound";
import { useEffect } from "react";

function App() {
  const location = useLocation();

  useEffect(() => {
    // after every route change, scroll to the top of the page after .5s
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1100);
  }, [location]);

  return (
    <div className="overflow-hidden bg-noir min-h-screen">
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Notfound />} />
          <Route path="/animes/:page" element={<Animes />} />
          <Route path="/anime/:id" element={<SoloAnime />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<User />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/user/*" element={<Notfound />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default App;
