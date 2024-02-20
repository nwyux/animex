import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function SoloAnime() {
    const [anime, setAnime] = useState([])
    const { id } = useParams()

    async function getAnime() {
        try {
            const res = await axios.get(`https://kitsu.io/api/edge/anime/${id}`)
            setAnime(res.data.data)
            console.log(res.data.data)
        } catch (error) {
            console.error(error)
        }
    }

    function displayAnime() {
        if (anime.attributes) {
            return (
                <div key={anime.id} className="bg-blanc p-4 rounded-lg max-w-lg flex flex-col justify-center items-center">
                    <h2 className="text-noir text-xl">{anime.attributes.titles.en}</h2>
                    <img src={anime.attributes.posterImage.original} alt={anime.attributes.titles.en} />
                    <p className="text-noir text-sm">{anime.attributes.synopsis}</p>
                </div>
            )
        }
    }

    useEffect(() => {
        getAnime()
    }, [])

  return (
    <div className="bg-noir min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl text-center text-blanc mb-4">AnimeX</h1>
        <div className="flex flex-col justify-center items-center py-4">
            {displayAnime()}
        </div>
    </div>
  )
}