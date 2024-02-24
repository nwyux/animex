import { Heart } from "lucide-react";

export default function Favorite(props) {
  return (
    <div
      key={props.id}
      className="soloCard transition-all duration-150 relative rounded-lg max-w-sm flex flex-col justify-center items-center"
    >
      <a href={`/anime/${props.id}`}>
        <img src={props.attributes.posterImage.small} alt={props.title} />
      </a>
      <div className="flex justify-center items-center gap-4 absolute bottom-0 backdrop-blur-xl w-full">
        <h2 className="text-blanc px-2 p-2 text-md font-bold w-full">
          {props.attributes.titles.en_jp}
        </h2>

        <button
          className="mr-4 text-3xl font-bold text-blanc"
          onClick={() => props.removeFavorite(props.favoriteId)}
        >
          <Heart />
        </button>
      </div>
    </div>
  );
}
