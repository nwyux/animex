import { useState, useEffect } from "react";
import useCookie from "react-use-cookie";
import axios from "axios";
import Favorite from "./Favorite";
import PageTemplate from "../PageTemplate";

export default function Favorites() {
  const [token] = useCookie("token", "0");
  const [userData, setUserData] = useState(null);
  const [animeDataArray, setAnimeDataArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiURL = process.env.REACT_APP_API_URL;

  async function removeFavorite(favoriteId) {
    if (userData && userData.favorites) {
      try {
        await axios.delete(
          `${apiURL}/api/favorites/${favoriteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(prevUserData => ({
          ...prevUserData,
          favorites: prevUserData.favorites.filter(fav => fav.id !== favoriteId)
        }));
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    }
  }

  async function displayFavorites() {
    try {
      const animeIds = userData.favorites.map((favorite) => favorite.animeId).join(',');
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
    const fetchData = async () => {
      try {
        const result = await axios.get(
          `${apiURL}/api/auth/user/${window.localStorage.getItem(
            "userID"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(result.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [apiURL, token]);

  useEffect(() => {
    if (userData && userData.favorites) {
      displayFavorites();
    }

    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [userData]);

  return (
    <div className="bg-noir min-h-screen flex flex-col items-center mt-28">
      <PageTemplate>
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-semibold text-blanc">Favorites</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {loading ? (
              <h1 className="text-4xl font-semibold text-blanc">Loading...</h1>
            ) : animeDataArray.length > 0 ? (
              animeDataArray.map((animeData) => {
                const favorite = userData.favorites.find(fav => fav.animeId === animeData.id);
                return (
                  <Favorite
                    key={animeData.id}
                    id={animeData.id}
                    attributes={animeData.attributes}
                    removeFavorite={() => removeFavorite(favorite.id)}
                  />
                );
              })
            ) : (
              <h1 className="text-4xl font-semibold text-blanc">No favorites found</h1>
            )}
          </div>
        </div>
      </PageTemplate>
    </div>
  );
}
