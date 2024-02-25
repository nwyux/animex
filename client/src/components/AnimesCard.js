import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Heart } from "lucide-react";

export default function AnimesCard(props) {

  return (
    <div
      key={props.id}
      className="soloCard transition-all duration-150 relative rounded-lg max-w-sm flex flex-col justify-center items-center"
    >
      <NavLink to={`/anime/${props.id}`}>
        <img src={props.attributes.posterImage.small} alt={props.title} />
      </NavLink>
      <div className="flex justify-center items-center gap-4 absolute bottom-0 backdrop-blur-xl w-full">
        <h2 className="text-blanc px-2 p-2 text-md font-bold w-full">
          {props.attributes.titles.en_jp}
        </h2>

        {window.localStorage.getItem("userID") && (
          <button
            className="mr-4 text-3xl font-bold text-blanc"
            onClick={() => props.addFavorite(props.animeId)}
          >
            <Heart />
          </button>
        )}
      </div>
    </div>
  );
}
