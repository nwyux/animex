import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function AnimesCard(props) {
//   const [anime, setAnime] = useState([]);

//   async function fetchAnimeData() {
//     try {
//       const response = await axios.get(
//         "https://kitsu.io/api/edge/anime?page%5Bnumber%5D=1&page%5Bsize%5D=20"
//       );
//       const animeData = response.data.data;
//       setAnime(animeData);
//       console.log(animeData);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   useEffect(() => {
//     fetchAnimeData();
//   }, []);

  return (
    <div
      key={props.id}
      className="soloCard transition-all duration-150 relative rounded-lg max-w-sm flex flex-col justify-center items-center"
    >
      <NavLink to={`/anime/${props.id}`}>
        <h2 className="text-blanc text-md font-bold absolute bottom-0 backdrop-blur-xl w-full p-2">
          {props.attributes.titles.en_jp}
        </h2>
        <img src={props.attributes.posterImage.small} alt={props.title} />
      </NavLink>
    </div>
  );
}
