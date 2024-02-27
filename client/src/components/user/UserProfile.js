import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PageTemplate from "../PageTemplate";
import { NavLink } from "react-router-dom";
import Favorite from "./Favorite";
import ProfileFavorite from "./ProfileFavorite";
import AdminPanel from "./AdminPanel";
import EditProfile from "./EditProfile";
import { Settings, UserRoundCog } from "lucide-react";


export default function UserProfile() {
  const [userData, setUserData] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [animeDataArray, setAnimeDataArray] = useState([]);
  const [modalAdminPanel, setModalAdminPanel] = useState(false);
  const [modalEditProfile, setModalEditProfile] = useState(false);
  const apiURL = process.env.REACT_APP_API_URL;
  const { username } = useParams();

  async function displayFavorites() {
    try {
        const animeIds = userFavorites.map((favorite) => favorite.animeId).join(',');
        const response = await axios.get(
            `https://kitsu.io/api/edge/anime?filter[id]=${animeIds}`
        );

        const animeDataArray = response.data.data;

        // filter anime to get only the 4 first ones
        animeDataArray.splice(4);
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
    <div className="min-h-screen mt-28 flex flex-col items-center mb-4">
      <PageTemplate>
        {modalAdminPanel ? (
            <AdminPanel
                id={userData.id}
                setModalAdminPanel={setModalAdminPanel}
            />
        ) : null}

        {modalEditProfile ? (
            <EditProfile
                userData={userData}
                setModalEditProfile={setModalEditProfile}
            />
        ) : null}

        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="bg-blanc bg-opacity-90 shadow-lg backdrop-blur-lg p-4 rounded-lg">
                <h1 className="text-3xl font-bold text-center mb-4">
                  {userData.username}
                  <p className="text-center text-sm text-gray-500">
                    {userData.email}
                  </p>

                  {userData.username === window.localStorage.getItem("username") ? (
                    <button
                      className="text-blanc flex items-center justify-center gap-1 hover:bg-green-600 text-xl bg-green-500 p-2 rounded-lg mt-4 w-48 mx-auto text-center"
                        onClick={() => setModalEditProfile(true)}
                    > 
                      <Settings /> Edit profile
                    </button>
                  ) : null}

                  {window.localStorage.getItem("admin") === "true" ? (
                    <button 
                    className="text-blanc flex items-center justify-center gap-1 hover:bg-red-500 text-xl bg-red-400 p-2 rounded-lg mt-4 w-48 mx-auto text-center"
                    onClick={() => setModalAdminPanel(true)}
                    >
                      <UserRoundCog /> Admin Options
                    </button>
                  ) : null}
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
                  {userComments.length > 0 ? 
                  userComments.map((comment) => (
                    <li key={comment.id} className="mb-4">
                        <NavLink
                        className={"hover:underline"}
                        to={`/anime/${comment.animeId}`}
                      >
                    <h2 className="font-semibold text-stone-600">
                        On {comment.animeName} :
                    </h2>
                      
                        <p className="text-sm text-gray-700">
                          {comment.content}
                        </p>
                      </NavLink>
                      <p className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </li>
                  ))
                  : <h1 className="text-xl text-center font-semibold text-stone-700">
                    The user has not commented yet
                    </h1>
                    }
                </ul>
              </div>
              <div className="bg-blanc relative bg-opacity-90 shadow-lg backdrop-blur-lg p-4 rounded-lg mt-4">
                <h2 className="text-2xl font-bold text-center mb-4">
                  Favorites
                </h2>
                <div 
                className={animeDataArray.length > 0 ? "grid grid-cols-2 gap-4" : "flex flex-col justify-center items-center gap-4"}
                >
                  {animeDataArray.length > 0 ? (
                    animeDataArray.map((animeData) => {
                      return (
                        <ProfileFavorite
                          key={animeData.id}
                          id={animeData.id}
                          attributes={animeData.attributes}
                        />
                      );
                    })
                  ) : (
                    <h1 className="text-xl text-center font-semibold text-stone-700">
                      No favorites found
                    </h1>
                  )}
                    {animeDataArray.length > 0 ? (
                    <div className="flex rounded-b-xl justify-center absolute bottom-0 left-0 shadow-xl p-6 backdrop-blur-xl w-full bg-gradient-to-t from-blanc to-transparent">
                        <NavLink
                        to={`/favorites/`}
                        className="text-blanc font-bold text-xl transition-all hover:bg-yellow-950 bg-marron p-2 rounded-lg hover:bg-vert-600"
                        >
                        See all favorites
                        </NavLink>
                    </div>
                    ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTemplate>
    </div>
  );
}
