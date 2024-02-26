import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimesCard from "./AnimesCard";
import useCookie from "react-use-cookie";
import PageTemplate from "./PageTemplate";
import axios from "axios";
import Pagination from "./Pagination";
import { useParams } from "react-router-dom";
import Notification from "./Notification";

export default function Animes() {
  const { page } = useParams();
  const [token, setToken] = useCookie("token", "0");
  const apiURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [anime, setAnime] = useState([]);
  const [currentPage, setCurrentPage] = useState(page ? Number(page) : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState(false);

  const notify = (color, message) => {
    setNotification({ color, message });
    setTimeout(() => {
      setNotification(false);
    }, 3000);
  };

  async function fetchAnimeData(page) {
    try {
      const response = await axios.get(
        `https://kitsu.io/api/edge/anime?page%5Bnumber%5D=${page}&page%5Bsize%5D=20`
      );
      const animeData = response.data.data;
      setAnime(animeData);
      setTotalPages(Math.floor(response.data.meta.count / 20));
    } catch (error) {
      console.error(error);
    }
  }

  async function addFavorite(animeId) {
    try {
      const response = await axios.post(
        `${apiURL}/api/favorites`,
        {
          userId: window.localStorage.getItem("userID"),
          animeId: animeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const { message } = response.data;
  
      if (message) {
        notify("bg-yellow-500", message);
      } else {
        notify("bg-emerald-500", "Anime added to Favorites");
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  useEffect(() => {
    const fetchData = async () => {
      await fetchAnimeData(currentPage);
      navigate(`/animes/${currentPage}`);
    };

    fetchData();
  }, [currentPage, navigate]);

  return (
    <div className="bg-noir min-h-screen flex flex-col justify-center items-center mt-28">
      <PageTemplate>
        {notification && (
          <Notification color={notification.color} message={notification.message} />
        )}
        <h1 className="text-5xl text-center text-blanc mb-4">
          AnimeX list of animes
        </h1>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
        <div className="grid grid-cols-1 p-2 my-4 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {anime.map((anime) => (
            <AnimesCard
              key={anime.id}
              id={anime.id}
              animeId={anime.id}
              attributes={anime.attributes}
              addFavorite={addFavorite}
            />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </PageTemplate>
    </div>
  );
}
