import { NavLink } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="bg-noir p-4 flex justify-between items-center">
      <h1 className="text-2xl text-blanc">AnimeX</h1>
      <div>
        <NavLink to="/" className="text-blanc mr-4">
          Home
        </NavLink>
        <NavLink to="/animes" className="text-blanc">
          Animes
        </NavLink>
      </div>
    </nav>
  )
}
