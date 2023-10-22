import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import LoadingPage from "../components/LoadingPage.jsx";
import "./Dashboard.modules.css";
import resortsHelperDataContext from "../contexts/resortsHelperDataContext";

export default function Dashboard() {
  const { state } = useLocation();
  const myList = state?.mountainList;
  const myListName = state?.mountainList.listName;
  const myListSlugs = myList?.mountains;
  const [mountainData, setMountainData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const helperFile = useContext(resortsHelperDataContext);

  const getMoreDetailedList = () => {
    if (helperFile !== null) {
      try {
        return helperFile.filter((resort) =>
          myListSlugs?.includes(resort.slug)
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getStatistics = async (slug) => {
    const options = {
      method: "GET",
      url: `https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${slug}`,
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API_KEY,
        "X-RapidAPI-Host": "ski-resorts-and-conditions.p.rapidapi.com",
      },
    };
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    myListSlugs.forEach((slug) => {
      getStatistics(slug).then((res) => {
        setMountainData((mountainData) => [...mountainData, res]);
        setIsLoading(false);
      });
    });
  }, [state]);

  const makeCards = (list) => {
    const filtered = mountainData.filter((md) =>
      list.slug.includes(md?.data?.slug)
    );

    if (filtered) {
      try {
        const selected = filtered;
        const { data } = selected[0];

        const showPercentage = () => {
          try {
            if (data) {
              const { lifts } = data;
              const { stats: openClosedSched } = lifts; // how many chairs are open/closed/onhold
              const { percentage } = openClosedSched; // ratio of chairs open/closed/scheduled
              return Object.keys(percentage).map((key, index) => (
                <li key={index}>
                  {key}: {percentage[key]}
                </li>
              ));
            }
          } catch (error) {
            console.log(error);
          }
        };

        const showOpenClosedSched = () => {
          try {
            if (data) {
              const { lifts } = data;
              const { stats: openClosedSched } = lifts; // how many chairs are open/closed/onhold
              return Object.keys(openClosedSched).map((key, index) => {
                if (key !== "percentage") {
                  return (
                    <li key={index}>
                      {key}: {openClosedSched[key]}
                    </li>
                  );
                }
              });
            }
          } catch (error) {
            console.log(error);
          }
        };

        const showChairStatus = () => {
          if (data) {
            try {
              const { lifts } = data;
              const { status: chairStatus } = lifts;

              return (
                <details>
                  <summary>
                    {Object.keys(chairStatus).length !== 0
                      ? "Chair Status"
                      : "No chair status available"}
                  </summary>

                  <p></p>
                  <table>
                    <thead></thead>
                    <tbody>
                      {Object.keys(chairStatus).map((key, index) => (
                        <tr scope="row" key={index}>
                          <td>{key}</td>
                          {chairStatus[key] === "closed" ? (
                            <td style={{ color: "#fd5959" }}>
                              {chairStatus[key]}
                            </td>
                          ) : chairStatus[key] === "scheduled" ? (
                            <td style={{ color: "#ff894c" }}>
                              {chairStatus[key]}
                            </td>
                          ) : chairStatus[key] === "open" ? (
                            <td style={{ color: "#00204a" }}>
                              {chairStatus[key]}
                            </td>
                          ) : (
                            <td>{chairStatus[key]}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              );
            } catch (error) {
              console.log(error);
            }
          }
        };

        const showLocation = (map) => {
          return (
            <details>
              <summary>Map</summary>
              <iframe
                src={`${map}`}
                width="100%"
                height="380"
                allowFullScreen={true}
                loading="lazy"
                title="map"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </details>
          );
        };

        const showURL = () => {
          return (
            <a href={data.href}>
              <small>Website</small>
            </a>
          );
        };

        return (
          <div className="mountain-card-container">
            <article className="mountain-card-article container">
              <header className="mountain-card-article-header">
                <h4>{list.name}</h4>
                <span>
                  {mountainData !== null &&
                  mountainData !== undefined &&
                  filtered !== undefined ? (
                    <ul className="percentage">{showPercentage()}</ul>
                  ) : (
                    <div></div>
                  )}
                </span>
              </header>
              <div className="container-image">
                <img src={`${list.img}`} alt={`${list.name}`} />
              </div>
              <article className="chair-stats-box">
                <header>
                  <h5>{list.label}</h5>
                </header>
                <body className="mountain-card-article-body">
                  {mountainData !== null &&
                  mountainData !== undefined &&
                  filtered !== undefined ? (
                    <ul className="mountain-card-article-body-open-closed-sched">
                      {showOpenClosedSched()}
                    </ul>
                  ) : (
                    <div></div>
                  )}

                  <div className="chair-and-map">
                    {showChairStatus()}
                    {showLocation(list.map)}
                    {showURL()}
                  </div>
                </body>
              </article>
            </article>
          </div>
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Error encountered");
    }
  };

  return (
    <div className="Dashboard dashboard container-fluid">
      <div className="dashboard-heading">
        <div>{isLoading ? <LoadingPage /> : <p></p>}</div>
        <h2>{myListName?.toUpperCase()}</h2>
      </div>
      <div className="cards-container">
        {getMoreDetailedList()?.map((list, index) => {
          return <li key={index}>{makeCards?.(list, index)}</li>;
        })}
      </div>
    </div>
  );
}
