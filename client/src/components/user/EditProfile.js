import React, { useState, useEffect } from "react";
import useCookie from "react-use-cookie";
import axios from "axios";
import { X } from "lucide-react";

export default function EditProfile(props) {
  const [token, setToken] = useCookie("token", "0");
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const apiURL = process.env.REACT_APP_API_URL;

  async function updateUser() {
    try {
      await axios.put(
        `${apiURL}/api/auth/user/${window.localStorage.getItem("userID")}`,
        {
          username: newUsername,
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          ...(newPassword && { password: newPassword }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error as needed
    }
  }

  async function deleteUser() {
    try {
      await axios.delete(
        `${apiURL}/api/auth/user/${window.localStorage.getItem("userID")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setToken("0");
      window.localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${apiURL}/api/auth/user/${window.localStorage.getItem("userID")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(result.data);
        // Initialize state variables with user data
        setNewUsername(result.data.username);
        setNewFirstName(result.data.firstName);
        setNewLastName(result.data.lastName);
        setNewEmail(result.data.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error as needed
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="fixed flex flex-col z-20 rounded-xl bg-blanc text-noir bg-opacity-50 backdrop-blur-lg max-w-lg h-full justify-center items-center">
            
            <X
              onClick={() => props.setModalEditProfile(false)}
              className="absolute top-4 right-4 text-3xl  cursor-pointer"
              />
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-xl font-bold text-center max-w-xs">
                Delete the account of {props.userData.username}?
              </h1>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Retype your username"
                className="mt-4 p-2 rounded-xl bg-stone-600 "
                />
              <button
                onClick={deleteUser}
                className={`text-blanc p-2 rounded-xl mt-4 ${
                    username === props.userData.username ? "bg-red-400" : "bg-red-200 cursor-not-allowed"
                }`}
                disabled={username !== props.userData.username}
              >
                Delete Account
              </button>
            </div>

        <div className="flex flex-col justify-center items-center">


        <div className="flex flex-col items-center">
        <form onSubmit={updateUser} className="grid grid-cols-1 p-2 my-2 gap-6 sm:grid-cols-2">
              <label
                htmlFor="newUsername"
                className="flex flex-col  text-xl font-bold text-center"
              >
                Update Username
                <input
                  type="text"
                  id="newUsername"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="mb-4 mt-4 p-2 rounded-xl bg-stone-600 "
                />
              </label>

              <label
                htmlFor="newFirstName"
                className="flex flex-col  text-xl font-bold text-center"
              >
                Update First Name
                <input
                  type="text"
                  id="newFirstName"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  className="mb-4 mt-4 p-2 rounded-xl bg-stone-600 "
                />
              </label>

              <label
                htmlFor="newLastName"
                className="flex flex-col  text-xl font-bold text-center"
              >
                Update Last Name
                <input
                  type="text"
                  id="newLastName"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  className="mb-4 mt-4 p-2 rounded-xl bg-stone-600 "
                />
              </label>

              <label
                htmlFor="newEmail"
                className="flex flex-col  text-xl font-bold text-center"
              >
                Update Email
                <input
                  type="text"
                  id="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mb-4 mt-4 p-2 rounded-xl bg-stone-600 "
                />
              </label>

              <label
                htmlFor="newPassword"
                className="flex flex-col  text-xl font-bold text-center"
              >
                Update Password
                <input
                  type="password"
                  id="newPassword"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mb-4 mt-4 p-2 rounded-xl bg-stone-600 "
                />
              </label>

              <label className="flex flex-col mt-7 justify-center text-xl font-bold text-center">
                <button
                  type="submit"
                  className="bg-stone-700 p-2 rounded-xl hover:bg-stone-600"
                >
                  Update
                </button>
                </label>
            </form>
          </div>
        </div>
        </div>
  );
}
