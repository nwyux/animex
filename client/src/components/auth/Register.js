import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useCookie from "react-use-cookie";
import { NavLink } from "react-router-dom";
import PageTemplate from "../PageTemplate";
import Notification from "../Notification";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
      <div className="flex absolute top-64 z-20 justify-center bg-blanc sm:bg-transparent rounded-full items-center mb-4">
        <NavLink
          to="/register"
          className="text-2xl sm:-mt-14 sm:text-4xl sm:bg-transparent font-semibold  rounded-full py-4 px-11 text-noir"
        >
          Register
        </NavLink>
      </div>
      <div className="w-full sm:max-w-2xl p-4 bg-blanc sm:backdrop-blur-sm sm:border-2 sm:border-blanc sm:top-48 sm:bg-blanc sm:bg-opacity-65 absolute top-64 h-screen rounded-[45px]">
        <Box 
        component="form" noValidate onSubmit={register} 
        className="mt-24 w-full max-w-lg m-auto grid gap-4 text-blanc"
        autoComplete="off">
          <TextField
            id="outlined-controlled"
            label="Username"
            type="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
          />
          <TextField
            id="outlined-controlled"
            label="First Name"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mb-4"
          />
          <TextField
            id="outlined-controlled"
            label="Last Name"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mb-4"
          />
          <TextField
            id="outlined-controlled"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <TextField
            id="outlined-controlled"
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={username === "" || firstName === "" || lastName === "" || email === "" || password === ""}
            className="bg-vertfonce text-blanc py-2 rounded-lg hover:bg-vert"
            color={loading ? "secondary" : "primary"}
          >
            {loading ? "Loading..." : "Register"}
          </Button>
        </Box>
        <div className="text-noir flex justify-center gap-1 font-bold mt-4 text-center">
          <p>You already have an account?</p>
          <NavLink to="/login" className="text-vertfonce hover:underline">
            Login here
          </NavLink>
        </div>
      </div>
      </PageTemplate>
    </div>
  );
}
