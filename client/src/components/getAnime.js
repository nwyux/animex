import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import AnimesCard from './AnimesCard';
import useCookie from 'react-use-cookie';
import PageTemplate from './PageTemplate';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function Animes() {
  const [anime, setAnime] = useState([]);
  const { page } = useParams();
  const [currentPage, setCurrentPage] = useState(page ? Number(page) : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useCookie('token', '0');
  const navigate = useNavigate();
  const apiURL = process.env.REACT_APP_API_URL;


  async function fetchAnimeData(page) {
    try {
      const response = await axios.get(
        `https://kitsu.io/api/edge/anime?page%5Bnumber%5D=${page}&page%5Bsize%5D=20`
      );
      const animeData = response.data.data;
      setAnime(animeData);
      setTotalPages(Math.floor(response.data.meta.count / 20));
      console.log(animeData);
    } catch (error) {
      console.error(error);
    }
  }

  async function addFavorite(animeId) {
    try {
      await axios.post(
        `${apiURL}/api/favorites`,
        {
          userId: window.localStorage.getItem('userID'),
          animeId: animeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchAnimeData(currentPage);
      // Update the URL with the current page number
      navigate(`/animes/${currentPage}`);
    };

    fetchData();
  }, [currentPage, navigate]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return (
    <div className="bg-noir min-h-screen flex flex-col justify-center items-center mt-28">
      <PageTemplate>
        <h1 className="text-5xl text-center text-blanc mb-4">AnimeX list of animes</h1>
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
        <div className="flex justify-center items-center mt-4 p-2 my-4 text-xl">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className={`bg-gray-300 bg-opacity-50 backdrop-blur-lg rounded-full p-1 hover:bg-opacity-25`}>
          <ChevronLeft />
          </button>
          <label className="text-blanc mx-4">Page</label>
            <select className="bg-gray-300 bg-opacity-50 backdrop-blur-lg rounded-full p-1 hover:bg-opacity-25 mx-4 flex items-center justify-center" value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))}>
                {[...Array(totalPages).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                        {x + 1}
                    </option>
                ))}
            </select>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className='bg-gray-300 bg-opacity-50 backdrop-blur-lg rounded-full p-1 hover:bg-opacity-25'>
            <ChevronRight />
          </button>
        </div>
      </PageTemplate>
    </div>
  );
}
