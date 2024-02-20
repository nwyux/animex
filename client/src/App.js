import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";


function App() {
  return (
    <>
      {/* Navbar */}

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      {/* Footer */}
    </>
  );
}

export default App;
