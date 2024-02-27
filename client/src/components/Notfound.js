import { NavLink } from "react-router-dom"

export default function Notfound() {
  return (
    <div className="bg-noir min-h-screen mt-28 flex flex-col justify-center items-center">
        <h1 className="text-5xl text-center text-blanc mb-4">AnimeX</h1>
        <div className="flex flex-col justify-center items-center py-4">
            <h2 className="text-3xl text-blanc">404 Not Found</h2>
            <p className="text-blanc">The page you are looking for does not exist</p>
            <div className="flex justify-center items-center gap-4">
              <NavLink to="/" className="text-blanc">Back to Home</NavLink>
            </div>
        </div>
    </div>
  )
}
