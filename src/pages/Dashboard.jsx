import axios from "axios";
import { resorts } from "../ulitities/data";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Dashboard.modules.css";

export default function Dashboard() {
  const { state } = useLocation();
  const myList = state?.mountainList;
  const myListName = state?.mountainList.listName;
  const myListSlugs = myList?.mountains;
  const [mountainData, setMountainData] = useState([]);

  const moreDetailedList = resorts.filter((resort) =>
    myListSlugs?.includes(resort.slug)
  );

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
      });
    });
  }, []);

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
          try {
            if (data) {
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
            }
          } catch (error) {
            console.log(error);
          }
        };

        const showLocation = (map) => {
          // const map =
          //   "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10245.793161796904!2d-122.96724402382902!3d50.05916564431904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5487225af28c5409%3A0x276c0edfa7be2148!2sWhistler%20Mountain!5e0!3m2!1sen!2sus!4v1697039798245!5m2!1sen!2sus";
          return (
            <details>
              <summary>Map</summary>
              <iframe
                src={`${map}`}
                width="100%"
                height="380"
                allowfullscreen="true"
                loading="lazy"
                title="map"
                referrerpolicy="no-referrer-when-downgrade"
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
              <div class="container-image">
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
        <h2>{myListName?.toUpperCase()}</h2>
      </div>
      <div className="cards-container">
        {moreDetailedList?.map((list, index) => {
          return <li key={index}>{makeCards(list, index)}</li>;
        })}
      </div>
    </div>
  );
}
