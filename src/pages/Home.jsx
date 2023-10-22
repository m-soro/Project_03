import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID.jsx";
import { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import "./Home.modules.css";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import LoadingPage from "../components/LoadingPage.jsx";
import { useGetUserName } from "../hooks/useGetUserName";
import NotLoggedIn from "./NotLoggedIn";
import resortsHelperDataContext from "../contexts/resortsHelperDataContext.jsx";

export default function Home() {
  // let localURL = "http://localhost:3001/mountain";
  // let deployedURL = "https://open-peaks-v2-backend.onrender.com/mountain";
  let userName = useGetUserName();
  const [cookies, _] = useCookies(["access_token"]);
  const [mountains, setMountains] = useState([]);
  const [savedMountains, setSavedMountains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(null);
  const helperFile = useContext(resortsHelperDataContext);

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
  }, [showWarning]);

  const handleDelete = (id) => {
    setShowWarning(true);
    setToBeDeleted(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `https://open-peaks-v2-backend.onrender.com/mountain/delete/${toBeDeleted}`
      );
      setShowWarning(false);
    } catch (error) {
      console.log(error);
    }
  };

  const Warning = () => {
    return (
      <dialog open>
        <article
          style={{ padding: "2rem 2rem 5rem 2rem", borderRadius: "12px" }}
        >
          <h3>Warning</h3>
          <p>You are about to delete this list. Are you sure?</p>
          <footer style={{ backgroundColor: "transparent" }}>
            <Link
              style={{ color: "#f2910a", borderColor: "#f2910a" }}
              to="/"
              role="button"
              className="outline"
              onClick={() => setShowWarning(!showWarning)}
            >
              Cancel
            </Link>
            <Link
              style={{ color: "#f67280", borderColor: "#f67280" }}
              to="/"
              role="button"
              className="outline"
              onClick={() => confirmDelete()}
            >
              Confirm
            </Link>
          </footer>
        </article>
      </dialog>
    );
  };

  const withResults = () => {
    const myList = mountains?.filter((mountain) =>
      savedMountains?.includes(mountain._id)
    );

    const detailedList = myList.map((list) => {
      try {
        return helperFile.filter((r) => list.mountains.includes(r.slug));
      } catch (error) {
        console.error(error);
      }
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
            <article className="welcome-article">
              <header>
                <h2 className="welcome-user">Hi {`${userName}`},</h2>
                <p>Welcome to your home page. Your list is empty.</p>
              </header>
              <body>
                <ul className="instructions">
                  <p>To get started:</p>
                  <li>
                    Click the pen icon to create and save a list of resorts to
                    track
                  </li>
                  <li>
                    Select from 148 resorts, create a list based on region, your
                    season pass, or resorts that you plan to visit
                  </li>
                  <li>Once created your list(s) will appear here</li>

                  <li>Click the the list name to view your dashboard</li>
                  <ul className="sub-list">
                    <li>
                      Your dashboard contains the resorts you are tracking
                    </li>
                    <li>
                      View percentage of open/closed/scheduled lift or chair
                      statistics
                    </li>
                    <li>View detailed chair or lift status</li>
                    <li>See the resort's map and visit the website</li>
                  </ul>
                </ul>
              </body>
              <footer>
                <blockquote>
                  Make sure to save your username and password. <br />
                  Check out your dashboard(s) and have an awesome day! <br />
                  <br />
                  <cite>- Mark S.</cite>
                </blockquote>
              </footer>
            </article>
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
          <div>{showWarning ? <Warning /> : <p></p>}</div>
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
