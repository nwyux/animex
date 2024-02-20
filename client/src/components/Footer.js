import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 p-4">
      <div className="container mx-auto text-center font-bold text-white">
        Project by{" "}
        <a className="hover:underline" href="" target="_blank" rel="noreferrer">
          Jhonatan
        </a>
        .{" "}
        <a className="hover:underline" href="" target="_blank" rel="noreferrer">
          GitHub
        </a>
        .
      </div>
    </footer>
  );
}
