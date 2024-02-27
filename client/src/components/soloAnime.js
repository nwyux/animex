import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import PageTemplate from "./PageTemplate";
import useCookie from "react-use-cookie";
import Notification from "./Notification";

export default function SoloAnime() {
  const [anime, setAnime] = useState([]);
  const { id } = useParams();
  const { username } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [token, setToken] = useCookie("token", "0");
  const apiURL = process.env.REACT_APP_API_URL;
  const [notification, setNotification] = useState(false);

  const notify = (color, message) => {
    setNotification({ color, message });
    setTimeout(() => {
      setNotification(false);
    }, 5000);
  };

  async function getAnime() {
    try {
      const res = await axios.get(`https://kitsu.io/api/edge/anime/${id}`);
      setAnime(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getComments() {
    try {
      const res = await axios.get(`${apiURL}/api/comments/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredComments = res.data.filter((comment) => comment.animeId === id);
  
      setComments(filteredComments);
  
    } catch (error) {
      console.error(error);
    }
  }
  
  async function addComment() {
    try {
      const response = await axios.post(
        `${apiURL}/api/comments`,
        {
          userId: window.localStorage.getItem("userID"),
          username: window.localStorage.getItem("username"),
          animeId: id,
          animeName: anime.attributes.titles.en_jp,
          title : title,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message } = response.data;


      setTitle("");
      setContent("");
      getComments();
      
      if (message) {
        notify("bg-red-500", message);
      } else {
        notify("bg-emerald-500", "Comment added");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function displayAnime() {
    if (anime.attributes) {
      return (
        <div
          key={anime.id}
          className="bg-blanc p-4 rounded-lg mx-8 sm:max-w-4xl gap-4 flex flex-col  justify-center items-center"
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <img
              src={anime.attributes.posterImage.medium}
              alt={anime.attributes.titles.en_jp}
            />
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="text-noir text-xl">
                {anime.attributes.titles.en_jp}
              </h2>
              <p className="text-noir text-sm text-justify max-w-sm">
                {anime.attributes.synopsis}
              </p>
              <div className="flex justify-center items-center gap-4">
              <p className="text-noir text-sm">
                Episodes: {anime.attributes.episodeCount}
              </p>
                <p className="text-noir text-sm">
                    Average Rating: {anime.attributes.averageRating}/100
                </p>
                </div>
            </div>
          </div>
        </div>
      );
    }
  }

  useEffect(() => {
    getAnime();
    getComments();
  }, []);

  function commentDate(createdAt) {
    const newDate = new Date(createdAt);
    return newDate.toDateString();
  }

  return (
    <div className="bg-noir min-h-screen flex flex-col mt-28 items-center gap-4">
      <PageTemplate>
      {notification && (
        <Notification color={notification.color} message={notification.message} />
      )}
      <h1 className="text-5xl text-center text-blanc mb-4">AnimeX</h1>
      <div className="flex flex-col justify-center items-center py-4">
        {displayAnime()}
      </div>

      <div className="flex flex-col justify-center items-center gap-4">
        <h2 className="text-3xl text-blanc">Comments</h2>
        <div className="flex flex-col justify-center items-center gap-4">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-blanc p-4 rounded-lg mx-8 sm:max-w-4xl gap-4 flex flex-col  justify-center items-center"
              >
                <h3 className="text-noir text-xl">{comment.title}</h3>
                <p className="text-noir text-sm text-justify max-w-sm">
                  {comment.content}
                </p>
                <div className="flex justify-center items-center gap-4">
                  <p className="text-noir text-sm">
                    <NavLink to={`/user/${comment.username}`}>
                      {comment.username}
                    </NavLink>
                  </p>
                  <p className="text-noir text-sm">
                    {commentDate(comment.createdAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-blanc">No comments yet</p>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-4">
        {window.localStorage.getItem("userID") ? (
          <div className="bg-blanc p-4 rounded-lg mx-8 sm:max-w-4xl gap-4 flex flex-col  justify-center items-center">
            <h2 className="text-noir text-xl">Add a comment</h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-3 mb-6 bg-vert text-vertfonce rounded-xl placeholder:text-vertfonce placeholder:text-xl placeholder:font-bold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Content"
              className="w-full p-3 mb-6 bg-vert text-vertfonce rounded-xl placeholder:text-vertfonce placeholder:text-xl placeholder:font-bold"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              maxLength="500"
            />
            <button
              className={"bg-vertfonce text-blanc p-2 rounded-xl " + (title === "" || content === "" ? "opacity-50 cursor-not-allowed" : "")}
              onClick={addComment}
              disabled={title === "" || content === ""}
            >
              Add Comment
            </button>
          </div>
        ) : (
          <p className="text-blanc">You must be logged in to add a comment</p>
        )}
      </div>
      </PageTemplate>
    </div>
  );
}
