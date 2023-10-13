import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID.jsx";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { resorts } from "../ulitities/data";
import NotLoggedIn from "./NotLoggedIn";
import "./Home.modules.css";
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
      if (myList.length > 0) {
        return (
          <div className="mountain-article-container">
            <h2>Hi {`${userName}`}, your created list:</h2>
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

                      <ImageList
                        sx={{ width: "auto" }}
                        cols={4}
                        rowHeight={164}
                      >
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
      } else {
        return (
          <>
            <h2>Hi {`${userName}`},</h2>
            <p>
              Looks like your list is empty. Once created it will appear here.
            </p>
          </>
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Home container home">
      {cookies.access_token ? (
        <>
          <div>{isLoading ? <LoadingPage /> : <p></p>}</div>
          {withResults()}
        </>
      ) : (
        <div className="not-logged-in">
          <NotLoggedIn />
        </div>
      )}
    </div>
  );
}
