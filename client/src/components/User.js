import { useState, useEffect } from "react";
import useCookie from "react-use-cookie";
import axios from "axios";
import { X } from "lucide-react";

export default function User() {
  const [token] = useCookie("token", "0");
  const [userData, setUserData] = useState(null);
  const [modalFormUpdateUser, setModalFormUpdateUser] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function updateUser() {
    try {
      await axios.put(
        `http://localhost:3001/api/auth/user/${window.localStorage.getItem("userID")}`,
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
      setModalFormUpdateUser(false);
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error as needed
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3001/api/auth/user/${window.localStorage.getItem("userID")}`,
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

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="text-noir sm:text-blanc overflow-hidden flex h-screen relative justify-center items-center">
      {modalFormUpdateUser && (
        <div className="absolute z-20 bg-transparent backdrop-blur-lg bg-opacity-50 top-0 left-0 w-screen h-screen flex justify-center items-center">
          <X onClick={() => setModalFormUpdateUser(false)} className="absolute mx-12 right-2 sm:right-24 top-24 cursor-pointer text-blanc" />
          <form onSubmit={updateUser} className="flex flex-col max-w-xs">
            <label htmlFor="newUsername" className="text-blanc text-xl font-bold text-center">
              Update Username
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="mb-4 mt-4 p-2 rounded-xl bg-vertfonce text-blanc"
              />
            </label>

            <label htmlFor="newFirstName" className="text-xl font-bold text-center">
              Update First Name
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                className="mb-4 mt-4 p-2 rounded-xl bg-vertfonce text-blanc"
              />
            </label>
            
            <label htmlFor="newLastName" className="text-xl font-bold text-center">
              Update Last Name
              <input
                type="text"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                className="mb-4 mt-4 p-2 rounded-xl bg-vertfonce text-blanc"
              />
            </label>

            <label htmlFor="newEmail" className="text-xl font-bold text-center">
              Update Email
              <input
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mb-4 mt-4 p-2 rounded-xl bg-vertfonce text-blanc"
              />
            </label>

            <label htmlFor="newPassword" className="text-xl font-bold text-center">
              Update Password
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-4 mt-4 p-2 rounded-xl bg-vertfonce text-blanc"
              />
            </label>

            <button
              type="submit"
              className="bg-vertfonce text-blanc p-2 rounded-xl"
            >
              Update
            </button>
          </form>
        </div>
      )}
      <div className="w-full sm:max-w-2xl p-4 bg-blanc sm:backdrop-blur-sm sm:border-2 sm:border-blanc sm:top-48 sm:bg-transparent absolute top-64 h-screen rounded-[45px]">
         <h1 className="text-2xl font-bold text-center">Welcome {userData.username}</h1>
         <div className="flex flex-col items-center relative">
           <p>First Name: {userData.firstName}</p>
           <p>Last Name: {userData.lastName}</p>
           <p>Email: {userData.email}</p>
           <button
             onClick={() => setModalFormUpdateUser(true)}
             className="bg-vertfonce text-blanc p-2 rounded-xl"
           >
             Update
           </button>

         </div>
       </div>
     </div>
   );
 }