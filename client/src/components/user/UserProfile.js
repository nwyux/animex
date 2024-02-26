import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PageTemplate from "../PageTemplate";
import { NavLink } from "react-router-dom";
import Favorite from "./Favorite";

export default function UserProfile() {
  const [userData, setUserData] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [animeDataArray, setAnimeDataArray] = useState([]);
  const apiURL = process.env.REACT_APP_API_URL;
  const { username } = useParams();

  async function displayFavorites() {
    try {
        const animeIds = userFavorites.map((favorite) => favorite.animeId).join(',');
        const response = await axios.get(
            `https://kitsu.io/api/edge/anime?filter[id]=${animeIds}`
        );

        const animeDataArray = response.data.data;
        setAnimeDataArray(animeDataArray);
    } catch (error) {
        console.error(error);
    }
}


useEffect(() => {
    async function fetchData() {
        try {
            const response = await axios.get(`${apiURL}/api/auth/profile/${username}`);
            setUserData(response.data);
            setUserComments(response.data.comments);
            setUserFavorites(response.data.favorites);
        } catch (error) {
            console.error(error);
        }
    }

    fetchData();

    if (userFavorites.length > 0) {
        displayFavorites();
    }
}, [username, apiURL, userFavorites.length]);




  function formatDate(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  }

  return (
    <div className="min-h-screen mt-28 ">
      <PageTemplate>
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="bg-blanc bg-opacity-90 shadow-lg backdrop-blur-lg p-4 rounded-lg">
                <h1 className="text-3xl font-bold text-center mb-4">
                  {userData.username}
                  <p className="text-center text-sm text-gray-500">
                    {userData.email}
                  </p>
                </h1>
                <p className="text-center text-sm text-gray-700">
                  Membre depuis le : {formatDate(userData.createdAt)}
                </p>
              </div>
              <div className="bg-blanc bg-opacity-90 shadow-lg backdrop-blur-lg p-4 rounded-lg mt-4">
                <h2 className="text-2xl font-bold text-center mb-4">
                  Comments
                </h2>
                <ul>
                  {userComments.map((comment) => (
                    <li key={comment.id} className="mb-4">
                      <p className="text-sm text-gray-700">
                        {formatDate(comment.createdAt)}
                      </p>
                      <NavLink
                        className={"hover:underline"}
                        to={`/anime/${comment.animeId}`}
                      >
                        <p className="text-sm text-gray-700">
                          {comment.content}
                        </p>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blanc bg-opacity-90 shadow-lg backdrop-blur-lg p-4 rounded-lg mt-4">
                <h2 className="text-2xl font-bold text-center mb-4">
                  Favorites
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {animeDataArray.length > 0 ? (
                    animeDataArray.map((animeData) => {
                      return (
                        <Favorite
                          key={animeData.id}
                          id={animeData.id}
                          attributes={animeData.attributes}
                        />
                      );
                    })
                  ) : (
                    <h1 className="text-4xl font-semibold text-blanc">
                      No favorites found
                    </h1>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTemplate>
    </div>
  );
}
