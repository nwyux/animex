import { useState, useEffect } from "react";
import useCookie from "react-use-cookie";
import axios from "axios";
import Favorite from "./Favorite";

export default function Favorites() {
  const [token] = useCookie("token", "0");
  const [userData, setUserData] = useState(null);
  const [animeDataArray, setAnimeDataArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiURL = process.env.REACT_APP_API_URL;

  async function displayFavorites() {
    if (userData && userData.favorites !== ([])) {
        setLoading(false);
      try {
        const animeDataArray = await Promise.all(
          userData.favorites.map(async (favorite) => {
            const response = await axios.get(
              `https://kitsu.io/api/edge/anime/${favorite.animeId}`
            );
            return response.data.data;
          })
        );

        setTimeout(() => {
            setAnimeDataArray(animeDataArray);
            }, 500);
      } catch (error) {
        console.error(error);
      }
    }
  }

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

        window.location.reload();
      } catch (error) {
        console.error("Error removing favorite:", error);
        // Handle error as needed
      }
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
        // Handle error as needed
      }
    };
    fetchData();

    // Call displayFavorites after userData is set
    if (userData) {
      displayFavorites();
    }

    // Simulate a 2-second delay
    const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 1000);
  
      // Clear the timeout when the component unmounts or when data is loaded
      return () => clearTimeout(timeoutId);
}, [token, userData]);


  return (
    <div className="bg-noir min-h-screen flex flex-col items-center mt-28">
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
    </div>
  );
}
