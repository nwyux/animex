import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import PageTemplate from "./PageTemplate";
import useCookie from "react-use-cookie";
import Notification from "./Notification";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Divider from '@mui/material/Divider';

export default function SoloAnime() {
  const [anime, setAnime] = useState([]);
  const { id } = useParams();
  const { username } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [token, setToken] = useCookie("token", "0");
  const apiURL = process.env.REACT_APP_API_URL;
  const [notification, setNotification] = useState(false);

  const notify = (color, message) => {
    setNotification({ color, message });
    setTimeout(() => {
      setNotification(false);
    }, 5000);
  };

  async function getAnime() {
    try {
      const res = await axios.get(`https://kitsu.io/api/edge/anime/${id}`);
      setAnime(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getComments() {
    try {
      const res = await axios.get(`${apiURL}/api/comments/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredComments = res.data.filter(
        (comment) => comment.animeId === id
      );

      setComments(filteredComments);
    } catch (error) {
      console.error(error);
    }
  }

  async function addComment() {
    try {
      const response = await axios.post(
        `${apiURL}/api/comments`,
        {
          userId: window.localStorage.getItem("userID"),
          username: window.localStorage.getItem("username"),
          animeId: id,
          animeName: anime.attributes.titles.en_jp,
          title: title,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { message } = response.data;

      setTitle("");
      setContent("");
      getComments();

      if (message) {
        notify("bg-red-500", message);
      } else {
        notify("bg-emerald-500", "Comment added");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function displayAnime() {
    if (anime.attributes) {
      return (
        // <div
        //   key={anime.id}
        //   className="text-blanc p-4 rounded-lg mx-8 sm:max-w-6xl gap-4 flex flex-col justify-center items-center"
        // >
        //   <div className="flex flex-col md:flex-row justify-center items-center gap-14">
        //     <img
        //       src={anime.attributes.posterImage.medium}
        //       alt={anime.attributes.titles.en_jp}
        //     />
        //     <hr className="w-0.5 h-96 bg-blanc hidden md:block" />
        //     <div className="flex flex-col justify-center items-center gap-4">
        //       <h2 className=" text-xl">{anime.attributes.titles.en_jp}</h2>
        //       <p className=" text-sm text-justify max-w-sm">
        //         {anime.attributes.synopsis}
        //       </p>
        //       <div className="grid grid-cols-2 gap-4 max-w-sm">
        //         <p className=" text-sm">
        //           Episodes: {anime.attributes.episodeCount}
        //         </p>
        //         <p className=" text-sm">
        //           Average Rating: {anime.attributes.averageRating}/100
        //         </p>
        //         <p className=" text-sm">
        //           First aired: {anime.attributes.startDate}
        //         </p>
        //         <p className=" text-sm">
        //           Last aired: {anime.attributes.endDate}
        //         </p>
        //         <p className=" text-sm">Status: {anime.attributes.status}</p>
        //         <p className=" text-sm">
        //           Age rating: {anime.attributes.ageRatingGuide}
        //         </p>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <Box className="text-blanc mx-8 rounded-lg sm:max-w-6xl gap-4 flex flex-col justify-center items-center">
          <Card variant="outlined"
          className="flex text-blanc flex-col md:flex-row justify-center items-center gap-12"
          sx={{ backgroundColor: "#131313", color: "#f9f9f9" }}
          >
            <CardMedia
              component="img"
              image={anime.attributes.posterImage.medium}
              alt={anime.attributes.titles.en_jp}
            />
            <hr className="w-0.5 h-96 bg-blanc hidden md:block" />
            <CardContent
            className="flex flex-col justify-center items-center gap-4"
            >
              <Typography
                sx={{ fontSize: 16 }}
                gutterBottom
              >
                {anime.attributes.titles.en_jp}
              </Typography>
              <Typography component="div"
              className="text-sm text-justify max-w-6xl"
              >
                {anime.attributes.synopsis}
              </Typography>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <Typography sx={{ fontSize: 14 }}>
                  Episodes: {anime.attributes.episodeCount}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  Average Rating: {anime.attributes.averageRating}/100
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  First aired: {anime.attributes.startDate}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  Last aired: {anime.attributes.endDate}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  Status: {anime.attributes.status}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  Age rating: {anime.attributes.ageRatingGuide}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Box>
      );
    }
  }

  useEffect(() => {
    getAnime();
    getComments();
  }, []);

  function commentDate(createdAt) {
    const newDate = new Date(createdAt);
    return newDate.toDateString();
  }

  return (
    <div className="bg-noir min-h-screen flex flex-col mt-28 items-center gap-4">
      <PageTemplate>
        {notification && (
          <Notification
            color={notification.color}
            message={notification.message}
          />
        )}
        <div className="flex flex-col justify-center items-center py-4">
          {displayAnime()}
        </div>

        <div className="flex flex-col justify-center items-center gap-4">
          <h2 className="text-3xl text-blanc">Comments</h2>
          <div className="flex flex-col justify-center items-center gap-4">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <Box
                  key={comment.id}
                  className="bg-noir rounded-lg mx-8 sm:max-w-7xl gap-4 flex flex-col justify-center items-center"
                >
                  <Card
                    sx={{ minWidth: 275, backgroundColor: "rgb(233, 229, 214)", borderColor: "#1f2937", backdropFilter: "blur(10px)", backgroundOpacity: "90%" }}
                    variant="outlined"
                    className="w-80"
                  >
                    <CardContent>
                      <Typography
                        sx={{ fontSize: 16 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {comment.title}
                      </Typography>
                      <Typography variant="h7" component="div">
                        {comment.content}
                      </Typography>
                    </CardContent>
                    <CardActions
                    >
                      <Button size="small" variant="text" className="text-blanc"
                      sx={{ color: "#1f2937"}}
                      >
                        <NavLink to={`/user/${comment.username}`}>
                          {comment.username}
                        </NavLink>
                      </Button>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        {commentDate(comment.createdAt)}
                      </Typography>
                    </CardActions>
                  </Card>
                </Box>
              ))
            ) : (
              <p className="text-blanc">No comments yet</p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-4 p-4">
          {window.localStorage.getItem("userID") ? (
            <div className="bg-blanc p-4 rounded-lg mx-8 sm:max-w-7xl gap-4 flex flex-col justify-center items-center">
              <h2 className="text-noir text-xl">Add a comment</h2>
              <Box
                component="form"
                noValidate
                onSubmit={addComment}
                className="min-w-full max-w-xl m-auto grid gap-4 text-blanc"
                autoComplete="off"
              >
                <TextField
                  id="outlined-controlled"
                  label="Title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mb-4 w-72"
                />
                <TextField
                  id="outlined-controlled"
                  label="Content"
                  multiline
                  minRows={3}
                  maxRows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mb-4"
                />
                <Button
                  type="submit"
                  variant="contained"
                  className="bg-emerald-500 hover:bg-emerald-600 text-blanc p-2 rounded-lg block mx-auto text-center"
                  disabled={title === "" || content === ""}
                >
                  Add Comment
                </Button>
              </Box>
            </div>
          ) : (
            <p className="text-blanc">You must be logged in to add a comment</p>
          )}
        </div>
      </PageTemplate>
    </div>
  );
}
