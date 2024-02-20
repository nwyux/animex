import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Animes() {
    const [anime, setAnime] = useState([]);

    async function fetchAnimeData() {
        try {
            const response = await axios.get('https://kitsu.io/api/edge/anime?page%5Bnumber%5D=1&page%5Bsize%5D=20');
            const animeData = response.data.data;
            setAnime(animeData);
            console.log(animeData);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchAnimeData();
    } , []);

    // async function fetchAnimeData() {
    //     try {
    //         const response = await axios.get('http://localhost:3001/api/anime');
    //         const animeData = response.data.data;
    //         setAnime(animeData);
    //         console.log(animeData);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    // console.log(anime)

    // function animeImage() {
    //     if (anime.images) {
    //         return anime.images.webp ? anime.images.webp.image_url : anime.images.jpg.image_url;
    //     }
    // }

    // async function delayedFetchAnimeData() {
    //     const itemsPerPage = 25;
    //     const requestsPerSecond = 2;
    //     const delayBetweenRequests = 1100 / requestsPerSecond; // milliseconds

    //     for (let page = 1; page <= itemsPerPage; page++) {
    //         await fetchAnimeData(); // Make the API request

    //         // Delay before making the next API request
    //         if (page < itemsPerPage) {
    //             await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
    //         }
    //     }
    // }

    // useEffect(() => {
    //     delayedFetchAnimeData();
    // }, []);

    return (
        <div className="bg-noir min-h-screen flex flex-col justify-center items-center">
            <h1 className="text-5xl text-center text-blanc mb-4">AnimeX list of animes</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {anime.map(anime => (
                    <div key={anime.id} className="relative rounded-lg max-w-sm flex flex-col justify-center items-center">
                        <NavLink to={`/anime/${anime.id}`}>
                        <h2 className="text-blanc text-md font-bold absolute bottom-0 backdrop-blur-xl w-full p-2">{anime.attributes.titles.en_jp}</h2>
                        <img src={anime.attributes.posterImage.small} alt={anime.title} />
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    );
}
