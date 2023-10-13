import { useState, useEffect } from "react";
import { useGetUserID } from "../hooks/useGetUserID.jsx";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { resorts } from "../ulitities/data";
import axios from "axios";
import "./Home.modules.css";
import NotLoggedIn from "./NotLoggedIn";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import LoadingPage from "../components/LoadingPage.jsx";

export default function Home({ userName }) {
  const [cookies, _] = useCookies(["access_token"]);
  const [mountains, setMountains] = useState([]);
  const [savedMountains, setSavedMountains] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const userID = useGetUserID();

  useEffect(() => {
    const fetchMountains = async () => {
      try {
        const response = await axios.get(
          "https://open-peaks-v2-backend.onrender.com/mountain"
        );
        setMountains(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSavedMountains = async () => {
      try {
        const response = await axios.get(
          `https://open-peaks-v2-backend.onrender.com/mountain/savedMountains/ids/${userID}`
        );
        setSavedMountains(response.data.savedMountains);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMountains();
    fetchSavedMountains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://open-peaks-v2-backend.onrender.com/mountain/delete/${id}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const withResults = () => {
    const myList = mountains?.filter((mountain) =>
      savedMountains?.includes(mountain._id)
    );
    const detailedList = myList.map((list) => {
      return resorts.filter((r) => list.mountains.includes(r.slug));
    });

    try {
      return (
        <div className="mountain-article-container">
          <ul>
            {myList.map((mountainList, index) => (
              <li key={mountainList._id}>
                <article className="mountain-list-article">
                  <header className="mountain-list-article-header">
                    <Link to={"/dashboard"} state={{ mountainList }}>
                      <h3>{`${mountainList.listName[0].toUpperCase()}${mountainList.listName.slice(
                        1
                      )}`}</h3>
                    </Link>

                    <ImageList sx={{ width: "auto" }} cols={4} rowHeight={164}>
                      {detailedList[index].map((item) => (
                        <ImageListItem key={item.img}>
                          <img
                            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                            alt={item.title}
                            loading="lazy"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </header>
                  <body className="mountain-list-article-body">
                    <ul className="resort-list-footer">
                      <li>
                        Tracking: {mountainList.mountains.length} resorts:{" "}
                      </li>
                      {detailedList[index].map((item, index) => {
                        return <li key={index}>{item.name}</li>;
                      })}
                    </ul>
                    <div className="list-options">
                      <button className="outline">
                        <Link
                          to={`/update/${mountainList._id}`}
                          state={{ mountainList }}
                        >
                          Edit
                        </Link>
                      </button>
                      <button className="outline">
                        <Link onClick={() => handleDelete(mountainList._id)}>
                          Delete
                        </Link>
                      </button>
                    </div>
                  </body>
                </article>
              </li>
            ))}
          </ul>
        </div>
      );
    } catch (error) {
      console.log(error);
    }
  };

  const noResults = () => {
    return <div>No Lists</div>;
  };

  return (
    <div className="Home container home">
      {cookies.access_token ? (
        <>
          <div>{isLoading ? <LoadingPage /> : <p></p>}</div>
          <h2>
            {mountains?.length === 0
              ? `Hi ${
                  userName !== null ? `${userName}` : ``
                }, your list is empty.`
              : `Hi ${
                  userName !== null ? `${userName}` : ``
                }, your created lists:`}
          </h2>
          {mountains !== undefined || mountains?.length === 0
            ? withResults()
            : noResults()}
        </>
      ) : (
        <div className="not-logged-in">
          <NotLoggedIn />
        </div>
      )}
    </div>
  );
}
