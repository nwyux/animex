import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Index() {
    const [anime, setAnime] = useState([])

    async function getAnime() {
        try {
            const res = await axios.get('https://api.jikan.moe/v4/anime/21')
            setAnime(res.data.data)
            console.log(res.data.data)
        } catch (error) {
            console.error(error)
        }
    }

    function animeImage() {
        if (anime.images) {
            if (anime.images.webp) {
                return anime.images.webp.image_url
            } else {
                return anime.images.jpg.image_url
            }
        }
    }

    useEffect(() => {
        getAnime()
    }, [])

  return (
    <div className="bg-noir min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl text-center text-blanc mb-4">AnimeX</h1>
        <div className="flex flex-col justify-center items-center">
                <div key={anime.id} className="bg-blanc p-4 rounded-lg max-w-lg flex flex-col justify-center items-center">
                    <h2 className="text-noir text-xl">{anime.title}</h2>
                    <img src={animeImage()} alt={anime.title} />
                    <p className="text-noir text-sm">{anime.synopsis}</p>
                </div>
        </div>
    </div>
  )
}
