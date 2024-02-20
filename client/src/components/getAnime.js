import axios from 'axios';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AnimesCard from './AnimesCard';

export default function Animes() {
    const [anime, setAnime] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    async function fetchAnimeData(page) {
        try {
            const response = await axios.get(`https://kitsu.io/api/edge/anime?page%5Bnumber%5D=${page}&page%5Bsize%5D=20`);
            const animeData = response.data.data;
            setAnime(animeData);
            setTotalPages(Math.floor(response.data.meta.count / 20));
            console.log(animeData);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchAnimeData(currentPage);
    }, [currentPage]);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
    };

    return (
        <div className="bg-noir min-h-screen flex flex-col justify-center items-center">
            <h1 className="text-5xl text-center text-blanc mb-4">AnimeX list of animes</h1>
            <div className="grid grid-cols-1 p-2 my-4 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {anime.map((anime) => (
                    <AnimesCard key={anime.id} {...anime} />
                ))}
            </div>
            <div className="flex justify-center mt-4 bg-blanc p-2 my-4">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous Page
                </button>
                <span className="mx-2">{`Page ${currentPage} of ${totalPages}`}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next Page
                </button>
            </div>
        </div>
    );
}
