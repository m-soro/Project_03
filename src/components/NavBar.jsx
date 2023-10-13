import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./NavBar.modules.css";

export default function NavBar({ userID, userName }) {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

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
            <Link to="/">Open Peaks</Link>
          </li>
        </ul>
        {!cookies.access_token ? (
          <>
            <ul>
              <li>
                <Link to="/auth">Sign up / Log in</Link>
              </li>
            </ul>
          </>
        ) : (
          <ul>
            <li>
              <Link to="/">
                {userName !== null ? `${userName}'s Account` : `Account`}
              </Link>
            </li>
            <li>
              <Link to="/create-data">Create Lists</Link>
            </li>
            <li>
              <Link to="/auth" onClick={logout}>
                Log out
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
