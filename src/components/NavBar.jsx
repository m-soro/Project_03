import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import CreateIcon from "@mui/icons-material/Create";
import LogoutIcon from "@mui/icons-material/Logout";
import "./NavBar.modules.css";
import { useGetUserName } from "../hooks/useGetUserName";

export default function NavBar({ userID }) {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  let userName = useGetUserName();
  // reset the cookie
  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    window.localStorage.removeItem("userName");
    navigate("/auth");
  };

  const userLoggedIn = () => {
    return (
      <nav className="navbar container-fluid">
        <ul>
          <li>
            <Link to="/">
              {/* <strong>Open Peaks</strong> */}
              <img
                src="https://github.com/m-soro/Project_2/blob/main/src/assets/images/openPeaks.png?raw=true"
                alt=""
                style={{ height: "65px", width: "auto" }}
              />
            </Link>
          </li>
        </ul>
        {!cookies.access_token ? (
          <ul>
            <li>
              <Link to="/auth">Sign up / Log in</Link>
            </li>
          </ul>
        ) : (
          <ul className="logged-in-menu">
            <li>
              <Link
                to="/"
                data-tooltip={`${userName}'s Account`}
                data-placement="bottom"
              >
                <Avatar sx={{ bgcolor: "#72cff8" }}>{`${userName[0]}`}</Avatar>
              </Link>
            </li>
            <li>
              <Link
                to="/create-data"
                data-tooltip="Create List"
                data-placement="bottom"
              >
                <CreateIcon />
              </Link>
            </li>
            <li>
              <Link
                to="/auth"
                onClick={logout}
                data-tooltip="Log out"
                data-placement="bottom"
              >
                <LogoutIcon />
              </Link>
            </li>
          </ul>
        )}
      </nav>
    );
  };

  const userNotLoggedIn = () => {
    return (
      <div className="navbar">
        <Link to="/auth">Log in or Register</Link>
      </div>
    );
  };

  return (
    <div className="NavBar">
      {userID !== null ? userLoggedIn() : userNotLoggedIn()}
    </div>
  );
}
