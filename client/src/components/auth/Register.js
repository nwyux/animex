import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useCookie from "react-use-cookie";
import { NavLink } from "react-router-dom";
import PageTemplate from "../PageTemplate";
import Notification from "../Notification";

export default function Register() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userToken, setUserToken] = useCookie("token", "0");
  const [registered, setRegistered] = useState(false);
  const [userID, setUserID] = useState("");
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API_URL;
  const [notification, setNotification] = useState(false);

  const notify = (color, message) => {
    setNotification({ color, message });
    setTimeout(() => {
      setNotification(false);
    }, 6500);
  };

  async function register(e) {
    e.preventDefault();
    setLoading(true);
    const response = (
        await axios.post(`${apiURL}/api/auth/register`, {
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            })
    ).data;

    console.log(response);

    if (response.error) {
      setError(response.error);
    } else {
      setUserToken(response["access_token"], {
        days: 365,
        SameSite: "Strict",
        Secure: true,
      });
      setRegistered(true);
      setUserID(response.userID);

      if (response.message) {
        notify("bg-red-500", response.message);
      }

      if (response.admin) {
        window.localStorage.setItem("admin", response.admin);
      }

      if (response.userID) {
        window.localStorage.setItem("userID", response.userID);
      }

      if (response.username) {
        window.localStorage.setItem("username", response.username);
        window.location.href = "/user/" + response.username;
      }
    }
    setLoading(false);
}

  return (
    <div className="loginBg overflow-hidden flex h-screen relative justify-center items-center">
      <PageTemplate>
        {notification && ( <Notification color={notification.color} message={notification.message} /> )}
      <div className="flex absolute top-64 z-20 justify-center bg-vert sm:bg-transparent rounded-full items-center mb-4">
        <NavLink
          to="/login"
          className="text-2xl sm:hidden font-semibold py-4 px-6 text-vertfonce"
        >
          Login
        </NavLink>
        <NavLink
          to="/register"
          className="text-2xl sm:-mt-14 sm:text-4xl sm:bg-transparent font-semibold bg-vertfonce rounded-full py-4 px-11 text-blanc"
        >
          Register
        </NavLink>
      </div>
      <div className="w-full sm:max-w-2xl p-4 bg-blanc sm:backdrop-blur-sm sm:border-2 sm:border-blanc sm:top-48 sm:bg-transparent absolute top-64 h-screen rounded-[45px]">
        <form onSubmit={register} className="mt-24">
          <input
            type="text"
            placeholder="Username"
            className="w-full sm:bakcdrop-blur-sm sm:bg-[rgb(172,185,146)] sm:bg-opacity-70 shadow-xl p-3 mb-6 bg-vert text-vertfonce rounded-xl placeholder:text-vertfonce placeholder:text-xl placeholder:font-bold"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="text"
            placeholder="First Name"
            className="w-full sm:bakcdrop-blur-sm sm:bg-[rgb(172,185,146)] sm:bg-opacity-70 shadow-xl p-3 mb-6 bg-vert text-vertfonce rounded-xl placeholder:text-vertfonce placeholder:text-xl placeholder:font-bold"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

        <input
            type="text"
            placeholder="Last Name"
            className="w-full sm:bakcdrop-blur-sm sm:bg-[rgb(172,185,146)] sm:bg-opacity-70 shadow-xl p-3 mb-6 bg-vert text-vertfonce rounded-xl placeholder:text-vertfonce placeholder:text-xl placeholder:font-bold"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full sm:bakcdrop-blur-sm sm:bg-[rgb(172,185,146)] sm:bg-opacity-70 shadow-xl p-3 mb-6 bg-vert text-vertfonce rounded-xl placeholder:text-vertfonce placeholder:text-xl placeholder:font-bold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full sm:bakcdrop-blur-sm sm:bg-[rgb(172,185,146)] sm:bg-opacity-70 shadow-xl p-3 mb-6 bg-vert text-vertfonce rounded-xl placeholder:text-vertfonce placeholder:text-xl placeholder:font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full p-3 mt-6 bg-vertfonce sm:bg-marron shadow-2xl text-blanc rounded-xl font-bold"
            onClick={register}
            disabled={loading}
          >
            Register
          </button>
        </form>
        <div className="text-vertfonce flex gap-1 font-bold mt-4">
          <p>You already have an account?</p>
          <NavLink to="/login" className="text-vert hover:underline">
            Login here
          </NavLink>
        </div>
      </div>
      </PageTemplate>
    </div>
  );
}
