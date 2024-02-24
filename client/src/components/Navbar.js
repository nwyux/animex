import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import useCookie from "react-use-cookie";
import axios from "axios";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [token, setUserToken] = useCookie("token", "0");
  const [data, setData] = useState(null);
  const apiURL = process.env.REACT_APP_API_URL;

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  function logout() {
    setUserToken('0');
  }

  function mobileLogout() {
    closeMenuOnClick();
    logout();
  }


  useEffect(() => {

    const fetchData = async () => {
      const result = await axios.get(
         `${apiURL}/api/auth/user/${window.localStorage.getItem("userID")}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      setData(result.data);
      // console.log(result.data);
  };

  fetchData();

    const closeMenu = (event) => {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    const handleMouseDown = (event) => {
      closeMenu(event);
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [showMenu, token]);

  const closeMenuOnClick = () => {
    setShowMenu(false);
  };

  function isLogged() {
    if (token === "0") {
      return (
        <ul className="flex text-noir lg:gap-12 font-alata items-center">
          <li className="mr-6">
            <NavLink to="/login" className="text-blanc hover:underline">
              Login
            </NavLink>
          </li>
          <li className="mr-6">
            <NavLink to="/register" className="text-blanc hover:underline">
              Register
            </NavLink>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="flex text-noir lg:gap-12 font-alata items-center">
          {data && data.admin === true && (
            <li className="mr-6">
            <NavLink to="/dashboard" className="text-blanc hover:underline">
              Dashboard
            </NavLink>
          </li>
          )}
          <li className="mr-6">
            <NavLink to="/user" className="text-blanc hover:underline">
              Userpage
            </NavLink>
          </li>
          <li className="mr-6">
            <NavLink to="/" onClick={logout} className="text-blanc hover:underline">
              Logout
            </NavLink>
          </li>
        </ul>
      );
    }
  }

  function isLoggedMobile() {
    if (token === "0") {
      return (
        <>
          <NavLink
            to="/login"
            className="text-noir hover:underline text-xl"
            onClick={closeMenuOnClick}
          >
            Login
          </NavLink>
          <hr className="w-1/5 bg-noir block h-0.5 opacity-40" />
          <NavLink
            to="/register"
            className="text-noir hover:underline text-xl"
            onClick={closeMenuOnClick}
          >
            Register
          </NavLink>
        </>
      );
    } else {
      return (
        <>
          {data && data.admin === true && (
            <>
            <NavLink
            to="/dashboard"
            className="text-noir hover:underline text-xl"
            onClick={closeMenuOnClick}
          >
            Dashboard
          </NavLink>
          <hr className="w-1/5 bg-noir block h-0.5 opacity-40" />
          </>
          )}
          <NavLink
            to="/user"
            className="text-noir hover:underline text-xl"
            onClick={closeMenuOnClick}
          >
            Userpage
          </NavLink>
          <hr className="w-1/5 bg-noir block h-0.5 opacity-40" />
          <NavLink
            to="/"
            className="text-noir hover:underline text-xl"
            onClick={mobileLogout}
          >
            Logout
          </NavLink>
        </>
      );
    }
  }

  return (
    <>
      <div className="z-50 text-blanc py-4 px-4 sm:px-0 items-center absolute top-0 left-0 right-0">
        <div className="hidden md:border-b-[.5px] py-3 md:border-blanc container b mx-auto md:flex justify-around align-middle items-center">
          <Link to="/" className="text-3xl font-archivo">
            {/* <img src={logo} alt="ECONIMAL" className="w-40" /> */}
            AnimeX
          </Link>
          <ul className="flex text-blanc lg:gap-12 font-alata items-center">
            <li className="mr-6">
              <NavLink to="/animes" className="text-blanc hover:underline">
                Anime List
              </NavLink>
            </li>
            <li className="mr-6">
              <NavLink to="/trending" className="text-blanc hover:underline">
                Trending
              </NavLink>
            </li>
            <li className="mr-6">
              <NavLink to="/discover" className="text-blanc hover:underline">
                Discover
              </NavLink>
            </li>
            <li className="mr-6">
              <NavLink to="/browse" className="text-blanc hover:underline">
                Browse
              </NavLink>
            </li>
          </ul>
          {isLogged()}
        </div>

        <div className="container mx-auto md:hidden flex justify-between items-center relative">
          <div className="text-blanc">
            <Link to="/" className="text-3xl font-archivo">
              {/* <img src={tortoise} alt="ECONIMAL" className="w-20" /> */}
              AnimeX
            </Link>
          </div>
          <button className="text-3xl font-bold" onClick={toggleMenu}>
            {showMenu ? <X /> : <Menu />}
          </button>

          <div
            ref={menuRef}
            className={`${
              showMenu ? "translate-x-0" : "translate-x-full"
            } fixed -top-0 right-0 min-h-screen font-alata bg-blanc opacity-95 text-noir w-full max-w-lg flex flex-col justify-center items-center p-6 gap-4 transition-transform duration-200 border-l-2 border-blanc`}
          >
            <button
              className="absolute top-10 right-5 text-3xl font-bold"
              onClick={toggleMenu}
            >
              <X />
            </button>

            <NavLink
              to="/animes"
              className="text-noir hover:underline text-xl"
              onClick={closeMenuOnClick}
            >
              Anime List
            </NavLink>
            <hr className="w-1/5 bg-noir block h-0.5 opacity-40" />
            <NavLink
              to="/trending"
              className="text-noir hover:underline text-xl"
              onClick={closeMenuOnClick}
            >
              Trending
            </NavLink>
            <hr className="w-1/5 bg-noir block h-0.5 opacity-40" />
            <NavLink
              to="/discover"
              className="text-noir hover:underline text-xl"
              onClick={closeMenuOnClick}
            >
              Discover
            </NavLink>
            <hr className="w-1/5 bg-noir block h-0.5 opacity-40" />
            <NavLink
              to="/browse"
              className="text-noir hover:underline text-xl"
              onClick={closeMenuOnClick}
            >
              Browse
            </NavLink>
            <hr className="w-1/5 bg-noir block h-0.5 opacity-40" />
            {isLoggedMobile()}
          </div>
        </div>
      </div>
    </>
  );
}