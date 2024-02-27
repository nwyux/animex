import { useState, useEffect } from "react";
import axios from "axios";
import useCookie from "react-use-cookie";
import { X } from "lucide-react";

export default function AdminPanel(props) {
  const [user, setUser] = useState([]);
  const [comments, setComments] = useState([]);
  const [token, setToken] = useCookie("token", "0");
  const apiURL = process.env.REACT_APP_API_URL;
  const [newUsername, setNewUsername] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState("");

  async function getUserInfo() {
    try {
      const res = await axios.get(`${apiURL}/api/auth/user/${props.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      setComments(res.data.comments);

      setNewUsername(res.data.username || "");
      setNewFirstName(res.data.firstName || "");
      setNewLastName(res.data.lastName || "");
      setNewEmail(res.data.email || "");
    } catch (error) {
      console.error(error);
    }
  }

  async function updateUser(e) {
    e.preventDefault();
    try {
      await axios.put(
        `${apiURL}/api/auth/user/${props.id}`,
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
      props.setModalAdminPanel(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  async function deleteComment() {
    try {
      if (!selectedCommentId) {
        console.error("No comment selected");
        return;
      }

      console.log("Deleting comment:", selectedCommentId);
      await axios.delete(`${apiURL}/api/comments/${selectedCommentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the parent component's state by calling the function from props
      setComments(
        comments.filter((comment) => comment._id !== selectedCommentId)
      );
      setSelectedCommentId("");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  }

  async function deleteUser() {
    try {
      await axios.delete(`${apiURL}/api/auth/user/${props.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      props.setModalAdminPanel(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
      <div className="fixed z-20 rounded-xl bg-blanc text-noir bg-opacity-50 backdrop-blur-lg max-w-lg h-full flex justify-center items-center">
        <X
          onClick={() => props.setModalAdminPanel(false)}
          className="absolute top-4 right-4 text-3xl  cursor-pointer"
        />

        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-center mb-2">Admin Panel</h1>

          <button
            onClick={deleteUser}
            className="text-blanc hover:bg-red-500 text-xl bg-red-400 p-2 rounded-lg mt-4 block w-1/2 mx-auto text-center"            >
            Ban User Permanently
          </button>

          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center">
              User Comments
            </h2>
            <div className="flex flex-col max-w-xs">
              <select
                className="mb-4 mt-4 p-2 rounded-xl bg-stone-600 "
                value={selectedCommentId}
                onChange={(e) => setSelectedCommentId(e.target.value)}
              >
                <option value="">Select a comment to delete</option>
                {comments.map((comment) => (
                  <option key={comment.id} value={comment.id}>
                    {comment.title}
                  </option>
                ))}
              </select>
              <button
                onClick={deleteComment}
                className="text-blanc hover:bg-red-500 bg-red-400 p-2 rounded-lg block mx-auto text-center">
                Delete Comment
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center">
              Update User Info
            </h2>
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
