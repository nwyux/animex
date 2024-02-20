import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SoloAnime() {
  const [anime, setAnime] = useState([]);
  const { id } = useParams();

  async function getAnime() {
    try {
      const res = await axios.get(`https://kitsu.io/api/edge/anime/${id}`);
      setAnime(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  function displayAnime() {
    if (anime.attributes) {
      return (
        <div
          key={anime.id}
          className="bg-blanc p-4 rounded-lg max-w-4xl gap-4 flex flex-col  justify-center items-center"
        >
          <div className="flex justify-center items-center gap-4">
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
  }, []);

  return (
    <div className="bg-noir min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl text-center text-blanc mb-4">AnimeX</h1>
      <div className="flex flex-col justify-center items-center py-4">
        {displayAnime()}
      </div>
    </div>
  );
}
